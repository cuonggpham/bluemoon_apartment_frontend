import styled from "styled-components";
import Heading from "../../../components/Heading";
import { FcCalendar } from "react-icons/fc";
import Cards from "../../../components/Cards";
import ApartmentFeeChart from "../../../components/ApartmentFeeChart";
import ApartmentChart from "../../../components/ApartmentChart";
import ResidentsChart from "../../../components/ResidentChart";

const CalendarStyled = styled.label`
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  text-align: center;
  font-weight: 600;
  border: 1px solid var(--color-grey-700);
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background-color: var(--color-grey-200);
    border-color: var(--color-grey-600);
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.375rem 0.5rem;
    gap: 0.25rem;
  }
`;

function Calendar() {
  const today = new Date();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();
  return (
    <CalendarStyled>
      <FcCalendar size={20} />
      {`${month} ${year}, ${day}`}
    </CalendarStyled>
  );
}


const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 100%;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const ChartFullWidth = styled.div`
  grid-column: 1 / -1;
`;

export default function Overview() {
  return (
    <DashboardContainer>
      <HeaderSection>
        <Heading as="h1">Overview</Heading>
        <Calendar />
      </HeaderSection>

      <Cards />
      
      <ChartsSection>
        <ApartmentChart />
        <ResidentsChart />
      </ChartsSection>
      
      <ChartFullWidth>
        <ApartmentFeeChart />
      </ChartFullWidth>
    </DashboardContainer>
  );
}
