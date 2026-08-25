import type { MenuItem } from '../types'
import { formatPrice } from '../utils/nui'
import { Icon } from './Icon'

interface Props {
  item: MenuItem
  onAdd: (item: MenuItem) => void
}

export function ProductCard({ item, onAdd }: Props) {
  return (
    <div className="product-card card fade-in">
      <div className="product-image">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <div className="product-info">
        <h3>{item.name}</h3>
        <p className="product-desc">{item.description}</p>
        <div className="product-footer">
          <span className="product-price">{formatPrice(item.price)}</span>
          <button
            type="button"
            className="btn btn-primary btn-sm product-add-btn"
            onClick={() => onAdd(item)}
            aria-label={`${item.name} hinzufügen`}
          >
            <Icon name="plus" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
