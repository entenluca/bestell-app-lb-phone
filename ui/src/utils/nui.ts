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

  if (typeof window.fetchNui === 'function') {
    return window.fetchNui<T>(eventName, data, mockData)
  }

  const resourceName = window.resourceName ?? 'bestell-app-lb-phone'

  const resp = await fetch(`https://${resourceName}/${eventName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data ?? {}),
  })

  return resp.json()
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

export function waitForPhoneReady(): Promise<void> {
  if (isEnvBrowser) return Promise.resolve()
  if ((window as any).components) return Promise.resolve()

  return new Promise((resolve) => {
    const onMessage = (event: MessageEvent) => {
      if (event.data === 'componentsLoaded') {
        window.removeEventListener('message', onMessage)
        resolve()
      }
    }
    window.addEventListener('message', onMessage)
    setTimeout(() => {
      window.removeEventListener('message', onMessage)
      resolve()
    }, 2000)
  })
}

export function formatPrice(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' €'
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
