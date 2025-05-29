import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import ApartmentSearchDropdown from "../../components/ApartmentSearchDropdown";
import { HiOutlinePlusCircle, HiPencil, HiTrash, HiPlus, HiMinus } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

// Styled Components
const ApartmentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-grey-200);
`;

const ApartmentSearchSection = styled.div`
  background: linear-gradient(135deg, var(--color-grey-50) 0%, var(--color-grey-25) 100%);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
`;

const ApartmentSearchButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  justify-content: flex-end;
`;

const ApartmentsContainer = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-grey-25) 0%, white 100%);
  min-height: 3rem;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const ApartmentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border: 1px solid var(--color-grey-200);
  border-radius: var(--border-radius-md);
  background: white;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-xs);

  &:hover {
    border-color: var(--color-primary-300);
    box-shadow: var(--shadow-sm);
    transform: translateY(-1px);
  }

  span {
    font-weight: 500;
    color: var(--color-grey-700);
    font-size: var(--font-size-sm);
  }
`;

const NoApartmentsMessage = styled.div`
  text-align: center;
  color: var(--color-grey-500);
  font-style: italic;
  padding: var(--spacing-lg);
  font-size: var(--font-size-sm);
  background: var(--color-grey-50);
  border-radius: var(--border-radius-md);
  border: 2px dashed var(--color-grey-300);
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
      // Update apartment assignments via apartment API
      await axios.put(
        `http://localhost:8080/api/v1/apartments/${selectedApartment.addressNumber}`,
        {
          residents: [parseInt(formValues.id)] // Add this resident to the apartment
        }
      );

      // Update local state
      const newApartment = {
        addressNumber: selectedApartment.addressNumber,
        area: selectedApartment.area,
        status: selectedApartment.status
      };

      setFormValues((prevValues) => ({
        ...prevValues,
        apartments: [...prevValues.apartments, newApartment],
      }));

      setSelectedApartment(null);
      setShowApartmentSearch(false);
      toast.success("Apartment added successfully!");

    } catch (err: any) {
      console.error("Error adding apartment:", err);
      toast.error("Failed to add apartment. Please try again.");
    } finally {
      setIsUpdatingApartments(false);
    }
  };

  const handleRemoveApartment = async (apartmentId: number) => {
    if (!resident) {
      toast.error("Cannot remove apartment - resident not found");
      return;
    }

    setIsUpdatingApartments(true);

    try {
      // Get current residents of this apartment
      const apartmentResponse = await axios.get(
        `http://localhost:8080/api/v1/apartments/${apartmentId}`
      );
      
      const apartmentData = apartmentResponse.data.data;
      const currentResidents = apartmentData.residents || [];
      
      // Remove this resident from the apartment's resident list
      const updatedResidents = currentResidents
        .filter((res: any) => res.id !== parseInt(formValues.id))
        .map((res: any) => res.id);

      // Update apartment with new resident list
      await axios.put(
        `http://localhost:8080/api/v1/apartments/${apartmentId}`,
        {
          residents: updatedResidents
        }
      );

      // Update local state
      setFormValues((prevValues) => ({
        ...prevValues,
        apartments: prevValues.apartments.filter(
          (apt: any) => apt.addressNumber !== apartmentId
        ),
      }));

      toast.success("Apartment removed successfully!");

    } catch (err: any) {
      console.error("Error removing apartment:", err);
      toast.error("Failed to remove apartment. Please try again.");
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
      await axios.post(
        "http://localhost:8080/api/v1/residents",
        data
      );

      toast.success("Add Resident Successful!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error("Có lỗi xảy ra!!");
      console.error(err);
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
      cic: formValues.cic
    };

    try {
      await axios.put(
        `http://localhost:8080/api/v1/residents/${formValues.id}`,
        data
      );

      toast.success("Update Resident Successful!");

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật!");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/residents/${formValues.id}`);
      
      toast.success("Delete successful");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      toast.error("Có lỗi xảy ra!!");
      console.error(err);
    }
  };

  return (
    <Form width="400px">
      <div>
        <label>Information:</label>        
        <Form.Fields>          
          <FormField>
            <FormField.Label label={"Name"} required />
            <FormField.Input
              id="name"
              type="text"
              value={formValues.name}
              onChange={handleChange}
              required
              error={errors.name}
            />
          </FormField>
          <FormField>
            <FormField.Label label={"DOB"} required />
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
            <FormField.Label label={"CCCD"} required />
            <FormField.Input
              id="id"
              type="text"
              value={formValues.id}
              onChange={handleChange}
              required
              error={errors.id}
              readOnly={!!resident} // Only CCCD is read-only when editing existing resident
            />
          </FormField>
          <FormField>
            <FormField.Label label={"CIC Number"} />
            <FormField.Input
              id="cic"
              type="text"
              value={formValues.cic}
              onChange={handleChange}
              error={errors.cic}
            />
          </FormField>
          <Selector
            value={formValues.gender}
            onChange={handleChange}
            id="gender"
            options={genderOptions}
            label={"Gender:"}
            required
            error={errors.gender}
          />
        </Form.Fields>
      </div>      
        <div>
        <ApartmentHeader>
          <label>Apartments:</label>          {resident && (
            <Button 
              type="button" 
              size="compact" 
              variation="primary"
              onClick={() => setShowApartmentSearch(!showApartmentSearch)}
              disabled={isUpdatingApartments}
            >
              <HiPlus />
              Add Apartment
            </Button>
          )}
        </ApartmentHeader>
        
        {/* Apartment Search Section - Only show for existing residents */}
        {resident && showApartmentSearch && (
          <ApartmentSearchSection>
            <FormField>
              <FormField.Label label="Search Apartment" />
              <ApartmentSearchDropdown
                value={selectedApartment?.addressNumber?.toString() || ""}
                onChange={handleApartmentSelect}
                placeholder="Search by apartment number..."
              />            </FormField>            <ApartmentSearchButtons>
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
        
        <Form.Fields>          
          <div>
            {formValues.apartments && formValues.apartments.length > 0 ? (
              <div>
                <FormField.Label label="Current Apartments" className="apartments-label" />
                <div className="apartments-container">
                  {formValues.apartments.map((apartment: any, index: number) => (
                    <div 
                      key={apartment.addressNumber || index}
                      className="apartment-item"
                    >
                      <span>
                        Apartment {apartment.addressNumber} 
                        ({apartment.area}m² - {apartment.status})
                      </span>                      {resident && (
                        <Button 
                          type="button" 
                          size="compact" 
                          variation="danger"
                          onClick={() => handleRemoveApartment(apartment.addressNumber)}
                          disabled={isUpdatingApartments}
                          className="remove-apartment-btn"
                        >
                          <HiMinus />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-apartments-message">
                No apartments assigned
              </div>
            )}
          </div>          
          <FormField>
            <FormField.Label label={"Status"} required />
            <FormField.Select
              id="status"
              options={statusOptions}
              value={formValues.status}
              onChange={handleChange}
              required
              error={errors.status}
            />
          </FormField>
        </Form.Fields>
      </div>
        {resident ? (
        <Form.Buttons>
          <Button type="button" onClick={handleDelete} variation="danger" size="compact">
            Delete
            <span>
              <HiTrash />
            </span>
          </Button>
          <Button type="button" onClick={handleUpdate} variation="secondary" size="compact">
            Update
            <span>
              <HiPencil />
            </span>
          </Button>
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button
            onClick={handleAddResident}
            size="compact"
            variation="primary"
            type="submit"
          >
            Add
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}
