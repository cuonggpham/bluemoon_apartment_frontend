import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

// Custom debounce function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Helper function to format currency
const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)}B VND`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M VND`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K VND`;
  } else {
    return `${amount.toLocaleString()} VND`;
  }
};

// Styled components for modern payment form
const PaymentContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

const PaymentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 700;
  color: #1f2937;
  font-size: 1.5rem;
  letter-spacing: -0.01em;
`;

const Select = styled.select`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #1f2937;
  transition: border-color 0.2s;
  min-height: 48px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  option {
    font-size: 1.2rem;
    color: #1f2937;
  }
`;

const Input = styled.input`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #1f2937;
  transition: border-color 0.2s;
  min-height: 48px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #6b7280;
    font-weight: 400;
  }
`;

const TextArea = styled.textarea`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #1f2937;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s;
  line-height: 1.5;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #6b7280;
    font-weight: 400;
  }
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  color: white;
  padding: 0.85rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
  min-height: 48px;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  padding: 0.85rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #1f2937;
  width: 100%;
  transition: border-color 0.2s;
  min-height: 48px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #6b7280;
    font-weight: 400;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const SearchResultItem = styled.div`
  padding: 0.85rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  font-size: 1.2rem;
  font-weight: 500;
  color: #1f2937;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SelectedPayerDisplay = styled.div`
  padding: 0.85rem;
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  
  .clear-btn {
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.35rem 0.65rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    
    &:hover {
      background: #b91c1c;
    }
  }
