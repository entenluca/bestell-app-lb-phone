import type { Order, PaymentMethod } from '../../types'
import { OrderCard } from '../../components/OrderCard'
import { PageHeader } from '../../components/PageHeader'

interface Props {
  orders: Order[]
  paymentMethods: PaymentMethod[]
  onMarkDelivery: (orderId: string) => void
  onMarkDelivered: (orderId: string) => void
}

export function DeliveriesPage({
  orders,
  paymentMethods,
  onMarkDelivery,
  onMarkDelivered,
}: Props) {
  const deliveryOrders = orders.filter(
    (o) => o.status === 'bereit' || o.status === 'unterwegs'
  )

  const readyCount = deliveryOrders.filter((o) => o.status === 'bereit').length
  const transitCount = deliveryOrders.filter((o) => o.status === 'unterwegs').length

  return (
    <div className="deliveries-page fade-in">
      <PageHeader title="Auslieferungen" />

      <div className="delivery-stats">
        <div className="delivery-stat card">
          <span className="ds-value" style={{ color: '#8b5cf6' }}>{readyCount}</span>
          <span className="ds-label">Bereit</span>
        </div>
        <div className="delivery-stat card">
          <span className="ds-value" style={{ color: '#06b6d4' }}>{transitCount}</span>
          <span className="ds-label">Unterwegs</span>
        </div>
      </div>

      <div className="orders-list">
        {deliveryOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚚</div>
            <h3>Keine Auslieferungen</h3>
            <p>Alle Bestellungen wurden ausgeliefert.</p>
          </div>
        ) : (
          deliveryOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              paymentMethods={paymentMethods}
              onMarkDelivery={order.status !== 'unterwegs' ? onMarkDelivery : undefined}
              onMarkDelivered={onMarkDelivered}
              showDeliveryActions
            />
          ))
        )}
      </div>

      <style>{`
        .delivery-stats {
          display: flex;
          gap: 10px;
          padding: 12px 16px;
        }
        .delivery-stat {
          flex: 1;
          text-align: center;
          padding: 14px;
        }
        .ds-value {
          display: block;
          font-size: 28px;
          font-weight: 800;
        }
        .ds-label {
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .orders-list {
          padding: 0 16px 16px;
        }
      `}</style>
    </div>
  )
}
