import Constants from "expo-constants";
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
  globalStreak: number;
  activityHistory: number[];
  isWorkoutDoneToday?: boolean;
}

export interface WorkoutDayDetail extends DashboardWorkoutDay {}

export interface StartSessionInput {
  workoutDayId: string;
  startedAt: string;
}

export interface LogSetInput {
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  repsCompleted?: number;
  weightKg?: number;
}

export interface CompleteSessionInput {
  sessionId: string;
  completedAt: string;
  notes?: string;
}

export interface HabitSummary {
  id: string;
  userId: string;
  type: string;
  targetValue: string | null;
  unit: string | null;
  iconName?: string | null;
  colorHex?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  todayValue: number;
  completedToday: boolean;
  streak: number;
  bestStreak: number;
  completionRate: number;
}

export interface LogHabitInput {
  habitId: string;
  localDate: string;
  value?: number;
  completed?: boolean;
}

export interface CreateHabitInput {
  name: string;
  targetValue?: number;
  unit?: string;
  iconName?: string;
  colorHex?: string;
}

export interface UpdateHabitInput {
  name?: string;
  targetValue?: number;
  unit?: string;
  iconName?: string;
  colorHex?: string;
}

export interface SessionLog {
  id: string;
  startedAt: string;
  completedAt: string;
  workoutDay?: { name?: string | null } | null;
  exerciseLogs?: Array<{
    setNumber?: number | null;
    repsCompleted?: number | null;
    weightKg?: number | null;
    exercise?: { name?: string | null } | null;
  }> | null;
}

export function getApiUrl(): string {
  const configuredUrl = process.env.EXPO_PUBLIC_API_URL;

  if (configuredUrl) {
    return normalizeApiUrl(configuredUrl);
  }

  return Platform.OS === "android"
    ? "http://10.0.2.2:3001"
    : "http://localhost:3001";
}

function normalizeApiUrl(configuredUrl: string): string {
  if (Platform.OS === "web") {
    return configuredUrl;
  }

  try {
    const url = new URL(configuredUrl);

    if (!isLocalhost(url.hostname)) {
      return configuredUrl;
    }

    const expoHost = getExpoDevServerHost();

    if (expoHost && !isLocalhost(expoHost)) {
      url.hostname = expoHost;
      return url.toString().replace(/\/$/, "");
    }

    if (Platform.OS === "android") {
      url.hostname = "10.0.2.2";
      return url.toString().replace(/\/$/, "");
    }
  } catch {
    return configuredUrl;
  }

  return configuredUrl;
}

function getExpoDevServerHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(":")[0];
  return host || null;
}

function isLocalhost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function createApiClient(getToken: GetToken) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getToken();

    if (!token) {
      throw new Error("You need to sign in again.");
    }

    const apiUrl = getApiUrl();
    let response: Response;

    try {
      response = await fetch(`${apiUrl}${path}`, {
        ...init,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...init.headers,
        },
      });
    } catch (error) {
      if (error instanceof TypeError && error.message === "Network request failed") {
        throw new Error("Please check your internet connection.");
      }
      throw new Error(`Unable to reach ARC at ${apiUrl}. Check that the API server is running and reachable from this device.`);
    }

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
      return request<CurrentUserProfile>("/api/v1/users/me", {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
    },
    getDashboard() {
      return request<DashboardData>("/api/v1/dashboard/me");
    },
    getWorkoutDay(dayId: string) {
      return request<WorkoutDayDetail>(`/api/v1/sessions/days/${dayId}`);
    },
    startSession(input: StartSessionInput) {
      return request<{ session: { id: string } }>("/api/v1/sessions/start", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    logSet(input: LogSetInput) {
      return request<{ log: unknown }>("/api/v1/sessions/log-set", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    completeSession(input: CompleteSessionInput) {
      return request<{ session: unknown }>("/api/v1/sessions/complete", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    getHabits(date: string) {
      return request<{ habits: HabitSummary[], logs: any[] }>(`/api/v1/habits?date=${date}`);
    },
    createHabit(input: CreateHabitInput) {
      return request<{ habit: HabitSummary }>("/api/v1/habits", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    deleteHabit(habitId: string) {
      return request<{ success: boolean }>(`/api/v1/habits/${habitId}`, {
        method: "DELETE",
      });
    },
    updateHabit(habitId: string, input: UpdateHabitInput) {
      return request<{ habit: HabitSummary }>(`/api/v1/habits/${habitId}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      });
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
    getSessions() {
      return request<SessionLog[]>('/api/v1/sessions');
    },
    submitOnboarding(input: OnboardingInput) {
      return request("/api/v1/onboarding", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
    getWeightLogs() {
      return request<{ logs: any[] }>("/api/v1/users/weight");
    },
    addWeightLog(weightKg: number) {
      return request<{ log: any }>("/api/v1/users/weight", {
        method: "POST",
        body: JSON.stringify({ weightKg }),
      });
    },
    regeneratePlan(input: { goal: string; workoutDaysPerWeek: number; environment: string; dietaryPreference?: string }) {
      return request<{ success: boolean }>("/api/v1/plans/regenerate", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  };
}
