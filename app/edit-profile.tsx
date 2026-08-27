import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function EditProfile() {
  const { user, updateUser, updateEmail, updatePassword } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [newPassword, setNewPassword] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSaveProfile = async () => {
    const normalizedEmail = email.trim();
    if (!name.trim() || !username.trim() || !email.trim()) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    if (username.trim().length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters.");
      return;
    }

    setIsSaving(true);

    try {
      await updateUser({
        name: name.trim(),
        username: username.trim(),
      });

      if (email.trim() !== user?.email) {
        await updateEmail(normalizedEmail);

        Alert.alert(
          "Email confirmation required",
          "We've sent a confirmation link to your new email address. Your email will change after you confirm it."
        );
      } else {
        Alert.alert(
          "Success",
          "Profile updated successfully."
        );
      }

      router.back();
    }   catch (error) {
      console.error("Error updating profile:", error);

      Alert.alert(
        "Error",
        "Failed to update profile. Please try again."
      );
    }   finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        "Error",
        "Password must be at least 6 characters."
      );
      return;
    }

    setIsChangingPassword(true);

    try {
      await updatePassword(newPassword);

      setNewPassword("");

      Alert.alert(
        "Success",
        "Password updated successfully."
      );
    } catch (error) {
      console.error("Error updating password:", error);

      Alert.alert(
        "Error",
        "Failed to update password. Please try again."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Profile Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoComplete="username"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Security</Text>

        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#999"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.passwordButton}
          onPress={handleChangePassword}
          disabled={isChangingPassword}
        >
          {isChangingPassword ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.passwordButtonText}>
              Change Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  backButton: {
    fontSize: 36,
    color: "#000",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  headerSpacer: {
    width: 30,
  },

  content: {
    padding: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },

  input: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000",
    marginBottom: 16,
  },

  saveButton: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 32,
  },

  passwordButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  passwordButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});