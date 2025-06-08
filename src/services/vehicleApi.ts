import { Vehicle, VehicleResponse, VehicleCountSummary, VehicleEnum } from '../types/vehicle';
import api from './axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const vehicleApi = {
  // ============ BASIC VEHICLE CRUD ============
  async getAllVehicles(page: number = 1, size: number = 10) {
    const response = await api.get(`/vehicles?page=${page}&size=${size}`);
    return response.data.data;
  },

  async getVehiclesByApartment(apartmentId: number) {
    const response = await api.get(`/vehicles/${apartmentId}`);
    return response.data.data;
  },

  async createVehicle(vehicle: Vehicle) {
    const response = await api.post('/vehicles', vehicle);
    return response.data.data;
  },

  async updateVehicle(vehicleId: string, vehicle: Partial<Vehicle>) {
    const response = await api.put(`/vehicles/${vehicleId}`, vehicle);
    return response.data.data;
  },

  async deleteVehicle(apartmentId: number, vehicle: Vehicle) {
    const response = await api.delete(`/vehicles/${apartmentId}`, { data: vehicle });
    return response.data.data;
  },

  // ============ VEHICLE COUNT APIs FOR FEE CALCULATION ============
  
  /**
   * Get vehicle count summary for an apartment (for fee calculation)
   */
  async getVehicleCountSummary(apartmentId: number): Promise<VehicleCountSummary> {
    const response = await api.get(`/vehicles/count/apartment/${apartmentId}`);
    return response.data.data;
  },

  /**
   * Get vehicle count for specific type and apartment
   */
  async getVehicleCountByType(apartmentId: number, vehicleType: VehicleEnum): Promise<number> {
    const response = await api.get(`/vehicles/count/apartment/${apartmentId}/type/${vehicleType}`);
    return response.data.data;
  },

  /**
   * Get vehicle counts for all types for an apartment (helper method)
   */
  async getVehicleCountsByAllTypes(apartmentId: number) {
    const summary = await this.getVehicleCountSummary(apartmentId);
    return {
      [VehicleEnum.Motorbike]: summary.motorbikeCount,
      [VehicleEnum.Car]: summary.carCount,
      total: summary.totalCount,
    };
  },
};

export default vehicleApi; 