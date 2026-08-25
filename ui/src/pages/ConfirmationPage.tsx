import { formatPrice } from '../utils/nui'
import { Icon } from '../components/Icon'

interface Props {
  orderId: string
  total: number
  onBackHome: () => void
  onTrackOrder: () => void
}

export function ConfirmationPage({ orderId, total, onBackHome, onTrackOrder }: Props) {
  return (
    <div className="confirmation-page fade-in">
      <div className="confirmation-content">
        <div className="confirmation-icon success-icon">
          <Icon name="check" size={40} />
        </div>
        <h1>Bestellung bestätigt!</h1>
        <p className="confirmation-sub">Vielen Dank für deine Bestellung</p>

        <div className="confirmation-card card">
          <div className="conf-row">
            <span>Bestellnummer</span>
            <strong>{orderId}</strong>
          </div>
          <div className="conf-row">
            <span>Gesamtpreis</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>

        <p className="confirmation-info">
          Dein Essen wird zubereitet und an deinen Standort geliefert (ca. 25–35 Min.).
        </p>

        <div className="confirmation-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={onTrackOrder}>
            <Icon name="orders" size={18} />
            Status verfolgen
          </button>
          <button type="button" className="btn btn-secondary btn-lg" onClick={onBackHome}>
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  )
}
