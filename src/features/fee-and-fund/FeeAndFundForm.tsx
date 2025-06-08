import { useState, useEffect } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Selector from "../../components/Selector";
import Button from "../../components/Button";
import ApartmentSearchDropdown from "../../components/ApartmentSearchDropdown";
import { HiOutlinePlusCircle, HiPencil, HiTrash, HiCurrencyDollar, HiBuildingOffice2, HiDocumentText } from "react-icons/hi2";
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
    background: linear-gradient(90deg, #ec4899, #be185d);
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
  background: linear-gradient(135deg, #ec4899, #be185d);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
`;

const DescriptionTextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ec4899;
    box-shadow: 
      0 0 0 3px rgba(236, 72, 153, 0.1),
      0 4px 12px rgba(0, 0, 0, 0.05);
    background: rgba(255, 255, 255, 0.95);
  }
  
  &::placeholder {
    color: #9ca3af;
    font-style: italic;
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

const ApartmentSection = styled.div`
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

export default function FeeAndFundForm({ feeOrFund }: any) {
  const [formValues, setFormValues] = useState({
    id: feeOrFund?.id || "",
    name: feeOrFund?.name || "",
    description: feeOrFund?.description || "",
    amount: feeOrFund?.amount || "",
    feeTypeEnum: feeOrFund?.feeTypeEnum || "",
    apartmentId: feeOrFund?.apartmentId || "",
    createdAt: feeOrFund?.createdAt || "",
  });
  
  const [selectedApartment, setSelectedApartment] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const typeOptions = ["MANDATORY", "VOLUNTARY"];

  // Set initial apartment if editing existing fee
  useEffect(() => {
    if (feeOrFund?.apartmentId) {
      setSelectedApartment({ addressNumber: feeOrFund.apartmentId });
    }
  }, [feeOrFund]);

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.name || !formValues.name.toString().trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formValues.amount || !formValues.amount.toString().trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(formValues.amount)) || Number(formValues.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    
    if (!formValues.feeTypeEnum || !formValues.feeTypeEnum.toString().trim()) {
      newErrors.feeTypeEnum = "Type is required";
    }
    
    // For mandatory fees, apartment selection is required
    if (formValues.feeTypeEnum === "MANDATORY" && !formValues.apartmentId) {
      newErrors.apartmentId = "Apartment is required for mandatory fees";
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

  const handleApartmentChange = (apartment: any) => {
    setSelectedApartment(apartment);
    setFormValues((prevValues) => ({
      ...prevValues,
      apartmentId: apartment ? apartment.addressNumber : "",
    }));
    
    // Clear apartment error when apartment is selected
    if (errors.apartmentId && apartment) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apartmentId: "",
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
      name: formValues.name,
      description: formValues.description,
      amount: parseFloat(formValues.amount),
      feeTypeEnum: formValues.feeTypeEnum,
      apartmentId: formValues.feeTypeEnum === "MANDATORY" ? parseInt(formValues.apartmentId) : null,
    };

    try {
      // Use different endpoints based on fee type
      if (formValues.feeTypeEnum === "VOLUNTARY") {
        // Use bulk creation endpoint for voluntary fees
        const response = await api.post("/fees/voluntary/create-for-all", data);
        
        // Extract the number of created fees from response
        const createdCount = response.data.data?.length || 0;
        toast.success(`Voluntary fee created successfully for ${createdCount} apartments!`);
      } else {
        // Use single creation endpoint for other fee types
        await api.post("/fees", data);
        toast.success("Fee/Fund added successfully!");
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error adding fee/fund:", err);
      
      // Provide more specific error messages
      if (formValues.feeTypeEnum === "VOLUNTARY") {
        toast.error(err.response?.data?.message || "Error creating voluntary fee for apartments");
      } else {
        toast.error(err.response?.data?.message || "Error adding fee/fund");
      }
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    const data = {
      name: formValues.name,
      description: formValues.description,
      amount: parseFloat(formValues.amount),
      feeTypeEnum: formValues.feeTypeEnum,
      apartmentId: formValues.feeTypeEnum === "MANDATORY" ? parseInt(formValues.apartmentId) : null,
    };

    try {
      await api.put(`/fees/${formValues.id}`, data);
      toast.success("Fee/Fund updated successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error updating fee/fund:", err);
      toast.error(err.response?.data?.message || "Error updating fee/fund");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/fees/${formValues.id}`);
      toast.success("Fee/Fund deleted successfully!");
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Error deleting fee/fund:", err);
      toast.error(err.response?.data?.message || "Error deleting fee/fund");
    }
  };

  return (
    <FormContainer>
      {/* Fee/Fund Information Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiCurrencyDollar />
          </SectionIcon>
          <SectionTitle>Fee & Fund Information</SectionTitle>
        </SectionHeader>
        
        <Selector
          value={formValues.feeTypeEnum}
          onChange={handleChange}
          id="feeTypeEnum"
          options={typeOptions}
          label="Type"
          required
          error={errors.feeTypeEnum}
        />

        {/* Info message for VOLUNTARY fees */}
        {formValues.feeTypeEnum === "VOLUNTARY" && (
          <div style={{ 
            backgroundColor: '#dbeafe', 
            borderLeft: '4px solid #3b82f6', 
            padding: '12px 16px', 
            marginTop: '8px',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: '#1e40af'
          }}>
            <strong>ℹ️ Note:</strong> Voluntary fees will be automatically created for all apartments in the system. 
            Each apartment will get a separate fee record with the same amount.
          </div>
        )}

        {/* Apartment Selection - Only show for Mandatory fees */}
        {formValues.feeTypeEnum === "MANDATORY" && (
          <ApartmentSection>
            <FormField>
              <FormField.Label label="Apartment" required />
              <ApartmentSearchDropdown
                value={selectedApartment?.addressNumber || ""}
                onChange={handleApartmentChange}
                placeholder="Search for apartment by number..."
              />
              {errors.apartmentId && (
                <div style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {errors.apartmentId}
                </div>
              )}
            </FormField>
          </ApartmentSection>
        )}

        <FormField>
          <FormField.Label label="Name" required />
          <FormField.Input
            id="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            required
            error={errors.name}
            placeholder="Enter fee/fund name"
          />
        </FormField>

        <FormField>
          <FormField.Label label="Amount" required />
          <FormField.Input
            id="amount"
            type="number"
            value={formValues.amount}
            onChange={handleChange}
            required
            error={errors.amount}
            placeholder="Enter amount"
          />
        </FormField>

        {feeOrFund && (
          <FormField>
            <FormField.Label label="Created At" />
            <FormField.Input
              id="createdAt"
              type="text"
              value={formValues.createdAt}
              onChange={handleChange}
              readOnly
            />
          </FormField>
        )}
      </SectionCard>

      {/* Description Section */}
      <SectionCard>
        <SectionHeader>
          <SectionIcon>
            <HiDocumentText />
          </SectionIcon>
          <SectionTitle>Description</SectionTitle>
        </SectionHeader>
        
        <FormField>
          <FormField.Label label="Description" />
          <DescriptionTextArea
            id="description"
            value={formValues.description}
            onChange={handleChange}
            placeholder="Enter detailed description of the fee or fund..."
            rows={5}
          />
        </FormField>
      </SectionCard>

      {/* Action Buttons */}
      <ButtonGroup>
        {feeOrFund ? (
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
            {formValues.feeTypeEnum === "VOLUNTARY" 
              ? "Create Fee for All Apartments" 
              : "Add Fee/Fund"
            }
          </Button>
        )}
      </ButtonGroup>
    </FormContainer>
  );
}
