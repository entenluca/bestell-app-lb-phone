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

function isValidLocation(loc: unknown): loc is DeliveryLocation {
  if (!loc || typeof loc !== 'object') return false
  const data = loc as DeliveryLocation
  return typeof data.x === 'number' && typeof data.y === 'number' && !!data.address
}

interface Props {
  location: DeliveryLocation | null
  onLocationChange: (location: DeliveryLocation) => void
}

export function DeliveryMapPicker({ location, onLocationChange }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const gameMapRef = useRef<GameMapInstance | null>(null)
  const markerRef = useRef<GameMapLocation | null>(null)
  const [loading, setLoading] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updated, setUpdated] = useState(false)

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

  const applyLocation = useCallback((loc: DeliveryLocation) => {
    onLocationChange(loc)
    if (gameMapRef.current) {
      updateMarker(gameMapRef.current, loc)
    }
    setError(null)
    setUpdated(true)
    setTimeout(() => setUpdated(false), 1500)
  }, [onLocationChange, updateMarker])

  const loadPlayerLocation = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const loc = await fetchNui<DeliveryLocation>(
        'getPlayerLocation',
        {},
        isBrowser ? MOCK_LOCATION : undefined
      )

      if (!isValidLocation(loc)) {
        setError('Standort konnte nicht ermittelt werden.')
        return
      }

      applyLocation(loc)
    } catch {
      setError('Verbindung zum Spiel fehlgeschlagen.')
    } finally {
      setLoading(false)
    }
  }, [applyLocation])

  useEffect(() => {
    void loadPlayerLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const hasMap = !isBrowser && !!window.components?.GameMap

  return (
    <div className="delivery-map-picker">
      <div className="delivery-map-header">
        <div>
          <h3>Lieferpunkt auf der Karte</h3>
          <p>Essen wird an deinen aktuellen Standort geliefert</p>
        </div>
        <button
          type="button"
          className={`btn btn-secondary btn-sm location-btn ${updated ? 'location-btn-success' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            loadPlayerLocation()
          }}
          disabled={loading}
        >
          <Icon name="navigation" size={16} />
          {loading ? 'Lädt...' : updated ? 'Aktualisiert' : 'Meine Position'}
        </button>
      </div>

      {error && (
        <div className="location-error">
          <Icon name="map" size={14} />
          {error}
        </div>
      )}

      <div className="delivery-map-container">
        {hasMap ? (
          <div ref={mapRef} className="delivery-map" />
        ) : (
          <div className="delivery-map-fallback">
            <Icon name="map" size={32} />
            <p>Karte wird geladen...</p>
            <span>Tippe „Meine Position" um deinen Standort zu setzen</span>
          </div>
        )}
      </div>

      {location ? (
        <div className={`delivery-address-card ${updated ? 'delivery-address-updated' : ''}`}>
          <Icon name="map" size={18} className="delivery-address-icon" />
          <div>
            <strong>{location.address}</strong>
            <span>
              X: {location.x.toFixed(1)} · Y: {location.y.toFixed(1)}
            </span>
          </div>
        </div>
      ) : (
        <div className="delivery-address-card delivery-address-empty">
          <Icon name="navigation" size={18} className="delivery-address-icon" />
          <div>
            <strong>Kein Lieferpunkt gesetzt</strong>
            <span>Bitte „Meine Position" antippen</span>
          </div>
        </div>
      )}
    </div>
  )
}
