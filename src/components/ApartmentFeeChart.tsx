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
  const [feeData, setFeeData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/invoices/total"
        );
        const data = response.data.data.slice(0, 5); // Lấy 5 phần tử đầu tiên
        setFeeData(data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu hóa đơn", err);
      }
    };

    fetchData();
  }, []);

  //Tính toán max value và chia cho 1 triệu
  const maxValue = calculateMaxValue(feeData, 1000000); // Làm tròn và chia cho 1 triệu

  // Hàm định dạng giá trị theo triệu
  const formatValue = (value: number) => `${(value / 1000000).toFixed(2)}M`;
  return (
    <ChartBox>
      <Heading as="h2">Apartment Fee Collection Chart</Heading>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={feeData}
          margin={{
            top: 15,
            right: 20,
            left: 15,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
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
            dataKey="paidAmount"
            fill="#86efac"
            barSize={40}
            radius={[6, 6, 0, 0]}
          >
            <LabelList
              dataKey="paidAmount"
              position="top"
              formatter={formatValue}
              fontSize={10}
            />
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="contributionAmount"
            fill="#f97316"
            barSize={40}
            radius={[6, 6, 0, 0]}
          >
            <LabelList
              dataKey="contributionAmount"
              position="top"
              formatter={formatValue}
              fontSize={10}
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

// Hàm tính giá trị max và chia cho 1 triệu
const calculateMaxValue = (data, roundTo = 1000000) => {
  const maxValue = Math.max(
    ...data.flatMap((item) => [
      item.totalAmount,
      item.paidAmount,
      item.contributionAmount,
    ])
  );

  // Làm tròn maxValue lên bội số của `roundTo` (1 triệu)
  return Math.ceil(maxValue / roundTo) * roundTo;
};
