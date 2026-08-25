import { useCallback } from 'react'

export function useHorizontalWheelScroll() {
  return useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    if (element.scrollWidth <= element.clientWidth) return

    event.preventDefault()
    element.scrollLeft += event.deltaY
  }, [])
}
