import type { CartItem, Restaurant } from '../types'
import { formatPrice } from '../utils/nui'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'

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
          <div className="empty-icon">
            <Icon name="cart" size={48} />
          </div>
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
                  type="button"
                  className="btn-icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Icon name="minus" size={16} />
                </button>
                <span className="qty">{item.quantity}</span>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Icon name="plus" size={16} />
                </button>
                <button type="button" className="btn btn-ghost btn-sm remove-btn" onClick={() => onRemove(item.id)}>
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
        <button type="button" className="btn btn-primary btn-lg" onClick={onCheckout}>
          Zur Kasse
        </button>
      </div>
    </div>
  )
}
