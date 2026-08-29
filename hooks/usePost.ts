import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase/client";
import { uploadPostImage } from "@/lib/supabase/storage";
import { useEffect, useState } from "react";

export interface PostUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}
export interface Post {
  id: string;
  user_id: string;
  image_url: string;
  description?: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  profiles?: PostUser;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadPosts()
  }, [user])

  const loadPosts = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const {data: postsData, error: postsError} = await supabase
        .from("posts")
        .select(`
            *,
            profiles(id, name, username, profile_image_url)
          `)
        .eq("is_active", true)
        .gt("expires_at", new Date()
        .toISOString())
        .order("created_at", {ascending: false});
      
      if(postsError) {
        console.error("Error loading posts: ", postsError);
        throw postsError;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      const postsWithProfiles = postsData.map((post) => ({
        ...post,
        profiles: post.profiles || null,
      }));

      setPosts(postsWithProfiles);

    } catch (error) {
        console.error("Error in loadPosts: ", error)
    } finally {
        setIsLoading(false)
    }
  }

  const createPost = async (imageUri: string, description?: string) => {
    if(!user) {
      throw new Error("User not authenticated");
    }

    try {
       // Deactivate any existing posts
      const { error: deactivateError } = await supabase
        .from("posts")
        .update({ is_active: false })
        .eq("user_id", user.id).eq("is_active", true);
      
      if (deactivateError) {
        console.error("Error deactivating old posts: ", deactivateError);
      }

      const imageUrl = await uploadPostImage(user.id, imageUri);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const {error} = await supabase.from("posts").insert({
        user_id: user.id,
        image_url: imageUrl,
        description: description || null,
        expires_at: expiresAt.toISOString(),
      }).select().single()

      if (error) {
        console.error("Error creating posts: ", error);
        throw error;
      }
      // Refresh feed after creating the post
      await loadPosts();
    } catch (error) {
        console.error("Error creating posts: ", error);
        throw error;
    }
  }

  const deletePost = async (post: Post) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    if (post.user_id !== user.id) {
      throw new Error("You can only delete your own posts");
    }

    try {
      // Delete database row
      const { error: postError } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id)
        .eq("user_id", user.id);

      if (postError) {
        throw postError;
      }

      // Delete image from Storage
      const imagePath = post.image_url.split("/posts/")[1];

      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from("posts")
          .remove([imagePath]);

        if (storageError) {
          console.error("Error deleting post image:", storageError);
        }
      }

      // Refresh feed
      await loadPosts();
    }   catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  }

  const refreshPosts = async () => {
    await loadPosts();
  }

  return {createPost, deletePost, posts, refreshPosts};
}