import type { DashboardStats } from '../../types'
import { formatPrice } from '../../utils/nui'
import { PageHeader } from '../../components/PageHeader'

interface Props {
  stats: DashboardStats
  onSwitchCustomer: () => void
}

const statCards = [
  { key: 'neu' as const, label: 'Neue Bestellungen', icon: '🔔', color: '#3b82f6' },
  { key: 'in_bearbeitung' as const, label: 'In Bearbeitung', icon: '👨‍🍳', color: '#f59e0b' },
  { key: 'bereit' as const, label: 'Bereit zur Lieferung', icon: '📦', color: '#8b5cf6' },
  { key: 'unterwegs' as const, label: 'Unterwegs', icon: '🚚', color: '#06b6d4' },
  { key: 'ausgeliefert' as const, label: 'Ausgeliefert', icon: '✅', color: '#22c55e' },
]

export function DashboardPage({ stats, onSwitchCustomer }: Props) {
  return (
    <div className="dashboard-page fade-in">
      <PageHeader
        title="Dashboard"
        right={
          <button className="btn btn-ghost btn-sm" onClick={onSwitchCustomer}>
            🍽️ Kunde
          </button>
        }
      />

      <div className="revenue-card card">
        <span className="revenue-label">Tagesumsatz</span>
        <span className="revenue-value">{formatPrice(stats.tagesumsatz)}</span>
      </div>

      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.key} className="stat-card card" style={{ borderLeft: `4px solid ${card.color}` }}>
            <span className="stat-icon">{card.icon}</span>
            <div>
              <span className="stat-value" style={{ color: card.color }}>{stats[card.key]}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .dashboard-page {
          padding-bottom: 16px;
        }
        .revenue-card {
          margin: 16px;
          padding: 20px;
          text-align: center;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
        }
        .revenue-label {
          display: block;
          font-size: 13px;
          opacity: 0.85;
          margin-bottom: 4px;
        }
        .revenue-value {
          font-size: 32px;
          font-weight: 800;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 0 16px;
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px;
        }
        .stat-icon {
          font-size: 24px;
        }
        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: 800;
          line-height: 1;
        }
        .stat-label {
          font-size: 11px;
          color: var(--text-secondary);
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}
