import { useAuth } from '@clerk/clerk-expo';
import { Redirect, Stack, usePathname } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { createApiClient } from '../../lib/api';
import { registerForPushNotificationsAsync } from '../../lib/notifications';

// ARC design tokens
import { useAppTheme } from '../../lib/themeStore';



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
        if (!isMounted) return;
        // Bug fix: A 404 means the user record does not exist in our DB yet
        // (fresh sign-up before onboarding completes). Treat it as an incomplete
        // profile so the onboarding redirect fires, rather than showing an error.
        const isNotFound =
          (error instanceof Error && error.message.includes('404')) ||
          (typeof error === 'object' && error !== null && 'status' in error && (error as { status: number }).status === 404);
        if (isNotFound) {
          setProfileComplete(false);
        } else {
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
    return <Redirect href="/(app)/(tabs)/dashboard" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
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
