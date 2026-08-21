import { TouchableOpacity, Text, Modal, View, StyleSheet, TextInput, ActivityIndicator, Alert } from "react-native";
// import { Host, Button } from "@expo/ui/jetpack-compose";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image";
import { useState } from "react";
import { usePosts } from "@/hooks/usePost";

export default function Index() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const createPost = usePosts()
  const pickImage = async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status!=="granted") {
        Alert.alert(
          "Permission needed",
          "We need camera roll permissions to select a profile image.",
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        // mediaTypes: ImagePicker.MediaTypeOptions.Images
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if(!result.canceled && result.assets[0]) {
        setPreviewImage(result.assets[0].uri);
        setShowPreview(true);
        setDescription("");
      }
    }
    const takePhoto = async () => {
       const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if(status!=="granted") {
        Alert.alert(
          "Permission needed",
          "We need camera permission to take a photo.",
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if(!result.canceled && result.assets[0]) {
        setPreviewImage(result.assets[0].uri);
        setShowPreview(true);
        setDescription("");
      }
    }

  const showImagePicker = () => {
    Alert.alert("Select Profile Image", "Chose an option", [
      {text: "Camera", onPress: takePhoto},
      {text: "Photo Library", onPress: pickImage},
      {text: "Canel", style: "cancel" }
    ]);
  }

  const handlePost = async () => {
    if(!previewImage) return;
    setIsUploading(true);
    try {
      await createPost(previewImage, description);
      setPreviewImage(null);
      setDescription("");
      setShowPreview(false);
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert(
        "Error",
        "Failed to create post. Please try again."
      )
    } finally {
      setIsUploading(false);
    }
  }
  return (
    <SafeAreaView 
      style={styles.container}
      edges={["bottom","top"]}
    >
      <TouchableOpacity style={styles.fab} onPress={showImagePicker}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal visible={showPreview} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preview Your Post</Text>
            {previewImage && (
              <Image source={{uri: previewImage}} style={styles.previewImage} contentFit="cover"/>
            )}
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add a description (optional)"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={()=>{
                  setShowPreview(false);
                  setPreviewImage(null);
                  setDescription("");
                }}
                disabled={isUploading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.postButton, isUploading && styles.postButtonDisabled,]}
                onPress={handlePost}
                disabled={isUploading}
                >
                  {isUploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.postButtonText}>Post</Text>
                  )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab:{
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText:{
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  modalContainer:{
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent:{
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle:{
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",

  },
  previewImage:{
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  descriptionInput:{
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#000",
  },
  modalButtons:{
    flexDirection: "row",
    gap: 12,
  },
  modalButton:{
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton:{
    backgroundColor: "#f5f5f5"
  },
  cancelButtonText:{
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  postButton:{
    backgroundColor: "#000"
  },
  postButtonText:{
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  postButtonDisabled: {
    opacity: 0.6,
  },
});

