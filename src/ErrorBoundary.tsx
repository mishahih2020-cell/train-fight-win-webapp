import { Component, type ReactNode } from 'react'

interface State {
  error: Error | null
}

// Without this, any render error (a bad platform API, an unsupported CSS/JS
// feature in an old WebView, etc.) unmounts the whole tree silently — the
// user just sees the plain black <body> background with no clue why.
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 24,
            textAlign: 'center',
            color: '#ffffff',
            background: '#0b0b0d',
            fontFamily: 'sans-serif',
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 700 }}>Не удалось загрузить приложение</p>
          <p style={{ fontSize: 13, color: '#a0a0a0', maxWidth: 280 }}>
            Попробуй закрыть и открыть WebApp заново. Если не поможет — обнови Telegram.
          </p>
          <p style={{ fontSize: 11, color: '#6a6a6e', wordBreak: 'break-word', maxWidth: 320 }}>
            {this.state.error.message}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
