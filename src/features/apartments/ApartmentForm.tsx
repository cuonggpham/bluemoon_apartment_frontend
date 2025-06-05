import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import { HiOutlinePlusCircle, HiPencil, HiTrash, HiHome, HiUser, HiPhone, HiUserPlus } from "react-icons/hi2";
import Table from "../../components/Table";
import ResidentSearchDropdown from "../../components/ResidentSearchDropdown";
import MultiStepResidentForm from "../residents/MultiStepResidentForm";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";

// Enhanced Styled Components with modern glass morphism design
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 0;
  width: 100%;
  max-width: 800px;
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
    background: linear-gradient(135deg, rgba(6, 182, 212, 0.02), transparent);
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
    background: linear-gradient(90deg, #0891b2, #0e7490);
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
  background: linear-gradient(135deg, #0891b2, #0e7490);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(8, 145, 178, 0.3);
`;

const ResidentsTable = styled.div`
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.02);
`;

const TableHeader = styled.div`
  background: linear-gradient(135deg, rgba(241, 245, 249, 0.9), rgba(248, 250, 252, 0.8));
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
`;

const TableTitle = styled.h4`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '👥';
    font-size: 1.25rem;
  }
`;

const NoResidentsMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
  font-size: 1rem;
  background: rgba(248, 250, 252, 0.8);
  
  &::before {
    content: '🏠';
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

const AddResidentButton = styled(Button)`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResidentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

interface Resident {
  id: number;
  name: string;
  status: string;
  gender: string;
  cic: string;
}

interface Vehicle {
  id: number;
  licensePlate: string;
  vehicleType: string;
}

interface ApartmentFormProps {
  apartment?: {
    addressNumber: string;
    status: "Business" | "Residential" | "Vacant" | "";
    area: string;
    ownerName: string;
    ownerPhone: string;
    owner: { id: number; name: string };
    residents: Resident[]; 
    vehicleList: Vehicle[];
  };
  fetchApartments: () => void; // A function to refresh the apartment list after adding a new apartment
}

