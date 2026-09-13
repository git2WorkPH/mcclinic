import {
  useEffect,
  useRef,
  useState,
  type DependencyList,
  type ReactNode,
} from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
export const styles = StyleSheet.create({
  page: { minHeight: "100%", backgroundColor: "#eef3f2" },
  header: { backgroundColor: "#123d35", padding: 24, gap: 12 },
  brand: { fontSize: 26, fontWeight: "700", color: "#fff" },
  headerText: { color: "#dbede7", fontSize: 14 },
  body: {
    padding: 24,
    gap: 20,
    maxWidth: 1360,
    width: "100%",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
  columns: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 20,
  },
  sidebar: { width: 330, gap: 16 },
  main: { flex: 1, minWidth: 360, gap: 16 },
  card: {
    padding: 24,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dce5e1",
    borderRadius: 12,
    gap: 14,
  },
  heading: { fontSize: 22, fontWeight: "700", color: "#173e35" },
  subheading: { fontSize: 17, fontWeight: "600", color: "#24473f" },
  text: { fontSize: 15, color: "#254a40", lineHeight: 23 },
  muted: { fontSize: 13, color: "#657a73", lineHeight: 20 },
  field: { gap: 6, flexGrow: 1, minWidth: 180 },
  label: { fontSize: 13, fontWeight: "600", color: "#35584d" },
  input: {
    borderWidth: 1,
    borderColor: "#b5c9c1",
    borderRadius: 6,
    padding: 11,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#173e35",
    minHeight: 43,
  },
  multiline: { minHeight: 130, textAlignVertical: "top" },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 6,
    backgroundColor: "#176b56",
    alignSelf: "flex-start",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  secondary: { backgroundColor: "#e5efeb" },
  secondaryText: { color: "#215343" },
  disabled: { opacity: 0.45 },
  banner: { backgroundColor: "#fff2d9", padding: 12 },
  bannerText: {
    color: "#794811",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  error: {
    backgroundColor: "#fff0ec",
    padding: 12,
    borderRadius: 6,
    color: "#993621",
    fontSize: 14,
  },
  success: { color: "#126249", fontSize: 14 },
  item: { borderTopWidth: 1, borderColor: "#e0e8e4", paddingTop: 14, gap: 9 },
  badge: {
    padding: 5,
    backgroundColor: "#eef4f1",
    color: "#285347",
    fontSize: 12,
    alignSelf: "flex-start",
  },
  tabs: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  login: { maxWidth: 460, width: "100%", alignSelf: "center", marginTop: 64 },
});
export function Button({
  children,
  onPress,
  disabled = false,
  secondary = false,
  accessibilityState,
}: {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  accessibilityState?: { expanded?: boolean };
}) {
  return (
    <Pressable
      aria-expanded={accessibilityState?.expanded}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        secondary && styles.secondary,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>
        {children}
      </Text>
    </Pressable>
  );
}
export function Field({
  label,
  value,
  onChange,
  multiline = false,
  password = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  password?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChange}
        multiline={multiline}
        secureTextEntry={password}
        autoCapitalize="none"
        style={[styles.input, multiline && styles.multiline]}
      />
    </View>
  );
}
export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      {title && (
        <Text role="heading" style={styles.heading}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}
export function useAction() {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const keys = useRef(new Map<string, string>());
  return {
    busy,
    error,
    message,
    async run(work: (key: string) => Promise<void>, fingerprint = "action") {
      if (busy) return;
      setBusy(true);
      setError("");
      setMessage("");
      const key = keys.current.get(fingerprint) ?? crypto.randomUUID();
      keys.current.set(fingerprint, key);
      try {
        await work(key);
        keys.current.delete(fingerprint);
        setMessage("Saved.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
      } finally {
        setBusy(false);
      }
    },
  };
}
export function Feedback({ state }: { state: ReturnType<typeof useAction> }) {
  return (
    <>
      {Boolean(state.error) && (
        <Text role="alert" style={styles.error}>
          {state.error}
        </Text>
      )}
      {Boolean(state.message) && (
        <Text accessibilityLiveRegion="polite" style={styles.success}>
          {state.message}
        </Text>
      )}
    </>
  );
}
export function useLoad<T>(load: () => Promise<T>, deps: DependencyList) {
  const [value, setValue] = useState<T | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setValue(null);
    setError("");
    void load()
      .then((v) => {
        if (active) setValue(v);
      })
      .catch((e) => {
        if (active)
          setError(e instanceof Error ? e.message : "Unable to load records.");
      });
    return () => {
      active = false;
    };
  }, deps);
  return { value, error };
}
export const formatTime = (value: string) => new Date(value).toLocaleString();
export function iso(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.valueOf())) throw new Error("Enter a valid date/time.");
  return d.toISOString();
}
