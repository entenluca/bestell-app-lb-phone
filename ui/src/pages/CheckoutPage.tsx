import { useEffect, useState } from 'react'
import type { CartItem, DeliveryLocation, PaymentMethod, Restaurant } from '../types'
import { fetchNui, formatPrice, sanitizeName, sanitizePhoneNumber } from '../utils/nui'
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

type FieldErrors = {
  name?: string
  phone?: string
  location?: string
}

function validateCheckout(
  name: string,
  phone: string,
  deliveryLocation: DeliveryLocation | null
): FieldErrors {
  const errors: FieldErrors = {}

  if (!name.trim()) {
    errors.name = 'Bitte gib deinen Namen ein.'
  }

  if (!phone.trim()) {
    errors.phone = 'Bitte gib deine Telefonnummer ein.'
  }

  if (!deliveryLocation) {
    errors.location = 'Bitte setze deinen Lieferpunkt mit „Meine Position".'
  }

  return errors
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
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  useEffect(() => {
    const loadPhone = async () => {
      const isBrowser = !(window as any).invokeNative
      const data = await fetchNui<{ phone?: string }>(
        'getPlayerPhone',
        {},
        isBrowser ? { phone: '5550123' } : undefined
      )

      if (data?.phone) {
        setPhone(sanitizePhoneNumber(data.phone))
      }
    }

    void loadPhone()
  }, [])

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + restaurant.deliveryFee

  const clearError = (field: keyof FieldErrors) => {
    if (!errors[field]) return
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitAttempted(true)

    const nextErrors = validateCheckout(name, phone, deliveryLocation)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || !deliveryLocation) return

    onSubmit({
      customerName: name.trim(),
      phone: phone.trim(),
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

      <form onSubmit={handleSubmit} className="checkout-form" noValidate>
        <div className={submitAttempted && errors.location ? 'checkout-section has-error' : 'checkout-section'}>
          <DeliveryMapPicker
            location={deliveryLocation}
            onLocationChange={(loc) => {
              setDeliveryLocation(loc)
              clearError('location')
            }}
          />
          {submitAttempted && errors.location && (
            <p className="field-error" role="alert">
              <Icon name="map" size={14} />
              {errors.location}
            </p>
          )}
        </div>

        <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
          <label htmlFor="name">
            <Icon name="orders" size={14} /> Name *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Dein Name"
            value={name}
            onChange={(e) => {
              setName(sanitizeName(e.target.value))
              clearError('name')
            }}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p className="field-error" id="name-error" role="alert">
              <Icon name="bell" size={14} />
              {errors.name}
            </p>
          )}
        </div>

        <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
          <label htmlFor="phone">
            <Icon name="phone" size={14} /> Telefonnummer *
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="tel"
            placeholder="5550123"
            value={phone}
            onChange={(e) => {
              setPhone(sanitizePhoneNumber(e.target.value))
              clearError('phone')
            }}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone ? (
            <p className="field-error" id="phone-error" role="alert">
              <Icon name="phone" size={14} />
              {errors.phone}
            </p>
          ) : phone ? (
            <span className="input-hint">Aus deinem Handy übernommen</span>
          ) : null}
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
          disabled={loading}
        >
          {loading ? 'Wird gesendet...' : 'Bestellung abschicken'}
        </button>
      </form>
    </div>
  )
}
