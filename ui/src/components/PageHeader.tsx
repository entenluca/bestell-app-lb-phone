import { ReactNode } from 'react'

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
          ←
        </button>
      )}
      <h1>{title}</h1>
      {right}
    </header>
  )
}
