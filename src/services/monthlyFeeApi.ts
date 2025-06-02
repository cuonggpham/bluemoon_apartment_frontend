import { Fee, PaymentRecord, FeeTypeEnum, FeeHelpers, VehicleEnum } from '../types/monthlyFee';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// Monthly Fee API với logic mới: Fee records cụ thể cho từng apartment
export const monthlyFeeApi = {
  // ============ FEE GENERATION API ============
  async generateMonthlyFees(
    feeType: FeeTypeEnum,
    billingMonth: string, // Format: YYYY-MM
    unitPricePerSqm?: number | null, // Required for FLOOR_AREA
    customFeeName?: string | null // Optional custom name for floor area fees
  ) {
    const params = new URLSearchParams({
      feeType: feeType,
      billingMonth: billingMonth,
    });
    
    if (unitPricePerSqm !== undefined && unitPricePerSqm !== null) {
      params.append('unitPricePerSqm', unitPricePerSqm.toString());
    }

    // Add custom fee name if provided
    if (customFeeName) {
      params.append('customFeeName', customFeeName);
    }

    const response = await fetch(`${API_BASE_URL}/fees/monthly/generate?${params}`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Failed to generate monthly fees');
    const apiResponse = await response.json(); // Returns: { code, message, data: Fee[] }
    return apiResponse.data; // Extract the data field
  },

  // ============ FEE QUERY API ============
  async getUnpaidFeesByApartment(apartmentId: number) {
    const response = await fetch(`${API_BASE_URL}/fees/monthly/unpaid/apartment/${apartmentId}`);
    if (!response.ok) throw new Error('Failed to fetch unpaid fees');
    const apiResponse = await response.json(); // Returns: { code, message, data: Fee[] }
    return apiResponse.data; // Extract the data field
  },

  async getFeesByMonth(billingMonth: string) {
    const response = await fetch(`${API_BASE_URL}/fees/monthly/month/${billingMonth}`);
    if (!response.ok) throw new Error('Failed to fetch fees by month');
    const apiResponse = await response.json(); // Returns: { code, message, data: Fee[] }
    return apiResponse.data; // Extract the data field
  },

  async deactivateFee(feeId: number) {
    const response = await fetch(`${API_BASE_URL}/fees/${feeId}/deactivate`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to deactivate fee');
    const apiResponse = await response.json();
    return apiResponse.data; // Extract the data field
  },

  // ============ PAYMENT API ============
  async createPayment(data: {
    payerId: number;
    feeId: number;
  }) {
    const params = new URLSearchParams({
      payerId: data.payerId.toString(),
      feeId: data.feeId.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/payment-records/recurring-fees?${params}`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error('Failed to create recurring fee payment');
    const apiResponse = await response.json(); // Returns: { code, message, data: PaymentRecord }
    return apiResponse.data; // Extract the data field
  },

  async getPayments() {
    const response = await fetch(`${API_BASE_URL}/payment-records/recurring-fees`);
    if (!response.ok) throw new Error('Failed to fetch recurring fee payments');
    const apiResponse = await response.json(); // Returns: { code, message, data: PaymentRecord[] }
    return apiResponse.data; // Extract the data field
  },

  async getPaymentsByApartment(apartmentId: number) {
    const response = await fetch(`${API_BASE_URL}/payment-records/recurring-fees/apartment/${apartmentId}`);
    if (!response.ok) throw new Error('Failed to fetch recurring fee payments by apartment');
    const apiResponse = await response.json(); // Returns: { code, message, data: PaymentRecord[] }
    return apiResponse.data; // Extract the data field
  },

  // ============ VEHICLE PRICE CONFIGURATION API ============
  
  /**
   * Get all active vehicle price settings
   */
  async getAllVehiclePriceSettings() {
    const response = await fetch(`${API_BASE_URL}/vehicle-price-settings`);
    if (!response.ok) throw new Error('Failed to fetch vehicle price settings');
    const apiResponse = await response.json(); // Returns: { code, message, data: VehiclePriceSetting[] }
    return apiResponse.data; // Extract the data field
  },

  /**
   * Get current parking prices for all vehicle types
   */
  async getParkingPrices(): Promise<Record<VehicleEnum, number>> {
    const settings = await this.getAllVehiclePriceSettings();
    
    // Convert VehiclePriceSetting[] to Record<VehicleEnum, number>
    const prices: Record<VehicleEnum, number> = {
      [VehicleEnum.Motorbike]: 50000, // Default values
      [VehicleEnum.Car]: 200000,
    };

    settings.forEach((setting: any) => {
      if (setting.vehicleType && setting.pricePerVehicle) {
        prices[setting.vehicleType as VehicleEnum] = setting.pricePerVehicle;
      }
    });

    return prices;
  },

  /**
   * Update parking prices for all vehicle types
   */
  async updateParkingPrices(prices: Record<VehicleEnum, number>) {
    const promises = Object.entries(prices).map(([vehicleType, price]) => {
      return this.updateParkingPriceByVehicleType(vehicleType as VehicleEnum, price);
    });

    await Promise.all(promises);
    return { message: 'All parking prices updated successfully' };
  },

  /**
   * Get parking price for specific vehicle type
   */
  async getParkingPriceByVehicleType(vehicleType: VehicleEnum): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/vehicle-price-settings/price/${vehicleType}`);
    if (!response.ok) throw new Error(`Failed to fetch parking price for ${vehicleType}`);
    const apiResponse = await response.json(); // Returns: { code, message, data: number }
    return apiResponse.data; // Extract the data field
  },

  /**
   * Update parking price for specific vehicle type
   */
  async updateParkingPriceByVehicleType(vehicleType: VehicleEnum, price: number) {
    const params = new URLSearchParams({
      vehicleType: vehicleType,
      pricePerVehicle: price.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/vehicle-price-settings?${params}`, {
      method: 'POST',
    });

    if (!response.ok) throw new Error(`Failed to update parking price for ${vehicleType}`);
    const apiResponse = await response.json();
    return apiResponse.data; // Extract the data field
  },

  // ============ UTILITY METHODS ============
  
  /**
   * Tạo phí cho tất cả loại xe (helper method)
   */
  async generateAllVehicleFees(billingMonth: string) {
    return this.generateMonthlyFees('VEHICLE_PARKING', billingMonth);
  },

  /**
   * Tạo phí diện tích sàn cho tất cả apartment
   */
  async generateFloorAreaFees(billingMonth: string, unitPricePerSqm: number, customFeeName?: string) {
    return this.generateMonthlyFees('FLOOR_AREA', billingMonth, unitPricePerSqm, customFeeName);
  },

  /**
   * Lấy tổng quan phí theo tháng
   */
  async getMonthlyFeeSummary(billingMonth: string) {
    const fees = await this.getFeesByMonth(billingMonth);
    
    const summary = {
      totalFees: fees.length,
      totalAmount: fees.reduce((sum: number, fee: Fee) => sum + fee.amount, 0),
      vehicleParkingFees: fees.filter((fee: Fee) => fee.feeTypeEnum === 'VEHICLE_PARKING').length,
      floorAreaFees: fees.filter((fee: Fee) => fee.feeTypeEnum === 'FLOOR_AREA').length,
      activeFees: fees.filter((fee: Fee) => fee.isActive).length,
    };
    
    return summary;
  },
  
  /**
   * Helper để kiểm tra loại phí - use FeeHelpers instead
   */
  isMandatoryFee(fee: Fee): boolean {
    return FeeHelpers.isMandatory(fee);
  },
  
  /**
   * Helper để lấy mô tả đơn vị - use FeeHelpers instead
   */
  getUnitDescription(fee: Fee): string {
    return FeeHelpers.getUnitDescription(fee);
  },

  // Add method to get fees by month (alias for getFeesByMonth)
  async getMonthlyFeesByMonth(billingMonth: string) {
    return this.getFeesByMonth(billingMonth);
  },
};

export default monthlyFeeApi; 