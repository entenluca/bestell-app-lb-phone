import type { CartItem, Restaurant } from '../types'
import { formatPrice } from '../utils/nui'
import { PageHeader } from '../components/PageHeader'

interface Props {
  cart: CartItem[]
  restaurant: Restaurant
  onBack: () => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
}

export function CartPage({
  cart,
  restaurant,
  onBack,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: Props) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + restaurant.deliveryFee

  if (cart.length === 0) {
    return (
      <div className="fade-in">
        <PageHeader title="Warenkorb" onBack={onBack} />
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Warenkorb ist leer</h3>
          <p>Füge leckere Gerichte hinzu!</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onBack}>
            Zur Speisekarte
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page fade-in">
      <PageHeader title="Warenkorb" onBack={onBack} />

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.id} className="cart-item card">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <span className="cart-item-price">{formatPrice(item.price)}</span>
              <div className="cart-item-controls">
                <button
                  className="btn-icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span className="qty">{item.quantity}</span>
                <button
                  className="btn-icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
                <button className="btn btn-ghost btn-sm remove-btn" onClick={() => onRemove(item.id)}>
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary card">
        <div className="summary-row">
          <span>Zwischensumme</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="summary-row">
          <span>Lieferkosten</span>
          <span>{formatPrice(restaurant.deliveryFee)}</span>
        </div>
        <div className="summary-row total">
          <span>Gesamt</span>
          <span>{formatPrice(total)}</span>
        </div>
        <button className="btn btn-primary btn-lg" onClick={onCheckout}>
          Zur Kasse
        </button>
      </div>

      <style>{`
        .cart-items {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cart-item {
          display: flex;
          gap: 12px;
          padding: 10px;
        }
        .cart-item img {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          flex-shrink: 0;
        }
        .cart-item-info {
          flex: 1;
          min-width: 0;
        }
        .cart-item-info h3 {
          font-size: 14px;
          font-weight: 700;
        }
        .cart-item-price {
          font-size: 14px;
          font-weight: 700;
          color: var(--primary);
        }
        .cart-item-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .qty {
          font-weight: 700;
          min-width: 24px;
          text-align: center;
        }
        .remove-btn {
          margin-left: auto;
          color: #ef4444 !important;
          font-size: 12px;
        }
        .cart-summary {
          margin: 0 16px 16px;
          padding: 16px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .summary-row.total {
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          border-top: 1px solid var(--border);
          margin-top: 8px;
          padding-top: 12px;
        }
        .summary-row.total span:last-child {
          color: var(--primary);
        }
        .cart-summary .btn {
          margin-top: 14px;
        }
      `}</style>
    </div>
  )
}
