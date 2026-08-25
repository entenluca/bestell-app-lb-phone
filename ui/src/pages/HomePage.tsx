import { useState } from 'react'
import type { Category, MenuItem, Restaurant } from '../types'
import { ProductCard } from '../components/ProductCard'
import { Icon, CategoryIcon } from '../components/Icon'
import { useHorizontalWheelScroll } from '../hooks/useHorizontalWheelScroll'

interface Props {
  restaurant: Restaurant
  menu: MenuItem[]
  categories: Category[]
  cartCount: number
  onAddToCart: (item: MenuItem) => void
  onOpenCart: () => void
  onSwitchStaff: () => void
  isStaff: boolean
}

export function HomePage({
  restaurant,
  menu,
  categories,
  cartCount,
  onAddToCart,
  onOpenCart,
  onSwitchStaff,
  isStaff,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const handleCategoryWheel = useHorizontalWheelScroll()

  const filtered = activeCategory === 'all'
    ? menu
    : menu.filter((m) => m.category === activeCategory)

  return (
    <div className="home-page fade-in">
      <div className="hero">
        <img src={restaurant.logo} alt={restaurant.name} className="hero-logo" />
        <div className="hero-text">
          <h1>{restaurant.name}</h1>
          <p>{restaurant.tagline}</p>
        </div>
        <div className="hero-actions">
          {isStaff && (
            <button className="btn btn-secondary btn-sm hero-btn" onClick={onSwitchStaff}>
              <Icon name="dashboard" size={16} />
              Team
            </button>
          )}
          <button className="btn btn-primary btn-sm cart-btn hero-btn" onClick={onOpenCart}>
            <Icon name="cart" size={16} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="delivery-info">
        <span className="delivery-info-item">
          <Icon name="truck" size={14} />
          Lieferung {restaurant.deliveryFee.toFixed(2).replace('.', ',')} €
        </span>
        <span className="delivery-info-item">
          <Icon name="clock" size={14} />
          ca. 25–35 Min.
        </span>
      </div>

      <div className="categories-scroll hide-scrollbar" onWheel={handleCategoryWheel}>
        <button
          className={`cat-pill ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          Alle
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <CategoryIcon name={cat.icon} size={14} />
            {cat.label}
          </button>
        ))}
      </div>

      <div className="products-grid">
        {filtered.map((item) => (
          <ProductCard key={item.id} item={item} onAdd={onAddToCart} />
        ))}
      </div>

      {cartCount > 0 && (
        <div className="floating-cart">
          <button className="btn btn-primary btn-lg" onClick={onOpenCart}>
            <Icon name="cart" size={18} />
            Warenkorb ({cartCount})
          </button>
        </div>
      )}
    </div>
  )
}
