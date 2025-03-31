export interface HeatlthStatus {
  status: "up" | "down";
  message: string;
  timestamp: string;
  details?: {
    database?: {
      status: "up" | "down";
      message: string;
      responseTime?: number;
    };
  };
}
