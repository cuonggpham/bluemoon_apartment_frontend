import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--space-2-5) var(--space-3);
  padding-right: var(--space-10);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  background-color: var(--color-grey-0);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px var(--color-brand-100);
  }
  
  &:hover {
    border-color: var(--color-brand-300);
    box-shadow: var(--shadow-md);
  }
  
  &.dropdown-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: var(--color-brand-500);
  }

  &::placeholder {
    color: var(--color-grey-400);
    font-size: var(--font-size-sm);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: var(--space-2);
  background: none;
  border: none;
  color: var(--color-grey-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--color-grey-700);
    background-color: var(--color-grey-100);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--color-brand-100);
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-grey-0);
  border: 1px solid var(--color-brand-500);
  border-top: none;
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: var(--space-1) 0;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
  
  ${props => props.hidden && `display: none;`}
`;

const DropdownItem = styled.li`
  padding: var(--space-2-5) var(--space-3);
  cursor: pointer;
  border-bottom: 1px solid var(--color-grey-100);
  transition: all var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    background-color: var(--color-brand-50);
    color: var(--color-brand-700);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoResults = styled.div`
  padding: var(--space-3);
  color: var(--color-grey-500);
  text-align: center;
  font-style: italic;
  font-size: var(--font-size-sm);
`;

const ResidentInfo = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-grey-600);
  margin-top: var(--space-1);
`;

interface Resident {
  id: number;
  name: string;
  dob?: string;
}

interface ResidentSearchDropdownProps {
  value?: string;
  onChange: (resident: Resident | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ResidentSearchDropdown({
  value = "",
  onChange,
  placeholder = "Nhập tên hoặc ID để tìm kiếm cư dân...",
  disabled = false,
}: ResidentSearchDropdownProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Resident[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allResidents, setAllResidents] = useState<Resident[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch all residents on component mount
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/residents?size=999&page=1`);
        const residentsData = response.data.data.result;
        const residentsList = residentsData.map((resident: any) => ({
          id: resident.id,
          name: resident.name,
          dob: resident.dob,
        }));
        setAllResidents(residentsList);
      } catch (err) {
        console.error("Error fetching residents:", err);
      }
    };

    fetchResidents();
  }, []);  
  // Debounced search function
  const debouncedSearch = (searchTerm: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (searchTerm.trim() === "") {
        // Hide dropdown when search is empty
        setSuggestions([]);
        setIsOpen(false);
      } else {
        setIsLoading(true);
        const filteredResidents = allResidents.filter((resident) =>
          resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resident.id.toString().includes(searchTerm)
        );
        setSuggestions(filteredResidents);
        setIsOpen(true);
        setIsLoading(false);
      }
    }, 300); // 300ms debounce delay
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    debouncedSearch(newValue);
  };
  const handleInputClick = () => {
    // Chỉ hiển thị dropdown nếu có text để tìm kiếm
    if (searchValue.trim() !== "" && !isOpen) {
      const filteredResidents = allResidents.filter((resident) =>
        resident.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        resident.id.toString().includes(searchValue)
      );
      setSuggestions(filteredResidents);
      setIsOpen(true);
    }
  };
  const handleInputFocus = () => {
    // Chỉ hiển thị dropdown nếu có text để tìm kiếm
    if (!isOpen && searchValue.trim() !== "") {
      const filteredResidents = allResidents.filter((resident) =>
        resident.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        resident.id.toString().includes(searchValue)
      );
      setSuggestions(filteredResidents);
      setIsOpen(true);
    }
  };

  const handleSelectResident = (resident: Resident) => {
    setSearchValue(resident.name);
    setIsOpen(false);
    setSuggestions([]);
    onChange(resident);
  };

  const handleClearSelection = () => {
    setSearchValue("");
    setIsOpen(false);
    setSuggestions([]);
    onChange(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Update search value when value prop changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);  return (
    <DropdownContainer ref={containerRef}>
      <InputContainer>
        <Input
          type="text"
          value={searchValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={isOpen ? "dropdown-open" : ""}
        />
        {searchValue && (
          <ClearButton
            type="button"
            onClick={handleClearSelection}
            title="Xóa lựa chọn"
          >
            ✕
          </ClearButton>        )}
      </InputContainer>
      <DropdownList hidden={!isOpen}>
        {isLoading ? (
          <NoResults>Đang tìm kiếm...</NoResults>
        ) : suggestions.length > 0 ? (
          suggestions.map((resident) => (
            <DropdownItem
              key={resident.id}
              onClick={() => handleSelectResident(resident)}
            >
              <div>
                <strong>{resident.name}</strong> (ID: {resident.id})
                {resident.dob && <ResidentInfo>
                  Ngày sinh: {resident.dob}
                </ResidentInfo>}
              </div>
            </DropdownItem>
          ))
        ) : searchValue.trim() !== "" ? (
          <NoResults>Không tìm thấy cư dân phù hợp</NoResults>
        ) : null}
      </DropdownList>
    </DropdownContainer>
  );
}
