import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import api from "../../services/axios";
import "./form.css";

const StatisticsWrapper = styled.div`
  padding: 2rem;
  background: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const StatisticsContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  color: #1f2937;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.75rem;
`;

const BillingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #f3f4f6;
  }

  &.complete {
    background: #ecfdf5;
    border-color: #10b981;
  }

  &.incomplete {
    background: #fef3c7;
    border-color: #f59e0b;
  }
`;

const StatusSpan = styled.span`
  font-weight: 600;
  font-size: 1.3rem;
  color: #374151;
`;

const Arrow = styled.span`
  transition: transform 0.2s;
  font-size: 1.2rem;
  &.open {
    transform: rotate(180deg);
  }
`;

const BillingDetails = styled.div`
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-top: none;
  border-radius: 0 0 8px 8px;
  margin-bottom: 1rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: #f9fafb;
    font-weight: 600;
    font-size: 1.3rem;
    color: #374151;
  }

  td {
    color: #6b7280;
    font-size: 1.2rem;
  }
`;

const PayButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
  font-size: 1.1rem;
`;

const StyledLabel = styled.label`
  display: block;
  margin-top: 1.5rem;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 1.4rem;
  color: #1f2937;
  letter-spacing: -0.01em;
  
  &:first-child {
    margin-top: 0;
  }
`;

interface StatisticsFormProps {
  statistic: {
    addressNumber: string;
  };
}

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

interface UtilityBill {
  id: number;
  name: string;
  paymentStatus: string;
  electricity: number;
  water: number;
  internet: number;
  apartmentId: number;
  createdAt: string;
}

