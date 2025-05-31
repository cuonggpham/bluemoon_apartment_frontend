import Table from "../../components/Table";
import Tag from "../../components/Tag";
import Modal from "../../components/Modal";
import FeeAndFundForm from "./FeeAndFundForm";
import { formatFeeType } from "../../utils/helpers";
import styled from "styled-components";

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

export default function FeeAndFundRow({ feeOrFund }: any) {
  const { id, name, description, unitPrice, feeTypeEnum, apartmentId } = feeOrFund;

  const statusStyled = {
    Mandatory: "pink",
    Voluntary: "green",
  };
  return (
    <Table.Row>
      <div>{id}</div>
      <div>{name}</div>
      <div>{description}</div>
      <div>{unitPrice}</div>
      <div>{feeTypeEnum === "Mandatory" ? (apartmentId || "N/A") : "-"}</div>
      <Tag type={statusStyled[feeTypeEnum as keyof typeof statusStyled] || "gray"}>{formatFeeType(feeTypeEnum)}</Tag>
      <Modal>
        <Modal.Open id="details">
          <DetailsButton>Details</DetailsButton>
        </Modal.Open>

        <Modal.Window id="details" name="Fee and Fund Details">
          <FeeAndFundForm feeOrFund={feeOrFund} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
