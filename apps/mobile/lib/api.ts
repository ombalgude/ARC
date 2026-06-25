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

export function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  return Platform.OS === "android" ? "http://10.0.2.2:3001" : "http://localhost:3001";
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

    const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;

    if (!response.ok || !payload?.success) {
      throw new Error(payload?.error?.message ?? "Unable to reach ARC right now.");
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
    submitOnboarding(input: OnboardingInput) {
      return request("/api/v1/onboarding", {
        method: "POST",
        body: JSON.stringify(input),
      });
    },
  };
}
