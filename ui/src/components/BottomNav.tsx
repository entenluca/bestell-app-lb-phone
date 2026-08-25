import { Icon } from './Icon'

interface Props {
  items: { id: string; label: string; icon: string; badge?: number }[]
  active: string
  onChange: (id: string) => void
}

export function BottomNav({ items, active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          <span className="nav-icon">
            <Icon name={item.icon} size={22} />
          </span>
          <span>{item.label}</span>
          {item.badge != null && item.badge > 0 && (
            <span className="nav-badge">{item.badge}</span>
          )}
        </button>
      ))}
    </nav>
  )
}
