import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { createApiClient, type CurrentUserProfile } from "../../lib/api";

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function RenderValue({ value }: { value: unknown }) {
  if (Array.isArray(value)) {
    return (
      <View style={styles.badgeContainer}>
        {value.map((item, i) => (
          <View key={i} style={styles.valueBadge}>
            <Text style={styles.valueBadgeText}>{String(item)}</Text>
          </View>
        ))}
      </View>
    );
  }
  
  if (typeof value === "boolean") {
    return <Text style={styles.value}>{value ? "Yes" : "No"}</Text>;
  }

  return <Text style={styles.value} numberOfLines={2} ellipsizeMode="tail">{String(value)}</Text>;
}

const EXCLUDED_KEYS = ["id", "userId", "createdAt", "updatedAt", "deletedAt", "clerkId"];

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
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load profile data."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [api]);

  const handleSignOut = () => {
    void signOut();
  };

  const filteredProfile = profileData?.profile
    ? Object.entries(profileData.profile).filter(([key]) => !EXCLUDED_KEYS.includes(key))
    : [];

  const filteredPreferences = profileData?.preferences
    ? Object.entries(profileData.preferences).filter(([key]) => !EXCLUDED_KEYS.includes(key))
    : [];

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#111318", "#1a1612", "#111318"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <ActivityIndicator color="#f2c46d" style={styles.loader} size="large" />
          ) : errorMessage ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : profileData ? (
            <View style={styles.content}>
              
              {/* Profile Card Header with Glassmorphism */}
              <View style={styles.avatarGlassContainer}>
                <BlurView intensity={20} tint="dark" style={styles.avatarBlur}>
                  <View style={styles.avatarWrapper}>
                    <LinearGradient
                      colors={["#f2c46d", "#d9a13e"]}
                      style={styles.avatarGradient}
                    >
                      <Ionicons name="person" size={40} color="#111318" />
                    </LinearGradient>
                  </View>
                  <Text style={styles.userEmail}>{profileData.user.email}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {profileData.profileComplete ? "Active Member" : "Incomplete"}
                    </Text>
                  </View>
                </BlurView>
              </View>

              {/* Data Sections */}
              <View style={styles.sectionContainer}>
                {/* Account Settings */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.glassCard}>
                  <BlurView intensity={15} tint="dark" style={styles.glassInner}>
                    <View style={styles.row}>
                      <View style={styles.rowLeft}>
                        <View style={styles.iconBox}>
                          <Ionicons name="mail" size={16} color="#f2c46d" />
                        </View>
                        <Text style={styles.label}>Email Address</Text>
                      </View>
                      <Text style={styles.value}>{profileData.user.email}</Text>
                    </View>
                    <View style={[styles.row, styles.noBorder]}>
                      <View style={styles.rowLeft}>
                        <View style={styles.iconBox}>
                          <Ionicons name="calendar" size={16} color="#f2c46d" />
                        </View>
                        <Text style={styles.label}>Member Since</Text>
                      </View>
                      <Text style={styles.value}>
                        {new Date(profileData.user.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </BlurView>
                </View>

                {/* Personal Info */}
                {filteredProfile.length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Personal Info</Text>
                    <View style={styles.glassCard}>
                      <BlurView intensity={15} tint="dark" style={styles.glassInner}>
                        {filteredProfile.map(([key, value], index, arr) => (
                          <View key={key} style={[styles.row, index === arr.length - 1 && styles.noBorder]}>
                            <View style={styles.rowLeft}>
                              <View style={styles.iconBox}>
                                <Ionicons name="person-outline" size={16} color="#f2c46d" />
                              </View>
                              <Text style={styles.label}>{formatKey(key)}</Text>
                            </View>
                            <RenderValue value={value} />
                          </View>
                        ))}
                      </BlurView>
                    </View>
                  </>
                )}

                {/* Preferences */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Preferences</Text>
                <View style={styles.glassCard}>
                  <BlurView intensity={15} tint="dark" style={styles.glassInner}>
                    {filteredPreferences.length > 0 ? (
                      filteredPreferences.map(([key, value], index, arr) => (
                        <View key={key} style={[styles.row, index === arr.length - 1 && styles.noBorder]}>
                          <View style={styles.rowLeft}>
                            <View style={styles.iconBox}>
                              <Ionicons name="options" size={16} color="#f2c46d" />
                            </View>
                            <Text style={styles.label}>{formatKey(key)}</Text>
                          </View>
                          <RenderValue value={value} />
                        </View>
                      ))
                    ) : (
                      <Text style={styles.emptyText}>No preferences set.</Text>
                    )}
                  </BlurView>
                </View>

                {/* Logout Button */}
                <Pressable
                  style={({ pressed }) => [
                    styles.signOutButton,
                    pressed && styles.signOutButtonPressed,
                  ]}
                  onPress={handleSignOut}
                >
                  <LinearGradient
                    colors={["rgba(255, 77, 77, 0.15)", "rgba(255, 77, 77, 0.05)"]}
                    style={styles.signOutGradient}
                  >
                    <Ionicons name="log-out-outline" size={20} color="#ff4d4d" />
                    <Text style={styles.signOutButtonText}>Sign Out</Text>
                  </LinearGradient>
                </Pressable>
              </View>

            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111318",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  loader: {
    marginTop: 60,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 77, 77, 0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.3)",
    marginTop: 20,
  },
  errorText: {
    color: "#ff8080",
    fontSize: 14,
    textAlign: "center",
  },
  content: {
    marginTop: 16,
  },
  avatarGlassContainer: {
    borderRadius: 32,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(242, 196, 109, 0.2)",
    marginBottom: 32,
  },
  avatarBlur: {
    padding: 32,
    alignItems: "center",
  },
  avatarWrapper: {
    shadowColor: "#f2c46d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
    marginBottom: 20,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: "rgba(242, 196, 109, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(242, 196, 109, 0.4)",
  },
  badgeText: {
    color: "#f2c46d",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionContainer: {
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
    paddingLeft: 4,
  },
  glassCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  glassInner: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(242, 196, 109, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  value: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    paddingLeft: 16,
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    justifyContent: "flex-end",
    flex: 1,
    paddingLeft: 16,
  },
  valueBadge: {
    backgroundColor: "rgba(242, 196, 109, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(242, 196, 109, 0.3)",
  },
  valueBadgeText: {
    color: "#f2c46d",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 24,
  },
  signOutButton: {
    marginTop: 40,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 77, 0.3)",
  },
  signOutGradient: {
    flexDirection: "row",
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  signOutButtonPressed: {
    opacity: 0.7,
  },
  signOutButtonText: {
    color: "#ff4d4d",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
