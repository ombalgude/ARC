import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Tabs, usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { createApiClient } from '../../lib/api';
import { registerForPushNotificationsAsync } from '../../lib/notifications';
import { Home, Dumbbell, CheckCircle2, Apple, User } from 'lucide-react-native';

// ARC design tokens
import { useAppTheme } from '../../lib/themeStore';

function TabIcon({ Icon, focused, C }: { Icon: any; focused: boolean; C: any }) {
  return (
    <View style={[tabIconStyles.container, focused && tabIconStyles.focused]}>
      <Icon size={22} color={focused ? C.brand : C.textTertiary} strokeWidth={focused ? 2.5 : 2} />
    </View>
  );
}

const tabIconStyles = StyleSheet.create({
  container: {
    width: 44,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  focused: {
    backgroundColor: 'rgba(143, 111, 255, 0.15)',
  },
});

export default function AppLayout(): React.JSX.Element {
  const C = useAppTheme();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile(): Promise<void> {
      if (!isLoaded || !isSignedIn) return;
      setErrorMessage(null);

      try {
        const result = await api.getMe();
        if (isMounted) setProfileComplete(result.profileComplete);
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load your profile.');
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
      if (!isLoaded || !isSignedIn) return;
      const token = await registerForPushNotificationsAsync();
      if (!isMounted || !token) return;

      try {
        await api.savePushToken(token);
      } catch {
        // Push token registration should not block the signed-in app shell
      }
    }

    void registerPushToken();
    return () => {
      isMounted = false;
    };
  }, [api, isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <View style={[styles.loading, { backgroundColor: C.background }]}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/welcome" as any} />;
  }

  if (profileComplete === null) {
    return (
      <View style={[styles.loading, { backgroundColor: C.background }]}>
        <View style={styles.loadingCard}>
          <ActivityIndicator color={C.brand} size="large" />
          <Text style={[styles.loadingBrand, { color: C.foreground }]}>ARC</Text>
          <Text style={[styles.loadingText, { color: C.textSecondary }]}>Preparing your profile...</Text>
          {errorMessage ? <Text style={styles.loadingError}>{errorMessage}</Text> : null}
        </View>
      </View>
    );
  }

  if (!profileComplete && pathname !== '/onboarding') {
    return <Redirect href="/onboarding" />;
  }

  if (profileComplete && pathname === '/onboarding') {
    return <Redirect href="/(app)/dashboard" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopColor: C.border,
          borderTopWidth: 1,
          paddingTop: 8,
          // Let React Navigation handle the bottom inset automatically, or we can use paddingBottom
        },
        tabBarActiveTintColor: C.brand,
        tabBarInactiveTintColor: C.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Dumbbell} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
          tabBarIcon: ({ focused }) => <TabIcon Icon={CheckCircle2} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Apple} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} C={C} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="chat"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="workout/[dayId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="workout/active"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="workout/summary"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="habits/history"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="nutrition/targets"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="nutrition/guidance"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile/[slug]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile/my-goals"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile/subscription"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile/weight-tracking"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="profile/settings"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingCard: {
    alignItems: 'center',
    gap: 12,
  },
  loadingBrand: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 6,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingError: {
    fontSize: 12,
    color: '#FF6B6B',
    textAlign: 'center',
    maxWidth: 240,
    marginTop: 4,
  },
});
