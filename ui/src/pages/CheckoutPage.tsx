import { useState } from 'react'
import type { CartItem, PaymentMethod, Restaurant } from '../types'
import { formatPrice } from '../utils/nui'
import { PageHeader } from '../components/PageHeader'

interface Props {
  cart: CartItem[]
  restaurant: Restaurant
  paymentMethods: PaymentMethod[]
  onBack: () => void
  onSubmit: (data: {
    customerName: string
    phone: string
    address: string
    note: string
    paymentMethod: string
    items: { id: string; name: string; price: number; quantity: number }[]
  }) => void
  loading: boolean
}

export function CheckoutPage({
  cart,
  restaurant,
  paymentMethods,
  onBack,
  onSubmit,
  loading,
}: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState(paymentMethods[0]?.id ?? 'cash')

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + restaurant.deliveryFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      customerName: name,
      phone,
      address,
      note,
      paymentMethod: payment,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    })
  }

  return (
    <div className="checkout-page fade-in">
      <PageHeader title="Checkout" onBack={onBack} />

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            placeholder="Dein Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Telefonnummer *</label>
          <input
            id="phone"
            type="tel"
            placeholder="555-0123"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Lieferadresse *</label>
          <input
            id="address"
            type="text"
            placeholder="Straße, Hausnummer, Stadt"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Hinweis zur Bestellung</label>
          <textarea
            id="note"
            placeholder="z.B. Klingeln, Etage, Allergien..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="payment">Zahlungsart</label>
          <select
            id="payment"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            {paymentMethods.map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="checkout-summary card">
          <div className="summary-row">
            <span>{cart.length} Artikel</span>
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
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Wird gesendet...' : 'Bestellung abschicken'}
        </button>
      </form>

      <style>{`
        .checkout-form {
          padding: 16px;
        }
        .checkout-summary {
          padding: 14px;
          margin-bottom: 16px;
        }
        .checkout-summary .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .checkout-summary .summary-row.total {
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          border-top: 1px solid var(--border);
          margin-top: 8px;
          padding-top: 10px;
        }
        .checkout-summary .summary-row.total span:last-child {
          color: var(--primary);
        }
      `}</style>
    </div>
  )
}
