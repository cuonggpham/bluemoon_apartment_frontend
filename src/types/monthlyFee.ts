// Monthly Fee Types với logic mới: Fee records cụ thể cho từng apartment

export type FeeTypeEnum = 
  // Main fee categories
  | 'MANDATORY'        // Phí bắt buộc chung
  | 'VOLUNTARY'        // Phí tự nguyện
  | 'VEHICLE_PARKING'  // Phí gửi xe (tính theo số lượng xe)
  | 'FLOOR_AREA';      // Phí theo diện tích sàn (tính theo m²)

// Deprecated - use FeeTypeEnum instead
export type MonthlyFeeTypeEnum = 'VEHICLE_PARKING' | 'FLOOR_AREA';

export enum VehicleEnum {
  Motorbike = 'Motorbike', 
  Car = 'Car',
}

export enum PaymentStatus {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  OVERDUE = 'OVERDUE',
}

export interface Fee {
  id: number;
  name: string; // e.g., "Phí gửi xe tháng 2024-01"
  description?: string; // Chi tiết tính toán
  feeTypeEnum: FeeTypeEnum; // Unified fee type
  amount: number; // Amount đã được tính toán cụ thể cho apartment này
  unitPrice?: number; // Unit price for reference (VNĐ per unit - xe, m², etc.)
  apartmentId?: number; // Gắn với apartment cụ thể (for mandatory fees)
  
  // Phí định kỳ
  isRecurring: boolean;
  isActive: boolean; // false khi đã thanh toán
  effectiveFrom?: string;
  effectiveTo?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

// Helper functions for Fee (to match backend logic)
export const FeeHelpers = {
  /**
   * Check if fee is mandatory (requires specific apartment)
   */
  isMandatory(fee: Fee): boolean {
    const mandatoryTypes: FeeTypeEnum[] = [
      'MANDATORY',
      'VEHICLE_PARKING',
      'FLOOR_AREA'
    ];
    return mandatoryTypes.includes(fee.feeTypeEnum);
  },

  /**
   * Check if fee is voluntary (can be applied to any apartment)
   */
  isVoluntary(fee: Fee): boolean {
    return fee.feeTypeEnum === 'VOLUNTARY';
  },

  /**
   * Check if fee is calculated per unit (has unitPrice)
   */
  isPerUnitFee(fee: Fee): boolean {
    const perUnitTypes: FeeTypeEnum[] = [
      'VEHICLE_PARKING',
      'FLOOR_AREA'
    ];
    return perUnitTypes.includes(fee.feeTypeEnum);
  },

  /**
   * Check if fee is monthly recurring
   */
  isMonthlyFee(fee: Fee): boolean {
    const monthlyTypes: FeeTypeEnum[] = [
      'VEHICLE_PARKING',
      'FLOOR_AREA'
    ];
    return monthlyTypes.includes(fee.feeTypeEnum);
  },

  /**
   * Check if this is a recurring instance (has apartmentId and isRecurring)
   */
  isRecurringInstance(fee: Fee): boolean {
    return fee.isRecurring && fee.apartmentId != null;
  },

  /**
   * Get unit description for fee type
   */
  getUnitDescription(fee: Fee): string {
    switch (fee.feeTypeEnum) {
      case 'VEHICLE_PARKING': return 'xe';
      case 'FLOOR_AREA': return 'm²';
      default: return 'đơn vị';
    }
  }
};

export interface PaymentRecord {
  id: number;
  payerId: number;
  payerName?: string;
  feeId: number;
  feeName?: string;
  apartmentId: number;
  apartmentNumber?: string;
  amount: number; // Amount từ Fee (đã tính sẵn)
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// ============ REQUEST/RESPONSE TYPES ============

export interface MonthlyFeeGenerationRequest {
  feeType: FeeTypeEnum; // Use unified enum
  billingMonth: string; // Format: YYYY-MM
  unitPricePerSqm?: number; // Required for FLOOR_AREA
  customFeeName?: string; // Optional custom name for floor area fees
}

export interface MonthlyFeePaymentRequest {
  payerId: number;
  feeId: number; // Fee đã có amount tính sẵn
}

export interface MonthlyFeeSummary {
  billingMonth: string;
  totalFees: number;
  totalAmount: number;
  vehicleParkingFees: number;
  floorAreaFees: number;
  activeFees: number;
  paidFees: number;
}

// ============ UTILITY TYPES ============

export interface Apartment {
  id: number;
  addressNumber: number;
  area: number;
  // other apartment fields...
}

export interface Resident {
  id: number;
  name: string;
  // other resident fields...
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaymentStatusCheck {
  feeId: number;
  apartmentId: number;
  year: number;
  month: number;
  isPaid: boolean;
} 