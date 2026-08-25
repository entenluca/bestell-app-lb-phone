import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  className?: string
  children: ReactNode
}

export function HorizontalScroll({ className = '', children }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let pendingDelta = 0
    let frameId: number | null = null

    const flush = () => {
      if (pendingDelta !== 0) {
        element.scrollLeft += pendingDelta
        pendingDelta = 0
      }
      frameId = null
    }

    const onWheel = (event: WheelEvent) => {
      const maxScroll = element.scrollWidth - element.clientWidth
      if (maxScroll <= 1) return

      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY

      if (delta === 0) return

      event.preventDefault()
      event.stopPropagation()

      pendingDelta += delta
      if (frameId === null) {
        frameId = requestAnimationFrame(flush)
      }
    }

    element.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => {
      element.removeEventListener('wheel', onWheel, { capture: true })
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div ref={ref} className={`horizontal-scroll hide-scrollbar ${className}`.trim()}>
      {children}
    </div>
  )
}
