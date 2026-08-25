import { useState } from 'react'
import type { Category, MenuItem, Restaurant } from '../types'
import { ProductCard } from '../components/ProductCard'

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
            <button className="btn btn-secondary btn-sm" onClick={onSwitchStaff}>
              👨‍🍳 Mitarbeiter
            </button>
          )}
          <button className="btn btn-primary btn-sm cart-btn" onClick={onOpenCart}>
            🛒 {cartCount > 0 ? cartCount : ''}
          </button>
        </div>
      </div>

      <div className="delivery-info">
        <span>🚚 Lieferung {restaurant.deliveryFee.toFixed(2).replace('.', ',')} €</span>
        <span>⏱️ ca. 25–35 Min.</span>
      </div>

      <div className="categories-scroll">
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
            {cat.icon} {cat.label}
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
            Warenkorb ansehen ({cartCount} Artikel)
          </button>
        </div>
      )}

      <style>{`
        .home-page {
          min-height: 100%;
        }
        .hero {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 16px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
        }
        .hero-logo {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          object-fit: cover;
          border: 2px solid rgba(255,255,255,0.3);
        }
        .hero-text {
          flex: 1;
        }
        .hero-text h1 {
          font-size: 20px;
          font-weight: 800;
        }
        .hero-text p {
          font-size: 12px;
          opacity: 0.85;
        }
        .hero-actions {
          display: flex;
          gap: 8px;
        }
        .hero-actions .btn-secondary {
          background: rgba(255,255,255,0.2);
          border-color: rgba(255,255,255,0.3);
          color: white;
        }
        .cart-btn {
          min-width: 44px;
        }
        .delivery-info {
          display: flex;
          justify-content: space-around;
          padding: 10px 16px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .categories-scroll {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .cat-pill {
          flex-shrink: 0;
          padding: 8px 16px;
          border-radius: 20px;
          background: var(--surface);
          border: 1.5px solid var(--border);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all 0.2s;
        }
        .cat-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          padding: 0 16px 16px;
        }
        .floating-cart {
          position: fixed;
          bottom: calc(16px + var(--safe-bottom));
          left: 16px;
          right: 16px;
          z-index: 15;
        }
        .floating-cart .btn {
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  )
}
