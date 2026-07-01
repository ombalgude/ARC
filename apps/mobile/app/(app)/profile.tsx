import { useAuth } from '@clerk/clerk-expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createApiClient, type CurrentUserProfile } from '../../lib/api';

const C = {
  background: '#0A0912',
  card: '#12102A',
  cardRaised: '#1B1840',
  foreground: '#EAE8FF',
  brand: '#8F6FFF',
  brandDark: '#7C5CFC',
  health: '#00EDD0',
  energy: '#FF8585',
  amber: '#FFC333',
  textSecondary: '#9890BC',
  textTertiary: '#5E5880',
  border: 'rgba(143, 111, 255, 0.12)',
  muted: 'rgba(255, 255, 255, 0.06)',
  destructive: '#FF6B6B',
} as const;

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

function RenderValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <View style={renderStyles.badgeContainer}>
        {value.map((item, i) => (
          <View key={i} style={renderStyles.badge}>
            <Text style={renderStyles.badgeText}>{String(item)}</Text>
          </View>
        ))}
      </View>
    );
  }
  
  if (typeof value === 'boolean') {
    return <Text style={renderStyles.valueText}>{value ? 'Yes' : 'No'}</Text>;
  }

  return (
    <Text style={renderStyles.valueText} numberOfLines={2} ellipsizeMode="tail">
      {String(value)}
    </Text>
  );
}

const renderStyles = StyleSheet.create({
  valueText: {
    fontSize: 15,
    color: C.foreground,
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 6,
    flex: 1,
  },
  badge: {
    backgroundColor: C.muted,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    color: C.foreground,
    fontWeight: '600',
  },
});

const EXCLUDED_KEYS = ['id', 'userId', 'createdAt', 'updatedAt', 'deletedAt', 'clerkId'];

export default function ProfileScreen(): React.JSX.Element {
  const { signOut, getToken } = useAuth();
  const api = useMemo(() => createApiClient(getToken), [getToken]);
  
  const [profileData, setProfileData] = useState<CurrentUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile(): Promise<void> {
      try {
        const result = await api.getMe();
        if (isMounted) {
          setProfileData(result);
          setErrorMessage(null);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load profile data.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadProfile();
    return () => { isMounted = false; };
  }, [api]);

  const handleSignOut = () => void signOut();

  const filteredProfile = profileData?.profile
    ? Object.entries(profileData.profile).filter(([key]) => !EXCLUDED_KEYS.includes(key))
    : [];

  const filteredPreferences = profileData?.preferences
    ? Object.entries(profileData.preferences).filter(([key]) => !EXCLUDED_KEYS.includes(key))
    : [];

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.brand} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>

        {errorMessage ? (
          <View style={styles.errorState}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : profileData ? (
          <>
            {/* Header Card */}
            <View style={styles.profileHeaderCard}>
              <View style={styles.avatarWrapper}>
                <Text style={styles.avatarEmoji}>👤</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.userEmail}>{profileData.user.email}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>
                    {profileData.profileComplete ? 'Active Member' : 'Incomplete Setup'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Account Details */}
            <Text style={styles.sectionTitle}>Account Details</Text>
            <View style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Email</Text>
                <Text style={styles.rowValue}>{profileData.user.email}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Member Since</Text>
                <Text style={styles.rowValue}>
                  {new Date(profileData.user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>

            {/* Personal Info */}
            {filteredProfile.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Body & Metrics</Text>
                <View style={styles.card}>
                  {filteredProfile.map(([key, value], idx) => (
                    <View key={key}>
                      <View style={styles.row}>
                        <Text style={styles.rowLabel}>{formatKey(key)}</Text>
                        <RenderValue value={value} />
                      </View>
                      {idx < filteredProfile.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Preferences */}
            {filteredPreferences.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Training Setup</Text>
                <View style={styles.card}>
                  {filteredPreferences.map(([key, value], idx) => (
                    <View key={key}>
                      <View style={styles.row}>
                        <Text style={styles.rowLabel}>{formatKey(key)}</Text>
                        <RenderValue value={value} />
                      </View>
                      {idx < filteredPreferences.length - 1 && <View style={styles.divider} />}
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        ) : null}

        <Pressable
          id="profile-signout-btn"
          onPress={handleSignOut}
          style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 },
  loading: { flex: 1, backgroundColor: C.background, alignItems: 'center', justifyContent: 'center' },
  pageTitle: { fontSize: 32, fontWeight: '800', color: C.foreground, letterSpacing: -0.64, marginBottom: 24 },
  errorState: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  errorIcon: { fontSize: 40, marginBottom: 12 },
  errorText: { color: C.destructive, fontSize: 15, textAlign: 'center' },
  
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
    gap: 16,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(143,111,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 32 },
  headerInfo: { flex: 1, alignItems: 'flex-start' },
  userEmail: { fontSize: 17, fontWeight: '700', color: C.foreground, marginBottom: 8 },
  statusBadge: {
    backgroundColor: 'rgba(0,237,208,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0,237,208,0.25)',
    borderRadius: 9999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusBadgeText: { fontSize: 11, fontWeight: '700', color: C.health, letterSpacing: 0.5, textTransform: 'uppercase' },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    gap: 16,
  },
  rowLabel: { fontSize: 15, fontWeight: '500', color: C.textSecondary, flexShrink: 0 },
  rowValue: { fontSize: 15, fontWeight: '600', color: C.foreground },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: 16 },

  signOutButton: {
    backgroundColor: 'rgba(255,107,107,0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,107,107,0.20)',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  signOutText: { fontSize: 16, fontWeight: '700', color: C.destructive },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
