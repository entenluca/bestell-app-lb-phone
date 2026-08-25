import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  AppMode,
  CartItem,
  CustomerView,
  DashboardStats,
  InitData,
  MenuItem,
  Order,
  OrderStatus,
  StaffView,
} from './types'
import { mockInitData, mockOrders } from './data/mock'
import { fetchNui, onNuiEvent } from './utils/nui'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { DashboardPage } from './pages/staff/DashboardPage'
import { OrdersPage } from './pages/staff/OrdersPage'
import { DeliveriesPage } from './pages/staff/DeliveriesPage'

const isBrowser = !(window as any).invokeNative

function computeStats(orders: Order[]): DashboardStats {
  const stats: DashboardStats = {
    neu: 0,
    in_bearbeitung: 0,
    bereit: 0,
    unterwegs: 0,
    ausgeliefert: 0,
    tagesumsatz: 0,
  }

  const today = new Date().toISOString().slice(0, 10)

  for (const order of orders) {
    if (order.status === 'neu') stats.neu++
    if (order.status === 'in_bearbeitung') stats.in_bearbeitung++
    if (order.status === 'bereit') stats.bereit++
    if (order.status === 'unterwegs') stats.unterwegs++
    if (order.status === 'ausgeliefert') stats.ausgeliefert++
    if (order.createdAt.slice(0, 10) === today && order.status !== 'storniert') {
      stats.tagesumsatz += order.total
    }
  }

  return stats
}

