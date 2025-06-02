export enum VehicleEnum {
  Bicycle = 'Bicycle',
  Motorbike = 'Motorbike',
  Car = 'Car',
}

export interface Vehicle {
  id: string;
  category: VehicleEnum;
  registerDate: string;
  apartment?: {
    addressNumber: number;
    status: string;
    area: number;
  };
}

export interface VehicleCountSummary {
  apartmentId: number;
  bicycleCount: number;
  motorbikeCount: number;
  carCount: number;
  totalCount: number;
}

export interface VehicleResponse {
  id: string;
  category: VehicleEnum;
  registerDate: string;
  apartment?: {
    addressNumber: number;
    status: string;
    area: number;
  };
} 