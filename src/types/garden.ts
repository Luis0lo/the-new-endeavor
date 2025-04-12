
export type ViewType = "day" | "week" | "month" | "year";

export interface GardenActivity {
  id: string;
  title: string;
  description?: string;
  date: string;
  activity_time?: string;
  completed?: boolean;
  category_id?: string;
}
