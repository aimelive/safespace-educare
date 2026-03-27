import { apiCall, getToken } from "@/lib/api"

export async function startChat() {
  const token = getToken()
  return apiCall("/api/chat/start", "POST", {}, token)
}

export async function sendMessage(chat_id: number, message: string) {
  const token = getToken()
  return apiCall("/api/chat/message", "POST", { chat_id, message }, token)
}

export async function getChatMessages(chatId: number) {
  const token = getToken()
  return apiCall(`/api/chat/${chatId}`, "GET", undefined, token)
}
