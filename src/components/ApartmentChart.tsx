import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import styled from "styled-components";
import Heading from "./Heading";
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
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.02), transparent);
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

  & > *:first-child {
    margin-bottom: 1.5rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
    font-size: 1.5rem;
    color: black;
    fill: #111827;
  }

  & .recharts-legend-item-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
    fill: #374151 !important;
  }

  & .recharts-tooltip-wrapper {
    font-size: 1rem;
    font-weight: 500;
  }

  & .recharts-legend-item {
    font-size: 1rem !important;
    font-weight: 600 !important;
    color: #374151 !important;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    
    & > *:first-child {
      margin-bottom: 1rem;
    }

    & .recharts-pie-label-text {
      font-size: 0.875rem;
    }

    & .recharts-legend-item-text {
      font-size: 0.875rem;
    }
  }
`;

interface Apartment {
  status: string; // Trạng thái của căn hộ
}

interface ProcessedData {
  status: string; // Tên nhóm trạng thái
  value: number; // Số lượng căn hộ thuộc nhóm
}

// Mảng bắt đầu với các nhóm trạng thái và giá trị ban đầu
const startData: ProcessedData[] = [
  { status: "Business", value: 0 },
  { status: "Residential", value: 0 },
  { status: "Vacant", value: 0 },
];

async function prepareData(): Promise<ProcessedData[]> {
  // Hàm lấy dữ liệu căn hộ từ API
  const fetchApartments = async (): Promise<Apartment[]> => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/apartments?size=999"
      );
      return response.data.data.result; // Trả về danh sách căn hộ
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu căn hộ:", error);
      return []; // Trả về mảng rỗng khi lỗi
    }
  };

  // Hàm tăng giá trị của một nhóm trong mảng
  function incArrayValue(arr: ProcessedData[], field: string): ProcessedData[] {
    return arr.map((obj) =>
      obj.status === field ? { ...obj, value: obj.value + 1 } : obj
    );
  }

  // Lấy dữ liệu từ API
  const apartments = await fetchApartments();

  // Xử lý dữ liệu
  const data = apartments
    .reduce<ProcessedData[]>((arr, cur) => {
      const status = cur.status;
      if (status === "Business") return incArrayValue(arr, "Business");
      if (status === "Residential") return incArrayValue(arr, "Residential");
      if (status === "Vacant") return incArrayValue(arr, "Vacant");
      return arr;
    }, startData)
    .filter((obj) => obj.value > 0); // Lọc ra các nhóm có giá trị lớn hơn 0

  return data;
}
const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function ApartmentChart() {
  const [data, setData] = useState<ProcessedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await prepareData();
      setData(result);
    };
    fetchData();
  }, []);

  const totalValue = data.reduce((total, entry) => total + entry.value, 0);
  return (
    <ChartBox>
      <Heading as="h3">Apartment Summary</Heading>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            cx="35%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={3}
            dataKey="value"
            nameKey="status"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              value={totalValue}
              position="center"
              fontSize={32}
              fontWeight="bold"
              fill="#111827"
            />
          </Pie>
          <Tooltip 
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
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconSize={12}
            width={120}
            iconType="circle"
            wrapperStyle={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151' 
            }}
            formatter={(value, entry, index) =>
              `${entry.payload.status}: ${entry.payload.value}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
