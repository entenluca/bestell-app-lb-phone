import type { DashboardStats } from '../../types'
import { formatPrice } from '../../utils/nui'
import { PageHeader } from '../../components/PageHeader'
import { Icon } from '../../components/Icon'

interface Props {
  stats: DashboardStats
  onSwitchCustomer: () => void
}

const statCards = [
  { key: 'neu' as const, label: 'Neue Bestellungen', icon: 'bell', color: '#3b82f6' },
  { key: 'in_bearbeitung' as const, label: 'In Bearbeitung', icon: 'pasta', color: '#f59e0b' },
  { key: 'bereit' as const, label: 'Bereit zur Lieferung', icon: 'orders', color: '#8b5cf6' },
  { key: 'unterwegs' as const, label: 'Unterwegs', icon: 'delivery', color: '#06b6d4' },
  { key: 'ausgeliefert' as const, label: 'Ausgeliefert', icon: 'check', color: '#22c55e' },
]

export function DashboardPage({ stats, onSwitchCustomer }: Props) {
  return (
    <div className="dashboard-page fade-in">
      <PageHeader
        title="Dashboard"
        right={
          <button type="button" className="btn btn-ghost btn-sm" onClick={onSwitchCustomer}>
            <Icon name="utensils" size={16} />
            Kunde
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
            <span className="stat-icon" style={{ color: card.color }}>
              <Icon name={card.icon} size={24} />
            </span>
            <div>
              <span className="stat-value" style={{ color: card.color }}>{stats[card.key]}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
