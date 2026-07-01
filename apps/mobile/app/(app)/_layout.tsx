import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Tabs, usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { createApiClient } from '../../lib/api';
import { registerForPushNotificationsAsync } from '../../lib/notifications';

// ARC design tokens
import { Appearance } from 'react-native';
import { LightColors, DarkColors } from '../../../../packages/ui/src/tokens/theme';

const isDark = Appearance.getColorScheme() === 'dark';
const C = isDark ? DarkColors : LightColors;

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={[tabIconStyles.container, focused && tabIconStyles.focused]}>
      <Text style={tabIconStyles.emoji}>{emoji}</Text>
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
  emoji: {
    fontSize: 20,
  },
});

export default function AppLayout(): React.JSX.Element {
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
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/welcome" as any} />;
  }

  if (profileComplete === null) {
    return (
      <View style={styles.loading}>
        <View style={styles.loadingCard}>
          <ActivityIndicator color={C.brand} size="large" />
          <Text style={styles.loadingBrand}>ARC</Text>
          <Text style={styles.loadingText}>Preparing your profile...</Text>
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
          paddingBottom: 4,
          paddingTop: 8,
          height: 64,
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
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🥗" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Coach',
          tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="workout/[dayId]"
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
    backgroundColor: C.background,
  },
  loadingCard: {
    alignItems: 'center',
    gap: 12,
  },
  loadingBrand: {
    fontSize: 32,
    fontWeight: '800',
    color: C.foreground,
    letterSpacing: 6,
    marginTop: 8,
  },
  loadingText: {
    fontSize: 14,
    color: C.textSecondary,
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
