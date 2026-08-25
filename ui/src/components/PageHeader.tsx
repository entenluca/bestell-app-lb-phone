import { ReactNode } from 'react'
import { Icon } from './Icon'

interface Props {
  title: string
  onBack?: () => void
  right?: ReactNode
}

export function PageHeader({ title, onBack, right }: Props) {
  return (
    <header className="page-header">
      {onBack && (
        <button className="back-btn" onClick={onBack} aria-label="Zurück">
          <Icon name="back" size={20} />
        </button>
      )}
      <h1>{title}</h1>
      {right}
    </header>
  )
}
