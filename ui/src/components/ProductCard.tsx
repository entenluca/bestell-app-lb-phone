import type { MenuItem } from '../types'
import { formatPrice } from '../utils/nui'

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
          <button className="btn btn-primary btn-sm" onClick={() => onAdd(item)}>
            + Warenkorb
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          display: flex;
          flex-direction: column;
        }
        .product-image {
          height: 140px;
          overflow: hidden;
        }
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-info {
          padding: 14px;
        }
        .product-info h3 {
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .product-desc {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .product-price {
          font-size: 16px;
          font-weight: 800;
          color: var(--primary);
        }
      `}</style>
    </div>
  )
}
