import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { animate } from 'animejs';
import { toast } from 'react-toastify';
import { monthlyFeeApi } from '../../../services/monthlyFeeApi';
import { Fee, PaymentRecord, FeeTypeEnum, FeeHelpers, VehicleEnum } from '../../../types/monthlyFee';
import Heading from '../../../components/Heading';
import { floorAreaFeeConfigApi, FloorAreaFeeConfig } from "../../../services/floorAreaFeeConfigApi";

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
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.02), transparent);
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
    background: linear-gradient(90deg, #6366f1, #4f46e5);
    border-radius: 2px;
  }
`;

const StyledHeading = styled(Heading)`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
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
  color: #1f2937;
  font-size: var(--font-size-base);
  margin: 0;
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-normal);
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(229, 231, 235, 0.6);
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 1rem 2rem;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#374151'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  font-size: var(--font-size-sm);

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #4f46e5, #4338ca)' : 'rgba(99, 102, 241, 0.1)'};
    color: ${props => props.active ? 'white' : '#6366f1'};
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: var(--font-size-xs);
  }
`;

const TabContent = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 
    0 2px 16px rgba(0, 0, 0, 0.03),
    0 1px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.05),
      0 2px 12px rgba(0, 0, 0, 0.03);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #111827;
  font-size: var(--font-size-base);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 8px;
  font-size: var(--font-size-base);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: white;
  }

  &::placeholder {
    color: #6b7280;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
  border-radius: 8px;
  font-size: var(--font-size-base);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    background: white;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
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
    background: linear-gradient(135deg, #4f46e5, #4338ca);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    background: var(--dashboard-text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:disabled::before {
    display: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

// Standardized table components that match other pages
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
  margin-top: 1.5rem;

  &:hover {
    box-shadow: 
      0 4px 24px rgba(0, 0, 0, 0.05),
      0 2px 12px rgba(0, 0, 0, 0.03);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.1));
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid rgba(99, 102, 241, 0.2);
  font-weight: 600;
  color: #111827;
  font-size: var(--font-size-sm);
  line-height: 1.4;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: var(--font-size-xs);
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  font-size: var(--font-size-sm);
  color: #1f2937;
  line-height: 1.4;
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: var(--font-size-xs);
  }
`;

// Standardized action button for tables
const ActionButton = styled.button<{ variant?: 'danger' | 'warning' | 'success' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'warning': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'success': return 'linear-gradient(135deg, #10b981, #059669)';
      default: return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    }
  }};
  color: white;
  border: none;
  padding: 0.5rem 0.875rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  line-height: 1;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    padding: 0.375rem 0.625rem;
    font-size: 0.7rem;
  }
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  background: ${props => props.status === 'active' ? 
    'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.1))' : 
    'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.1))'};
  color: ${props => props.status === 'active' ? '#15803d' : '#b91c1c'};
  border: 1px solid ${props => props.status === 'active' ? 
    'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    width: 4px;
    height: 1.5rem;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border-radius: 2px;
  }
