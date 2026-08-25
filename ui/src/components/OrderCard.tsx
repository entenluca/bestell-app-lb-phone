import type { Order, OrderStatus, PaymentMethod } from '../types'
import { STATUS_COLORS, STATUS_LABELS, STATUS_FLOW } from '../types'
import { fetchNui, formatPrice, formatTime, getPaymentLabel } from '../utils/nui'
import { Icon } from './Icon'

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

  const setWaypoint = () => {
    if (!order.coords) return
    fetchNui('setDeliveryWaypoint', { x: order.coords.x, y: order.coords.y })
  }

  return (
    <div className="order-card card fade-in">
      <div className="order-card-header">
        <div className="customer-order-meta">
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
          <span className="order-info-row">
            <Icon name="phone" size={14} />
            {order.phone}
          </span>
          <span className="order-info-row">
            <Icon name="map" size={14} />
            {order.address}
          </span>
        </div>

        <div className="order-items">
          {order.items.map((item) => (
            <div key={`${item.id}-${item.quantity}`} className="order-item-row">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {order.note && (
          <div className="order-note">
            <Icon name="message" size={14} />
            {order.note}
          </div>
        )}

        <div className="order-meta">
          <span>{getPaymentLabel(order.paymentMethod, paymentMethods)}</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </div>

      {!compact && order.status !== 'ausgeliefert' && order.status !== 'storniert' && (
        <div className="order-actions">
          {order.coords && (
            <button type="button" className="btn btn-secondary btn-sm waypoint-btn" onClick={setWaypoint}>
              <Icon name="navigation" size={16} />
              Route setzen
            </button>
          )}

          {canMarkDelivery && onMarkDelivery && (
            <button type="button" className="btn btn-delivery" onClick={() => onMarkDelivery(order.id)}>
              <Icon name="truck" size={18} />
              Zur Auslieferung
            </button>
          )}

          {showDeliveryActions && order.status === 'unterwegs' && onMarkDelivered && (
            <button type="button" className="btn btn-delivered" onClick={() => onMarkDelivered(order.id)}>
              <Icon name="check" size={18} />
              Ausgeliefert
            </button>
          )}

          {onStatusChange && nextStatus && !showDeliveryActions && (
            <div className="status-actions">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onStatusChange(order.id, nextStatus)}
              >
                <Icon name="next" size={14} />
                {STATUS_LABELS[nextStatus]}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onStatusChange(order.id, 'storniert')}
              >
                Stornieren
              </button>
            </div>
          )}

          {onStatusChange && !nextStatus && (
            <button
              type="button"
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
          <button type="button" className="btn btn-delivered" onClick={() => onMarkDelivered(order.id)}>
            <Icon name="check" size={18} />
            Ausgeliefert
          </button>
        </div>
      )}
    </div>
  )
}
