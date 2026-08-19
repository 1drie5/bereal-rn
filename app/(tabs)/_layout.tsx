import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import AuthLoading from "@/components/AuthLoading";

export default function TabsLayout() {
  const { user } = useAuth();
  const { loading } = useAuth();
  if (loading) {
    return <AuthLoading />;
  }
  // Not authenticated
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Authenticated but onboarding not completed
  if (!user.onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  // Authenticated + onboarding completed
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "crimson" }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                focused
                  ? "information-circle"
                  : "information-circle-outline"
              }
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}