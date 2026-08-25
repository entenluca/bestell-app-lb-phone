import { useState } from 'react'
import type { Order, OrderStatus, PaymentMethod } from '../../types'
import { STATUS_LABELS } from '../../types'
import { OrderCard } from '../../components/OrderCard'
import { PageHeader } from '../../components/PageHeader'

interface Props {
  orders: Order[]
  paymentMethods: PaymentMethod[]
  onStatusChange: (orderId: string, status: OrderStatus) => void
  onMarkDelivery: (orderId: string) => void
}

const filters: { id: string; label: string }[] = [
  { id: 'all', label: 'Alle' },
  { id: 'active', label: 'Aktiv' },
  { id: 'neu', label: 'Neu' },
  { id: 'in_bearbeitung', label: 'Bearbeitung' },
  { id: 'bereit', label: 'Bereit' },
  { id: 'unterwegs', label: 'Unterwegs' },
  { id: 'ausgeliefert', label: 'Fertig' },
]

export function OrdersPage({
  orders,
  paymentMethods,
  onStatusChange,
  onMarkDelivery,
}: Props) {
  const [filter, setFilter] = useState('active')

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true
    if (filter === 'active') return o.status !== 'ausgeliefert' && o.status !== 'storniert'
    return o.status === filter
  })

  return (
    <div className="orders-page fade-in">
      <PageHeader title="Bestellungen" />

      <div className="filter-scroll">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-pill ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            {f.id === 'neu' && orders.filter((o) => o.status === 'neu').length > 0 && (
              <span className="filter-count">
                {orders.filter((o) => o.status === 'neu').length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Keine Bestellungen</h3>
            <p>
              {filter === 'active'
                ? 'Alle Bestellungen sind abgeschlossen.'
                : `Keine Bestellungen mit Status „${STATUS_LABELS[filter as OrderStatus] ?? filter}".`}
            </p>
          </div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              paymentMethods={paymentMethods}
              onStatusChange={onStatusChange}
              onMarkDelivery={onMarkDelivery}
            />
          ))
        )}
      </div>

      <style>{`
        .filter-scroll {
          display: flex;
          gap: 6px;
          padding: 10px 16px;
          overflow-x: auto;
        }
        .filter-pill {
          flex-shrink: 0;
          padding: 6px 14px;
          border-radius: 16px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .filter-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .filter-count {
          background: white;
          color: var(--primary);
          font-size: 10px;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .filter-pill.active .filter-count {
          background: rgba(255,255,255,0.3);
          color: white;
        }
        .orders-list {
          padding: 0 16px 16px;
        }
      `}</style>
    </div>
  )
}
