export type OrderStatus =
  | 'neu'
  | 'in_bearbeitung'
  | 'bereit'
  | 'unterwegs'
  | 'ausgeliefert'
  | 'storniert'

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface Category {
  id: string
  label: string
  icon: string
}

export interface DeliveryLocation {
  x: number
  y: number
  z: number
  address: string
}

export interface CartItem extends MenuItem {
  quantity: number
}

export interface PaymentMethod {
  id: string
  label: string
}

export interface Restaurant {
  name: string
  tagline: string
  logo: string
  deliveryFee: number
  minOrder: number
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  status: OrderStatus
  createdAt: string
  customerName: string
  phone: string
  address: string
  coords?: { x: number; y: number; z: number }
  note: string
  paymentMethod: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  total: number
  updatedAt?: string
}

export interface DashboardStats {
  neu: number
  in_bearbeitung: number
  bereit: number
  unterwegs: number
  ausgeliefert: number
  tagesumsatz: number
}

export interface InitData {
  restaurant: Restaurant
  menu: MenuItem[]
  categories: Category[]
  paymentMethods: PaymentMethod[]
  isStaff: boolean
  phoneSafeTop?: string
  phoneSafeSide?: string
}

export type CustomerView = 'home' | 'cart' | 'checkout' | 'confirmation'
export type StaffView = 'dashboard' | 'orders' | 'deliveries'
export type AppMode = 'customer' | 'staff'

export const STATUS_LABELS: Record<OrderStatus, string> = {
  neu: 'Neue Bestellung',
  in_bearbeitung: 'In Bearbeitung',
  bereit: 'Bereit zur Lieferung',
  unterwegs: 'Unterwegs',
  ausgeliefert: 'Ausgeliefert',
  storniert: 'Storniert',
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  neu: '#3b82f6',
  in_bearbeitung: '#f59e0b',
  bereit: '#8b5cf6',
  unterwegs: '#06b6d4',
  ausgeliefert: '#22c55e',
  storniert: '#ef4444',
}

export const STATUS_FLOW: OrderStatus[] = [
  'neu',
  'in_bearbeitung',
  'bereit',
  'unterwegs',
  'ausgeliefert',
]
