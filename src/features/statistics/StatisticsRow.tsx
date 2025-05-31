import Table from "../../components/Table";
import Modal from "../../components/Modal";
import StatisticsForm from "./StatisticsForm";
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

interface StatisticsProps {
  statistic: {
    addressNumber: string;
  };
}

export default function StatisticsRow({ statistic }: StatisticsProps) {
  const { addressNumber } = statistic;

  return (
    <Table.Row>
      <div>{addressNumber}</div>
      <Modal>
        <Modal.Open id="details">
          <DetailsButton>Details</DetailsButton>
        </Modal.Open>

        <Modal.Window id="details" name="List of Billing">
          <StatisticsForm statistic={statistic} />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
