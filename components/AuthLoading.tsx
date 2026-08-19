import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AuthLoading() {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <View style={styles.innerCircle}>
          <Text style={styles.logoText}>B</Text>
        </View>
      </View>

      <Text style={styles.title}>BeReal</Text>
      <Text style={styles.subtitle}>Getting things ready...</Text>

      <ActivityIndicator
        size="small"
        color="#000"
        style={styles.loader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  innerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#000",
  },

  title: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: "800",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#777",
  },

  loader: {
    marginTop: 24,
  },
});