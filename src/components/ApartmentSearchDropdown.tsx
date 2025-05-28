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
  padding: 12px;
  padding-right: 40px;
  border: 1px solid var(--color-grey-300);
  border-radius: 4px;
  font-size: 14px;
  background-color: var(--color-grey-0);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-600);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
  }
  
  &.dropdown-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: var(--color-brand-600);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--color-grey-500);
  cursor: pointer;
  padding: 4px;
  border-radius: 2px;
  
  &:hover {
    color: var(--color-grey-700);
    background-color: var(--color-grey-100);
  }
  
  &:focus {
    outline: none;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid var(--color-brand-600);
  border-top: 1px solid var(--color-grey-300);
  border-radius: 0 0 8px 8px;
  max-height: 250px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 1000;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  
  ${props => props.hidden && `display: none;`}
`;

const DropdownItem = styled.li`
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid var(--color-grey-100);
  
  &:hover {
    background-color: var(--color-grey-50);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoResults = styled.div`
  padding: 12px;
  color: var(--color-grey-500);
  text-align: center;
  font-style: italic;
`;

const ApartmentInfo = styled.div`
  font-size: 12px;
  color: var(--color-grey-500);
`;

interface Apartment {
  addressNumber: number;
  area: number;
  status: string;
}

interface ApartmentSearchDropdownProps {
  value?: string;
  onChange: (apartment: Apartment | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ApartmentSearchDropdown({
  value = "",
  onChange,
  placeholder = "Nhập số phòng để tìm kiếm căn hộ...",
  disabled = false,
}: ApartmentSearchDropdownProps) {
  const [searchValue, setSearchValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Apartment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allApartments, setAllApartments] = useState<Apartment[]>([]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch all apartments on component mount
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/apartments?size=999&page=1`);
        const apartmentsData = response.data.data.result;
        const apartmentsList = apartmentsData.map((apartment: any) => ({
          addressNumber: apartment.addressNumber,
          area: apartment.area,
          status: apartment.status,
        }));
        setAllApartments(apartmentsList);
      } catch (err) {
        console.error("Error fetching apartments:", err);
      }
    };

    fetchApartments();
  }, []);

  // Debounced search function
  const debouncedSearch = (searchTerm: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        setIsOpen(false);
      } else {
        setIsLoading(true);
        const filteredApartments = allApartments.filter((apartment) =>
          apartment.addressNumber.toString().includes(searchTerm) ||
          apartment.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(filteredApartments);
        setIsOpen(true);
        setIsLoading(false);
      }
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    debouncedSearch(newValue);
  };

  const handleInputClick = () => {
    if (searchValue.trim() !== "" && !isOpen) {
      const filteredApartments = allApartments.filter((apartment) =>
        apartment.addressNumber.toString().includes(searchValue) ||
        apartment.status.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSuggestions(filteredApartments);
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!isOpen && searchValue.trim() !== "") {
      const filteredApartments = allApartments.filter((apartment) =>
        apartment.addressNumber.toString().includes(searchValue) ||
        apartment.status.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSuggestions(filteredApartments);
      setIsOpen(true);
    }
  };

  const handleSelectApartment = (apartment: Apartment) => {
    setSearchValue(apartment.addressNumber.toString());
    setIsOpen(false);
    setSuggestions([]);
    onChange(apartment);
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
  }, [value]);

  return (
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
          </ClearButton>
        )}
      </InputContainer>
      <DropdownList hidden={!isOpen}>
        {isLoading ? (
          <NoResults>Đang tìm kiếm...</NoResults>
        ) : suggestions.length > 0 ? (
          suggestions.map((apartment) => (
            <DropdownItem
              key={apartment.addressNumber}
              onClick={() => handleSelectApartment(apartment)}
            >
              <div>
                <strong>Phòng {apartment.addressNumber}</strong>
                <ApartmentInfo>
                  Diện tích: {apartment.area}m² | Trạng thái: {apartment.status}
                </ApartmentInfo>
              </div>
            </DropdownItem>
          ))
        ) : searchValue.trim() !== "" ? (
          <NoResults>Không tìm thấy căn hộ phù hợp</NoResults>
        ) : null}
      </DropdownList>
    </DropdownContainer>
  );
}
