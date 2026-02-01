import { useEffect, useMemo, useRef, useState } from 'react'

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

function buildSupportReply(userText) {
  const text = (userText || '').toLowerCase()

  // Keep responses supportive and non-medical; gently encourage professional care when needed.
  if (text.includes('hot flash') || text.includes('hot flashes')) {
    return "That sounds really uncomfortable. Hot flashes can be exhausting. If you want, you can log when they happen (time, intensity, triggers like caffeine/alcohol/stress) and we can look for patterns. If symptoms feel severe or are changing quickly, consider checking in with a clinician."
  }

  if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired')) {
    return "Sleep disruption is very common around perimenopause/menopause. If you’d like, tell me what your nights look like (bedtime, wake-ups, night sweats, stress level) and we can brainstorm gentle routines to try. If you’re feeling unsafe, extremely depressed, or unable to function, it’s important to seek professional support."
  }

  if (text.includes('anx') || text.includes('panic') || text.includes('mood') || text.includes('depress')) {
    return "I’m here with you. Mood changes can feel intense and isolating. If you can, share what you’re noticing (when it started, what helps, what makes it worse). If you’re thinking about harming yourself or feel in danger, please call local emergency services right now."
  }

  if (text.includes('help') || text.includes('support')) {
    return "I’m here to support you. What’s the biggest thing you want help with today—symptoms, sleep, stress, or tracking what you’re experiencing?"
  }

  return "Thanks for sharing that. I’m here with you. If you tell me a bit more about what you’re experiencing (what, when it started, how often, how intense), I can help you organize it for your symptom log and suggest questions to bring to a clinician."
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

  function addMessage(role, text) {
    const msg = {
      id: uid(),
      role,
      text,
      createdAt: nowIso(),
    }
    setMessages((prev) => [...prev, msg])
  }

  async function handleSend(textOverride) {
    const text = (textOverride ?? input).trim()
    if (!text || isTyping) return

    addMessage('user', text)
    setInput('')

    // Simulate a support response.
    setIsTyping(true)
    await new Promise((r) => setTimeout(r, 450))
    addMessage('support', buildSupportReply(text))
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

  function handleClear() {
    setMessages([])
    setInput('')
    setIsTyping(false)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
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
