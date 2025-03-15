export type TaskCategory = "Work" | "Personal" | "Health" | "Learning";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  timestamp: string;
  color: string;
}

export const CATEGORY_COLORS = {
  Work: "#FF5757",
  Personal: "#FFB946",
  Health: "#4CAF50",
  Learning: "#2196F3",
};

export const CATEGORY_ICONS = {
  Work: "briefcase",
  Personal: "user",
  Health: "heart",
  Learning: "book-open",
};
