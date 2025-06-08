import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import ApartmentSearchDropdown from '../../components/ApartmentSearchDropdown';
import api from '../../services/axios';

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
  margin-top: 1.5rem;
  
  &:first-child {
    margin-top: 0;
  }
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
  amount: number;
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
  const [paymentRecords, setPaymentRecords] = useState<any[]>([]);
  const [filteredResidents, setFilteredResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayer, setSelectedPayer] = useState<Resident | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch fees, residents, apartments and payment records on component mount
  useEffect(() => {
    fetchFees();
    fetchResidents();
    fetchApartments();
    fetchPaymentRecords();
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
      const response = await api.get('/fees/all');
      const data = response.data;
      console.log('Fees API response:', data); // Debug log
      
      // Check if response is successful and has data
      if (data.code === 200 && data.data && Array.isArray(data.data)) {
        setFees(data.data);
        console.log('Fees loaded:', data.data); // Debug log
      } else if (data && Array.isArray(data)) {
        // Fallback for direct array response
        setFees(data);
        console.log('Fees loaded (fallback):', data); // Debug log
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
      const response = await api.get('/residents');
      const data = response.data;
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
      const response = await api.get('/apartments');
      const data = response.data;
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

  const fetchPaymentRecords = async () => {
    try {
      const response = await api.get('/payment-records');
      const data = response.data;
      console.log('Payment Records API response:', data); // Debug log
      
      // Check if response is successful and has data
      if (data.data && Array.isArray(data.data)) {
        setPaymentRecords(data.data);
        console.log('Payment Records loaded:', data.data); // Debug log
      } else if (data.code === 200 && data.data && Array.isArray(data.data)) {
        setPaymentRecords(data.data);
      } else {
        console.error('Unexpected API response structure:', data);
        toast.error('Invalid response format for payment records');
      }
    } catch (error) {
      console.error('Error fetching payment records:', error);
      toast.error('Failed to load payment records');
    }
  };

  // Helper function to check if apartment has paid for a specific fee
  const hasApartmentPaidFee = (feeId: number, apartmentId: number) => {
    return paymentRecords.some(record => 
      record.feeId === feeId && record.apartmentId === apartmentId
    );
  };

  // Get fees available for the selected apartment
  const getAvailableFeesForApartment = () => {
    if (!selectedApartment) {
      return [];
    }

    return fees.filter(fee => {
      // Check if this apartment has already paid for this fee
      const alreadyPaid = hasApartmentPaidFee(fee.id, selectedApartment.addressNumber);
      
      if (alreadyPaid) {
        return false; // Don't show fees already paid by this apartment
      }

      // ALL fee types now have apartmentId - only show fees belonging to this apartment
      // This includes MANDATORY, VOLUNTARY, VEHICLE_PARKING, and FLOOR_AREA fees
      return fee.apartmentId === selectedApartment.addressNumber;
    });
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
      
      // Auto-fill amount from fee
      if (fee) {
        setFormData(prev => ({
          ...prev,
          amount: fee.amount.toString()
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

  // Handle apartment selection from dropdown
  const handleApartmentSelect = (apartment: any) => {
    if (apartment) {
      setSelectedApartment(apartment);
      setFormData(prev => ({
        ...prev,
        apartmentId: apartment.addressNumber.toString(),
        feeId: '' // Clear fee selection when apartment changes
      }));
      setSelectedFee(null);
    } else {
      setSelectedApartment(null);
      setFormData(prev => ({
        ...prev,
        apartmentId: '',
        feeId: ''
      }));
      setSelectedFee(null);
    }
    
    // Clear apartment error when selection is made
    if (errors.apartmentId) {
      setErrors(prev => ({
        ...prev,
        apartmentId: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedPayer) {
      newErrors.payerId = 'Please select a payer';
    }
    
    if (!formData.apartmentId) {
      newErrors.apartmentId = 'Please select an apartment';
    }
    
    if (!formData.feeId) {
      newErrors.feeId = 'Please select a fee item';
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Please select payment date';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (selectedFee) {
      // Validate amount based on fee type
      const paymentAmount = parseFloat(formData.amount);
      const feeAmount = selectedFee.amount;
      
      if (selectedFee.feeTypeEnum === 'VOLUNTARY') {
        // Voluntary fees: minimum amount is fee amount
        if (paymentAmount < feeAmount) {
          newErrors.amount = `Voluntary fee requires minimum payment of ${formatCurrency(feeAmount)}`;
        }
      } else {
        // Other fees: maximum amount is fee amount
        if (paymentAmount > feeAmount) {
          newErrors.amount = `Payment cannot exceed required amount of ${formatCurrency(feeAmount)}`;
        }
      }
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
      const submitData = {
        payerId: selectedPayer!.id,
        feeId: parseInt(formData.feeId),
        apartmentId: parseInt(formData.apartmentId),
        paymentDate: formData.paymentDate,
        amount: parseFloat(formData.amount),
        notes: formData.notes || null
      };
      
      console.log('Submitting payment:', submitData);
      
      const response = await api.post('/payment-records', submitData);
      
      const responseData = response.data;
      console.log('Payment response:', responseData);
      
      if (response.status === 200 || response.status === 201) {
        toast.success('Payment recorded successfully!');
        
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
        setSelectedApartment(null);
        setSelectedFee(null);
        setSearchTerm('');
        setErrors({});
        
        // Refresh payment records
        await fetchPaymentRecords();
        
        // Call success callback to refresh parent component
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(responseData.message || 'Failed to record payment');
      }
    } catch (error: any) {
      console.error('Error recording payment:', error);
      toast.error(error.message || 'Failed to record payment. Please try again.');
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
        {/* Step 1: Select Apartment */}
        <FormGroup>
          <Label htmlFor="apartmentId">Apartment *</Label>
          <ApartmentSearchDropdown
            value={formData.apartmentId}
            onChange={handleApartmentSelect}
            placeholder="Search for apartment by number..."
          />
          {errors.apartmentId && <ErrorMessage>{errors.apartmentId}</ErrorMessage>}
        </FormGroup>

        {/* Step 2: Show fees for selected apartment */}
        {selectedApartment && (
          <FormGroup>
            <Label htmlFor="feeId" id="feeId-label">
              Fee Item for Apartment {selectedApartment.addressNumber} * 
              <span style={{ fontSize: '0.875rem', fontWeight: '400', color: '#6b7280' }}>
                ({getAvailableFeesForApartment().length} unpaid fees available)
              </span>
            </Label>
            {getAvailableFeesForApartment().length > 0 ? (
              <Select
                id="feeId"
                name="feeId"
                value={formData.feeId}
                onChange={handleInputChange}
                aria-labelledby="feeId-label"
                aria-label="Select fee item for apartment"
                title="Select fee item for apartment"
              >
                <option value="">Select a fee item</option>
                {getAvailableFeesForApartment().map(fee => (
                  <option key={fee.id} value={fee.id}>
                    {fee.name} - {formatCurrency(fee.amount)} ({fee.feeTypeEnum})
                  </option>
                ))}
              </Select>
            ) : (
              <div style={{ 
                padding: '0.85rem', 
                background: '#fef3c7', 
                border: '1px solid #f59e0b', 
                borderRadius: '8px',
                color: '#92400e',
                fontWeight: '500'
              }}>
                ℹ️ No unpaid fees available for apartment {selectedApartment.addressNumber}
              </div>
            )}
            {errors.feeId && <ErrorMessage>{errors.feeId}</ErrorMessage>}
          </FormGroup>
        )}

        {/* Step 3: Select Payer */}
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
          {selectedFee && (
            <div style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: selectedFee.feeTypeEnum === 'VOLUNTARY' ? '#f0f9ff' : '#fef3c7',
              border: `1px solid ${selectedFee.feeTypeEnum === 'VOLUNTARY' ? '#0ea5e9' : '#f59e0b'}`,
              borderRadius: '6px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {selectedFee.feeTypeEnum === 'VOLUNTARY' ? '💝 Voluntary Fee' : '📋 Required Fee'}
              </div>
              <div>
                {selectedFee.feeTypeEnum === 'VOLUNTARY' 
                  ? `Minimum payment: ${formatCurrency(selectedFee.amount)} (can pay more)`
                  : `Exact amount: ${formatCurrency(selectedFee.amount)} (cannot exceed)`
                }
              </div>
            </div>
          )}
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