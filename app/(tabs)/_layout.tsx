import { Tabs, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/context/AuthContext";

export default function TabsLayout() {
  const {user} = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  return <Tabs screenOptions={{ tabBarActiveTintColor: "crimson"}}>
    <Tabs.Screen 
      name="index" 
      options={{
        title: "Home",
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size}/>
        ),
      }} 
    />
    <Tabs.Screen 
      name="about"
      options={{
        title: "About",
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused? "information-circle" : "information-circle-outline"} color={color} size={size}/>
        ),
      }} 
    />
    <Tabs.Screen 
      name="profile" 
      options={{ 
        title: "Profile",
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons name={focused ? "person" : "person-outline"} color={color} size={size}/>
        ),
      }} 
    />
  </Tabs>
}