import { memo } from 'react'
import { Icon } from './Icon'

interface Props {
  items: { id: string; label: string; icon: string; badge?: number }[]
  active: string
  onChange: (id: string) => void
}

export const BottomNav = memo(function BottomNav({ items, active, onChange }: Props) {
  return (
    <nav className="bottom-nav" aria-label="Navigation">
      {items.map((item) => {
        const isActive = active === item.id

        return (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="nav-icon-wrap">
              <Icon name={item.icon} size={20} />
              {item.badge != null && item.badge > 0 && (
                <span className="nav-badge">{item.badge > 9 ? '9+' : item.badge}</span>
              )}
            </span>
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
})
