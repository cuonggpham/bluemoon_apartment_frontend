import { useState, useEffect, useCallback } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiArrowLeft, HiArrowRight, HiExclamationTriangle, HiUser, HiHome, HiIdentification, HiBuildingOffice2 } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

// Enhanced styled components with modern glass morphism design
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const StepIndicatorContainer = styled.div`
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.02);
  text-align: center;
`;

const StepFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const StepCircle = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  
  ${(props) => {
    if (props.$active) {
      return `
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        box-shadow: 
          0 8px 20px rgba(99, 102, 241, 0.3),
          0 4px 10px rgba(99, 102, 241, 0.2);
        transform: scale(1.1);
      `;
    } else if (props.$completed) {
      return `
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        box-shadow: 
          0 6px 16px rgba(16, 185, 129, 0.3),
          0 3px 8px rgba(16, 185, 129, 0.2);
      `;
    } else {
      return `
        background: rgba(241, 245, 249, 0.8);
        color: #9ca3af;
        border: 2px solid rgba(203, 213, 225, 0.6);
      `;
    }
  }}
`;

const StepLine = styled.div<{ $active: boolean }>`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
  
  ${(props) => props.$active ? `
    background: linear-gradient(90deg, #10b981, #059669);
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  ` : `
    background: rgba(203, 213, 225, 0.6);
  `}
`;

const StepLabel = styled.div<{ $active: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${(props) => props.$active ? `
    color: #4f46e5;
  ` : `
    color: #6b7280;
  `}
`;

const SectionCard = styled.div`
  background: rgba(248, 250, 252, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 4px 16px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.02), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.06),
      0 6px 20px rgba(0, 0, 0, 0.03);
    transform: translateY(-2px);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #4f46e5);
    border-radius: 2px;
  }
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937, #374151);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

const OptionSection = styled.div`
  margin-bottom: 2rem;
`;

const OptionLabel = styled.label`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: block;
`;

const OptionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 1rem;
  position: relative;
  overflow: hidden;
  
  ${(props) => props.$selected ? `
    border-color: #6366f1;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.05));
    color: #4f46e5;
    box-shadow: 
      0 8px 20px rgba(99, 102, 241, 0.15),
      0 4px 10px rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
  ` : `
    border-color: rgba(203, 213, 225, 0.8);
    background: rgba(248, 250, 252, 0.8);
    color: #6b7280;
    
    &:hover {
      border-color: rgba(156, 163, 175, 0.8);
      background: rgba(241, 245, 249, 0.9);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  `}
`;

const SearchSection = styled.div`
  background: rgba(241, 245, 249, 0.8);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(203, 213, 225, 0.6);
  border-radius: 16px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.03),
    0 2px 10px rgba(0, 0, 0, 0.02);
`;

const LoadingIndicator = styled.div`
  padding: 1rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 12px;
  margin-top: 0.5rem;
`;

const NoResultsContainer = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.03));
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const NoResultsIcon = styled(HiExclamationTriangle)`
  color: #dc2626;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const NoResultsText = styled.span`
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
`;

const SuggestionsContainer = styled.div`
  border: 1px solid rgba(203, 213, 225, 0.6);
  border-radius: 16px;
  max-height: 280px;
  overflow-y: auto;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.04),
    0 3px 12px rgba(0, 0, 0, 0.03);
`;

const SuggestionItem = styled.div`
  padding: 1rem 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(79, 70, 229, 0.03));
    border-color: rgba(99, 102, 241, 0.2);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionTitle = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const SuggestionDetails = styled.div`
  font-size: 1.75rem;
  color: #6b7280;
`;

const NewApartmentTitle = styled.h4`
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 1px;
  }
`;

