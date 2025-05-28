import { useState, useEffect, useCallback } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiArrowLeft, HiArrowRight, HiExclamationTriangle } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";

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
  };

  const handleApartmentChange = (e: any) => {
    const { id, value } = e.target;
    setApartmentData((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
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
    
    if (value.trim() === "") {
      setApartmentSuggestions([]);
      setNoResultsFound(false);
      setIsSearching(false);
    }
  };
  const selectApartment = (apartment: any) => {
    setSelectedApartmentId(apartment.addressNumber.toString());
    setSearchValue(apartment.addressNumber.toString());
    setApartmentSuggestions([]);
    setNoResultsFound(false);
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!residentData.name || !residentData.dob || !residentData.id || !residentData.gender) {
        toast.error("Please fill in all required fields");
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
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <div 
            style={{ 
              width: "30px", 
              height: "30px", 
              borderRadius: "50%", 
              backgroundColor: currentStep >= 1 ? "#3b82f6" : "#e5e7eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}
          >
            1
          </div>
          <div style={{ width: "50px", height: "2px", backgroundColor: currentStep >= 2 ? "#3b82f6" : "#e5e7eb" }}></div>
          <div 
            style={{ 
              width: "30px", 
              height: "30px", 
              borderRadius: "50%", 
              backgroundColor: currentStep >= 2 ? "#3b82f6" : "#e5e7eb",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold"
            }}
          >
            2
          </div>
        </div>
        <div style={{ marginTop: "10px", fontWeight: "bold" }}>
          {currentStep === 1 ? "Personal Information" : "Apartment Selection"}
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div>
          <h3>Step 1: Personal Information</h3>
          <Form.Fields>
            <FormField>
              <FormField.Label label="Full Name *" />
              <FormField.Input
                id="name"
                type="text"
                value={residentData.name}
                onChange={handleResidentChange}
                placeholder="Enter full name"
              />
            </FormField>
            
            <FormField>
              <FormField.Label label="Date of Birth *" />
              <FormField.Input
                id="dob"
                type="date"
                value={residentData.dob}
                onChange={handleResidentChange}
              />
            </FormField>
            
            <FormField>
              <FormField.Label label="CCCD *" />
              <FormField.Input
                id="id"
                type="text"
                value={residentData.id}
                onChange={handleResidentChange}
                placeholder="Enter citizen ID"
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
              label="Gender *"
            />
            
            <Selector
              value={residentData.status}
              onChange={handleResidentChange}
              id="status"
              options={statusOptions}
              label="Status"
            />
          </Form.Fields>
        </div>
      )}

      {/* Step 2: Apartment Selection */}
      {currentStep === 2 && (
        <div>
          <h3>Step 2: Apartment Assignment</h3>
          
          {/* Apartment Option Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontWeight: "bold", marginBottom: "10px", display: "block" }}>
              Choose an option:
            </label>
            <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
              <button
                type="button"
                onClick={() => setApartmentOption("existing")}
                style={{
                  padding: "10px 20px",
                  border: apartmentOption === "existing" ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: apartmentOption === "existing" ? "#eff6ff" : "white",
                  color: apartmentOption === "existing" ? "#3b82f6" : "#374151",
                  cursor: "pointer",
                  fontWeight: apartmentOption === "existing" ? "bold" : "normal"
                }}
              >
                Find Existing Apartment
              </button>
              <button
                type="button"
                onClick={() => setApartmentOption("new")}
                style={{
                  padding: "10px 20px",
                  border: apartmentOption === "new" ? "2px solid #3b82f6" : "2px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: apartmentOption === "new" ? "#eff6ff" : "white",
                  color: apartmentOption === "new" ? "#3b82f6" : "#374151",
                  cursor: "pointer",
                  fontWeight: apartmentOption === "new" ? "bold" : "normal"
                }}
              >
                Create New Apartment
              </button>
            </div>
          </div>          {/* Existing Apartment Search */}
          {apartmentOption === "existing" && (
            <div>
              <FormField>
                <FormField.Label label="Search Apartment by Number" />
                <FormField.Input
                  type="text"
                  value={searchValue}
                  onChange={handleApartmentSearch}
                  placeholder="Enter apartment number"
                />
              </FormField>
              
              {/* Loading indicator */}
              {isSearching && (
                <div style={{ 
                  padding: "10px", 
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "0.875rem"
                }}>
                  Searching...
                </div>
              )}
              
              {/* No results message */}
              {noResultsFound && searchValue.trim() !== "" && !isSearching && (
                <div style={{ 
                  padding: "15px", 
                  backgroundColor: "#fef2f2", 
                  border: "1px solid #fecaca", 
                  borderRadius: "8px",
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <HiExclamationTriangle style={{ color: "#dc2626", fontSize: "1.25rem" }} />
                  <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
                    No apartment found with number "{searchValue}". Please check the number or create a new apartment.
                  </span>
                </div>
              )}
              
              {/* Apartment Suggestions */}
              {apartmentSuggestions.length > 0 && !isSearching && (
                <div style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  maxHeight: "200px", 
                  overflowY: "auto",
                  marginTop: "5px"
                }}>
                  {apartmentSuggestions.map((apartment) => (
                    <div
                      key={apartment.addressNumber}
                      onClick={() => selectApartment(apartment)}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #f3f4f6",
                        cursor: "pointer",
                        backgroundColor: "white"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                      <div style={{ fontWeight: "bold" }}>Apartment {apartment.addressNumber}</div>
                      <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
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
              <h4 style={{ marginBottom: "15px" }}>Create New Apartment</h4>
              <Form.Fields>
                <FormField>
                  <FormField.Label label="Apartment Number *" />
                  <FormField.Input
                    id="addressNumber"
                    type="text"
                    value={apartmentData.addressNumber}
                    onChange={handleApartmentChange}
                    placeholder="Enter apartment number"
                  />
                </FormField>
                
                <FormField>
                  <FormField.Label label="Area (m²) *" />
                  <FormField.Input
                    id="area"
                    type="number"
                    value={apartmentData.area}
                    onChange={handleApartmentChange}
                    placeholder="Enter area in square meters"
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
                  />
                </FormField>
                
                <Selector
                  value={apartmentData.status}
                  onChange={handleApartmentChange}
                  id="status"
                  options={apartmentStatusOptions}
                  label="Apartment Type"
                />
              </Form.Fields>
              
              <div style={{ 
                padding: "10px", 
                backgroundColor: "#f0f9ff", 
                border: "1px solid #bae6fd", 
                borderRadius: "8px",
                marginTop: "15px"
              }}>
                <p style={{ margin: "0", fontSize: "0.875rem", color: "#0369a1" }}>
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
