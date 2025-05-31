import Table from "../../components/Table";
import Tag from "../../components/Tag";
import { capitalize } from "../../utils/helpers";
import Modal from "../../components/Modal";
import ResidentForm from "./ResidentForm";
import styled from "styled-components";

// Styled Components
const ApartmentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  justify-content: flex-start;
  align-items: center;
  min-height: 2rem;
`;

const ApartmentTag = styled.span`
  background: linear-gradient(135deg, var(--color-blue-100) 0%, var(--color-blue-50) 100%);
  color: var(--color-blue-700);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  border: 1px solid var(--color-blue-200);
  transition: all 0.2s ease;
  
  &:hover {
    background: linear-gradient(135deg, var(--color-blue-200) 0%, var(--color-blue-100) 100%);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;

const NoApartments = styled.span`
  color: var(--color-grey-500);
  font-style: italic;
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs);
`;

const DetailsButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-brand-600);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  text-align: left;
  width: 100%;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--color-brand-700);
    text-decoration: underline;
  }
  
  &:focus {
    outline: none;
    color: var(--color-brand-700);
  }
`;

export default function ResidentRow({ resident, index }:{ resident: any; index: number }) {
  const { id, apartments, name, dob, status, gender } = resident;

  const statusStyled = {
    Resident: "green",
    Moved: "red",
    Temporary: "pink",
    Absent: "yellow",
  };

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày, thêm 0 nếu nhỏ hơn 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng (bắt đầu từ 0)
    const year = date.getFullYear(); // Lấy năm
    return `${day}-${month}-${year}`;
  }
  
  return (
    <Table.Row key={id}>
      {" "}
      {/* Ensure the row is uniquely identified */}
      <div>{index + 1}</div>      <div>
        {apartments && apartments.length > 0 ? (
          <ApartmentTags>
            {apartments.map((apartment: any, idx: number) => (
              <ApartmentTag
                key={apartment.addressNumber || idx}
              >
                {apartment.addressNumber}
              </ApartmentTag>
            ))}
          </ApartmentTags>
        ) : (
          <NoApartments>No apartments</NoApartments>
        )}
      </div>
      <div>{name}</div>
      <div>{id}</div>
      <div>{gender}</div>
      <div>{formatDate(dob)}</div>
      <Tag
        type={
          statusStyled[
            status as "Resident" | "Moved" | "Temporary" | "Absent"
          ] || "grey"
        }
      >
        {capitalize(status) || "Unknown"}
      </Tag>      <Modal>
        <Modal.Open id="details">
          <DetailsButton>Details</DetailsButton>
        </Modal.Open>

        <Modal.Window id="details" name="Resident Details">
          <ResidentForm resident={resident} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
