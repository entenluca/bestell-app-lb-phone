import { useEffect, useState } from 'react'
import type { CartItem, DeliveryLocation, PaymentMethod, Restaurant } from '../types'
import { formatPrice } from '../utils/nui'
import { PageHeader } from '../components/PageHeader'
import { DeliveryMapPicker } from '../components/DeliveryMapPicker'
import { Icon } from '../components/Icon'

interface Props {
  cart: CartItem[]
  restaurant: Restaurant
  paymentMethods: PaymentMethod[]
  onBack: () => void
  onSubmit: (data: {
    customerName: string
    phone: string
    address: string
    coords: { x: number; y: number; z: number }
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
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState(paymentMethods[0]?.id ?? 'cash')
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null)

  useEffect(() => {
    if (typeof window.getSettings === 'function') {
      window.getSettings().then((settings) => {
        if (settings?.name) setName(settings.name)
      })
    }
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + restaurant.deliveryFee

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!deliveryLocation) return

    onSubmit({
      customerName: name,
      phone,
      address: deliveryLocation.address,
      coords: { x: deliveryLocation.x, y: deliveryLocation.y, z: deliveryLocation.z },
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
        <DeliveryMapPicker
          location={deliveryLocation}
          onLocationChange={setDeliveryLocation}
        />

        <div className="form-group">
          <label htmlFor="name">
            <Icon name="orders" size={14} /> Name *
          </label>
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
          <label htmlFor="phone">
            <Icon name="phone" size={14} /> Telefonnummer *
          </label>
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
          <label htmlFor="note">
            <Icon name="message" size={14} /> Hinweis zur Bestellung
          </label>
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

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading || !deliveryLocation}
        >
          {loading ? 'Wird gesendet...' : 'Bestellung abschicken'}
        </button>
      </form>
    </div>
  )
}
