import { useState } from 'react'
import type { Order, OrderStatus, PaymentMethod } from '../../types'
import { STATUS_LABELS } from '../../types'
import { OrderCard } from '../../components/OrderCard'
import { PageHeader } from '../../components/PageHeader'
import { useHorizontalWheelScroll } from '../../hooks/useHorizontalWheelScroll'

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
  const handleFilterWheel = useHorizontalWheelScroll()

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true
    if (filter === 'active') return o.status !== 'ausgeliefert' && o.status !== 'storniert'
    return o.status === filter
  })

  const newCount = orders.filter((o) => o.status === 'neu').length

  return (
    <div className="orders-page fade-in">
      <PageHeader title="Bestellungen" />

      <div className="filter-scroll hide-scrollbar" onWheel={handleFilterWheel}>
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`filter-pill ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            {f.id === 'neu' && newCount > 0 && (
              <span className="filter-count">{newCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filtered.length === 0 ? (
          <div className="empty-state">
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
    </div>
  )
}
