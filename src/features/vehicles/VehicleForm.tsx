import { useState, useEffect } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import { HiOutlinePlusCircle, HiPencil, HiTrash, HiTruck, HiInformationCircle } from "react-icons/hi2";
import ApartmentSearchDropdown from "../../components/ApartmentSearchDropdown";
import api from "../../services/axios";
import { toast } from "react-toastify";
import styled from "styled-components";

// Enhanced Styled Components with modern glass morphism design
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
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
  /* Remove overflow: hidden to allow dropdown to extend beyond container */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.02), transparent);
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
    background: linear-gradient(90deg, #db2777, #be185d);
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
  background: linear-gradient(135deg, #db2777, #be185d);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);
`;

const InfoIcon = styled(HiInformationCircle)`
  color: #3b82f6;
  font-size: 2.6rem;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  margin: 0;
  color: #1e40af;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.5;
`;

const InfoNote = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(37, 99, 235, 0.03));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  margin-top: 1.5rem;
`;

const StyledFormField = styled(FormField)`
  .form-field-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: block;
    letter-spacing: -0.01em;
  }
  
  .form-field-input {
    width: 100%;
    padding: 1rem 1.25rem;
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
      border-color: #db2777;
      box-shadow: 
        0 0 0 3px rgba(219, 39, 119, 0.1),
        0 2px 8px rgba(219, 39, 119, 0.1);
      background: white;
      transform: translateY(-1px);
    }
    
    &::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }
  }
`;

const StyledSelector = styled(Selector)`
  .selector-label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
    display: block;
    letter-spacing: -0.01em;
  }
  
  select {
    width: 100%;
    padding: 1rem 1.25rem;
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
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: #db2777;
      box-shadow: 
        0 0 0 3px rgba(219, 39, 119, 0.1),
        0 2px 8px rgba(219, 39, 119, 0.1);
      background: white;
      transform: translateY(-1px);
    }
    
    option {
      font-size: 1rem;
      color: #1f2937;
      padding: 0.5rem;
      background: white;
    }
  }
`;

export default function VehicleForm({ vehicle }: any) {
  const [formValues, setFormValues] = useState({
    apartmentId: vehicle?.apartment?.addressNumber || vehicle?.apartmentId || "",
    registerDate: vehicle?.registerDate || "",
    id: vehicle?.id || "",
    category: vehicle?.category || "",
  });
  
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const vehicleTypeOptions = ["Motorbike", "Car"];

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.apartmentId) {
      newErrors.apartmentId = "Apartment is required";
    }
    
    if (!formValues.id || !formValues.id.toString().trim()) {
      newErrors.id = "Vehicle number is required";
    }
    
    if (!formValues.category || !formValues.category.toString().trim()) {
      newErrors.category = "Vehicle type is required";
    }
    
    setErrors(newErrors);
    
    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors);
      toast.error(`Validation errors: ${errorMessages.join(', ')}`);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
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

  const handleApartmentSelect = (apartment: any) => {
    setSelectedApartment(apartment);
    setFormValues((prevValues) => ({
      ...prevValues,
      apartmentId: apartment?.addressNumber || "",
    }));
    
    // Clear error when apartment is selected
    if (errors.apartmentId && apartment) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apartmentId: "",
      }));
    }
  };

  // Initialize selected apartment when editing existing vehicle
  useEffect(() => {
    // Check if we have apartment data from VehicleResponse
    if (vehicle?.apartment) {
      setSelectedApartment({
        addressNumber: vehicle.apartment.addressNumber,
        area: vehicle.apartment.area,
        status: vehicle.apartment.status,
      });
    } else if (vehicle?.apartmentId && !selectedApartment) {
      // Fallback: fetch apartment details for old structure
      const fetchApartmentDetails = async () => {
        try {
          const response = await api.get(`/apartments/${vehicle.apartmentId}`);
          const apartmentData = response.data.data;
          setSelectedApartment({
            addressNumber: apartmentData.addressNumber,
            area: apartmentData.area,
            status: apartmentData.status,
          });
        } catch (error) {
          console.error("Error fetching apartment details:", error);
        }
      };
      fetchApartmentDetails();
    }
  }, [vehicle?.apartment, vehicle?.apartmentId, selectedApartment]);

  const handleDelete = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Use apartmentId from formValues (which is set from apartment.addressNumber or direct apartmentId)
      console.log("Deleting vehicle with apartmentId:", formValues.apartmentId);
      const response = await api.delete(`/vehicles/${formValues.apartmentId}`, {
        data: { id: formValues.id }, // Payload gửi kèm
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Vehicle deleted successfully!");
    } catch (error) {
      toast.error("Error deleting vehicle");
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("handleSubmit được gọi!");
    console.log("Form values:", formValues);
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const vehicleData = {
      apartmentId: formValues.apartmentId,
      id: formValues.id,
      category: formValues.category
    };
    
    console.log("Sending vehicle data:", vehicleData);
    
    try {
      let response;
      if (vehicle) {
        response = await api.put(
          `/vehicles/${formValues.id}`,
          vehicleData
        );
        toast.success("Vehicle updated successfully!");
      } else {
        response = await api.post(
          "/vehicles",
          vehicleData
        );
        toast.success("Vehicle added successfully!");
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Error details:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <FormContainer>
      {/* Vehicle Information Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiTruck />
          </SectionIcon>
          <SectionTitle>Vehicle Information</SectionTitle>
        </SectionHeader>
        
        <StyledFormField>
          <FormField.Label label="Apartment" required />          
          <ApartmentSearchDropdown
            value={selectedApartment?.addressNumber?.toString() || (formValues.apartmentId?.toString() || "")}
            onChange={handleApartmentSelect}
            placeholder="Search apartment by room number..."
          />
          {errors.apartmentId && (
            <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              {errors.apartmentId}
            </div>
          )}
        </StyledFormField>

        <StyledFormField>
          <FormField.Label label="Vehicle Number" required />
          <FormField.Input
            id="id"
            type="text"
            value={formValues.id}
            onChange={handleChange}
            placeholder="Enter license plate number"
            error={errors.id}
          />
        </StyledFormField>

        <StyledSelector
          value={formValues.category}
          onChange={handleChange}
          id="category"
          options={vehicleTypeOptions}
          label="Vehicle Type"
          required
          error={errors.category}
        />

        <InfoNote>
          <InfoIcon />
          <InfoText>
            💡 Vehicle registration will be linked to the selected apartment. Make sure to enter the correct license plate number.
          </InfoText>
        </InfoNote>
      </SectionCard>

      {/* Action Buttons */}
      <ButtonGroup>
        {vehicle ? (
          <>
            <Button 
              variation="danger" 
              size="compact" 
              onClick={handleDelete}
              type="button"
            >
              <HiTrash />
              Delete
            </Button>
            <Button 
              type="submit" 
              size="compact" 
              variation="secondary"
              onClick={handleSubmit}
            >
              <HiPencil />
              Update
            </Button>
          </>
        ) : (
          <Button 
            type="submit" 
            size="compact" 
            variation="primary"
            onClick={handleSubmit}
          >
            <HiOutlinePlusCircle />
            Add Vehicle
          </Button>
        )}
      </ButtonGroup>
    </FormContainer>
  );
}
