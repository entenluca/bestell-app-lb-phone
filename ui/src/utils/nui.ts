const isEnvBrowser = !(window as any).invokeNative

export async function fetchNui<T = unknown>(
  eventName: string,
  data?: unknown,
  mockData?: T
): Promise<T> {
  if (isEnvBrowser) {
    if (mockData !== undefined) return mockData
    return {} as T
  }

  const resourceName = (window as any).resourceName ?? 'bestell-app-lb-phone'

  const resp = await fetch(`https://${resourceName}/${eventName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data ?? {}),
  })

  return resp.json()
}

export function onNuiEvent<T>(action: string, handler: (data: T) => void) {
  const listener = (event: MessageEvent) => {
    const msg = event.data
    if (msg?.action === action) {
      handler(msg.data as T)
    }
  }
  window.addEventListener('message', listener)
  return () => window.removeEventListener('message', listener)
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
