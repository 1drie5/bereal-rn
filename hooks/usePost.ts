import { useAuth } from "@/context/AuthContext"
import { uploadPostImage } from "@/lib/supabase/storage";

export const usePosts = () => {
  const { user } = useAuth();
  const createPost = async (imageUri: string, description?: string) => {
    if(!user) {
      throw new Error("User not authenticated");
    }

    try {
      const imageUrl = await uploadPostImage(user.id, imageUri)
    } catch (error) {
      
    }
  }

  return(createPost)
}