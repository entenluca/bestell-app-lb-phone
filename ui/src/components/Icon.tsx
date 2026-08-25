import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CakeSlice,
  Check,
  ChefHat,
  ClipboardList,
  Clock,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  Minus,
  Navigation,
  Phone,
  Pizza,
  Plus,
  Salad,
  ShoppingCart,
  Truck,
  UtensilsCrossed,
  Wine,
  X,
  type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  utensils: UtensilsCrossed,
  pizza: Pizza,
  pasta: ChefHat,
  salate: Salad,
  getraenke: Wine,
  desserts: CakeSlice,
  cart: ShoppingCart,
  truck: Truck,
  map: MapPin,
  phone: Phone,
  clock: Clock,
  check: Check,
  plus: Plus,
  minus: Minus,
  back: ArrowLeft,
  next: ArrowRight,
  dashboard: LayoutDashboard,
  orders: ClipboardList,
  delivery: Truck,
  bell: Bell,
  navigation: Navigation,
  message: MessageSquare,
  close: X,
}

interface Props {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ name, size = 18, className, strokeWidth = 2 }: Props) {
  const LucideIcon = ICONS[name] ?? MapPin
  return <LucideIcon size={size} className={className} strokeWidth={strokeWidth} />
}

export function CategoryIcon({ name, size = 16 }: { name: string; size?: number }) {
  return <Icon name={name} size={size} />
}
