export interface Stall {
  id: number;
  name: string;
  size: "SMALL" | "MEDIUM" | "LARGE";
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  dimensions: string;
  location: string;
  positionX: number;
  positionY: number;
}


export interface StallsResponse {
  success: boolean;
  stalls: Stall[];
}

export interface StallResponse {
  success: boolean;
  stall: Stall;
}
