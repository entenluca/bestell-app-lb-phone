import type { Order, OrderStatus, PaymentMethod } from '../types'
import { STATUS_COLORS, STATUS_LABELS, STATUS_FLOW } from '../types'
import { formatPrice, formatTime, getPaymentLabel } from '../utils/nui'

interface Props {
  order: Order
  paymentMethods: PaymentMethod[]
  onStatusChange?: (orderId: string, status: OrderStatus) => void
  onMarkDelivery?: (orderId: string) => void
  onMarkDelivered?: (orderId: string) => void
  compact?: boolean
  showDeliveryActions?: boolean
}

export function OrderCard({
  order,
  paymentMethods,
  onStatusChange,
  onMarkDelivery,
  onMarkDelivered,
  compact = false,
  showDeliveryActions = false,
}: Props) {
  const statusColor = STATUS_COLORS[order.status]
  const currentIdx = STATUS_FLOW.indexOf(order.status)
  const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : null

  const canMarkDelivery = order.status === 'bereit' || order.status === 'in_bearbeitung' || order.status === 'neu'
  const isDelivery = order.status === 'bereit' || order.status === 'unterwegs'

  return (
    <div className="order-card card fade-in">
      <div className="order-card-header">
        <div>
          <span className="order-id">{order.id}</span>
          <span className="order-time">{formatTime(order.createdAt)}</span>
        </div>
        <span
          className="badge"
          style={{ background: statusColor + '22', color: statusColor }}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="order-card-body">
        <div className="order-customer">
          <strong>{order.customerName}</strong>
          <span>📞 {order.phone}</span>
          <span>📍 {order.address}</span>
        </div>

        <div className="order-items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item-row">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {order.note && (
          <div className="order-note">💬 {order.note}</div>
        )}

        <div className="order-meta">
          <span>{getPaymentLabel(order.paymentMethod, paymentMethods)}</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </div>

      {!compact && order.status !== 'ausgeliefert' && order.status !== 'storniert' && (
        <div className="order-actions">
          {canMarkDelivery && onMarkDelivery && (
            <button className="btn btn-delivery" onClick={() => onMarkDelivery(order.id)}>
              🚚 Zur Auslieferung
            </button>
          )}

          {showDeliveryActions && order.status === 'unterwegs' && onMarkDelivered && (
            <button className="btn btn-delivered" onClick={() => onMarkDelivered(order.id)}>
              ✓ Ausgeliefert
            </button>
          )}

          {onStatusChange && nextStatus && !showDeliveryActions && (
            <div className="status-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onStatusChange(order.id, nextStatus)}
              >
                → {STATUS_LABELS[nextStatus]}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onStatusChange(order.id, 'storniert')}
              >
                Stornieren
              </button>
            </div>
          )}

          {onStatusChange && !nextStatus && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onStatusChange(order.id, 'storniert')}
            >
              Stornieren
            </button>
          )}
        </div>
      )}

      {showDeliveryActions && isDelivery && order.status === 'bereit' && onMarkDelivered && (
        <div className="order-actions">
          <button className="btn btn-delivered" onClick={() => onMarkDelivered(order.id)}>
            ✓ Ausgeliefert
          </button>
        </div>
      )}

      <style>{`
        .order-card {
          margin-bottom: 12px;
        }
        .order-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 14px 14px 0;
        }
        .order-id {
          font-weight: 800;
          font-size: 15px;
          display: block;
        }
        .order-time {
          font-size: 12px;
          color: var(--text-secondary);
        }
        .order-card-body {
          padding: 12px 14px;
        }
        .order-customer {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 13px;
          margin-bottom: 10px;
        }
        .order-customer strong {
          font-size: 14px;
        }
        .order-items {
          background: var(--bg);
          border-radius: var(--radius-sm);
          padding: 10px;
          margin-bottom: 8px;
        }
        .order-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 2px 0;
        }
        .order-note {
          font-size: 12px;
          color: var(--text-secondary);
          background: var(--primary-light);
          padding: 8px 10px;
          border-radius: var(--radius-sm);
          margin-bottom: 8px;
        }
        .order-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          padding-top: 4px;
        }
        .order-meta strong {
          font-size: 16px;
          color: var(--primary);
        }
        .order-actions {
          padding: 0 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .status-actions {
          display: flex;
          gap: 8px;
        }
        .status-actions .btn-secondary {
          flex: 1;
        }
      `}</style>
    </div>
  )
}