export default function ApartmentForm({
  apartment,
  fetchApartments,
}: ApartmentFormProps) {  
  const [formValues, setFormValues] = useState({
    addressNumber: apartment?.addressNumber || "",
    status: apartment?.status || "",
    area: apartment?.area || "",
    ownerPhone: apartment?.ownerPhone || "",
    residents: apartment?.residents || [],
    vehicleList: apartment?.vehicleList || [],
  });

  // Add validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Owner selection state
  const [selectedOwner, setSelectedOwner] = useState<any>(apartment?.owner || null);

  const statusOptions = ["Business", "Residential", "Vacant"];

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.addressNumber || !formValues.addressNumber.toString().trim()) {
      newErrors.addressNumber = "Room number is required";
    }
    
    if (!formValues.area || !formValues.area.toString().trim()) {
      newErrors.area = "Room area is required";
    } else if (isNaN(Number(formValues.area)) || Number(formValues.area) <= 0) {
      newErrors.area = "Area must be a positive number";
    }
    
    if (!formValues.status || !formValues.status.toString().trim()) {
      newErrors.status = "Status is required";
    }
    
    // Validate phone number if provided
    if (formValues.ownerPhone && formValues.ownerPhone.toString().trim()) {
      const phoneStr = formValues.ownerPhone.toString().trim();
      if (!/^\d{10,11}$/.test(phoneStr)) {
        newErrors.ownerPhone = "Phone number must be 10-11 digits";
      }
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

  const handleOwnerSelect = (resident: any) => {
    setSelectedOwner(resident);
    // If resident is selected, use their info; otherwise clear
    if (resident) {
      setFormValues(prev => ({
        ...prev,
        ownerPhone: resident.phone || prev.ownerPhone
      }));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const data = {
      addressNumber: parseInt(formValues.addressNumber),
      area: parseFloat(formValues.area),
      status: formValues.status,
      ownerId: selectedOwner?.id || null,
      ownerPhone: formValues.ownerPhone || "",
    };

    try {
      await axios.post("http://localhost:8080/api/v1/apartments", data);
      toast.success("Apartment added successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error adding apartment:", err);
      toast.error(err.response?.data?.message || "Error adding apartment");
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // APPROACH 1: Always include current residents (safer, explicit)
    // Get current residents to preserve them during update
    let currentResidentIds = formValues.residents?.map((resident: any) => resident.id) || [];
    
    // If a new owner is selected, ensure they are in the residents list
    if (selectedOwner?.id && !currentResidentIds.includes(selectedOwner.id)) {
      currentResidentIds.push(selectedOwner.id);
    }

    const data = {
      addressNumber: parseInt(formValues.addressNumber),
      area: parseFloat(formValues.area),
      status: formValues.status,
      ownerId: selectedOwner?.id || null,
      ownerPhone: formValues.ownerPhone || "",
      residents: currentResidentIds, // Include current residents to prevent them from being lost
    };

    // APPROACH 2: Simpler approach - let backend handle residents preservation
    // Uncomment below if you prefer to rely on backend logic for residents preservation
    // const data = {
    //   addressNumber: parseInt(formValues.addressNumber),
    //   area: parseFloat(formValues.area),
    //   status: formValues.status,
    //   ownerId: selectedOwner?.id || null,
    //   ownerPhone: formValues.ownerPhone || "",
    //   // residents field omitted - backend will preserve existing residents
    // };

    try {
      await axios.put(
        `http://localhost:8080/api/v1/apartments/${apartment?.addressNumber}`,
        data
      );
      toast.success("Apartment updated successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error updating apartment:", err);
      toast.error(err.response?.data?.message || "Error updating apartment");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/apartments/${apartment?.addressNumber}`
      );
      toast.success("Apartment deleted successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error deleting apartment:", err);
      toast.error(err.response?.data?.message || "Error deleting apartment");
    }
  };

  return (
    <FormContainer>
      {/* Apartment Information Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiHome />
          </SectionIcon>
          <SectionTitle>Apartment Information</SectionTitle>
        </SectionHeader>
        
        <Form.Fields type="horizontal">
          <FormField>
            <FormField.Label label="Room Number" required />
            <FormField.Input
              id="addressNumber"
              type="text"
              value={formValues.addressNumber}
              onChange={handleChange}
              required
              error={errors.addressNumber}
              placeholder="Enter room number"
              readOnly={!!apartment} // Read-only when editing
            />
          </FormField>

          <FormField>
            <FormField.Label label="Room Area (m²)" required />
            <FormField.Input
              id="area"
              type="number"
              value={formValues.area}
              onChange={handleChange}
              required
              error={errors.area}
              placeholder="Enter area in square meters"
            />
          </FormField>
        </Form.Fields>      
        
        <Selector
          id="status"
          value={formValues.status}
          onChange={handleChange}
          options={statusOptions}
          label="Status"
          required
          error={errors.status}
        />
      </SectionCard>

      {/* Owner Information Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiUser />
          </SectionIcon>
          <SectionTitle>Owner Information (Optional)</SectionTitle>
        </SectionHeader>
        
        <Form.Fields type="horizontal">
          <FormField>
            <FormField.Label label="Owner" />          
            <ResidentSearchDropdown
              value={selectedOwner?.name || ""}
              onChange={handleOwnerSelect}
              placeholder="Click to select owner..."
            />
          </FormField>        
          
          <FormField>
            <FormField.Label label="Phone Number" />
            <FormField.Input
              id="ownerPhone"
              type="text"
              value={formValues.ownerPhone}
              onChange={handleChange}
              error={errors.ownerPhone}
              placeholder="Enter phone number"
            />        
          </FormField>
        </Form.Fields>
      </SectionCard>

      {/* Resident List Section - Only show for existing apartment details */}
      {apartment && formValues.residents && (
        <SectionCard>
          <ResidentsTable>
            <TableHeader>
              <ResidentsHeader>
                <TableTitle>Current Residents</TableTitle>
                <Modal>
                  <Modal.Open id="add-resident">
                    <AddResidentButton
                      type="button"
                      variation="primary"
                      size="compact"
                    >
                      <HiUserPlus />
                      Add Resident
                    </AddResidentButton>
                  </Modal.Open>
                  <Modal.Window id="add-resident" name="Add Resident to Apartment">
                    <MultiStepResidentForm apartmentId={apartment.addressNumber} />
                  </Modal.Window>
                </Modal>
              </ResidentsHeader>
            </TableHeader>
            
            {formValues.residents.length > 0 ? (
              <Table columns="1fr 1fr 1fr 1fr 1fr">
                <Table.Header>
                  <div>Name</div>
                  <div>ID</div>
                  <div>Gender</div>
                  <div>Status</div>
                  <div>CIC</div>
                </Table.Header>
                
                <Table.Body
                  data={formValues.residents}
                  render={(resident: Resident) => (
                    <Table.Row key={resident.id}>
                      <div>{resident.name}</div>
                      <div>{resident.id}</div>
                      <div>{resident.gender}</div>
                      <div>{resident.status}</div>
                      <div>{resident.cic || "N/A"}</div>
                    </Table.Row>
                  )}
                />
              </Table>
            ) : (
              <NoResidentsMessage>
                No residents assigned to this apartment
              </NoResidentsMessage>
            )}
          </ResidentsTable>
        </SectionCard>
      )}

      {/* Action Buttons */}
      <ButtonGroup>
        {apartment ? (
          <>
            <Button 
              onClick={handleDelete}
              type="button" 
              variation="danger" 
              size="compact"
            >
              <HiTrash />
              Delete
            </Button>
            <Button
              onClick={handleUpdate}
              type="button"
              variation="secondary"
              size="compact"
            >
              <HiPencil />
              Update
            </Button>
          </>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            size="compact"
            variation="primary"
          >
            <HiOutlinePlusCircle />
            Add Apartment
          </Button>
        )}
      </ButtonGroup>
    </FormContainer>
  );
}
