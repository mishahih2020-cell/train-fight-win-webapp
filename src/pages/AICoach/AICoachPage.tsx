import { Send } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { ChatMessage } from '@/components/ui/ChatMessage'
import { AI_MESSAGES, AI_QUICK_ACTIONS } from '@/data/mock'
import type { ChatMessageData } from '@/types'

export function AICoachPage() {
  const [messages, setMessages] = useState<ChatMessageData[]>(AI_MESSAGES)
  const [draft, setDraft] = useState('')

  const send = () => {
    if (!draft.trim()) return
    setMessages((m) => [...m, { id: `u${m.length}`, from: 'user', text: draft.trim() }])
    setDraft('')
  }

  return (
    <div className="safe-top px-4 pt-4">
      <h1 className="text-h1 text-[var(--color-text)]">AI Coach</h1>

      <Card className="mt-4 flex items-center gap-3">
        <Avatar size={44} />
        <div>
          <div className="text-body-secondary font-semibold text-[var(--color-text)]">Marat AI</div>
          <div className="text-caption text-[var(--color-text-secondary)]">Не бойся, я рядом, чтобы помочь</div>
        </div>
      </Card>

      <div className="mt-4 flex flex-col gap-3">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {AI_QUICK_ACTIONS.map((qa) => (
          <button
            key={qa.id}
            onClick={() => setMessages((m) => [...m, { id: `q${m.length}`, from: 'user', text: qa.label }])}
            className="press text-body-secondary flex h-11 items-center rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 text-left font-medium text-[var(--color-text)]"
          >
            {qa.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Написать сообщение..."
          className="text-body h-12 flex-1 rounded-[var(--radius-button)] border border-[var(--color-divider)] bg-[var(--color-card)] px-4 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-tertiary)]"
        />
        <button
          onClick={send}
          className="press flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-accent text-white"
          aria-label="Отправить"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      <div className="h-4" />
    </div>
  )
}
