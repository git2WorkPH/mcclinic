import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { print } from "graphql";
import {
  SystemStatusDocument,
  type SystemStatusQuery,
} from "@ehr/graphql-contract/operations";

export function App() {
  const [state, setState] = useState("Checking connection…");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState("Checking connection…");
    void fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: print(SystemStatusDocument) }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const body = (await response.json()) as {
          data?: SystemStatusQuery;
          errors?: unknown[];
        };
        if (body.errors || body.data?.systemStatus.status !== "available")
          throw new Error("Unavailable");
        if (!controller.signal.aborted) setState("Connected");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("Connection unavailable");
      });
    return () => controller.abort();
  }, [attempt]);
  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text role="heading" style={styles.heading}>
          Clinic EHR
        </Text>
        <Text style={styles.description}>
          Your clinical workspace is being prepared.
        </Text>
        <Text accessibilityLiveRegion="polite" style={styles.status}>
          {state}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setAttempt(attempt + 1)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Check connection</Text>
        </Pressable>
        <Text style={styles.note}>
          Development foundation · Patient workflows are not available yet.
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#f1f5f4",
    padding: 32,
    justifyContent: "center",
  },
  card: {
    maxWidth: 680,
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    gap: 20,
  },
  heading: { fontSize: 36, fontWeight: "700", color: "#173b35" },
  description: { fontSize: 18, color: "#445e59" },
  status: { fontSize: 16, color: "#173b35" },
  button: {
    backgroundColor: "#17675a",
    padding: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  note: { fontSize: 13, color: "#526760" },
});
