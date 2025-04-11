
export interface GardenActivity {
  id: string;
  title: string;
  description: string | null;
  date: string;
  activity_time?: string | null;
  completed?: boolean | null;
  category_id?: string | null;
}

export type ViewType = "day" | "week" | "month" | "year";
