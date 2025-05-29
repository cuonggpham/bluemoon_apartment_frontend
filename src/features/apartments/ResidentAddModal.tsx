import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import styled from "styled-components";

import styled from "styled-components";

// Modern styled components for ResidentAddModal
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-2);
  width: 100%;
  max-width: 600px;
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const SectionTitle = styled.p`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-grey-800);
  margin: 0;
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--color-grey-200);
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: var(--space-4);
  border: 1px solid var(--color-grey-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  background: var(--color-grey-0);
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--color-brand-500);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--color-grey-400);
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-grey-0);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: var(--shadow-lg);
  margin: 0;
  padding: 0;
  list-style: none;
  
  &.hidden {
    display: none;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-grey-100);
    border-radius: var(--border-radius-md);
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300);
    border-radius: var(--border-radius-md);
    
    &:hover {
      background: var(--color-grey-400);
    }
  }
`;

const SuggestionItem = styled.li`
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  border-bottom: 1px solid var(--color-grey-100);
  font-size: var(--font-size-base);
  color: var(--color-grey-700);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-brand-50);
    color: var(--color-brand-700);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SelectedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const SelectedContainer = styled.div`
  min-height: 120px;
  padding: var(--space-4);
  background: var(--color-grey-50);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-200);
`;

const SelectedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--color-grey-0);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-grey-200);
  margin-bottom: var(--space-2);
  font-size: var(--font-size-base);
  color: var(--color-grey-700);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RemoveButton = styled.span`
  color: var(--color-red-600);
  cursor: pointer;
  font-size: var(--font-size-xl);
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-red-100);
    transform: scale(1.1);
  }
`;

const NoSelection = styled.p`
  color: var(--color-grey-400);
  font-style: italic;
  text-align: center;
  margin: 0;
  padding: var(--space-4);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-grey-200);
`;

interface ResidentAddModalProps {
  onResidentsSelect: (residents: { id: number; name: string; dob: string }[]) => void;
}

export default function ResidentAddModal({ onResidentsSelect }: ResidentAddModalProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]); // Chỉ lưu danh sách tên cho gợi ý
  const [residents, setResidents] = useState<{ id: number; name: string; dob: string }[]>([]);
  const [selectedResidents, setSelectedResidents] = useState<{ id: number; name: string; dob: string }[]>([]);

  // Hàm gọi API để lấy danh sách residents
  const apiAllResidents = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/residents?size=100&page=1`);
      const residentsData = response.data.data.result;

      // Trích xuất id, name, và dob từ API
      const residentsList = residentsData.map((resident: any) => ({
        id: resident.id,
        name: resident.name,
        dob: resident.statusDate, // Hoặc resident.dob, tùy API
      }));

      setResidents(residentsList); // Lưu danh sách đầy đủ
      setSuggestions(residentsList.map((resident) => resident.name)); // Chỉ lưu danh sách tên cho gợi ý
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tải danh sách residents");
    }
  };

  useEffect(() => {
    apiAllResidents();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (value.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = residents
        .filter((resident) => resident.name.toLowerCase().includes(value.toLowerCase()))
        .map((resident) => resident.name); // Chỉ lấy tên để hiển thị trong gợi ý
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSelect = (residentName: string) => {
    // Tìm resident trong danh sách đầy đủ
    const selectedResident = residents.find((resident) => resident.name === residentName);
    if (selectedResident && !selectedResidents.some((r) => r.id === selectedResident.id)) {
      setSelectedResidents([...selectedResidents, selectedResident]);
    }
    setSearchValue(""); // Clear input field
    setSuggestions([]); // Clear suggestions
  };

  const handleRemove = (residentId: number) => {
    setSelectedResidents(selectedResidents.filter((item) => item.id !== residentId));
  };

  const handleSave = () => {
    onResidentsSelect(selectedResidents); // Trả danh sách residents đã chọn về parent component
    toast.success("Residents added successfully");
  };
  return (
    <ModalContainer>
      <SearchSection>
        <SectionTitle>Search Resident:</SectionTitle>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for residents by name..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <SuggestionsList className={suggestions.length === 0 ? "hidden" : ""}>
            {suggestions.map((name, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSelect(name)}
              >
                {name}
              </SuggestionItem>
            ))}
          </SuggestionsList>
        </SearchContainer>
      </SearchSection>

      <SelectedSection>
        <SectionTitle>Selected Residents:</SectionTitle>
        <SelectedContainer>
          {selectedResidents.length > 0 ? (
            selectedResidents.map((resident) => (
              <SelectedItem key={resident.id}>
                <span>{resident.name} (ID: {resident.id})</span>
                <RemoveButton onClick={() => handleRemove(resident.id)}>
                  ×
                </RemoveButton>
              </SelectedItem>
            ))
          ) : (
            <NoSelection>No residents selected</NoSelection>
          )}
        </SelectedContainer>
      </SelectedSection>      <ButtonContainer>
        <Button
          variation="primary"
          size="compact"
          onClick={handleSave}
          disabled={selectedResidents.length === 0}
        >
          Save Selection
        </Button>
      </ButtonContainer>
    </ModalContainer>
  );
}
