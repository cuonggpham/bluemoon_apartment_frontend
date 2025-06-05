import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background: #f9fafb;
  padding: 1rem;
  text-align: left;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  font-size: 1.4rem;
  letter-spacing: -0.01em;
`;

const TableRow = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
  font-size: 1.3rem;
  font-weight: 500;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #374151;
  font-size: 1.5rem;
  font-weight: 600;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #374151;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1.25rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #1f2937;
  width: 340px;
  
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

const DebtStatus = styled.span<{ $isDebt: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 1.275rem;
  font-weight: 600;
  background: ${props => props.$isDebt ? '#fef2f2' : '#f0fdf4'};
  color: ${props => props.$isDebt ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.$isDebt ? '#fecaca' : '#bbf7d0'};
`;

const UpdateButton = styled.button`
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 1.275rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  
  &:hover {
    background: #d97706;
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ActionCell = styled(TableCell)`
  min-width: 120px;
  text-align: center;
`;

interface PaymentRecord {
  id: number;
  payerId: number;
  payerName: string;
  feeId: number;
  feeName: string;
  apartmentId: number;
  apartmentNumber: string;
  paymentDate: string;
  amount: number;
  notes: string;
  createdAt: string;
  isFullyPaid: boolean;
  remainingAmount: number;
}

interface PaymentRecordTableProps {
  refreshTrigger?: number;
}

export default function PaymentRecordTable({ refreshTrigger }: PaymentRecordTableProps) {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateMode, setUpdateMode] = useState<{ recordId: number; currentAmount: number } | null>(null);
  const [updateAmount, setUpdateAmount] = useState('');

  useEffect(() => {
    fetchPaymentRecords();
  }, [refreshTrigger]);

  const fetchPaymentRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/payment-records');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Handle the API response structure: { code: 200, data: [...], message: "..." }
      const data = result.data || result;
      
      if (Array.isArray(data)) {
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPaymentRecords(sortedData);
      } else {
        console.error('Expected array but received:', data);
        setPaymentRecords([]);
      }
    } catch (error) {
      console.error('Error fetching payment records:', error);
      toast.error('Failed to load payment records');
      setPaymentRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePayment = (record: PaymentRecord) => {
    setUpdateMode({ recordId: record.id, currentAmount: record.amount });
    setUpdateAmount(record.amount.toString());
  };

  const handleCancelUpdate = () => {
    setUpdateMode(null);
    setUpdateAmount('');
  };

  const handleSaveUpdate = async () => {
    if (!updateMode) return;
    
    try {
      const record = paymentRecords.find(r => r.id === updateMode.recordId);
      if (!record) return;

      const response = await fetch(`http://localhost:8080/api/v1/payment-records/${updateMode.recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payerId: record.payerId,
          feeId: record.feeId,
          paymentDate: record.paymentDate,
          amount: parseFloat(updateAmount),
          notes: record.notes
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update payment');
      }

      toast.success('Payment updated successfully!');
      setUpdateMode(null);
      setUpdateAmount('');
      await fetchPaymentRecords(); // Refresh data
    } catch (error: any) {
      console.error('Error updating payment:', error);
      toast.error(error.message || 'Failed to update payment');
    }
  };

  const filteredRecords = paymentRecords.filter(record =>
    record.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.feeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return <LoadingMessage>Loading payment records...</LoadingMessage>;
  }

  return (
    <TableContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.6rem', fontWeight: '700' }}>
          Payment Records ({filteredRecords.length})
        </h3>
        <SearchInput
          type="text"
          placeholder="Search by payer, fee, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRecords.length === 0 ? (
        <EmptyMessage>
          {searchTerm ? 'No payment records match your search.' : 'No payment records found.'}
        </EmptyMessage>
      ) : (
        <Table>
          <thead>
            <tr>
              <TableHeader>ID</TableHeader>
              <TableHeader>Payer</TableHeader>
              <TableHeader>Fee Item</TableHeader>
              <TableHeader>Apartment</TableHeader>
              <TableHeader>Payment Date</TableHeader>
              <TableHeader>Amount</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Notes</TableHeader>
              <TableHeader>Actions</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.payerName}</TableCell>
                <TableCell>{record.feeName}</TableCell>
                <TableCell>#{record.apartmentNumber}</TableCell>
                <TableCell>{formatDate(record.paymentDate)}</TableCell>
                <TableCell>
                  {updateMode?.recordId === record.id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={updateAmount}
                        onChange={(e) => setUpdateAmount(e.target.value)}
                        placeholder="Enter amount"
                        title="Update payment amount"
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          width: '120px'
                        }}
                        min="0"
                        step="0.01"
                      />
                      <button
                        onClick={handleSaveUpdate}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCancelUpdate}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    formatAmount(record.amount)
                  )}
                </TableCell>
                <TableCell>
                  <DebtStatus $isDebt={!record.isFullyPaid}>
                    {record.isFullyPaid ? (
                      <>✅ Paid</>
                    ) : (
                      <>⚠️ Debt: {formatAmount(record.remainingAmount)}</>
                    )}
                  </DebtStatus>
                </TableCell>
                <TableCell>{record.notes || '-'}</TableCell>
                <ActionCell>
                  {!record.isFullyPaid ? (
                    <UpdateButton 
                      onClick={() => handleUpdatePayment(record)}
                      title="Update payment amount"
                    >
                      💰 Update
                    </UpdateButton>
                  ) : (
                    <span style={{ 
                      color: '#10b981', 
                      fontSize: '1.275rem', 
                      fontWeight: '600' 
                    }}>
                      ✅ Completed
                    </span>
                  )}
                </ActionCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </TableContainer>
  );
} 