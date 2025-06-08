import { Fee, PaymentRecord, FeeTypeEnum, FeeHelpers, VehicleEnum } from '../types/monthlyFee';
import api from './axios';

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

    const response = await api.post(`/fees/monthly/generate?${params}`);
    return response.data.data; // Extract the data field from axios response
  },

  // ============ FEE QUERY API ============
  async getUnpaidFeesByApartment(apartmentId: number) {
    const response = await api.get(`/fees/monthly/unpaid/apartment/${apartmentId}`);
    return response.data.data; // Extract the data field
  },

  async getFeesByMonth(billingMonth: string) {
    const response = await api.get(`/fees/monthly/month/${billingMonth}`);
    return response.data.data; // Extract the data field
  },

  async deactivateFee(feeId: number) {
    const response = await api.put(`/fees/${feeId}/deactivate`);
    return response.data.data; // Extract the data field
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

    const response = await api.post(`/payment-records/recurring-fees?${params}`);
    return response.data.data; // Extract the data field from axios response
  },

  async getPayments() {
    const response = await api.get('/payment-records/recurring-fees');
    return response.data.data; // Extract the data field
  },

  async getPaymentsByApartment(apartmentId: number) {
    const response = await api.get(`/payment-records/recurring-fees/apartment/${apartmentId}`);
    return response.data.data; // Extract the data field
  },

  // ============ VEHICLE PRICE CONFIGURATION API ============
  
  /**
   * Get all active vehicle price settings
   */
  async getAllVehiclePriceSettings() {
    const response = await api.get('/vehicle-price-settings');
    return response.data.data; // Extract the data field
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
    const response = await api.get(`/vehicle-price-settings/price/${vehicleType}`);
    return response.data.data; // Extract the data field
  },

  /**
   * Update parking price for specific vehicle type
   */
  async updateParkingPriceByVehicleType(vehicleType: VehicleEnum, price: number) {
    const params = new URLSearchParams({
      vehicleType: vehicleType,
      pricePerVehicle: price.toString(),
    });

    const response = await api.post(`/vehicle-price-settings?${params}`);
    return response.data.data; // Extract the data field
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