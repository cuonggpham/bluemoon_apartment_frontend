import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import ApartmentSearchDropdown from "../../components/ApartmentSearchDropdown";
import { HiOutlinePlusCircle, HiPencil, HiTrash, HiPlus, HiMinus, HiHome, HiUser, HiIdentification } from "react-icons/hi2";
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
  max-width: 600px;
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

const ApartmentSearchSection = styled.div`
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
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.02), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ApartmentSearchButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const ApartmentsContainer = styled.div`
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  min-height: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.02);
`;

const ApartmentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(226, 232, 240, 0.6);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.03),
    0 1px 4px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.03), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.05),
      0 3px 10px rgba(0, 0, 0, 0.03);
    transform: translateY(-2px);
  }

  &:hover::before {
    opacity: 1;
  }

  span {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '🏠';
      font-size: 1.125rem;
    }
  }
`;

const NoApartmentsMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
  font-size: 1rem;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  border: 2px dashed rgba(203, 213, 225, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '📭';
    display: block;
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.6);
  margin-top: 1.5rem;
`;

const AddApartmentButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 4px 16px rgba(16, 185, 129, 0.2),
    0 2px 8px rgba(16, 185, 129, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #059669, #047857);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(16, 185, 129, 0.3),
      0 4px 12px rgba(16, 185, 129, 0.15);
  }

  &:hover::before {
    opacity: 1;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

export default function ResidentForm({ resident }: any) {
  const [formValues, setFormValues] = useState({
    id: resident?.id?.toString() || "",
    name: resident?.name?.toString() || "",
    dob: resident?.dob?.toString() || "",
    apartments: resident?.apartments || [],
    status: resident?.status?.toString() || "Resident",
    cic: resident?.cic?.toString() || "",
    gender: resident?.gender?.toString() || "",
  });

  // Add validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Add apartment management states
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [showApartmentSearch, setShowApartmentSearch] = useState(false);
  const [isUpdatingApartments, setIsUpdatingApartments] = useState(false);

  const statusOptions = ["Resident", "Moved", "Temporary", "Absent"];
  const genderOptions = ["Male", "Female"];
  
  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.name || !formValues.name.toString().trim()) {
      newErrors.name = "Name is required";
    }
    
    const idStr = formValues.id ? formValues.id.toString().trim() : "";
    if (!idStr) {
      newErrors.id = "CCCD is required";
    } else if (!/^\d{12}$/.test(idStr)) {
      newErrors.id = "CCCD must be 12 digits";
    }
    
    if (!formValues.dob) {
      newErrors.dob = "Date of birth is required";
    }
    
    if (!formValues.gender || !formValues.gender.toString().trim()) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formValues.status || !formValues.status.toString().trim()) {
      newErrors.status = "Status is required";
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

  // Apartment management functions
  const handleApartmentSelect = (apartment: any) => {
    setSelectedApartment(apartment);
  };

  const handleAddApartment = async () => {
    if (!selectedApartment) {
      toast.error("Please select an apartment to add");
      return;
    }

    // Check if apartment is already assigned
    const isAlreadyAssigned = formValues.apartments.some(
      (apt: any) => apt.addressNumber === selectedApartment.addressNumber
    );

    if (isAlreadyAssigned) {
      toast.warning("This apartment is already assigned to the resident");
      return;
    }

    setIsUpdatingApartments(true);    
    try {
      // Get current residents of this apartment first
      const apartmentResponse = await api.get(
        `/apartments/${selectedApartment.addressNumber}`
      );
      
      const apartmentData = apartmentResponse.data.data;
      const currentResidents = apartmentData.residents || [];
      
      // Add this resident to the existing resident list
      const currentResidentIds = currentResidents.map((res: any) => res.id);
      const updatedResidentIds = [...currentResidentIds, parseInt(formValues.id)];

      // Update apartment assignments via apartment API
      await api.put(
        `/apartments/${selectedApartment.addressNumber}`,
        {
          area: apartmentData.area,
          status: apartmentData.status,
          residents: updatedResidentIds
        }
      );

      // Update local state
      setFormValues(prev => ({
        ...prev,
        apartments: [...prev.apartments, selectedApartment]
      }));

      setSelectedApartment(null);
      setShowApartmentSearch(false);
      toast.success("Apartment added successfully!");
      
    } catch (error: any) {
      console.error("Error adding apartment:", error);
      toast.error(error.response?.data?.message || "Error adding apartment");
    } finally {
      setIsUpdatingApartments(false);
    }
  };

  const handleRemoveApartment = async (apartmentId: number) => {
    setIsUpdatingApartments(true);
    try {
      // Get current apartment data
      const apartmentResponse = await api.get(
        `/apartments/${apartmentId}`
      );
      
      const apartmentData = apartmentResponse.data.data;
      const currentResidents = apartmentData.residents || [];
      
      // Remove this resident from the apartment's resident list
      const updatedResidentIds = currentResidents
        .filter((res: any) => res.id !== parseInt(formValues.id))
        .map((res: any) => res.id);

      // Update apartment via API
      await api.put(
        `/apartments/${apartmentId}`,
        {
          area: apartmentData.area,
          status: apartmentData.status,
          residents: updatedResidentIds
        }
      );

      // Update local state
      setFormValues(prev => ({
        ...prev,
        apartments: prev.apartments.filter((apt: any) => apt.addressNumber !== apartmentId)
      }));

      toast.success("Apartment removed successfully!");
      
    } catch (error: any) {
      console.error("Error removing apartment:", error);
      toast.error(error.response?.data?.message || "Error removing apartment");
    } finally {
      setIsUpdatingApartments(false);
    }
  };

  const handleAddResident = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    const data = {
      id: formValues.id,
      name: formValues.name,
      dob: formValues.dob,
      status: formValues.status,
      gender: formValues.gender,
      cic: formValues.cic
    };
    
    // Note: For creating new residents, apartment assignment is handled separately
    // or through the MultiStepResidentForm component

    try {
      await api.post(
        "/residents",
        data
      );

      toast.success("Add Resident Successful!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      // Extract error message from backend response
      let errorMessage = "Có lỗi xảy ra khi thêm resident!";
      
      if (error?.response?.data) {
        const responseData = error.response.data;
        
        // Check if there are validation errors in data object
        if (responseData.data && typeof responseData.data === 'object') {
          // Extract validation errors
          const validationErrors = Object.values(responseData.data).join(', ');
          errorMessage = validationErrors;
        } else if (responseData.message) {
          // Use general message from backend
          errorMessage = responseData.message;
        }
      }
      
      toast.error(errorMessage);
      console.error(error);
    }
  };
  
  const handleUpdate = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const data = {
      id: formValues.id,
      name: formValues.name,
      dob: formValues.dob,
      status: formValues.status,
      gender: formValues.gender,
      cic: formValues.cic,
      apartments: formValues.apartments // Include apartments to preserve owner-apartment relationships
    };

    try {
      await api.put(
        `/residents/${formValues.id}`,
        data
      );

      toast.success("Update Resident Successful!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      // Extract error message from backend response
      let errorMessage = "Có lỗi xảy ra khi cập nhật resident!";
      
      if (error?.response?.data) {
        const responseData = error.response.data;
        
        // Check if there are validation errors in data object
        if (responseData.data && typeof responseData.data === 'object') {
          // Extract validation errors
          const validationErrors = Object.values(responseData.data).join(', ');
          errorMessage = validationErrors;
        } else if (responseData.message) {
          // Use general message from backend
          errorMessage = responseData.message;
        }
      }
      
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/residents/${formValues.id}`);
      
      toast.success("Delete successful");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      // Extract error message from backend response
      let errorMessage = "Có lỗi xảy ra khi xóa resident!";
      
      if (error?.response?.data) {
        const responseData = error.response.data;
        
        // Check if there are validation errors in data object
        if (responseData.data && typeof responseData.data === 'object') {
          // Extract validation errors
          const validationErrors = Object.values(responseData.data).join(', ');
          errorMessage = validationErrors;
        } else if (responseData.message) {
          // Use general message from backend
          errorMessage = responseData.message;
        }
      }
      
      toast.error(errorMessage);
      console.error(error);
    }
  };

  return (
    <FormContainer>
      {/* Personal Information Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiUser />
          </SectionIcon>
          <SectionTitle>Personal Information</SectionTitle>
        </SectionHeader>
        
        <Form.Fields>          
          <FormField>
            <FormField.Label label="Full Name" required />
            <FormField.Input
              id="name"
              type="text"
              value={formValues.name}
              onChange={handleChange}
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
              value={formValues.dob}
              onChange={handleChange}
              required
              error={errors.dob}
            />
          </FormField>
          <FormField>
            <FormField.Label label="CCCD" required />
            <FormField.Input
              id="id"
              type="text"
              value={formValues.id}
              onChange={handleChange}
              required
              error={errors.id}
              readOnly={!!resident} // Only CCCD is read-only when editing existing resident
              placeholder="Enter 12-digit CCCD number"
            />
          </FormField>
          <FormField>
            <FormField.Label label="CIC Number" />
            <FormField.Input
              id="cic"
              type="text"
              value={formValues.cic}
              onChange={handleChange}
              error={errors.cic}
              placeholder="Enter CIC number (optional)"
            />
          </FormField>
          <Selector
            value={formValues.gender}
            onChange={handleChange}
            id="gender"
            options={genderOptions}
            label="Gender"
            required
            error={errors.gender}
          />
          <Selector
            value={formValues.status}
            onChange={handleChange}
            id="status"
            options={statusOptions}
            label="Status"
            required
            error={errors.status}
          />
        </Form.Fields>
      </SectionCard>

      {/* Apartments Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiHome />
          </SectionIcon>
          <SectionTitle>Apartments</SectionTitle>
          {resident && (
            <AddApartmentButton 
              type="button" 
              size="compact" 
              variation="primary"
              onClick={() => setShowApartmentSearch(!showApartmentSearch)}
              disabled={isUpdatingApartments}
            >
              <HiPlus />
              Add Apartment
            </AddApartmentButton>
          )}
        </SectionHeader>
        
        {/* Apartment Search Section - Only show for existing residents */}
        {resident && showApartmentSearch && (
          <ApartmentSearchSection>
            <FormField>
              <FormField.Label label="Search Apartment" />
              <ApartmentSearchDropdown
                value={selectedApartment?.addressNumber?.toString() || ""}
                onChange={handleApartmentSelect}
                placeholder="Search by apartment number..."
              />            
            </FormField>            
            <ApartmentSearchButtons>
              <Button 
                type="button" 
                size="compact" 
                variation="primary"
                onClick={handleAddApartment}
                disabled={!selectedApartment || isUpdatingApartments}
              >
                Add Selected
              </Button>
              <Button 
                type="button" 
                size="compact" 
                variation="secondary"
                onClick={() => {
                  setShowApartmentSearch(false);
                  setSelectedApartment(null);
                }}
              >
                Cancel
              </Button>
            </ApartmentSearchButtons>
          </ApartmentSearchSection>
        )}
        
        {/* Current Apartments Display */}
        {formValues.apartments && formValues.apartments.length > 0 ? (
          <div>
            <FormField.Label label="Current Apartments" />
            <ApartmentsContainer>
              {formValues.apartments.map((apartment: any, index: number) => (
                <ApartmentItem 
                  key={apartment.addressNumber || index}
                >
                  <span>
                    Apartment {apartment.addressNumber} 
                    ({apartment.area}m² - {apartment.status})
                  </span>                      
                  {resident && (
                    <Button 
                      type="button" 
                      size="compact" 
                      variation="danger"
                      onClick={() => handleRemoveApartment(apartment.addressNumber)}
                      disabled={isUpdatingApartments}
                    >
                      <HiMinus />
                    </Button>
                  )}
                </ApartmentItem>
              ))}
            </ApartmentsContainer>
          </div>
        ) : (
          <NoApartmentsMessage>
            No apartments assigned
          </NoApartmentsMessage>
        )}
      </SectionCard>

      {/* Action Buttons */}
      <ButtonGroup>
        {resident ? (
          <>
            <Button type="button" onClick={handleDelete} variation="danger" size="compact">
              <HiTrash />
              Delete
            </Button>
            <Button type="button" onClick={handleUpdate} variation="secondary" size="compact">
              <HiPencil />
              Update
            </Button>
          </>
        ) : (
          <Button
            onClick={handleAddResident}
            size="compact"
            variation="primary"
            type="submit"
          >
            <HiOutlinePlusCircle />
            Add Resident
          </Button>
        )}
      </ButtonGroup>
    </FormContainer>
  );
}
