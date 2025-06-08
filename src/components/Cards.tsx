import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { animate } from "animejs";
import Card from "./Card";
import { PiBuildingApartmentFill } from "react-icons/pi";
import { MdFamilyRestroom } from "react-icons/md";
import { PiBuildingApartmentLight } from "react-icons/pi";
import { GiMoneyStack } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { FaCar } from "react-icons/fa";

import api from "../services/axios";

const CardsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 0;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }
`;

export default function Cards() {
  const [numOfApartments, setNumOfApartments] = useState<number>(0);
  const [numOfResidents, setNumOfResidents] = useState<number>(0);
  const [numOfVehicles, setNumOfVehicles] = useState<number>(0);
  const [totalAmountLast30Days, setTotalAmountLast30Days] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all data concurrently
        const [apartmentsRes, residentsRes, vehiclesRes, paymentsRes] = await Promise.all([
          api.get("/apartments?size=999"),
          api.get("/residents?size=999"),
          api.get("/vehicles?size=999"),
          api.get("/payment-records")
        ]);

        setNumOfApartments(apartmentsRes.data.data.totalElements);
        setNumOfResidents(residentsRes.data.data.totalElements);
        setNumOfVehicles(vehiclesRes.data.data.totalElements);

        // Calculate total payment amount in the last 30 days
        let paymentRecords = [];
        if (paymentsRes.data.code === 200 && paymentsRes.data.data) {
          paymentRecords = paymentsRes.data.data || [];
        }
        
        const today = new Date();
        const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

        const totalAmount = paymentRecords.reduce((total: number, record: any) => {
          const paymentDate = new Date(record.paymentDate);
          if (paymentDate >= thirtyDaysAgo) {
            total += record.amount;
          }
          return total;
        }, 0);

        setTotalAmountLast30Days(totalAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!loading && cardsRef.current) {
      animate(cardsRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutCubic',
        delay: 400
      });
    }
  }, [loading]);

  if (loading) {
    return (
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '1.5rem'
      }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            height: '140px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '16px',
            animation: 'pulse 2s ease-in-out infinite'
          }} />
        ))}
      </div>
    );
  }

  return (
    <>
      <SectionTitle>Key Metrics</SectionTitle>
      <CardsStyled ref={cardsRef}>
        <Card
          icon={<PiBuildingApartmentLight size={28} />}
          title="Total Apartments"
          value={numOfApartments}
          color="cyan"
          iconDetails="Apartments"
        />

        <Card
          icon={<MdFamilyRestroom size={28} />}
          title="Total Residents"
          value={numOfResidents}
          color="emerald"
          iconDetails="Residents"
        />

        <Card
          icon={<FaCar size={28} />}
          title="Total Vehicles"
          value={numOfVehicles}
          color="pink"
          iconDetails="Vehicles"
        />

        <Card
          icon={<GiPayMoney size={28} />}
          title="Revenue (30 days)"
          value={`₫${(totalAmountLast30Days / 1000000).toFixed(2)}M`}
          color="purple"
          iconDetails="Payment Records"
        />
      </CardsStyled>
    </>
  );
}
