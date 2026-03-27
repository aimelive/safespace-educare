import { apiCall, getToken } from "@/lib/api"

export async function getAllPosts() {
  return apiCall("/api/posts")
}

export async function createPost(title: string, content: string, is_anonymous = false) {
  const token = getToken()
  return apiCall("/api/posts", "POST", { title, content, is_anonymous }, token)
}

export async function likePost(post_id: number) {
  const token = getToken()
  return apiCall(`/api/posts/${post_id}/like`, "POST", {}, token)
}
