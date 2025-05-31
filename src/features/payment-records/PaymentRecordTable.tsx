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
}

interface PaymentRecordTableProps {
  refreshTrigger?: number;
}

export default function PaymentRecordTable({ refreshTrigger }: PaymentRecordTableProps) {
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
              <TableHeader>Notes</TableHeader>
              <TableHeader>Created</TableHeader>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.3rem' }}>{record.payerName}</div>
                    <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>ID: {record.payerId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.3rem' }}>{record.feeName}</div>
                    <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>ID: {record.feeId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.3rem' }}>Apt {record.apartmentNumber}</div>
                    <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>ID: {record.apartmentId}</div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(record.paymentDate)}</TableCell>
                <TableCell style={{ fontWeight: '700', color: '#059669', fontSize: '1.4rem' }}>
                  {formatAmount(record.amount)}
                </TableCell>
                <TableCell>
                  {record.notes ? (
                    <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {record.notes}
                    </div>
                  ) : (
                    <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '1.2rem' }}>No notes</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(record.createdAt)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </TableContainer>
  );
} 