import type { Order, PaymentMethod } from '../types'
import { STATUS_COLORS, STATUS_LABELS } from '../types'
import { formatPrice, formatTime, getPaymentLabel } from '../utils/nui'
import { Icon } from './Icon'
import { OrderStatusTracker } from './OrderStatusTracker'

interface Props {
  order: Order
  paymentMethods: PaymentMethod[]
}

export function CustomerOrderCard({ order, paymentMethods }: Props) {
  const statusColor = STATUS_COLORS[order.status]
  const isActive = order.status !== 'ausgeliefert' && order.status !== 'storniert'

  return (
    <div className={`customer-order-card card ${isActive ? 'customer-order-active' : ''}`}>
      <div className="customer-order-header">
        <div className="customer-order-meta">
          <span className="order-id">{order.id}</span>
          <time className="order-time" dateTime={order.createdAt}>
            {formatTime(order.createdAt)} Uhr
          </time>
        </div>
        <span
          className="badge"
          style={{ background: statusColor + '22', color: statusColor }}
        >
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <OrderStatusTracker status={order.status} />

      <div className="customer-order-items">
        {order.items.map((item) => (
          <div key={`${item.id}-${item.quantity}`} className="order-item-row">
            <span>{item.quantity}x {item.name}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="customer-order-footer">
        <span className="order-info-row">
          <Icon name="map" size={14} />
          {order.address}
        </span>
        <div className="order-meta">
          <span>{getPaymentLabel(order.paymentMethod, paymentMethods)}</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      </div>
    </div>
  )
}
