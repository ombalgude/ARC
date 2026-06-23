import { useUser } from "@clerk/clerk-expo";
import { StyleSheet, Text, View } from "react-native";

export default function DashboardScreen(): React.JSX.Element {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.firstName ?? "there"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111318",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
});
