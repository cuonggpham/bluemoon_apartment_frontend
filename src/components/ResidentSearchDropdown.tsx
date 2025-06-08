import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import api from "../services/axios";

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
  padding: 1rem 1.25rem;
  padding-right: 3rem;
  border: 1px solid rgba(209, 213, 219, 0.8);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 2px 8px rgba(99, 102, 241, 0.1);
    background: white;
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  
  &.dropdown-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: #6366f1;
    border-color: #6366f1;
    box-shadow: 
      0 0 0 3px rgba(99, 102, 241, 0.1),
      0 2px 8px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  
  &:hover {
    color: #374151;
    background-color: rgba(243, 244, 246, 0.8);
    transform: scale(1.1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #6366f1;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 200px;
  overflow-y: auto;
  
  margin: 0;
  padding: 0.25rem 0;
  z-index: 1000;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1);
  
  ${props => props.hidden && `display: none;`}
`;

const DropdownItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: all 0.2s ease;
  font-size: 1rem;
  color: #374151;
  
  &:hover {
    background-color: rgba(99, 102, 241, 0.05);
    color: #4f46e5;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoResults = styled.div`
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-align: center;
  font-style: italic;
  font-size: 0.875rem;
`;

const ResidentInfo = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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
        const response = await api.get(`/residents?size=999&page=1`);
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
