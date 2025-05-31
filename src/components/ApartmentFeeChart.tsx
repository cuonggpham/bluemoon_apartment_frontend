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
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-lg);
  padding: 1.25rem;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-fast);

  &:hover {
    box-shadow: var(--shadow-md);
  }

  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const feeData = [
  { month: "January", fees_due: 5641.87, fees_collected: 6356.75 },
  { month: "February", fees_due: 5020.84, fees_collected: 6901.61 },
  { month: "March", fees_due: 6029.0, fees_collected: 4459.96 },
  { month: "April", fees_due: 9475.39, fees_collected: 5120.06 },
  { month: "May", fees_due: 6834.72, fees_collected: 4426.51 },
  { month: "June", fees_due: 5634.86, fees_collected: 7829.25 },
  // { month: "July", fees_due: 6739.51, fees_collected: 8653.55 },
  // { month: "August", fees_due: 5400.8, fees_collected: 8930.17 },
  // { month: "September", fees_due: 9009.9, fees_collected: 6848.28 },
  // { month: "October", fees_due: 5958.21, fees_collected: 5051.16 },
  // { month: "November", fees_due: 9963.78, fees_collected: 4151.07 },
  // { month: "December", fees_due: 6525.44, fees_collected: 4271.92 },
];

export default function ApartmentFeeChart() {
  const [paymentData, setPaymentData] = useState([]);

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
        const monthlyData = records.reduce((acc: any, record: any) => {
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
        const chartData = Object.values(monthlyData).slice(-6);
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
  const formatValue = (value: number) => `${(value / 1000000).toFixed(2)}M`;
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
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            fontSize={12}
            stroke="#64748b"
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#c084fc"
            domain={[0, maxValue]}
            tickFormatter={formatValue}
            fontSize={12}
          />
          <Tooltip 
            formatter={(value) => formatValue(value)}
            contentStyle={{
              backgroundColor: 'var(--color-grey-0)',
              border: '1px solid var(--color-grey-200)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.875rem'
            }}
          />
          <Legend fontSize={12} />
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
              fontSize={10}
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
              fontSize={10}
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

// Function to calculate max value and divide by 1 million
const calculateMaxValue = (data, roundTo = 1000000) => {
  const maxValue = Math.max(
    ...data.flatMap((item) => [
      item.totalAmount || 0
    ])
  );

  // Round maxValue up to multiple of `roundTo` (1 million)
  return Math.ceil(maxValue / roundTo) * roundTo;
};
