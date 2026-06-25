import { Platform } from "react-native";
import type { ApiResponse } from "@arc/types";
import type { OnboardingInput } from "@arc/validations";

type GetToken = () => Promise<string | null>;

export interface CurrentUserProfile {
  user: {
    id: string;
    clerkId: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  profile: Record<string, unknown> | null;
  preferences: Record<string, unknown> | null;
  profileComplete: boolean;
}

export interface DashboardNutrition {
  id: string;
  userId: string;
  caloriesTarget: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  goal: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardWorkoutExercise {
  id: string;
  workoutDayId: string;
  exerciseId: string;
  exerciseName: string;
  sets: number | null;
  reps: string | null;
  restSeconds: number | null;
  orderIndex: number | null;
  notes: string | null;
}

export interface DashboardWorkoutDay {
  id: string;
  workoutPlanId: string;
  dayOfWeek: number | null;
  name: string | null;
  createdAt: string;
  exercises: DashboardWorkoutExercise[];
}

export interface DashboardWorkoutPlan {
  id: string;
  userId: string;
  name: string | null;
  splitType: string | null;
  generatedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  days: DashboardWorkoutDay[];
}

export interface DashboardData {
  nutrition: DashboardNutrition | null;
  workoutPlan: DashboardWorkoutPlan | null;
}

export interface WorkoutDayDetail extends DashboardWorkoutDay {}

export interface LogSessionInput {
  workoutDayId: string;
  startedAt: string;
  completedAt: string;
  exercises: Array<{
    exerciseId: string;
    completedSets: number;
    notes?: string;
  }>;
}

export interface HabitSummary {
  id: string;
  userId: string;
  type: "workout" | "water" | "sleep" | "steps" | "macros";
  targetValue: string | null;
  unit: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  todayValue: number;
  completedToday: boolean;
}

export interface LogHabitInput {
  habitId: string;
  value?: number;
  completed?: boolean;
}

export function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001";
}

export function createApiClient(getToken: GetToken) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getToken();

    if (!token) {
      throw new Error("You need to sign in again.");
    }

    const response = await fetch(`${getApiUrl()}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...init.headers,
      },
    });

    const payload = (await response
      .json()
      .catch(() => null)) as ApiResponse<T> | null;

    if (!response.ok || !payload?.success) {
      throw new Error(
        payload?.error?.message ?? "Unable to reach ARC right now.",
      );
    }

    if (!payload.data) {
      throw new Error("ARC returned an empty response.");
    }

    return payload.data;
  }

  return {
    getMe() {
      return request<CurrentUserProfile>("/api/v1/users/me");
    },
    getDashboard() {
      return request<DashboardData>("/api/v1/dashboard/me");
    },
    getWorkoutDay(dayId: string) {
      return request<WorkoutDayDetail>(`/api/v1/sessions/days/${dayId}`);
    },
    logSession(input: LogSessionInput) {
      return request<{ session: unknown; exerciseLogCount: number }>(
        "/api/v1/sessions",
        {
          method: "POST",
          body: JSON.stringify(input),
        },
      );
    },
    getHabits() {
      return request<{ habits: HabitSummary[] }>("/api/v1/habits");
    },
    logHabit(input: LogHabitInput) {
      return request<{ log: unknown }>("/api/v1/habits/log", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    savePushToken(token: string) {
      return request<{ saved: true }>("/api/v1/users/push-token", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
    },
    submitOnboarding(input: OnboardingInput) {
      return request("/api/v1/onboarding", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  };
}
