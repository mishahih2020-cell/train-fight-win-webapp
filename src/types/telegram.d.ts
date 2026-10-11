export {}

interface TelegramSafeAreaInset {
  top: number
  bottom: number
  left: number
  right: number
}

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void
        expand: () => void
        requestFullscreen?: () => void
        exitFullscreen?: () => void
        disableVerticalSwipes?: () => void
        setHeaderColor?: (color: string) => void
        setBackgroundColor?: (color: string) => void
        setBottomBarColor?: (color: string) => void
        // Device notch/home-indicator inset (Bot API 8.0+) — separate from
        // contentSafeAreaInset below, which is Telegram's OWN chrome.
        safeAreaInset?: TelegramSafeAreaInset
        // Extra inset needed to clear Telegram's fullscreen-mode back/menu
        // buttons, drawn over the WebView content itself.
        contentSafeAreaInset?: TelegramSafeAreaInset
        onEvent?: (
          event: 'safeAreaChanged' | 'contentSafeAreaChanged' | 'fullscreenChanged' | 'fullscreenFailed',
          cb: () => void,
        ) => void
        offEvent?: (
          event: 'safeAreaChanged' | 'contentSafeAreaChanged' | 'fullscreenChanged' | 'fullscreenFailed',
          cb: () => void,
        ) => void
        BackButton?: {
          show: () => void
          hide: () => void
          onClick: (cb: () => void) => void
          offClick: (cb: () => void) => void
        }
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void
          selectionChanged: () => void
        }
        // Signed by Telegram at launch — trustworthy for display purposes
        // (prefilling a name), but verifying it server-side would need the
        // raw `initData` string checked against the bot token, not this.
        initDataUnsafe?: {
          user?: TelegramUser
        }
      }
    }
  }
}
