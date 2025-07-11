
export type ViewType = "day" | "week" | "month" | "year";

export interface GardenActivity {
  id: string;
  title: string;
  description?: string;
  date: string;
  activity_time?: string;
  completed?: boolean;
  category_id?: string;
  priority?: "high" | "normal" | "low";
  status?: "pending" | "in_progress" | "done";
  outcome_rating?: number;
  outcome_log?: string;
  track?: boolean;
  action?: "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other";
  parent_activity_id?: string;
  has_children?: boolean;
  activity_order?: number;
  depth_level?: number;
  children?: GardenActivity[];
}
