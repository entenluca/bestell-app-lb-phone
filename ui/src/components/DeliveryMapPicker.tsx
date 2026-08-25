import { useCallback, useEffect, useRef, useState } from 'react'
import type { DeliveryLocation } from '../types'
import { fetchNui } from '../utils/nui'
import { Icon } from './Icon'

type GameMapLocation = {
  id: number
  title?: string
  image?: string
  coords: { x: number; y: number }
}

type GameMapInstance = {
  ready: Promise<void>
  setPosition(position: { x: number; y: number }, zoomLevel?: number): boolean
  setShowSelf(show: boolean): Promise<void>
  addLocation(data: { title?: string; coords: { x: number; y: number } }): GameMapLocation | null
  removeLocation(location: GameMapLocation | number): boolean
  destroy(): void
}

const isBrowser = !(window as any).invokeNative

const MOCK_LOCATION: DeliveryLocation = {
  x: -265.0,
  y: -963.0,
  z: 31.2,
  address: 'Legion Square, Los Santos',
}

interface Props {
  location: DeliveryLocation | null
  onLocationChange: (location: DeliveryLocation) => void
}

export function DeliveryMapPicker({ location, onLocationChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const gameMapRef = useRef<GameMapInstance | null>(null)
  const markerRef = useRef<GameMapLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)

  const updateMarker = useCallback((map: GameMapInstance, loc: DeliveryLocation) => {
    if (markerRef.current) {
      map.removeLocation(markerRef.current)
    }
    markerRef.current = map.addLocation({
      title: 'Lieferadresse',
      coords: { x: loc.x, y: loc.y },
    })
    map.setPosition({ x: loc.x, y: loc.y }, 4)
  }, [])

  const loadPlayerLocation = useCallback(async () => {
    setLoading(true)
    try {
      const loc = await fetchNui<DeliveryLocation>('getPlayerLocation', {}, MOCK_LOCATION)
      if (loc?.x != null && loc?.y != null) {
        onLocationChange(loc)
        if (gameMapRef.current) {
          updateMarker(gameMapRef.current, loc)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [onLocationChange, updateMarker])

  useEffect(() => {
    loadPlayerLocation()
  }, [loadPlayerLocation])

  useEffect(() => {
    if (isBrowser || !mapRef.current) {
      setMapReady(false)
      return
    }

    const GameMap = window.components?.GameMap
    if (!GameMap) {
      setMapReady(false)
      return
    }

    let destroyed = false
    const map = new GameMap(mapRef.current, {
      allowMoving: true,
      center: location ? { x: location.x, y: location.y } : undefined,
      defaultZoom: 4,
      minZoom: 2,
      maxZoom: 6,
    })

    gameMapRef.current = map

    map.ready.then(async () => {
      if (destroyed) return
      await map.setShowSelf(true)
      setMapReady(true)
      if (location) {
        updateMarker(map, location)
      }
    })

    return () => {
      destroyed = true
      map.destroy()
      gameMapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (location && gameMapRef.current && mapReady) {
      updateMarker(gameMapRef.current, location)
    }
  }, [location, mapReady, updateMarker])

  return (
    <div className="delivery-map-picker">
      <div className="delivery-map-header">
        <div>
          <h3>Lieferpunkt auf der Karte</h3>
          <p>Essen wird an deinen gewählten Standort geliefert</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={loadPlayerLocation}
          disabled={loading}
        >
          <Icon name="navigation" size={16} />
          {loading ? 'Lädt...' : 'Meine Position'}
        </button>
      </div>

      <div className="delivery-map-container">
        {isBrowser || !window.components?.GameMap ? (
          <div className="delivery-map-fallback">
            <Icon name="map" size={32} />
            <p>Kartenansicht (im Spiel verfügbar)</p>
            {location && <span>{location.address}</span>}
          </div>
        ) : (
          <div ref={mapRef} className="delivery-map" />
        )}
      </div>

      {location && (
        <div className="delivery-address-card">
          <Icon name="map" size={18} className="delivery-address-icon" />
          <div>
            <strong>{location.address}</strong>
            <span>
              X: {location.x.toFixed(1)} · Y: {location.y.toFixed(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
