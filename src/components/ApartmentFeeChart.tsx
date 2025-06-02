import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Heading from "./Heading";
import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";

const ChartBox = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  width: 100%;
  padding: 1.5rem;
  box-shadow: 
    0 4px 32px rgba(0, 0, 0, 0.04),
    0 2px 16px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.02), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    box-shadow: 
      0 8px 40px rgba(0, 0, 0, 0.06),
      0 4px 20px rgba(0, 0, 0, 0.03);
    transform: translateY(-2px);
  }

  &:hover::before {
    opacity: 1;
  }

  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 1rem 0;

  @media (max-width: 480px) {
    padding: 1.25rem;
    gap: 1rem;
  }
`;

interface PaymentRecord {
  month: string;
  totalAmount: number;
  recordCount: number;
}

export default function ApartmentFeeChart() {
  const [paymentData, setPaymentData] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/payment-records"
        );
        
        console.log('Payment Records API response:', response.data); // Debug log
        
        // Handle the response structure from ApiResponse
        let records = [];
        if (response.data.code === 200 && response.data.data) {
          records = response.data.data || [];
        } else {
          console.error('Unexpected API response structure:', response.data);
          records = [];
        }
        
        // Group payment records by month and calculate totals
        const monthlyData = records.reduce((acc: Record<string, PaymentRecord>, record: any) => {
          const date = new Date(record.paymentDate);
          const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
          
          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: monthKey,
              totalAmount: 0,
              recordCount: 0
            };
          }
          
          acc[monthKey].totalAmount += record.amount;
          acc[monthKey].recordCount += 1;
          
          return acc;
        }, {});
        
        // Convert to array and take last 6 months
        const chartData = Object.values(monthlyData).slice(-6) as PaymentRecord[];
        setPaymentData(chartData);
      } catch (err) {
        console.error("Error fetching payment records", err);
        setPaymentData([]);
      }
    };

    fetchData();
  }, []);

  //Calculate max value and divide by 1 million
  const maxValue = calculateMaxValue(paymentData, 1000000); // Round and divide by 1 million

  // Function to format value in millions
  const formatValue = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${(numValue / 1000000).toFixed(2)}M`;
  };
  return (
    <ChartBox>
      <Heading as="h2">Payment Records Chart</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={paymentData}
          margin={{
            top: 15,
            right: 20,
            left: 15,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            fontSize={14}
            fontWeight={500}
            stroke="#374151"
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#c084fc"
            domain={[0, maxValue]}
            tickFormatter={formatValue}
            fontSize={14}
            fontWeight={500}
          />
          <Tooltip 
            formatter={(value: any) => formatValue(value)}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              color: '#111827'
            }}
          />
          <Legend 
            fontSize={14}
            wrapperStyle={{ 
              fontWeight: '600', 
              color: '#374151' 
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="totalAmount"
            fill="#c084fc"
            barSize={40}
            radius={[6, 6, 0, 0]}
          >
            <LabelList
              dataKey="totalAmount"
              position="top"
              formatter={formatValue}
              fontSize={12}
              fontWeight={600}
              fill="#374151"
            />
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="recordCount"
            fill="#86efac"
            barSize={40}
            radius={[6, 6, 0, 0]}
          >
            <LabelList
              dataKey="recordCount"
              position="top"
              fontSize={12}
              fontWeight={600}
              fill="#374151"
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

// Function to calculate max value and divide by 1 million
const calculateMaxValue = (data: PaymentRecord[], roundTo = 1000000) => {
  const maxValue = Math.max(
    ...data.flatMap((item: PaymentRecord) => [
      item.totalAmount || 0
    ])
  );

  // Round maxValue up to multiple of `roundTo` (1 million)
  return Math.ceil(maxValue / roundTo) * roundTo;
};
