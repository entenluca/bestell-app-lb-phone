import type { Order, PaymentMethod } from '../types'
import { CustomerOrderCard } from '../components/CustomerOrderCard'
import { PageHeader } from '../components/PageHeader'
import { Icon } from '../components/Icon'

interface Props {
  orders: Order[]
  paymentMethods: PaymentMethod[]
  onBack: () => void
  loading?: boolean
}

export function MyOrdersPage({ orders, paymentMethods, onBack, loading }: Props) {
  const activeOrders = orders.filter((o) => o.status !== 'ausgeliefert' && o.status !== 'storniert')
  const pastOrders = orders.filter((o) => o.status === 'ausgeliefert' || o.status === 'storniert')

  return (
    <div className="my-orders-page fade-in">
      <PageHeader title="Meine Bestellungen" onBack={onBack} />

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon pulse">
            <Icon name="orders" size={40} />
          </div>
          <h3>Bestellungen werden geladen...</h3>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Icon name="orders" size={40} />
          </div>
          <h3>Keine Bestellungen</h3>
          <p>Du hast noch nichts bestellt. Stöbere in der Speisekarte!</p>
        </div>
      ) : (
        <div className="my-orders-list">
          {activeOrders.length > 0 && (
            <section className="my-orders-section">
              <h2>Aktiv</h2>
              {activeOrders.map((order) => (
                <CustomerOrderCard
                  key={order.id}
                  order={order}
                  paymentMethods={paymentMethods}
                />
              ))}
            </section>
          )}

          {pastOrders.length > 0 && (
            <section className="my-orders-section">
              <h2>Verlauf</h2>
              {pastOrders.map((order) => (
                <CustomerOrderCard
                  key={order.id}
                  order={order}
                  paymentMethods={paymentMethods}
                />
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