`;

interface PaymentRecordFormProps {
  onSuccess?: () => void;
}

interface Fee {
  id: number;
  name: string;
  unitPrice: number;
  feeTypeEnum: string;
  apartmentId?: number; // For mandatory fees
}

interface Resident {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
}

interface Apartment {
  addressNumber: number;
  area: number;
  status: string;
}

export default function PaymentRecordForm({ onSuccess }: PaymentRecordFormProps) {
  const [formData, setFormData] = useState({
    payerId: '',
    feeId: '',
    apartmentId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    amount: '',
    notes: ''
  });
  
  const [fees, setFees] = useState<Fee[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<Resident | null>(null);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch fees, residents, and apartments on component mount
  useEffect(() => {
    fetchFees();
    fetchResidents();
    fetchApartments();
  }, []);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-search-container]')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounce search functionality
  const debounceSearch = useCallback(
    debounce((searchValue: string) => {
      if (searchValue.trim() === '') {
        setFilteredResidents([]);
        setShowSearchResults(false);
        return;
      }
      
      const filtered = residents.filter(resident =>
        resident.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        resident.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
        resident.phoneNumber?.includes(searchValue)
      );
      
      setFilteredResidents(filtered);
      setShowSearchResults(filtered.length > 0);
    }, 300),
    [residents]
  );

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  const fetchFees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/fees');
      const data = await response.json();
      console.log('Fees API response:', data); // Debug log
      
      // Check if response is successful and has data
      if (data.data && data.data.result) {
        setFees(data.data.result);
        console.log('Fees loaded:', data.data.result); // Debug log
      } else if (data.data && Array.isArray(data.data)) {
        setFees(data.data);
      } else {
        console.error('Unexpected API response structure:', data);
        toast.error('Invalid response format for fee items');
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
      toast.error('Failed to load fee items');
    }
  };

  const fetchResidents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/residents');
      const data = await response.json();
      console.log('Residents API response:', data); // Debug log
      
      // Check if response is successful and has data
      if (data.data && data.data.result) {
        setResidents(data.data.result);
        console.log('Residents loaded:', data.data.result); // Debug log
      } else if (data.data && Array.isArray(data.data)) {
        setResidents(data.data);
      } else {
        console.error('Unexpected API response structure:', data);
        toast.error('Invalid response format for residents');
      }
    } catch (error) {
      console.error('Error fetching residents:', error);
      toast.error('Failed to load residents');
    }
  };

  const fetchApartments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/apartments');
      const data = await response.json();
      console.log('Apartments API response:', data); // Debug log
      
      // Check if response is successful and has data
      if (data.data && data.data.result) {
        setApartments(data.data.result);
        console.log('Apartments loaded:', data.data.result); // Debug log
      } else if (data.data && Array.isArray(data.data)) {
        setApartments(data.data);
      } else {
        console.error('Unexpected API response structure:', data);
        toast.error('Invalid response format for apartments');
      }
    } catch (error) {
      console.error('Error fetching apartments:', error);
      toast.error('Failed to load apartments');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Handle fee selection - update selectedFee state
    if (name === 'feeId') {
      const fee = fees.find(f => f.id === parseInt(value));
      setSelectedFee(fee || null);
      
      // If mandatory fee, auto-clear apartment selection
      if (fee && fee.feeTypeEnum === 'Mandatory') {
        setFormData(prev => ({
          ...prev,
          apartmentId: ''
        }));
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedPayer) {
      newErrors.payerId = 'Please select a payer';
    }
    
    if (!formData.feeId) {
      newErrors.feeId = 'Please select a fee item';
    }
    
    // Check apartment requirement for voluntary fees
    if (selectedFee && selectedFee.feeTypeEnum === 'Voluntary' && !formData.apartmentId) {
      newErrors.apartmentId = 'Please select an apartment for voluntary fee';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Please select a payment date';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const payload: any = {
        payerId: selectedPayer!.id,
        feeId: parseInt(formData.feeId),
        paymentDate: formData.paymentDate,
        amount: parseFloat(formData.amount),
        notes: formData.notes
      };
      
      // Only include apartmentId for voluntary fees
      if (selectedFee && selectedFee.feeTypeEnum === 'Voluntary' && formData.apartmentId) {
        payload.apartmentId = parseInt(formData.apartmentId);
      }
      
      const response = await fetch('http://localhost:8080/api/v1/payment-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      console.log('Payment API response:', result); // Debug log
      
      // Handle the response structure from ApiResponse
      if (result.code === 200 && result.data) {
        toast.success(result.message || 'Payment added successfully');
        // Reset form
        setFormData({
          payerId: '',
          feeId: '',
          apartmentId: '',
          paymentDate: new Date().toISOString().split('T')[0],
          amount: '',
          notes: ''
        });
        setSelectedPayer(null);
        setSelectedFee(null);
        setSearchTerm('');
        onSuccess?.();
      } else {
        const errorMessage = result.message || 'Failed to add payment';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating payment record:', error);
      toast.error('An error occurred while processing the payment');
    } finally {
      setLoading(false);
    }
  };

  const handlePayerSelect = (resident: Resident) => {
    setSelectedPayer(resident);
    setSearchTerm(resident.name);
    setShowSearchResults(false);
    
    // Clear error when payer is selected
    if (errors.payerId) {
      setErrors(prev => ({
        ...prev,
        payerId: ''
      }));
    }
  };

  const handleClearPayer = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPayer(null);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  return (
    <PaymentContainer>
      <h2 style={{ marginBottom: '1.5rem', color: '#1f2937', fontSize: '1.5rem', fontWeight: '700' }}>
        Record Payment
      </h2>
      
      <PaymentForm onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="feeId">Fee Item *</Label>
          <Select
            id="feeId"
            name="feeId"
            value={formData.feeId}
            onChange={handleInputChange}
            aria-label="Select fee item"
            title="Select fee item"
          >
            <option value="">Select a fee item</option>
            {fees.map(fee => (
              <option key={fee.id} value={fee.id}>
                {fee.name} - {formatCurrency(fee.unitPrice)} ({fee.feeTypeEnum})
              </option>
            ))}
          </Select>
          {errors.feeId && <ErrorMessage>{errors.feeId}</ErrorMessage>}
        </FormGroup>

        {/* Show apartment selection only for voluntary fees */}
        {selectedFee && selectedFee.feeTypeEnum === 'Voluntary' && (
          <FormGroup>
            <Label htmlFor="apartmentId">Apartment *</Label>
            <Select
              id="apartmentId"
              name="apartmentId"
              value={formData.apartmentId}
              onChange={handleInputChange}
              aria-label="Select apartment for voluntary fee"
            >
              <option value="">Select an apartment</option>
              {apartments.map(apartment => (
                <option key={apartment.addressNumber} value={apartment.addressNumber}>
                  Apartment {apartment.addressNumber} - {apartment.area}m² ({apartment.status})
                </option>
              ))}
            </Select>
            {errors.apartmentId && <ErrorMessage>{errors.apartmentId}</ErrorMessage>}
          </FormGroup>
        )}

        {/* Show apartment info for mandatory fees */}
        {selectedFee && selectedFee.feeTypeEnum === 'Mandatory' && selectedFee.apartmentId && (
          <FormGroup>
            <Label>Apartment (Auto-assigned)</Label>
            <div style={{ 
              padding: '0.75rem', 
              background: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '8px',
              color: '#0369a1',
              fontWeight: '500'
            }}>
              Apartment {selectedFee.apartmentId} (Mandatory Fee)
            </div>
          </FormGroup>
        )}

        <FormGroup>
          <Label htmlFor="payerId">Payer *</Label>
          <SearchContainer data-search-container>
            {!selectedPayer ? (
              <>
                <SearchInput
                  type="text"
                  id="payerId"
                  name="payerId"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  placeholder="Search for payer by name..."
                  aria-label="Search for payer"
                />
                {showSearchResults && (
                  <SearchResults>
                    {filteredResidents.length > 0 ? (
                      filteredResidents.map(resident => (
                        <SearchResultItem
                          key={resident.id}
                          onClick={() => {
                            handlePayerSelect(resident);
                          }}
                        >
                          <div style={{ fontWeight: '500' }}>{resident.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            ID: {resident.id} {resident.email && `• ${resident.email}`}
                          </div>
                        </SearchResultItem>
                      ))
                    ) : (
                      <SearchResultItem>
                        <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                          No residents found
                        </div>
                      </SearchResultItem>
                    )}
                  </SearchResults>
                )}
              </>
            ) : (
              <SelectedPayerDisplay>
                <div>
                  <div style={{ fontWeight: '500' }}>{selectedPayer.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    ID: {selectedPayer.id} {selectedPayer.email && `• ${selectedPayer.email}`}
                  </div>
                </div>
                <button
                  className="clear-btn"
                  onClick={handleClearPayer}
                >
                  Clear
                </button>
              </SelectedPayerDisplay>
            )}
          </SearchContainer>
          {errors.payerId && <ErrorMessage>{errors.payerId}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="paymentDate">Payment Date *</Label>
          <Input
            type="date"
            id="paymentDate"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleInputChange}
          />
          {errors.paymentDate && <ErrorMessage>{errors.paymentDate}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="amount">Amount (VND) *</Label>
          <Input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter payment amount"
            min="0"
            step="0.01"
          />
          {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="notes">Notes</Label>
          <TextArea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Additional notes (optional)"
          />
        </FormGroup>

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Add Payment'}
        </SubmitButton>
      </PaymentForm>
    </PaymentContainer>
  );
} 