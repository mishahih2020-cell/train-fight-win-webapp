import type { ChatMessageData } from '@/types'
import { Avatar } from './Avatar'

export function ChatMessage({ message }: { message: ChatMessageData }) {
  const isUser = message.from === 'user'
  return (
    <div className={`animate-slide-up flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && <Avatar size={28} />}
      <div
        className={`text-body-secondary max-w-[78%] rounded-[var(--radius-card)] px-4 py-3 whitespace-pre-line ${
          isUser
            ? 'gradient-accent rounded-tr-[4px] text-white'
            : 'rounded-tl-[4px] border border-[var(--color-divider)] bg-[var(--color-card)] text-[var(--color-text)]'
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}
