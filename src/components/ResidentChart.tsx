import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
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
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.02), transparent);
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
    font-size: 0.875rem;
  }

  & .recharts-legend-item-text {
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    
    & > *:first-child {
      margin-bottom: 1rem;
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
  { status: "Absent", value: 0 },
  { status: "Moved", value: 0 },
  { status: "Resident", value: 0 },
  { status: "Temporary", value: 0 },
];

const COLORS = ["#eab308", "#ef4444", "#00C49F", "#ec4899"]; // Màu sắc cho các nhóm trạng thái

async function prepareData(): Promise<ProcessedData[]> {
  // Hàm lấy dữ liệu căn hộ từ API
  const fetchApartments = async (): Promise<Apartment[]> => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/residents?size=999"
      );
      return response.data.data.result; // Trả về danh sách căn hộ
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu cư dân:", error);
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
      if (status === "Absent") return incArrayValue(arr, "Absent");
      if (status === "Moved") return incArrayValue(arr, "Moved");
      if (status === "Resident") return incArrayValue(arr, "Resident");
      if (status === "Temporary") return incArrayValue(arr, "Temporary");
      return arr;
    }, startData)
    .filter((obj) => obj.value > 0); // Lọc ra các nhóm có giá trị lớn hơn 0

  return data;
}

export default function ResidentsChart() {
  const [data, setData] = useState<ProcessedData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result = await prepareData();
      setData(result);
    };
    fetchData();
  }, []);

  // Tính tổng giá trị để hiển thị ở giữa PieChart
  const totalValue = data.reduce((total, entry) => total + entry.value, 0);
  return (
    <ChartBox>
      <Heading as="h3">Residents Summary</Heading>
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
            {/* Hiển thị tổng số ở giữa biểu đồ */}
            <Label
              value={totalValue}
              position="center"
              fontSize={28}
              fontWeight="bold"
              fill="#333"
            />
          </Pie>
          <Tooltip />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconSize={10}
            itemStyle={{ fontSize: '2.75rem' }}
             width={120}
             iconType="circle"
             formatter={(value, entry, index) =>
               `${entry.payload.status}: ${entry.payload.value}`
             }
           />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}
