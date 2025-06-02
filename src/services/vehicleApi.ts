import { Vehicle, VehicleResponse, VehicleCountSummary, VehicleEnum } from '../types/vehicle';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export const vehicleApi = {
  // ============ BASIC VEHICLE CRUD ============
  async getAllVehicles(page: number = 1, size: number = 10) {
    const response = await fetch(`${API_BASE_URL}/vehicles?page=${page}&size=${size}`);
    if (!response.ok) throw new Error('Failed to fetch vehicles');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async getVehiclesByApartment(apartmentId: number) {
    const response = await fetch(`${API_BASE_URL}/vehicles/${apartmentId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicles by apartment');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async createVehicle(vehicle: Vehicle) {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) throw new Error('Failed to create vehicle');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async updateVehicle(vehicleId: string, vehicle: Partial<Vehicle>) {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) throw new Error('Failed to update vehicle');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  async deleteVehicle(apartmentId: number, vehicle: Vehicle) {
    const response = await fetch(`${API_BASE_URL}/vehicles/${apartmentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (!response.ok) throw new Error('Failed to delete vehicle');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  // ============ VEHICLE COUNT APIs FOR FEE CALCULATION ============
  
  /**
   * Get vehicle count summary for an apartment (for fee calculation)
   */
  async getVehicleCountSummary(apartmentId: number): Promise<VehicleCountSummary> {
    const response = await fetch(`${API_BASE_URL}/vehicles/count/apartment/${apartmentId}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle count summary');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  /**
   * Get vehicle count for specific type and apartment
   */
  async getVehicleCountByType(apartmentId: number, vehicleType: VehicleEnum): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/vehicles/count/apartment/${apartmentId}/type/${vehicleType}`);
    if (!response.ok) throw new Error('Failed to fetch vehicle count by type');
    const apiResponse = await response.json();
    return apiResponse.data;
  },

  /**
   * Get vehicle counts for all types for an apartment (helper method)
   */
  async getVehicleCountsByAllTypes(apartmentId: number) {
    const summary = await this.getVehicleCountSummary(apartmentId);
    return {
      [VehicleEnum.Bicycle]: summary.bicycleCount,
      [VehicleEnum.Motorbike]: summary.motorbikeCount,
      [VehicleEnum.Car]: summary.carCount,
      total: summary.totalCount,
    };
  },
};

export default vehicleApi; 