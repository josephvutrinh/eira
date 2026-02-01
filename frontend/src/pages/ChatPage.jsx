import { useEffect, useMemo, useRef, useState } from 'react'
import { buildSupportReply } from '../services/chatApi'
import {
  clearChatMessages,
  fetchChatMessages,
  getOrCreateSessionId,
  insertChatMessage,
} from '../services/chatStore'

const STORAGE_KEY = 'eira_chat_v1'

function nowIso() {
  return new Date().toISOString()
}

function formatTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={
          'max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ' +
          (isUser
            ? 'bg-[#f9a1a1] text-white'
            : 'bg-[#ffffff] text-slate-900 border border-[#f9d5d7]')
        }
      >
        <div className="whitespace-pre-wrap leading-relaxed">{message.text}</div>
        <div
          className={
            'mt-1 text-xs ' +
            (isUser ? 'text-white/80' : 'text-slate-500')
          }
        >
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const sessionId = useMemo(() => getOrCreateSessionId(), [])

  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return []
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const listRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch {
      // ignore
    }
  }, [messages])

  useEffect(() => {
    // Best-effort: if Supabase is configured, load persisted history.
    let cancelled = false

    ;(async () => {
      const { data, error } = await fetchChatMessages({ sessionId, limit: 50 })
      if (cancelled) return
      if (error) {
        console.error('fetchChatMessages error', error)
        return
      }
      if (!data || data.length === 0) return

      // Map Supabase rows to the shape ChatPage expects.
      const mapped = data.map((row) => ({
        id: row.id,
        role: row.role,
        text: row.text,
        createdAt: row.created_at,
      }))

      setMessages(mapped)
    })()

    return () => {
      cancelled = true
    }
  }, [sessionId])

  useEffect(() => {
    // Auto-scroll to bottom when messages change.
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isTyping])

  const hasMessages = messages.length > 0

  const quickPrompts = useMemo(
    () => [
      'I’ve been having hot flashes and night sweats.',
      'My sleep has been really bad lately.',
      'My mood feels unpredictable and I’m overwhelmed.',
      'Help me figure out what to track for my symptom log.',
    ],
    [],
  )

  async function addMessage(role, text) {
    const createdAt = nowIso()

    // Optimistic UI update.
    const optimistic = {
      id: uid(),
      role,
      text,
      createdAt,
    }
    setMessages((prev) => [...prev, optimistic])

    const { data, error } = await insertChatMessage({
      sessionId,
      role,
      text,
      createdAt,
    })

    if (error) {
      console.error('insertChatMessage error', error)
      return optimistic
    }

    if (data?.id) {
      // Replace optimistic id with DB id (keeps React keys stable long-term).
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? { ...m, id: data.id } : m)),
      )
    }

    return optimistic
  }

  async function handleSend(textOverride) {
    const text = (textOverride ?? input).trim()
    if (!text || isTyping) return

    await addMessage('user', text)
    setInput('')

    // Simulate a support response (replace later with a backend call).
    setIsTyping(true)
    await new Promise((r) => setTimeout(r, 450))
    await addMessage('support', buildSupportReply(text))
    setIsTyping(false)

    // Keep focus in the input for “chat-like” UX.
    if (inputRef.current) inputRef.current.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleClear() {
    setMessages([])
    setInput('')
    setIsTyping(false)

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }

    const { error } = await clearChatMessages({ sessionId })
    if (error) console.error('clearChatMessages error', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef8ff] to-[#ffffff]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Support Chat
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              A supportive space to organize symptoms and questions. Not a medical
              diagnosis.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-[#f9d5d7] bg-[#ffffff] px-3 py-2 text-sm text-[#ff4d4d] shadow-sm hover:bg-[#f9d5d7] hover:text-[#ff4d4d]"
          >
            Clear
          </button>
        </header>

        {!hasMessages ? (
          <section className="mt-6 rounded-2xl border border-[#f9d5d7] bg-[#ffffff] p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              How can I support you today?
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Try one of these prompts, or write your own.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickPrompts.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="rounded-full bg-[#f9d5d7] px-3 py-2 text-sm text-[#ff4d4d] hover:bg-[#f9a1a1] hover:text-white"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[#f9a1a1] bg-[#fef8ff] p-4 text-sm text-slate-700">
              <div className="font-medium text-[#ff4d4d]">If you’re in danger</div>
              <div className="mt-1">
                If you feel unsafe or are thinking about self-harm, call local
                emergency services immediately.
              </div>
            </div>
          </section>
        ) : null}

        <main className="mt-6 flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#f9d5d7] bg-[#fef8ff] shadow-sm">
          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto p-4"
            aria-label="Chat messages"
          >
            {!hasMessages ? (
              <div className="text-sm text-slate-500">
                No messages yet. Choose a prompt above or type below.
              </div>
            ) : null}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-[#f9d5d7] bg-[#ffffff] px-4 py-3 text-sm text-slate-600 shadow-sm">
                  Support is typing…
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#f9d5d7] bg-[#ffffff] p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Type your message…"
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[#f9d5d7] bg-[#ffffff] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f9a1a1]"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="rounded-xl bg-[#f9a1a1] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#ff4d4d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Press Enter to send, Shift+Enter for a new line.
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
