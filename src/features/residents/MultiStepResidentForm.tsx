import { useState, useEffect, useCallback } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiArrowLeft, HiArrowRight, HiExclamationTriangle } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

// Modern styled components for MultiStepResidentForm
const StepIndicator = styled.div`
  margin-bottom: var(--space-6);
  text-align: center;
`;

const StepFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-3);
`;

const StepCircle = styled.div<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  border: 2px solid;
  transition: all var(--transition-fast);
  
  ${(props) => props.$active ? `
    background: linear-gradient(135deg, var(--color-brand-500), var(--color-brand-600));
    color: var(--color-grey-0);
    border-color: var(--color-brand-500);
    box-shadow: var(--shadow-sm);
  ` : `
    background-color: var(--color-grey-100);
    color: var(--color-grey-400);
    border-color: var(--color-grey-200);
  `}
`;

const StepLine = styled.div<{ $active: boolean }>`
  width: 60px;
  height: 3px;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-fast);
  
  ${(props) => props.$active ? `
    background: linear-gradient(90deg, var(--color-brand-500), var(--color-brand-600));
  ` : `
    background-color: var(--color-grey-200);
  `}
`;

const StepTitle = styled.div`
  margin-top: var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-800);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-900);
  margin-bottom: var(--space-4);
  margin-top: 0;
`;

const ApartmentOptionSection = styled.div`
  margin-bottom: var(--space-6);
`;

const ApartmentOptionLabel = styled.label`
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-800);
  margin-bottom: var(--space-3);
  display: block;
`;

const ApartmentOptionButtons = styled.div`
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;

const ApartmentOptionButton = styled.button<{ $selected: boolean }>`
  padding: var(--space-3) var(--space-5);
  border: 2px solid;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-base);
  position: relative;
  overflow: hidden;
  
  ${(props) => props.$selected ? `
    border-color: var(--color-brand-500);
    background: linear-gradient(135deg, var(--color-brand-50), var(--color-brand-100));
    color: var(--color-brand-700);
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  ` : `
    border-color: var(--color-grey-300);
    background-color: var(--color-grey-0);
    color: var(--color-grey-700);
    
    &:hover {
      border-color: var(--color-grey-400);
      background-color: var(--color-grey-50);
      transform: translateY(-1px);
      box-shadow: var(--shadow-xs);
    }
  `}
`;

const LoadingIndicator = styled.div`
  padding: var(--space-3);
  text-align: center;
  color: var(--color-grey-600);
  font-size: var(--font-size-sm);
  font-style: italic;
`;

const NoResultsContainer = styled.div`
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-red-50), var(--color-red-100));
  border: 1px solid var(--color-red-200);
  border-radius: var(--border-radius-lg);
  margin-top: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const NoResultsIcon = styled(HiExclamationTriangle)`
  color: var(--color-red-600);
  font-size: var(--font-size-lg);
  flex-shrink: 0;
`;

const NoResultsText = styled.span`
  color: var(--color-red-700);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
`;

const SuggestionsContainer = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  max-height: 240px;
  overflow-y: auto;
  margin-top: var(--space-2);
  background: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  
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

const SuggestionItem = styled.div`
  padding: var(--space-3);
  cursor: pointer;
  border-bottom: 1px solid var(--color-grey-100);
  transition: all var(--transition-fast);
  
  &:hover {
    background: linear-gradient(135deg, var(--color-brand-50), var(--color-brand-100));
    border-color: var(--color-brand-200);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SuggestionTitle = styled.div`
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-800);
  margin-bottom: var(--space-1);
`;

const SuggestionDetails = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-grey-600);
`;

const NewApartmentTitle = styled.h4`
  margin-bottom: var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-grey-800);
  margin-top: 0;
`;

const InfoNote = styled.div`
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-blue-50), var(--color-blue-100));
  border: 1px solid var(--color-blue-200);
  border-radius: var(--border-radius-lg);
  margin-top: var(--space-4);
`;

const InfoText = styled.p`
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-blue-700);
  font-weight: var(--font-weight-medium);
`;

