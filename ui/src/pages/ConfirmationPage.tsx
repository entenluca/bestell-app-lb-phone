import { formatPrice } from '../utils/nui'

interface Props {
  orderId: string
  total: number
  onBackHome: () => void
}

export function ConfirmationPage({ orderId, total, onBackHome }: Props) {
  return (
    <div className="confirmation-page fade-in">
      <div className="confirmation-content">
        <div className="confirmation-icon">✅</div>
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
          Dein Essen wird zubereitet und in ca. 25–35 Minuten geliefert.
        </p>

        <button className="btn btn-primary btn-lg" onClick={onBackHome}>
          Zurück zur Startseite
        </button>
      </div>

      <style>{`
        .confirmation-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100%;
          padding: 24px;
        }
        .confirmation-content {
          text-align: center;
          max-width: 320px;
        }
        .confirmation-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
        .confirmation-content h1 {
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .confirmation-sub {
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
        .confirmation-card {
          padding: 16px;
          margin-bottom: 16px;
          text-align: left;
        }
        .conf-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 14px;
        }
        .conf-row strong {
          color: var(--primary);
        }
        .confirmation-info {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  )
}
