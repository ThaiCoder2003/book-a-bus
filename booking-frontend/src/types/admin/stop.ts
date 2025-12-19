export type StopType = "start" | "stop" | "end";

export interface Stop {
  id: string;
  order?: number;
  name: string;
  address: string;
  arrivalTime: string;
  departureTime: string;
  type: StopType;
}