const ErrorMessage = styled.span`
  color: var(--color-red-600);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  margin-left: var(--space-2);
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
    setSelectedApartmentId(value);
    
    // Clear error when user starts typing
    if (errors.selectedApartmentId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        selectedApartmentId: "",
      }));
    }
    
    if (value.trim() === "") {
      setApartmentSuggestions([]);
      setNoResultsFound(false);
      setIsSearching(false);
    }
  };const selectApartment = (apartment: any) => {
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
    <Form width="500px">      {/* Step Indicator */}
      <StepIndicator>
        <StepFlex>
          <StepCircle $active={currentStep >= 1}>
            1
          </StepCircle>
          <StepLine $active={currentStep >= 2} />
          <StepCircle $active={currentStep >= 2}>
            2
          </StepCircle>
        </StepFlex>
        <StepTitle>
          {currentStep === 1 ? "Personal Information" : "Apartment Selection"}
        </StepTitle>
      </StepIndicator>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div>
          <SectionTitle>Step 1: Personal Information</SectionTitle>          
          <Form.Fields>
            <FormField>
              <FormField.Label label="Full Name" required />
              <FormField.Input
                id="name"
                type="text"
                value={residentData.name}
                onChange={handleResidentChange}
                placeholder="Enter full name"
                required
                error={errors.name}
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
                placeholder="Enter citizen ID"
                required
                error={errors.id}
              />
            </FormField>

            <FormField>
              <FormField.Label label="CIC Number" />
              <FormField.Input
                id="cic"
                type="text"
                value={residentData.cic}
                onChange={handleResidentChange}
                placeholder="Enter CIC number"
              />
            </FormField>
            
            <Selector
              value={residentData.gender}
              onChange={handleResidentChange}
              id="gender"
              options={genderOptions}
              label="Gender"
              required
              error={errors.gender}
            />
            
            <Selector
              value={residentData.status}
              onChange={handleResidentChange}
              id="status"
              options={statusOptions}
              label="Status"
              required
              error={errors.status}
            />          </Form.Fields>
        </div>
      )}

      {/* Step 2: Apartment Selection */}
      {currentStep === 2 && (
        <div>
          <SectionTitle>Step 2: Apartment Assignment</SectionTitle>
            {/* Apartment Option Selection */}
          <ApartmentOptionSection>            <ApartmentOptionLabel>
              Choose an option: {errors.apartmentOption && <ErrorMessage>{errors.apartmentOption}</ErrorMessage>}
            </ApartmentOptionLabel>
            <ApartmentOptionButtons>
              <ApartmentOptionButton
                type="button"
                onClick={() => {
                  setApartmentOption("existing");
                  if (errors.apartmentOption) {
                    setErrors(prev => ({ ...prev, apartmentOption: "" }));
                  }                }}
                $selected={apartmentOption === "existing"}
              >
                Find Existing Apartment
              </ApartmentOptionButton>
              <ApartmentOptionButton
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
              </ApartmentOptionButton>
            </ApartmentOptionButtons>
          </ApartmentOptionSection>          {/* Existing Apartment Search */}
          {apartmentOption === "existing" && (
            <div>
              <FormField>
                <FormField.Label label="Search Apartment by Number" required />
                <FormField.Input
                  type="text"
                  value={searchValue}
                  onChange={handleApartmentSearch}
                  placeholder="Enter apartment number"
                  required
                  error={errors.selectedApartmentId}
                />
              </FormField>
              
              {/* Loading indicator */}
              {isSearching && (
                <LoadingIndicator>
                  Searching...
                </LoadingIndicator>
              )}
                {/* No results message */}
              {noResultsFound && searchValue.trim() !== "" && !isSearching && (
                <NoResultsContainer>
                  <NoResultsIcon />
                  <NoResultsText>
                    No apartment found with number "{searchValue}". Please check the number or create a new apartment.
                  </NoResultsText>
                </NoResultsContainer>
              )}
              
              {/* Apartment Suggestions */}
              {apartmentSuggestions.length > 0 && !isSearching && (
                <SuggestionsContainer>
                  {apartmentSuggestions.map((apartment) => (                    <SuggestionItem
                      key={apartment.addressNumber}
                      onClick={() => selectApartment(apartment)}
                    >
                      <SuggestionTitle>Apartment {apartment.addressNumber}</SuggestionTitle>
                      <SuggestionDetails>
                        Owner: {apartment.owner?.name || "N/A"} | Status: {apartment.status}
                      </SuggestionDetails>
                    </SuggestionItem>
                  ))}
                </SuggestionsContainer>
              )}
            </div>
          )}          
          {/* New Apartment Form */}          {apartmentOption === "new" && (
            <div>
              <NewApartmentTitle>Create New Apartment</NewApartmentTitle>
              <Form.Fields>
                <FormField>
                  <FormField.Label label="Apartment Number" required />
                  <FormField.Input
                    id="addressNumber"
                    type="text"
                    value={apartmentData.addressNumber}
                    onChange={handleApartmentChange}
                    placeholder="Enter apartment number"
                    required
                    error={errors.addressNumber}
                  />
                </FormField>
                
                <FormField>
                  <FormField.Label label="Area (m²)" required />
                  <FormField.Input
                    id="area"
                    type="number"
                    value={apartmentData.area}
                    onChange={handleApartmentChange}
                    placeholder="Enter area in square meters"
                    required
                    error={errors.area}
                  />
                </FormField>
                
                <FormField>
                  <FormField.Label label="Owner Phone" />
                  <FormField.Input
                    id="ownerPhone"
                    type="text"
                    value={apartmentData.ownerPhone}
                    onChange={handleApartmentChange}
                    placeholder="Enter owner phone number"
                    error={errors.ownerPhone}
                  />
                </FormField>
                
                <Selector
                  value={apartmentData.status}
                  onChange={handleApartmentChange}
                  id="status"
                  options={apartmentStatusOptions}
                  label="Apartment Type"
                  required
                  error={errors.status}
                />
              </Form.Fields>              
              <InfoNote>
                <InfoText>
                  <strong>Note:</strong> {residentData.name} will be set as the owner of this new apartment.
                </InfoText>
              </InfoNote>
            </div>
          )}
        </div>
      )}      {/* Navigation Buttons */}
      <Form.Buttons>
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={prevStep}
            variation="secondary"
            size="compact"
          >
            <HiArrowLeft />
            Previous
          </Button>
        )}
        
        {currentStep < 2 && (
          <Button
            type="button"
            onClick={nextStep}
            variation="primary"
            size="compact"
          >
            Next
            <HiArrowRight />
          </Button>
        )}
        
        {currentStep === 2 && apartmentOption && (
          <Button
            type="button"
            onClick={handleSubmit}
            variation="primary"
            size="compact"
          >
            Create Resident
            <HiOutlinePlusCircle />
          </Button>
        )}
      </Form.Buttons>
    </Form>
  );
}
