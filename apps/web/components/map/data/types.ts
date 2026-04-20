export type VolunteerPin = {
  id: string; name: string; lat: number; lng: number;
  status: "available" | "busy"; skills: string[]; initials: string;
  assignedTo?: string;
  user_id?: string;
  email?: string;
  completedTasks?: number;
  performanceScore?: number;
};

export type OperationPin = {
  id: string; title: string; lat: number; lng: number;
  status: "critical" | "active" | "completed";
  assigned: number; needed: number; description: string;
};

export type ResourcePin = {
  id: string; title: string; lat: number; lng: number;
  type: "medical" | "food" | "equipment"; stock: number;
};