const InfoNote = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.03));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const InfoText = styled.p`
  margin: 0;
  color: #1e40af;
  font-size: 1.55rem;
  font-weight: 500;
`;

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  margin-top: 2rem;
`;

interface ResidentData {
  id: string;
  name: string;
  dob: string;
  cic: string;
  gender: string;
  status: string;
}

interface ApartmentData {
  addressNumber: string;
  area: string;
  status: string;
  ownerPhone: string;
}

export default function MultiStepResidentForm({ onCloseModal }: any) {
  const [currentStep, setCurrentStep] = useState(1);
  const [apartmentOption, setApartmentOption] = useState<"existing" | "new" | null>(null);
  
  // Add validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Step 1: Resident Information
  const [residentData, setResidentData] = useState<ResidentData>({
    id: "",
    name: "",
    dob: "",
    cic: "",
    gender: "",
    status: "Resident",
  });

  // Step 2: Apartment Data (for new apartment)
  const [apartmentData, setApartmentData] = useState<ApartmentData>({
    addressNumber: "",
    area: "",
    status: "Residential",
    ownerPhone: "",
  });
  // For existing apartment selection
  const [selectedApartmentId, setSelectedApartmentId] = useState("");
  const [apartmentSuggestions, setApartmentSuggestions] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResultsFound, setNoResultsFound] = useState(false);

  const statusOptions = ["Resident", "Moved", "Temporary", "Absent"];
  const genderOptions = ["Male", "Female"];
  const apartmentStatusOptions = ["Business", "Residential"];
  const handleResidentChange = (e: any) => {
    const { id, value } = e.target;
    setResidentData((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };

  const handleApartmentChange = (e: any) => {
    const { id, value } = e.target;
    setApartmentData((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };
  // Search for existing apartments with debounce
  const searchApartments = useCallback(async (searchValue: string) => {
    if (searchValue.trim() === "") {
      setApartmentSuggestions([]);
      setNoResultsFound(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setNoResultsFound(false);

    try {
      const response = await axios.get(`http://localhost:8080/api/v1/apartments?size=50&page=1`);
      const apartments = response.data.data.result;
      
      const filtered = apartments.filter((apt: any) => 
        apt.addressNumber.toString().includes(searchValue)
      );
      
      setApartmentSuggestions(filtered);
      setNoResultsFound(filtered.length === 0);
      setIsSearching(false);
    } catch (error) {
      console.error("Error searching apartments:", error);
      toast.error("Error searching apartments");
      setIsSearching(false);
      setNoResultsFound(true);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchValue) {
        searchApartments(searchValue);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayedSearch);
  }, [searchValue, searchApartments]);
  const handleApartmentSearch = (e: any) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Only update selectedApartmentId if user is actually typing
    // Don't auto-set it to the search value
    if (value.trim() === "") {
      setSelectedApartmentId("");
      setApartmentSuggestions([]);
      setNoResultsFound(false);
      setIsSearching(false);
    }
    
    // Clear error when user starts typing
    if (errors.selectedApartmentId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedApartmentId: "",
      }));
    }
  };

  const selectApartment = (apartment: any) => {
    setSelectedApartmentId(apartment.addressNumber.toString());
    setSearchValue(apartment.addressNumber.toString());
    setApartmentSuggestions([]);
    setNoResultsFound(false);
    
    // Clear error when apartment is selected
    if (errors.selectedApartmentId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedApartmentId: "",
      }));
    }
  };

  // Validation functions
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!residentData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!residentData.id.trim()) {
      newErrors.id = "CCCD is required";
    } else if (!/^\d{12}$/.test(residentData.id)) {
      newErrors.id = "CCCD must be 12 digits";
    }
    
    if (!residentData.dob) {
      newErrors.dob = "Date of birth is required";
    }
    
    if (!residentData.gender.trim()) {
      newErrors.gender = "Gender is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!apartmentOption) {
      newErrors.apartmentOption = "Please select an apartment option";
    }
    
    if (apartmentOption === "existing" && !selectedApartmentId) {
      newErrors.selectedApartmentId = "Please select an apartment";
    }
    
    if (apartmentOption === "new") {
      if (!apartmentData.addressNumber.trim()) {
        newErrors.addressNumber = "Room number is required";
      }
      
      if (!apartmentData.area.trim()) {
        newErrors.area = "Room area is required";
      } else if (isNaN(Number(apartmentData.area)) || Number(apartmentData.area) <= 0) {
        newErrors.area = "Area must be a positive number";
      }
      
      if (apartmentData.ownerPhone && !/^\d{10,11}$/.test(apartmentData.ownerPhone)) {
        newErrors.ownerPhone = "Phone number must be 10-11 digits";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!validateStep1()) {
        toast.error("Please fill in all required fields correctly");
        return;
      }
    } else if (currentStep === 2) {
      // Validate step 2
      if (!validateStep2()) {
        toast.error("Please complete the apartment selection");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };  
  
  // Submit form
  const handleSubmit = async () => {
    try {
      // Prepare payload for the new API endpoint
      const payload = {
        // Resident information
        id: parseInt(residentData.id),
        name: residentData.name,
        dob: residentData.dob,
        cic: residentData.cic,
        gender: residentData.gender,
        status: residentData.status,
        
        // Apartment option
        apartmentOption: apartmentOption,
        
        // For existing apartment
        ...(apartmentOption === "existing" && {
          existingApartmentId: parseInt(selectedApartmentId)
        }),
        
        // For new apartment
        ...(apartmentOption === "new" && {
          apartmentAddressNumber: parseInt(apartmentData.addressNumber),
          apartmentArea: parseFloat(apartmentData.area),
          apartmentStatus: apartmentData.status,
          ownerPhone: parseInt(apartmentData.ownerPhone)
        })
      };

      // Call the new transactional API endpoint
      await axios.post("http://localhost:8080/api/v1/residents/with-apartment", payload);

      toast.success("Resident created successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      console.error("Error creating resident:", error);
      toast.error(error.response?.data?.message || "Error creating resident");
    }
  };

  return (
    <FormContainer>
      {/* Step Indicator */}
      <StepIndicatorContainer>
        <StepFlex>
          <StepCircle $active={currentStep >= 1} $completed={currentStep > 1}>
            1
          </StepCircle>
          <StepLine $active={currentStep >= 2} />
          <StepCircle $active={currentStep >= 2} $completed={currentStep > 2}>
            2
          </StepCircle>
        </StepFlex>
        <StepLabel $active={currentStep >= 1}>
          {currentStep === 1 ? "Personal Information" : "Apartment Selection"}
        </StepLabel>
      </StepIndicatorContainer>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <SectionCard>
          <SectionHeader>
            <SectionIcon>
              <HiUser />
            </SectionIcon>
            <SectionTitle>Step 1: Personal Information</SectionTitle>
          </SectionHeader>
          
          <Form.Fields>
            <FormField>
              <FormField.Label label="Name" required />
              <FormField.Input
                id="name"
                type="text"
                value={residentData.name}
                onChange={handleResidentChange}
                required
                error={errors.name}
                placeholder="Enter full name"
              />
            </FormField>

            <FormField>
              <FormField.Label label="Date of Birth" required />
              <FormField.Input
                id="dob"
                type="date"
                value={residentData.dob}
                onChange={handleResidentChange}
                required
                error={errors.dob}
              />
            </FormField>

            <FormField>
              <FormField.Label label="CCCD" required />
              <FormField.Input
                id="id"
                type="text"
                value={residentData.id}
                onChange={handleResidentChange}
                required
                error={errors.id}
                placeholder="Enter 12-digit CCCD number"
              />
            </FormField>
          </Form.Fields>

          <Form.Fields type="horizontal">
            <FormField>
              <FormField.Label label="CIC Number" />
              <FormField.Input
                id="cic"
                type="text"
                value={residentData.cic}
                onChange={handleResidentChange}
                error={errors.cic}
                placeholder="Enter CIC number (optional)"
              />
            </FormField>

            <Selector
              id="gender"
              value={residentData.gender}
              onChange={handleResidentChange}
              options={genderOptions}
              label="Gender"
              required
              error={errors.gender}
            />
          </Form.Fields>

          <Selector
            id="status"
            value={residentData.status}
            onChange={handleResidentChange}
            options={statusOptions}
            label="Status"
            required
            error={errors.status}
          />
        </SectionCard>
      )}

      {/* Step 2: Apartment Assignment */}
      {currentStep === 2 && (
        <SectionCard>
          <SectionHeader>
            <SectionIcon>
              <HiHome />
            </SectionIcon>
            <SectionTitle>Step 2: Apartment Assignment</SectionTitle>
          </SectionHeader>
          
          {/* Apartment Option Selection */}
          <OptionSection>
            <OptionLabel>
              Choose an option: {errors.apartmentOption && <ErrorMessage>{errors.apartmentOption}</ErrorMessage>}
            </OptionLabel>
            <OptionButtons>
              <OptionButton
                type="button"
                onClick={() => {
                  setApartmentOption("existing");
                  if (errors.apartmentOption) {
                    setErrors(prev => ({ ...prev, apartmentOption: "" }));
                  }
                }}
                $selected={apartmentOption === "existing"}
              >
                Find Existing Apartment
              </OptionButton>
              <OptionButton
                type="button"
                onClick={() => {
                  setApartmentOption("new");
                  if (errors.apartmentOption) {
                    setErrors(prev => ({ ...prev, apartmentOption: "" }));
                  }
                }}
                $selected={apartmentOption === "new"}
              >
                Create New Apartment
              </OptionButton>
            </OptionButtons>
          </OptionSection>
          
          {/* Existing Apartment Search */}
          {apartmentOption === "existing" && (
            <SearchSection>
              <FormField>
                <FormField.Label label="Search Apartment by Number" required />
                <FormField.Input
                  id="apartmentSearch"
                  type="text"
                  value={searchValue}
                  onChange={handleApartmentSearch}
                  placeholder="Enter apartment number..."
                  error={errors.selectedApartmentId}
                />
              </FormField>

              {selectedApartmentId && (
                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>✓</span>
                    <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '0.875rem' }}>
                      Selected: Apartment {selectedApartmentId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApartmentId("");
                      setSearchValue("");
                      setApartmentSuggestions([]);
                      setNoResultsFound(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#16a34a',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '4px',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Clear selection"
                  >
                    ✕
                  </button>
                </div>
              )}

              {isSearching && (
                <LoadingIndicator>Searching apartments...</LoadingIndicator>
              )}

              {!isSearching && searchValue && apartmentSuggestions.length === 0 && !selectedApartmentId && (
                <NoResultsContainer>
                  <NoResultsIcon />
                  <NoResultsText>
                    No apartments found with number "{searchValue}"
                  </NoResultsText>
                </NoResultsContainer>
              )}

              {apartmentSuggestions.length > 0 && !isSearching && (
                <SuggestionsContainer>
                  {apartmentSuggestions.map((apartment) => (
                    <SuggestionItem
                      key={apartment.addressNumber}
                      onClick={() => selectApartment(apartment)}
                    >
                      <SuggestionTitle>Apartment {apartment.addressNumber}</SuggestionTitle>
                      <SuggestionDetails>
                        Area: {apartment.area}m² | Status: {apartment.status}
                        {apartment.ownerPhone && ` | Phone: ${apartment.ownerPhone}`}
                      </SuggestionDetails>
                    </SuggestionItem>
                  ))}
                </SuggestionsContainer>
              )}
            </SearchSection>
          )}
          
          {/* New Apartment Form */}
          {apartmentOption === "new" && (
            <div>
              <NewApartmentTitle>Create New Apartment</NewApartmentTitle>
              <Form.Fields type="horizontal">
                <FormField>
                  <FormField.Label label="Apartment Number" required />
                  <FormField.Input
                    id="addressNumber"
                    type="text"
                    value={apartmentData.addressNumber}
                    onChange={handleApartmentChange}
                    required
                    error={errors.addressNumber}
                    placeholder="e.g., 101, 202A"
                  />
                </FormField>

                <FormField>
                  <FormField.Label label="Area (m²)" required />
                  <FormField.Input
                    id="area"
                    type="number"
                    value={apartmentData.area}
                    onChange={handleApartmentChange}
                    required
                    error={errors.area}
                    placeholder="e.g., 50"
                  />
                </FormField>
              </Form.Fields>

              <Form.Fields type="horizontal">
                <Selector
                  id="status"
                  value={apartmentData.status}
                  onChange={handleApartmentChange}
                  options={apartmentStatusOptions}
                  label="Status"
                  required
                  error={errors.apartmentStatus}
                />

                <FormField>
                  <FormField.Label label="Owner Phone" />
                  <FormField.Input
                    id="ownerPhone"
                    type="text"
                    value={apartmentData.ownerPhone}
                    onChange={handleApartmentChange}
                    error={errors.ownerPhone}
                    placeholder="Optional"
                  />
                </FormField>
              </Form.Fields>
              
              <InfoNote>
                <InfoText>
                  💡 Creating a new apartment will automatically assign the resident as the owner.
                </InfoText>
              </InfoNote>
            </div>
          )}
        </SectionCard>
      )}

      {/* Navigation Buttons */}
      <ButtonGroup>
        {currentStep > 1 && (
          <Button
            type="button"
            variation="secondary"
            size="compact"
            onClick={prevStep}
          >
            <HiArrowLeft />
            Previous
          </Button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          {currentStep < 2 ? (
            <Button
              type="button"
              variation="primary"
              size="compact"
              onClick={nextStep}
            >
              Next
              <HiArrowRight />
            </Button>
          ) : (
            <Button
              type="button"
              variation="primary"
              size="compact"
              onClick={handleSubmit}
            >
              <HiOutlinePlusCircle />
              Add Resident
            </Button>
          )}
        </div>
      </ButtonGroup>
    </FormContainer>
  );
}
