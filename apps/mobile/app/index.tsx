import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { generateWorkoutPlan } from "@arc/fitness-core";
import { formatDate } from "@arc/utils";

export default function Index() {
  const plan = generateWorkoutPlan(["build_muscle", "athletic"], "intermediate");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ARC Mobile App</Text>
      <Text style={styles.subtitle}>Date: {formatDate(new Date())}</Text>
      <Text style={styles.plan}>Today's Target: {plan.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#aaaaaa",
    marginTop: 8,
  },
  plan: {
    fontSize: 16,
    color: "#4d80ff",
    marginTop: 20,
    fontWeight: "600",
  },
});
