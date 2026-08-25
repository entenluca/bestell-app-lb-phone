import type { CSSProperties } from 'react'
import type { OrderStatus } from '../types'
import { CUSTOMER_STATUS_LABELS, STATUS_COLORS, STATUS_FLOW } from '../types'
import { Icon } from './Icon'

interface Props {
  status: OrderStatus
  cancelReason?: string
}

const STEP_ICONS: Record<OrderStatus, string> = {
  neu: 'bell',
  in_bearbeitung: 'utensils',
  bereit: 'check',
  unterwegs: 'truck',
  ausgeliefert: 'check',
  storniert: 'close',
}

export function OrderStatusTracker({ status, cancelReason }: Props) {
  if (status === 'storniert') {
    return (
      <div className="status-tracker status-tracker-cancelled">
        <span className="status-tracker-badge" style={{ color: STATUS_COLORS.storniert }}>
          <Icon name="close" size={14} />
          Storniert
        </span>
        {cancelReason && (
          <p className="status-cancel-reason">Grund: {cancelReason}</p>
        )}
      </div>
    )
  }

  const currentIdx = STATUS_FLOW.indexOf(status)

  return (
    <div className="status-tracker">
      {STATUS_FLOW.map((step, index) => {
        const isDone = index < currentIdx
        const isActive = index === currentIdx
        const color = STATUS_COLORS[step]

        return (
          <div
            key={step}
            className={`status-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
            style={{ '--step-color': color } as CSSProperties}
          >
            <div className="status-step-marker" style={{ borderColor: isDone || isActive ? color : undefined }}>
              <span style={{ color: isDone || isActive ? color : undefined }}>
                <Icon name={STEP_ICONS[step]} size={14} />
              </span>
            </div>
            <span className="status-step-label">{CUSTOMER_STATUS_LABELS[step]}</span>
          </div>
        )
      })}
    </div>
  )
}