const StatisticsForm = ({ statistic }: StatisticsFormProps) => {
  // Add null check to prevent destructuring errors
  if (!statistic) {
    return <div>Loading...</div>;
  }
  
  const { addressNumber } = statistic;

  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>([]);
  const [dataUtility, setDataUtility] = useState<UtilityBill[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<{[key: string]: boolean}>({});

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prevState: {[key: string]: boolean}) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const apiPaymentRecords = async () => {
    try {
      const response = await api.get(`/payment-records/apartment/${addressNumber}`);
      
      console.log('Payment Records API response:', response.data); // Debug log
      
      // Handle the response structure from ApiResponse
      if (response.data.code === 200 && response.data.data) {
        setPaymentRecords(response.data.data || []);
      } else {
        console.error('Unexpected API response structure:', response.data);
        toast.error('Invalid response format for payment records');
        setPaymentRecords([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payment records");
      setPaymentRecords([]);
    }
  };

  const apiUtility = async () => {
    try {
      const response = await api.get(
        `/utilitybills/${addressNumber}`
      );
      setDataUtility(response.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const apiPayUtility = async (utilityId: string) => {
    try {
      await api.post(
        `/utilitybills/update/${utilityId}`
      );
      toast.success("Payment successful!");
      apiUtility();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '0 VND';
    }
    return Number(amount).toLocaleString('vi-VN') + ' VND';
  };

  useEffect(() => {
    apiPaymentRecords();
    apiUtility();
  }, []);

  return (
    <StatisticsWrapper>
      <StatisticsContent>
        <SectionTitle>Payment Records for Apartment {addressNumber}:</SectionTitle>
        {paymentRecords.length === 0 ? (
          <EmptyMessage>No payment records found for this apartment.</EmptyMessage>
        ) : (
          <div>
            <BillingHeader onClick={() => toggleDropdown('payments')}>
              <StatusSpan>Payment History ({paymentRecords.length} records)</StatusSpan>
              <Arrow className={openDropdowns['payments'] ? "open" : ""}>
                &#9662;
              </Arrow>
            </BillingHeader>
            {openDropdowns['payments'] && (
              <BillingDetails>
                <StyledTable>
                  <thead>
                    <tr>
                      <th>Payer</th>
                      <th>Fee Item</th>
                      <th>Apartment</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentRecords.slice(0, 10).map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{record.payerName}</div>
                            <div style={{ fontSize: '1.1rem', color: '#9ca3af' }}>ID: {record.payerId}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{record.feeName}</div>
                            <div style={{ fontSize: '1.1rem', color: '#9ca3af' }}>ID: {record.feeId}</div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>Apt {record.apartmentNumber}</div>
                            <div style={{ fontSize: '1.1rem', color: '#9ca3af' }}>ID: {record.apartmentId}</div>
                          </div>
                        </td>
                        <td style={{ fontSize: '1.2rem' }}>{formatDate(record.paymentDate)}</td>
                        <td style={{ fontWeight: '700', color: '#059669', fontSize: '1.3rem' }}>
                          {formatAmount(record.amount)}
                        </td>
                        <td style={{ fontSize: '1.2rem' }}>{record.notes || 'No notes'}</td>
                      </tr>
                    ))}
                  </tbody>
                </StyledTable>
                {paymentRecords.length > 10 && (
                  <p style={{ color: '#6b7280', fontStyle: 'italic', textAlign: 'center', fontSize: '1rem' }}>
                    Showing first 10 records. View all records in Fee Payment section.
                  </p>
                )}
              </BillingDetails>
            )}
          </div>
        )}
        
        <SectionTitle>Utility Bills:</SectionTitle>
        {dataUtility.length === 0 ? (
          <EmptyMessage>No utility bills found for this apartment.</EmptyMessage>
        ) : (
          dataUtility.map((utility, index) => {
            const totalAmount = utility.electricity + utility.water + utility.internet;
            return (
              <div key={index}>
                <BillingHeader
                  className={utility.paymentStatus === "Unpaid" ? "incomplete" : "complete"}
                  onClick={() => toggleDropdown(utility.id.toString())}
                >
                  <StatusSpan>{utility.name}</StatusSpan>
                  <StatusSpan>Total: {formatAmount(totalAmount)}</StatusSpan>
                  <StatusSpan>
                    {utility.paymentStatus === "Unpaid" ? "Unpaid" : "Paid"}
                  </StatusSpan>
                  <Arrow className={openDropdowns[utility.id.toString()] ? "open" : ""}>
                    &#9662;
                  </Arrow>
                </BillingHeader>
                {openDropdowns[utility.id.toString()] && (
                  <BillingDetails>
                    <StyledTable>
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Electricity</td>
                          <td>{formatAmount(utility.electricity)}</td>
                          <td>
                            <span style={{ 
                              color: utility.paymentStatus === "Paid" ? "#059669" : "#dc2626",
                              fontWeight: "600",
                              fontSize: '1.2rem'
                            }}>
                              {utility.paymentStatus}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Water</td>
                          <td>{formatAmount(utility.water)}</td>
                          <td>
                            <span style={{ 
                              color: utility.paymentStatus === "Paid" ? "#059669" : "#dc2626",
                              fontWeight: "600",
                              fontSize: '1.2rem'
                            }}>
                              {utility.paymentStatus}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Internet</td>
                          <td>{formatAmount(utility.internet)}</td>
                          <td>
                            <span style={{ 
                              color: utility.paymentStatus === "Paid" ? "#059669" : "#dc2626",
                              fontWeight: "600",
                              fontSize: '1.2rem'
                            }}>
                              {utility.paymentStatus}
                            </span>
                          </td>
                        </tr>
                        <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: '700' }}>
                          <td style={{ fontSize: '1.3rem' }}>Total</td>
                          <td style={{ color: '#059669', fontSize: '1.35rem', fontWeight: '700' }}>{formatAmount(totalAmount)}</td>
                          <td>
                            <span style={{ 
                              color: utility.paymentStatus === "Paid" ? "#059669" : "#dc2626",
                              fontWeight: "600",
                              fontSize: '1.2rem'
                            }}>
                              {utility.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </StyledTable>
                    {utility.paymentStatus === "Unpaid" && (
                      <PayButtonContainer>
                        <Button
                          onClick={() => apiPayUtility(utility.id.toString())}
                          variation="success"
                          size="compact"
                        >
                          Pay 💳
                        </Button>
                      </PayButtonContainer>
                    )}
                  </BillingDetails>
                )}
              </div>
            );
          })
        )}
      </StatisticsContent>
    </StatisticsWrapper>
  );
};

export default StatisticsForm;
