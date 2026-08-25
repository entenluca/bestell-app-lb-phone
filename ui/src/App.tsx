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
import { fetchNui, onNuiEvent, waitForPhoneReady, applyPhoneSafeArea } from './utils/nui'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './pages/HomePage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { MyOrdersPage } from './pages/MyOrdersPage'
import { DashboardPage } from './pages/staff/DashboardPage'
import { OrdersPage } from './pages/staff/OrdersPage'
import { DeliveriesPage } from './pages/staff/DeliveriesPage'
import { Icon } from './components/Icon'

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
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [myOrderIds, setMyOrderIds] = useState<Set<string>>(new Set())
  const [myOrdersLoading, setMyOrdersLoading] = useState(false)
  const [stats, setStats] = useState<DashboardStats>(computeStats(isBrowser ? mockOrders : []))
  const [mode, setMode] = useState<AppMode>('customer')
  const [customerView, setCustomerView] = useState<CustomerView>('home')
  const [staffView, setStaffView] = useState<StaffView>('dashboard')
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState<{ id: string; total: number } | null>(null)

  useEffect(() => {
    if (isBrowser) return

    let cancelled = false

    const init = async () => {
      await waitForPhoneReady()
      const data = await fetchNui<InitData>('getInitData')
      if (!cancelled && data?.menu?.length) {
        applyPhoneSafeArea(data.phoneSafeTop ?? '3.75rem', data.phoneSafeSide ?? '0.5rem')
        setInitData(data)
      } else if (!cancelled) {
        setLoadError(true)
      }
    }

    init()

    onNuiEvent<{ isStaff: boolean }>('staffStatus', (data) => {
      setInitData((prev) => (prev ? { ...prev, isStaff: data.isStaff } : prev))
    })
    onNuiEvent<Order[]>('myOrdersData', (data) => {
      setMyOrders(data)
      setMyOrdersLoading(false)
    })
    onNuiEvent<{ orders: Order[]; stats: DashboardStats }>('ordersData', (data) => {
      setOrders(data.orders)
      setStats(data.stats)
    })
    onNuiEvent<Order[]>('ordersUpdated', (data) => {
      setOrders(data)
      setStats(computeStats(data))
    })
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
    )

    return () => {
      cancelled = true
    }
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
            coords: data.coords,
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
          setMyOrders((prev) => [newOrder, ...prev])
          setMyOrderIds((prev) => new Set([...prev, newOrder.id]))
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

  const refreshMyOrders = useCallback(() => {
    if (isBrowser) return
    setMyOrdersLoading(true)
    fetchNui('getMyOrders')
  }, [])

  useEffect(() => {
    if (!initData || isBrowser) return
    refreshMyOrders()
  }, [initData, refreshMyOrders])

  useEffect(() => {
    if (!isBrowser || myOrderIds.size === 0) return
    setMyOrders(orders.filter((order) => myOrderIds.has(order.id)))
  }, [orders, isBrowser, myOrderIds])

  const refreshOrders = useCallback(() => {
    if (!isBrowser) fetchNui('getOrders')
  }, [])

  useEffect(() => {
    if (mode === 'staff') refreshOrders()
  }, [mode, staffView, refreshOrders])

  const activeMyOrdersCount = useMemo(
    () => myOrders.filter((o) => o.status !== 'ausgeliefert' && o.status !== 'storniert').length,
    [myOrders]
  )

  if (!initData) {
    return (
      <div className="app">
        <div className="empty-state" style={{ marginTop: '40%' }}>
          <div className="empty-icon pulse">
            <Icon name="utensils" size={48} />
          </div>
          <h3>{loadError ? 'App konnte nicht geladen werden' : 'Wird geladen...'}</h3>
          {loadError && (
            <p style={{ marginTop: 8, fontSize: 13 }}>
              Bitte Resource neu starten: <code>restart bestell-app-lb-phone</code>
            </p>
          )}
        </div>
      </div>
    )
  }

  const showCustomerNav = mode === 'customer' && (customerView === 'home' || customerView === 'orders')
  const hasBottomNav = showCustomerNav || mode === 'staff'

  return (
    <div className="app">
      <div className={`app-content ${hasBottomNav ? '' : 'no-nav'}`}>
        {mode === 'customer' ? (
          <>
            {customerView === 'home' && (
              <HomePage
                restaurant={initData.restaurant}
                menu={initData.menu}
                categories={initData.categories}
                cartCount={cartCount}
                activeOrdersCount={activeMyOrdersCount}
                onAddToCart={addToCart}
                onOpenCart={() => setCustomerView('cart')}
                onOpenOrders={() => setCustomerView('orders')}
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
                onTrackOrder={() => {
                  setConfirmedOrder(null)
                  setCustomerView('orders')
                  refreshMyOrders()
                }}
              />
            )}
            {customerView === 'orders' && (
              <MyOrdersPage
                orders={myOrders}
                paymentMethods={initData.paymentMethods}
                onBack={() => setCustomerView('home')}
                loading={myOrdersLoading}
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

      {showCustomerNav && (
        <BottomNav
          active={customerView === 'orders' ? 'orders' : 'home'}
          onChange={(id) => setCustomerView(id as CustomerView)}
          items={[
            { id: 'home', label: 'Speisekarte', icon: 'utensils' },
            {
              id: 'orders',
              label: 'Bestellungen',
              icon: 'orders',
              badge: activeMyOrdersCount,
            },
          ]}
        />
      )}

      {mode === 'staff' && (
        <BottomNav
          active={staffView}
          onChange={(id) => setStaffView(id as StaffView)}
          items={[
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
            {
              id: 'orders',
              label: 'Bestellungen',
              icon: 'orders',
              badge: orders.filter((o) => o.status === 'neu').length,
            },
            {
              id: 'deliveries',
              label: 'Auslieferung',
              icon: 'delivery',
              badge: orders.filter((o) => o.status === 'bereit' || o.status === 'unterwegs').length,
            },
          ]}
        />
      )}

    </div>
  )
}