export default function App() {
  const [initData, setInitData] = useState<InitData | null>(isBrowser ? mockInitData : null)
  const [orders, setOrders] = useState<Order[]>(isBrowser ? mockOrders : [])
  const [stats, setStats] = useState<DashboardStats>(computeStats(isBrowser ? mockOrders : []))
  const [mode, setMode] = useState<AppMode>('customer')
  const [customerView, setCustomerView] = useState<CustomerView>('home')
  const [staffView, setStaffView] = useState<StaffView>('dashboard')
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total: number } | null>(null)

  useEffect(() => {
    if (isBrowser) return

    fetchNui('getInitData')

    const cleanups = [
      onNuiEvent<InitData>('initData', (data) => setInitData(data)),
      onNuiEvent<{ orders: Order[]; stats: DashboardStats }>('ordersData', (data) => {
        setOrders(data.orders)
        setStats(data.stats)
      }),
      onNuiEvent<Order[]>('ordersUpdated', (data) => {
        setOrders(data)
        setStats(computeStats(data))
      }),
      onNuiEvent<{ success: boolean; orderId?: string; total?: number; message?: string }>(
        'orderResult',
        (result) => {
          setLoading(false)
          if (result.success && result.orderId && result.total != null) {
            setCart([])
            setConfirmedOrder({ id: result.orderId, total: result.total })
            setCustomerView('confirmation')
          }
        }
      ),
    ]

    return () => cleanups.forEach((fn) => fn())
  }, [])

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const addToCart = useCallback((item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id)
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((c) => c.id !== id))
    } else {
      setCart((prev) => prev.map((c) => (c.id === id ? { ...c, quantity } : c)))
    }
  }, [])

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const handleSubmitOrder = useCallback(
    (data: Parameters<typeof CheckoutPage>[0]['onSubmit'] extends (d: infer D) => void ? D : never) => {
      setLoading(true)

      if (isBrowser) {
        setTimeout(() => {
          const newOrder: Order = {
            id: `AF-${Date.now()}`,
            status: 'neu',
            createdAt: new Date().toISOString(),
            customerName: data.customerName,
            phone: data.phone,
            address: data.address,
            note: data.note,
            paymentMethod: data.paymentMethod,
            items: data.items,
            subtotal: data.items.reduce((s, i) => s + i.price * i.quantity, 0),
            deliveryFee: initData?.restaurant.deliveryFee ?? 4.5,
            total:
              data.items.reduce((s, i) => s + i.price * i.quantity, 0) +
              (initData?.restaurant.deliveryFee ?? 4.5),
          }
          setOrders((prev) => {
            const updated = [newOrder, ...prev]
            setStats(computeStats(updated))
            return updated
          })
          setCart([])
          setConfirmedOrder({ id: newOrder.id, total: newOrder.total })
          setCustomerView('confirmation')
          setLoading(false)
        }, 800)
        return
      }

      fetchNui('createOrder', data)
    },
    [initData]
  )

  const handleStatusChange = useCallback((orderId: string, status: OrderStatus) => {
    if (isBrowser) {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
        )
        setStats(computeStats(updated))
        return updated
      })
      return
    }
    fetchNui('updateStatus', { orderId, status })
  }, [])

  const handleMarkDelivery = useCallback((orderId: string) => {
    if (isBrowser) {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.id === orderId ? { ...o, status: 'unterwegs' as const, updatedAt: new Date().toISOString() } : o
        )
        setStats(computeStats(updated))
        return updated
      })
      return
    }
    fetchNui('markForDelivery', { orderId })
  }, [])

  const handleMarkDelivered = useCallback((orderId: string) => {
    if (isBrowser) {
      setOrders((prev) => {
        const updated = prev.map((o) =>
          o.id === orderId ? { ...o, status: 'ausgeliefert' as const, updatedAt: new Date().toISOString() } : o
        )
        setStats(computeStats(updated))
        return updated
      })
      return
    }
    fetchNui('markDelivered', { orderId })
  }, [])

  const refreshOrders = useCallback(() => {
    if (!isBrowser) fetchNui('getOrders')
  }, [])

  useEffect(() => {
    if (mode === 'staff') refreshOrders()
  }, [mode, staffView, refreshOrders])

  if (!initData) {
    return (
      <div className="app">
        <div className="empty-state" style={{ marginTop: '40%' }}>
          <div className="empty-icon pulse">🍽️</div>
          <h3>Wird geladen...</h3>
        </div>
      </div>
    )
  }

  const customerNav = customerView === 'home' && cartCount > 0

  return (
    <div className="app">
      <div className={`app-content ${mode === 'staff' || customerView !== 'home' ? 'no-nav' : ''}`}>
        {mode === 'customer' ? (
          <>
            {customerView === 'home' && (
              <HomePage
                restaurant={initData.restaurant}
                menu={initData.menu}
                categories={initData.categories}
                cartCount={cartCount}
                onAddToCart={addToCart}
                onOpenCart={() => setCustomerView('cart')}
                onSwitchStaff={() => setMode('staff')}
                isStaff={initData.isStaff}
              />
            )}
            {customerView === 'cart' && (
              <CartPage
                cart={cart}
                restaurant={initData.restaurant}
                onBack={() => setCustomerView('home')}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onCheckout={() => setCustomerView('checkout')}
              />
            )}
            {customerView === 'checkout' && (
              <CheckoutPage
                cart={cart}
                restaurant={initData.restaurant}
                paymentMethods={initData.paymentMethods}
                onBack={() => setCustomerView('cart')}
                onSubmit={handleSubmitOrder}
                loading={loading}
              />
            )}
            {customerView === 'confirmation' && confirmedOrder && (
              <ConfirmationPage
                orderId={confirmedOrder.id}
                total={confirmedOrder.total}
                onBackHome={() => {
                  setConfirmedOrder(null)
                  setCustomerView('home')
                }}
              />
            )}
          </>
        ) : (
          <>
            {staffView === 'dashboard' && (
              <DashboardPage
                stats={stats}
                onSwitchCustomer={() => setMode('customer')}
              />
            )}
            {staffView === 'orders' && (
              <OrdersPage
                orders={orders}
                paymentMethods={initData.paymentMethods}
                onStatusChange={handleStatusChange}
                onMarkDelivery={handleMarkDelivery}
              />
            )}
            {staffView === 'deliveries' && (
              <DeliveriesPage
                orders={orders}
                paymentMethods={initData.paymentMethods}
                onMarkDelivery={handleMarkDelivery}
                onMarkDelivered={handleMarkDelivered}
              />
            )}
          </>
        )}
      </div>

      {mode === 'staff' && (
        <BottomNav
          active={staffView}
          onChange={(id) => setStaffView(id as StaffView)}
          items={[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            {
              id: 'orders',
              label: 'Bestellungen',
              icon: '📋',
              badge: orders.filter((o) => o.status === 'neu').length,
            },
            {
              id: 'deliveries',
              label: 'Auslieferung',
              icon: '🚚',
              badge: orders.filter((o) => o.status === 'bereit' || o.status === 'unterwegs').length,
            },
          ]}
        />
      )}

      {mode === 'customer' && customerView === 'home' && !customerNav && (
        <div style={{ height: 0 }} />
      )}
    </div>
  )
}
