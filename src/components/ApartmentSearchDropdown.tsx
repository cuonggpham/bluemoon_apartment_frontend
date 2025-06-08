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
  transition: all 0.3s ease;
  min-height: 48px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: #0891b2;
    box-shadow: 
      0 0 0 3px rgba(8, 145, 178, 0.1),
      0 2px 8px rgba(8, 145, 178, 0.1);
    background: white;
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(8, 145, 178, 0.3);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  
  &.dropdown-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-color: #0891b2;
    border-color: #0891b2;
    box-shadow: 
      0 0 0 3px rgba(8, 145, 178, 0.1),
      0 2px 8px rgba(8, 145, 178, 0.1);
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
  transition: all 0.3s ease;
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
    box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.2);
  }
`;

const DropdownList = styled.ul<{ hidden: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #0891b2;
  border-top: none;
  border-radius: 0 0 12px 12px;
  max-height: 250px;
  overflow-y: auto;
  
  margin: 0;
  padding: 0.25rem 0;
  z-index: 1000;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1);
  
  ${({ hidden }) => hidden && `display: none;`}
`;

const DropdownItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: all 0.2s ease;
  font-size: 1rem;
  color: #374151;
  
  &:hover {
    background-color: rgba(8, 145, 178, 0.05);
    color: #0e7490;
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

const ApartmentInfo = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
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
  const [searchValue, setSearchValue] = useState(String(value || ""));
  const [suggestions, setSuggestions] = useState<Apartment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allApartments, setAllApartments] = useState<Apartment[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await api.get(`/apartments?size=999&page=1`);
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

  useEffect(() => {
    setSearchValue(String(value || ""));
  }, [value]);

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
    const searchStr = String(searchValue || "");
    if (searchStr.trim() !== "" && !isOpen) {
      const filteredApartments = allApartments.filter((apartment) =>
        apartment.addressNumber.toString().includes(searchStr) ||
        apartment.status.toLowerCase().includes(searchStr.toLowerCase())
      );
      setSuggestions(filteredApartments);
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    const searchStr = String(searchValue || "");
    if (!isOpen && searchStr.trim() !== "") {
      const filteredApartments = allApartments.filter((apartment) =>
        apartment.addressNumber.toString().includes(searchStr) ||
        apartment.status.toLowerCase().includes(searchStr.toLowerCase())
      );
      setSuggestions(filteredApartments);
      setIsOpen(true);
    }
  };

  const handleSelectApartment = (apartment: Apartment) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSearchValue(apartment.addressNumber.toString());
    setIsOpen(false);
    setSuggestions([]);
    onChange(apartment);
  };

  const handleClearSelection = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setSearchValue("");
    setIsOpen(false);
    setSuggestions([]);
    onChange(null);
  };

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
        ) : String(searchValue || "").trim() !== "" ? (
          <NoResults>Không tìm thấy căn hộ phù hợp</NoResults>
        ) : null}
      </DropdownList>
    </DropdownContainer>
  );
}
