import { useState } from 'react'
import { Icon } from './Icon'

interface Props {
  orderId: string
  onConfirm: (reason: string) => void
  onClose: () => void
}

const MIN_REASON_LENGTH = 3

export function CancelOrderModal({ orderId, onConfirm, onClose }: Props) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = () => {
    const trimmed = reason.trim()
    if (trimmed.length < MIN_REASON_LENGTH) {
      setError(`Bitte gib einen Grund an (mind. ${MIN_REASON_LENGTH} Zeichen).`)
      return
    }
    onConfirm(trimmed)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal card"
        role="dialog"
        aria-labelledby="cancel-order-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="cancel-order-title">Bestellung stornieren</h3>
          <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Schließen">
            <Icon name="close" size={18} />
          </button>
        </div>

        <p className="modal-subtitle">
          Bestellung <strong>{orderId}</strong> wird unwiderruflich storniert.
        </p>

        <div className={`form-group ${error ? 'has-error' : ''}`}>
          <label htmlFor="cancel-reason">Stornierungsgrund *</label>
          <textarea
            id="cancel-reason"
            rows={3}
            placeholder="z. B. Artikel nicht verfügbar, falsche Adresse…"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              if (error) setError(null)
            }}
            maxLength={200}
            autoFocus
          />
          {error && <span className="field-error">{error}</span>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Abbrechen
          </button>
          <button type="button" className="btn btn-danger" onClick={handleSubmit}>
            Stornieren
          </button>
        </div>
      </div>
    </div>
  )
}