`;

const InfoCard = styled.div`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(99, 102, 241, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;

  h4 {
    margin: 0 0 0.5rem 0;
    color: #3b82f6;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-bold);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
    color: #1e40af;
    font-size: var(--font-size-sm);
    line-height: 1.6;
  }

  li {
    margin-bottom: 0.25rem;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 3rem 2rem;
  font-size: var(--font-size-sm);
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const ConfigFormContainer = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border: 1px solid rgba(226, 232, 240, 0.8);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// Styled button for forms with variant support
const FormButton = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'secondary': return 'linear-gradient(135deg, #6b7280, #4b5563)';
      case 'success': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'danger': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      default: return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    }
  }};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: var(--font-size-sm);
  cursor: pointer;
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
    background: ${props => {
      switch (props.variant) {
        case 'secondary': return 'linear-gradient(135deg, #4b5563, #374151)';
        case 'success': return 'linear-gradient(135deg, #059669, #047857)';
        case 'danger': return 'linear-gradient(135deg, #dc2626, #b91c1c)';
        default: return 'linear-gradient(135deg, #4f46e5, #4338ca)';
      }
    }};
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: var(--dashboard-text-muted);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &:disabled::before {
    display: none;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const FormButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

type TabType = 'generation' | 'fees' | 'payments' | 'parking-config' | 'floor-area-config';

const MonthlyFeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('generation');
  const [loading, setLoading] = useState(false);

  // Generation form state
  const [feeType, setFeeType] = useState<FeeTypeEnum>('VEHICLE_PARKING');
  const [billingMonth, setBillingMonth] = useState('');
  const [unitPricePerSqm, setUnitPricePerSqm] = useState<number>(15000);
  const [floorAreaFeeName, setFloorAreaFeeName] = useState<string>('');
  const [selectedFloorAreaConfig, setSelectedFloorAreaConfig] = useState<number | null>(null);

  // Parking config state
  const [parkingPrices, setParkingPrices] = useState({
    [VehicleEnum.Motorbike]: 50000,
    [VehicleEnum.Car]: 200000,
  });

  // Floor area fee config state
  const [floorAreaConfigs, setFloorAreaConfigs] = useState<FloorAreaFeeConfig[]>([]);
  const [editingConfig, setEditingConfig] = useState<FloorAreaFeeConfig | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);

  // Data state
  const [fees, setFees] = useState<Fee[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const tabContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set default billing month to current month
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setBillingMonth(currentMonth);
    setSelectedMonth(currentMonth);
    
    // Load floor area configurations for dropdown usage
    handleLoadFloorAreaConfigs();
  }, []);

  // Animation effects
  useEffect(() => {
    if (containerRef.current) {
      animate(containerRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        easing: 'easeOutCubic',
        delay: 100
      });
    }

    if (headerRef.current) {
      animate(headerRef.current, {
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 500,
        easing: 'easeOutCubic',
        delay: 200
      });
    }

    if (tabContentRef.current) {
      animate(tabContentRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 400,
        easing: 'easeOutCubic',
        delay: 300
      });
    }
  }, [activeTab]);

  // Re-animate tab content when switching tabs
  useEffect(() => {
    if (tabContentRef.current) {
      animate(tabContentRef.current, {
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 250,
        easing: 'easeOutCubic'
      });
    }
  }, [activeTab]);

  // Load floor area configs when floor-area-config tab is selected
  useEffect(() => {
    if (activeTab === 'floor-area-config') {
      handleLoadFloorAreaConfigs();
    }
  }, [activeTab]);

  const handleGenerateFees = async () => {
    if (!billingMonth) {
      toast.error('Please select a billing month');
      return;
    }

    setLoading(true);

    try {
      let unitPrice = null;
      let feeName = null;
      
      if (feeType !== 'VEHICLE_PARKING' && selectedFloorAreaConfig) {
        // Find the config that matches the selected configuration
        const config = floorAreaConfigs && Array.isArray(floorAreaConfigs) 
          ? floorAreaConfigs.find(c => c.id === selectedFloorAreaConfig) 
          : null;
        if (!config) {
          toast.error('Selected floor area fee configuration not found');
          return;
        }
        
        // Check if this fee type already exists for this month
        const existingFees = await monthlyFeeApi.getMonthlyFeesByMonth(billingMonth);
        const hasExistingFee = existingFees.some(fee => 
          fee.name === config.feeName && fee.feeTypeEnum === config.feeTypeEnum
        );
        
        if (hasExistingFee) {
          toast.error(`Fee "${config.feeName}" already exists for ${billingMonth}. Each floor area fee can only be generated once per month.`);
          return;
        }
        
        unitPrice = config.unitPricePerSqm;
        feeName = config.feeName;
      }

      const generatedFees = await monthlyFeeApi.generateMonthlyFees(
        feeType,
        billingMonth,
        unitPrice,
        feeName
      );

      toast.success(
        `Successfully generated ${generatedFees.length} fees for ${billingMonth}`
      );

      // Reset selection after successful generation
      setFeeType('VEHICLE_PARKING');
      setSelectedFloorAreaConfig(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate fees');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFees = async () => {
    if (!selectedMonth) return;

    setLoading(true);

    try {
      const monthlyFees = await monthlyFeeApi.getFeesByMonth(selectedMonth);
      setFees(monthlyFees);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load fees list');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPayments = async () => {
    setLoading(true);

    try {
      const recurringPayments = await monthlyFeeApi.getPayments();
      setPayments(recurringPayments);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateFee = async (feeId: number) => {
    setLoading(true);

    try {
      await monthlyFeeApi.deactivateFee(feeId);
      toast.success('Fee deactivated successfully');
      
      // Refresh fees list
      await handleLoadFees();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to deactivate fee');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveParkingPrices = async () => {
    setLoading(true);

    try {
      // Save parking prices via API
      await monthlyFeeApi.updateParkingPrices(parkingPrices);
      toast.success('Parking prices updated successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update parking prices');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadParkingPrices = async () => {
    setLoading(true);

    try {
      const prices = await monthlyFeeApi.getParkingPrices();
      setParkingPrices(prices);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load parking prices');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'fees' && selectedMonth) {
      handleLoadFees();
    } else if (activeTab === 'payments') {
      handleLoadPayments();
    } else if (activeTab === 'parking-config') {
      handleLoadParkingPrices();
    } else if (activeTab === 'floor-area-config') {
      handleLoadFloorAreaConfigs();
    } else if (activeTab === 'generation') {
      // Load floor area configs for dropdown
      handleLoadFloorAreaConfigs();
    }
  }, [activeTab, selectedMonth]);

  // Floor area fee config handlers
  const handleLoadFloorAreaConfigs = async () => {
    setLoading(true);
    try {
      console.log('🔄 Loading floor area configurations...');
      const configs = await floorAreaFeeConfigApi.getAllActiveConfigs();
      console.log('✅ Loaded configs:', configs);
      console.log('📊 Config count:', configs?.length);
      console.log('🧪 Is array?', Array.isArray(configs));
      setFloorAreaConfigs(configs);
      console.log('💾 Set to state, current state:', configs);
    } catch (err) {
      console.error('❌ Error loading configs:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to load floor area configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFloorAreaConfig = async (config: Omit<FloorAreaFeeConfig, 'id'>) => {
    setLoading(true);
    try {
      await floorAreaFeeConfigApi.createConfig(config);
      toast.success('Floor area fee configuration created successfully');
      await handleLoadFloorAreaConfigs();
      setShowConfigForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create floor area configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFloorAreaConfig = async (id: number, config: Partial<FloorAreaFeeConfig>) => {
    setLoading(true);
    try {
      await floorAreaFeeConfigApi.updateConfig(id, config);
      toast.success('Floor area fee configuration updated successfully');
      await handleLoadFloorAreaConfigs();
      setEditingConfig(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update floor area configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateFloorAreaConfig = async (id: number) => {
    setLoading(true);
    try {
      await floorAreaFeeConfigApi.deactivateConfig(id);
      toast.success('Floor area fee configuration deactivated successfully');
      await handleLoadFloorAreaConfigs();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to deactivate floor area configuration');
    } finally {
      setLoading(false);
    }
  };

  // Floor Area Config Form Component
  interface FloorAreaConfigFormProps {
    config?: FloorAreaFeeConfig | null;
    onSave: (config: Omit<FloorAreaFeeConfig, 'id'> | Partial<FloorAreaFeeConfig>) => void;
    onCancel: () => void;
    loading: boolean;
  }

  const FloorAreaConfigForm: React.FC<FloorAreaConfigFormProps> = ({ 
    config, 
    onSave, 
    onCancel, 
    loading 
  }) => {
    const [formData, setFormData] = useState<Partial<FloorAreaFeeConfig>>({
      feeName: config?.feeName || '',
      description: config?.description || '',
      feeTypeEnum: config?.feeTypeEnum || 'FLOOR_AREA',
      unitPricePerSqm: config?.unitPricePerSqm || 0,
      isActive: config?.isActive ?? true,
      isAutoGenerated: config?.isAutoGenerated ?? false,
      effectiveFrom: config?.effectiveFrom || '',
      effectiveTo: config?.effectiveTo || '',
      scheduledDay: config?.scheduledDay || 1,
      scheduledHour: config?.scheduledHour || 2,
      scheduledMinute: config?.scheduledMinute || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Validation
      const errors = floorAreaFeeConfigApi.validateConfig(formData);
      if (errors.length > 0) {
        toast.error(errors[0]);
        return;
      }

      onSave(formData as any);
    };

    const handleInputChange = (field: keyof FloorAreaFeeConfig, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
      <ConfigFormContainer>
        <h3 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>
          {config ? 'Edit Configuration' : 'Add New Configuration'}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <FormGroup>
              <Label>Fee Name *</Label>
              <Input
                type="text"
                value={formData.feeName}
                onChange={(e) => handleInputChange('feeName', e.target.value)}
                placeholder="e.g., Management Fee, Maintenance Fee"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Fee Type *</Label>
              <Select
                value={formData.feeTypeEnum}
                onChange={(e) => handleInputChange('feeTypeEnum', e.target.value)}
                required
              >
                <option value="FLOOR_AREA">Floor Area Fee</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Unit Price (VND/m²) *</Label>
              <Input
                type="number"
                value={formData.unitPricePerSqm}
                onChange={(e) => handleInputChange('unitPricePerSqm', Number(e.target.value))}
                min="0"
                step="1000"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Effective From</Label>
              <Input
                type="date"
                value={formData.effectiveFrom}
                onChange={(e) => handleInputChange('effectiveFrom', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Effective To</Label>
              <Input
                type="date"
                value={formData.effectiveTo}
                onChange={(e) => handleInputChange('effectiveTo', e.target.value)}
              />
            </FormGroup>
          </div>

          <FormGroup style={{ marginTop: '1.5rem' }}>
            <Label>Description *</Label>
            <textarea
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: 'var(--font-size-base)',
                resize: 'vertical',
                minHeight: '80px'
              }}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of this fee type..."
              required
            />
          </FormGroup>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '1.5rem 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
              />
              Active
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: 'var(--font-size-sm)' }}>
              <input
                type="checkbox"
                checked={formData.isAutoGenerated}
                onChange={(e) => handleInputChange('isAutoGenerated', e.target.checked)}
              />
              Auto Generate Monthly
            </label>
          </div>

          {formData.isAutoGenerated && (
            <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#374151' }}>Scheduling Configuration</h4>
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label>Day of Month (1-31)</Label>
                  <Input
                    type="number"
                    value={formData.scheduledDay}
                    onChange={(e) => handleInputChange('scheduledDay', Number(e.target.value))}
                    min="1"
                    max="31"
                  />
                </FormGroup>
                
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label>Hour (0-23)</Label>
                  <Input
                    type="number"
                    value={formData.scheduledHour}
                    onChange={(e) => handleInputChange('scheduledHour', Number(e.target.value))}
                    min="0"
                    max="23"
                  />
                </FormGroup>
                
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label>Minute (0-59)</Label>
                  <Input
                    type="number"
                    value={formData.scheduledMinute}
                    onChange={(e) => handleInputChange('scheduledMinute', Number(e.target.value))}
                    min="0"
                    max="59"
                  />
                </FormGroup>
              </div>
              <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
                Fees will be automatically generated on day {formData.scheduledDay} at {String(formData.scheduledHour).padStart(2, '0')}:{String(formData.scheduledMinute).padStart(2, '0')} each month
              </small>
            </div>
          )}

          <FormButtonGroup>
            <FormButton 
              type="button"
              onClick={onCancel}
              variant="secondary"
            >
              Cancel
            </FormButton>
            <FormButton 
              type="submit"
              disabled={loading}
              variant="success"
            >
              {loading ? 'Saving...' : (config ? 'Update Configuration' : 'Create Configuration')}
            </FormButton>
          </FormButtonGroup>
        </form>
      </ConfigFormContainer>
    );
  };

  return (
    <PageContainer ref={containerRef}>
      <HeaderSection ref={headerRef}>
        <StyledHeading as="h1">Monthly Fee Management</StyledHeading>
        <Description>Create and manage monthly recurring fees for the apartment complex</Description>
      </HeaderSection>

      <TabContainer>
        <Tab 
          active={activeTab === 'generation'} 
          onClick={() => setActiveTab('generation')}
        >
          Generate Fees
        </Tab>
        <Tab 
          active={activeTab === 'fees'} 
          onClick={() => setActiveTab('fees')}
        >
          Fee List
        </Tab>
        <Tab 
          active={activeTab === 'payments'} 
          onClick={() => setActiveTab('payments')}
        >
          Payment History
        </Tab>
        <Tab 
          active={activeTab === 'parking-config'} 
          onClick={() => setActiveTab('parking-config')}
        >
          Parking Configuration
        </Tab>
        <Tab 
          active={activeTab === 'floor-area-config'} 
          onClick={() => setActiveTab('floor-area-config')}
        >
          Floor Area Configuration
        </Tab>
      </TabContainer>

      <TabContent ref={tabContentRef}>
        {activeTab === 'generation' && (
          <div>
            <SectionTitle>Generate Monthly Fees</SectionTitle>
            
            <FormGroup>
              <Label>Select Fee to Generate</Label>
              <Select 
                value={selectedFloorAreaConfig ? `floor-area-${selectedFloorAreaConfig}` : feeType} 
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'VEHICLE_PARKING') {
                    setFeeType('VEHICLE_PARKING');
                    setSelectedFloorAreaConfig(null);
                  } else if (value.startsWith('floor-area-')) {
                    const configId = parseInt(value.replace('floor-area-', ''));
                    const config = floorAreaConfigs && Array.isArray(floorAreaConfigs) 
                      ? floorAreaConfigs.find(c => c.id === configId) 
                      : null;
                    if (config) {
                      setFeeType(config.feeTypeEnum);
                      setSelectedFloorAreaConfig(configId);
                    }
                  }
                }}
              >
                <option value="VEHICLE_PARKING">Vehicle Parking Fee</option>
                <optgroup label="Floor Area Fees">
                  {floorAreaConfigs && Array.isArray(floorAreaConfigs) && floorAreaConfigs.map((config) => (
                    <option key={config.id} value={`floor-area-${config.id}`}>
                      {config.feeName} - {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(config.unitPricePerSqm)}/m²
                      {config.isAutoGenerated ? ' (Auto)' : ' (Manual)'}
                    </option>
                  ))}
                </optgroup>
              </Select>
              {selectedFloorAreaConfig && (
                <small style={{ color: '#6b7280', marginTop: '0.5rem', display: 'block' }}>
                  {(() => {
                    const config = floorAreaConfigs && Array.isArray(floorAreaConfigs) 
                      ? floorAreaConfigs.find(c => c.id === selectedFloorAreaConfig) 
                      : null;
                    return config ? (
                      <>
                        📝 {config.description}<br/>
                        🏷️ Type: {floorAreaFeeConfigApi.getFeeTypeDisplayName(config.feeTypeEnum)}<br/>
                        ⏰ Schedule: {floorAreaFeeConfigApi.formatScheduleDisplay(config)}
                      </>
                    ) : '';
                  })()}
                </small>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Billing Month</Label>
              <Input
                type="month"
                value={billingMonth}
                onChange={(e) => setBillingMonth(e.target.value)}
              />
            </FormGroup>

            <Button 
              onClick={handleGenerateFees} 
              disabled={loading || !billingMonth}
            >
              {loading ? 'Generating...' : 'Generate Fees for All Apartments'}
            </Button>

            {feeType !== 'VEHICLE_PARKING' && (
              <InfoCard style={{ marginTop: '1.5rem' }}>
                <h4>🔒 Generation Rules:</h4>
                <ul>
                  <li>Each floor area fee type can only be generated <strong>once per month</strong></li>
                  <li>System will check for existing fees before generating</li>
                  <li>Auto-generated fees will be created automatically by scheduler</li>
                  <li>Manual fees can be generated using this interface</li>
                </ul>
              </InfoCard>
            )}
          </div>
        )}

        {activeTab === 'fees' && (
          <div>
            <ActionButtonGroup>
              <FormGroup style={{ flex: 1, marginBottom: 0 }}>
                <Label>View Month</Label>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </FormGroup>
              <Button onClick={handleLoadFees} disabled={loading || !selectedMonth}>
                {loading ? 'Loading...' : 'Load Fee List'}
              </Button>
            </ActionButtonGroup>

            {fees.length > 0 && (
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Fee Name</Th>
                      <Th>Fee Type</Th>
                      <Th>Apartment</Th>
                      <Th>Amount</Th>
                      <Th>Unit Price</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee) => (
                      <tr key={fee.id}>
                        <Td>{fee.name}</Td>
                        <Td>{fee.feeTypeEnum}</Td>
                        <Td>{fee.apartmentId || 'Common'}</Td>
                        <Td>{formatCurrency(fee.amount)}</Td>
                        <Td>
                          {fee.unitPrice ? 
                            `${formatCurrency(fee.unitPrice)}/${FeeHelpers.getUnitDescription(fee)}` : 
                            'N/A'
                          }
                        </Td>
                        <Td>
                          <StatusBadge status={fee.isActive ? 'active' : 'inactive'}>
                            {fee.isActive ? 'Active' : 'Deactivated'}
                          </StatusBadge>
                        </Td>
                        <Td>
                          {fee.isActive && (
                            <ActionButton 
                              onClick={() => handleDeactivateFee(fee.id)}
                              variant="danger"
                            >
                              Deactivate
                            </ActionButton>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            )}

            {fees.length === 0 && selectedMonth && !loading && (
              <EmptyState>
                No fees found for {selectedMonth}
              </EmptyState>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <ActionButtonGroup>
              <Button onClick={handleLoadPayments} disabled={loading}>
                {loading ? 'Loading...' : 'Load Payment History'}
              </Button>
            </ActionButtonGroup>

            {payments.length > 0 && (
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <Th>Payment Date</Th>
                      <Th>Payer Name</Th>
                      <Th>Fee Name</Th>
                      <Th>Apartment</Th>
                      <Th>Amount</Th>
                      <Th>Notes</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <Td>{formatDate(payment.paymentDate)}</Td>
                        <Td>{payment.payerName || 'N/A'}</Td>
                        <Td>{payment.feeName || 'N/A'}</Td>
                        <Td>{payment.apartmentNumber || 'N/A'}</Td>
                        <Td>{formatCurrency(payment.amount)}</Td>
                        <Td>{payment.notes || 'N/A'}</Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            )}

            {payments.length === 0 && !loading && (
              <EmptyState>
                No payment history available
              </EmptyState>
            )}
          </div>
        )}

        {activeTab === 'parking-config' && (
          <div>
            <SectionTitle>Parking Price Configuration</SectionTitle>
            <Description style={{ marginBottom: '2rem' }}>
              Set parking prices for each vehicle type. These prices will be used when generating automatic monthly parking fees.
            </Description>
            
            <ActionButtonGroup>
              <Button onClick={handleLoadParkingPrices} disabled={loading}>
                {loading ? 'Loading...' : 'Load Current Prices'}
              </Button>
            </ActionButtonGroup>

            <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '600px' }}>
              <FormGroup>
                <Label>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🏍️ Motorbike (VND/month)
                  </span>
                </Label>
                <Input
                  type="number"
                  value={parkingPrices[VehicleEnum.Motorbike]}
                  onChange={(e) => setParkingPrices(prev => ({
                    ...prev,
                    [VehicleEnum.Motorbike]: Number(e.target.value)
                  }))}
                  min="0"
                  step="1000"
                />
                <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                  Current: {formatCurrency(parkingPrices[VehicleEnum.Motorbike])}
                </small>
              </FormGroup>

              <FormGroup>
                <Label>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🚗 Car (VND/month)
                  </span>
                </Label>
                <Input
                  type="number"
                  value={parkingPrices[VehicleEnum.Car]}
                  onChange={(e) => setParkingPrices(prev => ({
                    ...prev,
                    [VehicleEnum.Car]: Number(e.target.value)
                  }))}
                  min="0"
                  step="1000"
                />
                <small style={{ color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                  Current: {formatCurrency(parkingPrices[VehicleEnum.Car])}
                </small>
              </FormGroup>
            </div>

            <InfoCard>
              <h4>💡 Important Notes:</h4>
              <ul>
                <li>Parking prices will be applied for automatic monthly fee generation</li>
                <li>Scheduler runs at 1:00 AM on the first day of each month</li>
                <li>Fees are calculated based on the number of registered vehicles per apartment</li>
                <li>Price changes only affect fees generated after this time</li>
              </ul>
            </InfoCard>

            <FormButton 
              onClick={handleSaveParkingPrices} 
              disabled={loading}
              variant="success"
              style={{ marginTop: '2rem' }}
            >
              {loading ? 'Saving...' : 'Save Parking Price Configuration'}
            </FormButton>
          </div>
        )}

        {activeTab === 'floor-area-config' && (
          <div>
            <SectionTitle>Floor Area Fee Configuration</SectionTitle>
            <Description style={{ marginBottom: '2rem' }}>
              Manage floor area fee configurations for automatic and manual fee generation.
            </Description>
            
            <ActionButtonGroup>
              <Button onClick={handleLoadFloorAreaConfigs} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh Configurations'}
              </Button>
              <FormButton 
                onClick={() => setShowConfigForm(true)}
                variant="success"
              >
                Add New Configuration
              </FormButton>
            </ActionButtonGroup>

            {/* Configuration Form */}
            {(showConfigForm || editingConfig) && (
              <FloorAreaConfigForm 
                config={editingConfig}
                onSave={editingConfig ? 
                  (config) => handleUpdateFloorAreaConfig(editingConfig.id!, config) :
                  handleCreateFloorAreaConfig
                }
                onCancel={() => {
                  setShowConfigForm(false);
                  setEditingConfig(null);
                }}
                loading={loading}
              />
            )}

            {/* Configurations Table */}
            {(() => {
              console.log('🔍 Rendering check:');
              console.log('   floorAreaConfigs:', floorAreaConfigs);
              console.log('   is truthy:', !!floorAreaConfigs);
              console.log('   is array:', Array.isArray(floorAreaConfigs));
              console.log('   length:', floorAreaConfigs?.length);
              console.log('   should show table:', !!(floorAreaConfigs && Array.isArray(floorAreaConfigs) && floorAreaConfigs.length > 0));
              
              return (floorAreaConfigs && Array.isArray(floorAreaConfigs) && floorAreaConfigs.length > 0) ? (
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <Th>Fee Name</Th>
                        <Th>Type</Th>
                        <Th>Unit Price</Th>
                        <Th>Auto Generate</Th>
                        <Th>Schedule</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {floorAreaConfigs.map((config) => (
                        <tr key={config.id}>
                          <Td>
                            <div>
                              <strong>{config.feeName}</strong>
                              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                {config.description}
                              </div>
                            </div>
                          </Td>
                          <Td>{floorAreaFeeConfigApi.getFeeTypeDisplayName(config.feeTypeEnum)}</Td>
                          <Td>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(config.unitPricePerSqm)}/m²
                          </Td>
                          <Td>
                            <StatusBadge status={config.isAutoGenerated ? 'active' : 'inactive'}>
                              {config.isAutoGenerated ? 'Yes' : 'No'}
                            </StatusBadge>
                          </Td>
                          <Td>
                            <div style={{ color: '#6b7280', fontSize: 'var(--font-size-sm)' }}>
                              {floorAreaFeeConfigApi.formatScheduleDisplay(config)}
                            </div>
                          </Td>
                          <Td>
                            <StatusBadge status={config.isActive ? 'active' : 'inactive'}>
                              {config.isActive ? 'Active' : 'Inactive'}
                            </StatusBadge>
                          </Td>
                          <Td>
                            <ActionButtons>
                              <ActionButton 
                                onClick={() => setEditingConfig(config)}
                                variant="warning"
                              >
                                Edit
                              </ActionButton>
                              {config.isActive && (
                                <ActionButton 
                                  onClick={() => handleDeactivateFloorAreaConfig(config.id!)}
                                  variant="danger"
                                >
                                  Deactivate
                                </ActionButton>
                              )}
                            </ActionButtons>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              ) : null;
            })()}

            {(!floorAreaConfigs || !Array.isArray(floorAreaConfigs) || floorAreaConfigs.length === 0) && !loading && (
              <EmptyState>
                No floor area fee configurations found. Create your first configuration to get started.
              </EmptyState>
            )}

            <InfoCard style={{ marginTop: '2rem' }}>
              <h4>💡 Configuration Guide:</h4>
              <ul>
                <li><strong>Auto Generate:</strong> Fees will be created automatically by scheduler</li>
                <li><strong>Manual Generate:</strong> Use "Generate Fees" tab to create fees on demand</li>
                <li><strong>Schedule:</strong> Set specific day/time for automatic generation</li>
                <li><strong>Effective Dates:</strong> Control when configuration is valid</li>
                <li><strong>Fee Types:</strong> Different categories help organize and track fees</li>
              </ul>
            </InfoCard>
          </div>
        )}
      </TabContent>
    </PageContainer>
  );
};

export default MonthlyFeeManagement; 