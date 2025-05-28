import { useState, useEffect, useCallback } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiArrowLeft, HiArrowRight, HiExclamationTriangle } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import "./MultiStepResidentForm.css";

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
    <Form width="500px">      
    {/* Step Indicator */}
      <div className="step-indicator">
        <div className="step-flex">
          <div className={`step-circle ${currentStep >= 1 ? 'active' : 'inactive'}`}>
            1
          </div>
          <div className={`step-line ${currentStep >= 2 ? 'active' : 'inactive'}`}></div>
          <div className={`step-circle ${currentStep >= 2 ? 'active' : 'inactive'}`}>
            2
          </div>
        </div>
        <div className="step-title">
          {currentStep === 1 ? "Personal Information" : "Apartment Selection"}
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div>
          <h3>Step 1: Personal Information</h3>          
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
          <h3>Step 2: Apartment Assignment</h3>
            {/* Apartment Option Selection */}
          <div className="apartment-option-section">
            <label className="apartment-option-label">
              Choose an option: {errors.apartmentOption && <span className="error-message">{errors.apartmentOption}</span>}
            </label>
            <div className="apartment-option-buttons">
              <button
                type="button"
                onClick={() => {
                  setApartmentOption("existing");
                  if (errors.apartmentOption) {
                    setErrors(prev => ({ ...prev, apartmentOption: "" }));
                  }
                }}
                className={`apartment-option-button ${apartmentOption === "existing" ? "selected" : ""}`}
              >
                Find Existing Apartment
              </button>
              <button
                type="button"
                onClick={() => {
                  setApartmentOption("new");
                  if (errors.apartmentOption) {
                    setErrors(prev => ({ ...prev, apartmentOption: "" }));
                  }
                }}
                className={`apartment-option-button ${apartmentOption === "new" ? "selected" : ""}`}
              >
                Create New Apartment
              </button>
            </div>
          </div>          {/* Existing Apartment Search */}
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
                <div className="loading-indicator">
                  Searching...
                </div>
              )}
              
              {/* No results message */}
              {noResultsFound && searchValue.trim() !== "" && !isSearching && (
                <div className="no-results-container">
                  <HiExclamationTriangle className="no-results-icon" />
                  <span className="no-results-text">
                    No apartment found with number "{searchValue}". Please check the number or create a new apartment.
                  </span>
                </div>
              )}
              
              {/* Apartment Suggestions */}
              {apartmentSuggestions.length > 0 && !isSearching && (
                <div className="apartment-suggestions-container">
                  {apartmentSuggestions.map((apartment) => (
                    <div
                      key={apartment.addressNumber}
                      onClick={() => selectApartment(apartment)}
                      className="apartment-suggestion"
                    >
                      <div className="apartment-suggestion-title">Apartment {apartment.addressNumber}</div>
                      <div className="apartment-suggestion-details">
                        Owner: {apartment.owner?.name || "N/A"} | Status: {apartment.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}          
          {/* New Apartment Form */}
          {apartmentOption === "new" && (
            <div>
              <h4 className="new-apartment-title">Create New Apartment</h4>
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
              
              <div className="new-apartment-info-note">
                <p className="new-apartment-info-text">
                  <strong>Note:</strong> {residentData.name} will be set as the owner of this new apartment.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <Form.Buttons>
        {currentStep > 1 && (
          <Button
            type="button"
            onClick={prevStep}
            variation="secondary"
            size="medium"
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
            size="medium"
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
            size="medium"
          >
            Create Resident
            <HiOutlinePlusCircle />
          </Button>
        )}
      </Form.Buttons>
    </Form>
  );
}
