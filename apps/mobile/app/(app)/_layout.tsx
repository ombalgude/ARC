import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { createApiClient } from "../../lib/api";
import { registerForPushNotificationsAsync } from "../../lib/notifications";

export default function AppLayout(): React.JSX.Element {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile(): Promise<void> {
      if (!isLoaded || !isSignedIn) {
        return;
      }

      setErrorMessage(null);

      try {
        const result = await api.getMe();

        if (isMounted) {
          setProfileComplete(result.profileComplete);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load your profile.");
          setProfileComplete(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [api, isLoaded, isSignedIn]);

  useEffect(() => {
    let isMounted = true;

    async function registerPushToken(): Promise<void> {
      if (!isLoaded || !isSignedIn) {
        return;
      }

      const token = await registerForPushNotificationsAsync();

      if (!isMounted || !token) {
        return;
      }

      try {
        await api.savePushToken(token);
      } catch {
        // Push token registration should not block the signed-in app shell.
      }
    }

    void registerPushToken();

    return () => {
      isMounted = false;
    };
  }, [api, isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#f2c46d" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (profileComplete === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#f2c46d" />
        <Text style={styles.loadingText}>Preparing your ARC profile</Text>
      </View>
    );
  }

  if (!profileComplete && pathname !== "/onboarding") {
    return <Redirect href="/onboarding" />;
  }

  if (profileComplete && pathname === "/onboarding") {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111318",
          borderTopColor: "#1d212b",
        },
        tabBarActiveTintColor: "#f2c46d",
        tabBarInactiveTintColor: "#aeb4bf",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workout/[dayId]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111318",
  },
  loadingText: {
    color: "#aeb4bf",
    fontSize: 14,
    marginTop: 14,
  },
});
