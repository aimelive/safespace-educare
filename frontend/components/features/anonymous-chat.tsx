"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  MessageCircle,
  Send,
  AlertCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  RefreshCw,
} from "lucide-react"

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function AnonymousChat() {
  const [chatSessions, setChatSessions] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Resolve the current user once (client-side only)
  const currentUser =
    typeof window !== "undefined"
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem("user") || "null")
          } catch {
            return null
          }
        })()
      : null

  const currentUserId: string = currentUser?.id ?? ""
  const role: string = currentUser?.role ?? ""
  const isCounselor = role === "counselor" || role === "admin"

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  // ── API helpers ────────────────────────────────────────────────────────────

  const fetchChatSessions = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/sessions`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      if (res.ok) {
        const data = await res.json()
        setChatSessions(Array.isArray(data) ? data : [])
      }
    } catch {
      console.error("Failed to fetch chat sessions")
    }
  }, [token])

  const fetchMessages = useCallback(
    async (chatId: string) => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (res.ok) {
          const data = await res.json()
          setMessages(Array.isArray(data) ? data : [])
        }
      } catch {
        console.error("Failed to fetch messages")
      }
    },
    [token],
  )

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchChatSessions()
  }, [fetchChatSessions])

  // Load messages immediately when entering a chat and start polling
  useEffect(() => {
    if (!activeChat?.id) return

    fetchMessages(activeChat.id)

    pollRef.current = setInterval(() => {
      fetchMessages(activeChat.id)
    }, 4000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [activeChat?.id, fetchMessages])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // ── Handlers ──────────────────────────────────────────────────────────────

  const openSession = (chat: any) => {
    setActiveChat(chat)
    setMessages([])
  }

  const startNewChat = async () => {
    setStarting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        },
      )
      if (res.ok) {
        const chat = await res.json()
        setChatSessions((prev) => [chat, ...prev])
        openSession(chat)
      }
    } catch {
      console.error("Failed to start chat")
    } finally {
      setStarting(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeChat) return
    setLoading(true)
    const text = messageInput
    setMessageInput("") // optimistic clear
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ chat_id: activeChat.id, message: text }),
        },
      )
      if (res.ok) {
        const msg = await res.json()
        setMessages((prev) => [...prev, msg])
      } else {
        setMessageInput(text) // restore on failure
      }
    } catch {
      console.error("Failed to send message")
      setMessageInput(text) // restore on failure
    } finally {
      setLoading(false)
    }
  }

  // ── CHAT VIEW ───────────────────────────────────────────────────────────────

  if (activeChat) {
    const chatLabel = isCounselor
      ? activeChat.student_name ?? "Anonymous Student"
      : "Anonymous Chat"

    return (
      <div
        className="flex flex-col"
        style={{ height: "calc(100vh - 14rem)", minHeight: "480px" }}
      >
        {/* Chat header */}
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => {
              setActiveChat(null)
              setMessages([])
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#152060]/10 text-[#152060]/50 transition-colors hover:text-[#152060]"
            aria-label="Back to chats"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#152060]/10">
              <MessageCircle
                className="h-3.5 w-3.5 text-[#152060]/50"
                aria-hidden="true"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#152060]">{chatLabel}</p>
              <div className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden="true"
                />
                <p className="text-xs text-[#152060]/45">Secure &amp; confidential</p>
              </div>
            </div>
          </div>

          {/* Manual refresh button */}
          <button
            onClick={() => fetchMessages(activeChat.id)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-[#152060]/10 text-[#152060]/40 transition-colors hover:text-[#152060]"
            aria-label="Refresh messages"
            title="Refresh messages"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-[#152060]/8 bg-[#f7f9ff] p-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#152060]/8">
                  <MessageCircle
                    className="h-5 w-5 text-[#152060]/25"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-sm text-[#152060]/45">
                  {isCounselor
                    ? "No messages yet. Reply to start the conversation."
                    : "A counselor will respond shortly…"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg, idx) => {
                const isMine = msg.sender_id === currentUserId
                return (
                  <div
                    key={msg.id ?? idx}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={[
                        "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                        isMine
                          ? "rounded-br-sm bg-[#152060] text-white"
                          : "rounded-bl-sm border border-[#152060]/8 bg-white text-[#152060]",
                      ].join(" ")}
                    >
                      {msg.message}
                      <p
                        className={[
                          "mt-1 text-[10px]",
                          isMine ? "text-white/50" : "text-[#152060]/30",
                        ].join(" ")}
                      >
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="mt-3 flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={
              isCounselor ? "Reply to student…" : "Type your message…"
            }
            className="flex-1 rounded-xl border border-[#152060]/12 bg-[#f7f9ff] px-4 py-3 text-sm text-[#152060] placeholder:text-[#152060]/30 transition-all focus:border-[#CC1A2E]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#CC1A2E]/20"
          />
          <Button
            type="submit"
            disabled={loading || !messageInput.trim()}
            className="border-0 bg-[#152060] px-4 text-white hover:bg-[#1e3280]"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </form>
      </div>
    )
  }

  // ── COUNSELOR LOBBY ──────────────────────────────────────────────────────────

  if (isCounselor) {
    return (
      <div className="space-y-7">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#152060]">
            Student Chats
          </h2>
          <p className="mt-0.5 text-sm text-[#152060]/50">
            Anonymous chats from students — student identity is protected.
          </p>
        </div>

        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#152060]">
              Active sessions
            </h3>
            <button
              onClick={fetchChatSessions}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#152060]/50 transition-colors hover:bg-[#f7f9ff] hover:text-[#152060]"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>

          {chatSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#152060]/15 bg-[#f7f9ff] py-14 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#152060]/8">
                <MessageCircle
                  className="h-6 w-6 text-[#152060]/40"
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm font-medium text-[#152060]/60">
                No active chats
              </p>
              <p className="mt-1 text-xs text-[#152060]/40">
                Students can start an anonymous chat from their dashboard.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatSessions.map((chat, i) => (
                <button
                  key={chat.id ?? i}
                  onClick={() => openSession(chat)}
                  className="flex w-full items-center gap-3 rounded-xl border border-[#152060]/8 bg-[#f7f9ff] px-4 py-3 text-left transition-all hover:bg-white"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#152060]/10">
                    <MessageCircle
                      className="h-3.5 w-3.5 text-[#152060]/50"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#152060]">
                      {chat.student_name ?? "Anonymous Student"}
                    </p>
                    <p className="text-xs text-[#152060]/40">
                      {chat.created_at
                        ? new Date(chat.created_at).toLocaleDateString()
                        : "Unknown date"}
                      {typeof chat.message_count === "number"
                        ? ` · ${chat.message_count} message${chat.message_count !== 1 ? "s" : ""}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      chat.status === "open"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#152060]/8 text-[#152060]/50",
                    ].join(" ")}
                  >
                    {chat.status ?? "open"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── STUDENT LOBBY ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-[#152060]">
          Anonymous Chat
        </h2>
        <p className="mt-0.5 text-sm text-[#152060]/50">
          Talk to a counselor confidentially — your identity is protected.
        </p>
      </div>

      {/* Crisis banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertCircle
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
          aria-hidden="true"
        />
        <span>
          This is not an emergency service. For immediate help, please contact
          emergency services or a crisis helpline.
        </span>
      </div>

      {/* Start card */}
      <div className="rounded-2xl border border-[#152060]/8 bg-white p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#152060]/5">
          <MessageCircle
            className="h-8 w-8 text-[#152060]/30"
            aria-hidden="true"
          />
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <ShieldCheck
            className="h-4 w-4 text-emerald-500"
            aria-hidden="true"
          />
          <p className="text-xs font-semibold text-emerald-600">
            100% anonymous &amp; confidential
          </p>
        </div>
        <h3 className="mb-2 text-lg font-bold text-[#152060]">
          Start a Confidential Chat
        </h3>
        <p className="mx-auto mb-7 max-w-xs text-sm text-[#152060]/50">
          Connect anonymously with a counselor who is ready to listen without
          judgment.
        </p>
        <Button
          onClick={startNewChat}
          disabled={starting}
          className="border-0 bg-[#152060] px-8 py-5 font-semibold text-white hover:bg-[#1e3280]"
        >
          {starting ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Connecting…
            </>
          ) : (
            <>
              <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Start Chat Now
            </>
          )}
        </Button>
      </div>

      {/* Previous sessions */}
      {chatSessions.length > 0 && (
        <div className="rounded-2xl border border-[#152060]/8 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-[#152060]">
            Previous sessions
          </h3>
          <div className="space-y-2">
            {chatSessions.map((chat, i) => (
              <button
                key={chat.id ?? i}
                onClick={() => openSession(chat)}
                className="flex w-full items-center gap-3 rounded-xl border border-[#152060]/8 bg-[#f7f9ff] px-4 py-3 text-left transition-all hover:bg-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#152060]/10">
                  <MessageCircle
                    className="h-3.5 w-3.5 text-[#152060]/50"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#152060]">
                    Session #{i + 1}
                  </p>
                  <p className="text-xs text-[#152060]/40">
                    {chat.created_at
                      ? new Date(chat.created_at).toLocaleDateString()
                      : "Previous chat"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
