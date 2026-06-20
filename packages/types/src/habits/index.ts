export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  streakCount: number;
}
