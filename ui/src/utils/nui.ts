const isEnvBrowser = !(window as any).invokeNative

declare global {
  interface Window {
    fetchNui?: <T>(eventName: string, data?: unknown, mockData?: T) => Promise<T>
    onNuiEvent?: <T>(eventName: string, cb: (data: T) => void) => void
    resourceName?: string
  }
}

export async function fetchNui<T = unknown>(
  eventName: string,
  data?: unknown,
  mockData?: T
): Promise<T> {
  if (isEnvBrowser) {
    if (mockData !== undefined) return mockData
    return {} as T
  }

  const resourceName = window.resourceName ?? 'bestell-app-lb-phone'

  try {
    const resp = await fetch(`https://${resourceName}/${eventName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(data ?? {}),
    })

    const result = await resp.json()
    return result as T
  } catch (error) {
    console.error(`[Alpp Food] fetchNui "${eventName}" failed:`, error)

    if (typeof window.fetchNui === 'function') {
      return window.fetchNui<T>(eventName, data)
    }

    if (mockData !== undefined) return mockData
    throw error
  }
}

export function onNuiEvent<T>(action: string, handler: (data: T) => void) {
  if (typeof window.onNuiEvent === 'function') {
    window.onNuiEvent(action, handler)
    return () => {}
  }

  const listener = (event: MessageEvent) => {
    const msg = event.data
    if (msg?.action === action) {
      handler(msg.data as T)
    }
  }
  window.addEventListener('message', listener)
  return () => window.removeEventListener('message', listener)
}

export function applyPhoneSafeArea(top = '3.75rem', side = '0.5rem') {
  const root = document.documentElement
  root.style.setProperty('--phone-safe-top', top)
  root.style.setProperty('--phone-safe-side', side)
}

export function showApp() {
  document.body.style.visibility = 'visible'
}

export function waitForPhoneReady(): Promise<void> {
  if (isEnvBrowser) {
    showApp()
    return Promise.resolve()
  }

  const done = () => showApp()

  if ((window as any).components) {
    done()
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.data === 'componentsLoaded') {
        window.removeEventListener('message', onMessage)
        done()
        resolve()
      }
    }
    window.addEventListener('message', onMessage)
    setTimeout(() => {
      window.removeEventListener('message', onMessage)
      done()
      resolve()
    }, 2000)
  })
}

export function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace('.', ',')}\u00a0€`
}

export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString.replace('T', ' '))
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return isoString
  }
}

export function getPaymentLabel(id: string, methods: { id: string; label: string }[]): string {
  return methods.find((m) => m.id === id)?.label ?? id
}
