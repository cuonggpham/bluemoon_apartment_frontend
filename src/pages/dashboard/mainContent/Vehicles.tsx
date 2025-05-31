import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import anime from "animejs";
import AddAndSearch from "../../../components/AddAndSearch";
import Heading from "../../../components/Heading";
import Row from "../../../components/Row";
import VehiclesTable from "../../../features/vehicles/VehiclesTable";
import VehicleForm from "../../../features/vehicles/VehicleForm";

const PageContainer = styled.div`
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 
    0 4px 32px rgba(0, 0, 0, 0.04),
    0 2px 16px rgba(0, 0, 0, 0.02);
  position: relative;
  overflow: hidden;
  margin: 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(236, 72, 153, 0.02), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0.5rem;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.6);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, #db2777, #be185d);
    border-radius: 2px;
  }
`;

const StyledHeading = styled(Heading)`
  background: linear-gradient(135deg, #db2777, #be185d);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: var(--letter-spacing-tight);
  margin-bottom: 0.5rem;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);

  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);
  }
`;

const Description = styled.p`
  color: var(--dashboard-text-secondary);
  font-size: var(--font-size-base);
  margin: 0;
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 
    0 2px 16px rgba(0, 0, 0, 0.03),
    0 1px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.05),
      0 2px 12px rgba(0, 0, 0, 0.03);
  }
`;

export default function Vehicles() {
  const [keyword, setKeyword] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Faster container entrance animation
    anime({
      targets: containerRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      easing: 'easeOutCubic',
      delay: 100
    });

    // Faster header animation
    anime({
      targets: headerRef.current,
      opacity: [0, 1],
      translateX: [-20, 0],
      duration: 350,
      easing: 'easeOutCubic',
      delay: 200
    });

    // Faster table animation
    anime({
      targets: tableRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 300,
      easing: 'easeOutCubic',
      delay: 300
    });
  }, []);

  return (
    <PageContainer ref={containerRef}>
      <HeaderSection ref={headerRef}>
        <Row type="horizontal" justify="between" gap="lg">
          <div>
            <StyledHeading as="h1">Vehicles Management</StyledHeading>
            <Description>Manage and track all vehicles in your property</Description>
          </div>
          <AddAndSearch title="Add Vehicle" setKeyword={setKeyword} keyword={keyword}>
            <VehicleForm />
          </AddAndSearch>
        </Row>
      </HeaderSection>
      
      <TableContainer ref={tableRef}>
        <VehiclesTable keyword={keyword}/>
      </TableContainer>
    </PageContainer>
  );
}
