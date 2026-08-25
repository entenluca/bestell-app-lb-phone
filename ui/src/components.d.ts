interface GameMapLocation {
  id: number
  title?: string
  image?: string
  coords: { x: number; y: number }
}

interface GameMapInstance {
  ready: Promise<void>
  currentCoords: { x: number; y: number } | null
  setZoom(zoomLevel: number): boolean
  getZoom(): number | null
  setPosition(position: { x: number; y: number } | [number, number], zoomLevel?: number): boolean
  setShowSelf(show: boolean): Promise<void>
  addLocation(data: { title?: string; image?: string; coords: { x: number; y: number } }): GameMapLocation | null
  removeLocation(location: GameMapLocation | number): boolean
  destroy(): void
}

interface GameMapConstructor {
  new (
    container: HTMLElement,
    options?: {
      allowMoving?: boolean
      center?: { x: number; y: number } | [number, number]
      minZoom?: number
      maxZoom?: number
      defaultZoom?: number
    }
  ): GameMapInstance
}

declare global {
  interface Window {
    components?: {
      GameMap?: GameMapConstructor
      [key: string]: unknown
    }
    getSettings?: () => Promise<{ name?: string; [key: string]: unknown }>
  }
}

export {}
