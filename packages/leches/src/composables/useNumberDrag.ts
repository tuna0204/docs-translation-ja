import type { MaybeRef, Ref } from 'vue'
import { getCurrentInstance, onUnmounted, ref, toValue } from 'vue'
import { clampValue } from '../utils/format'

const SVG_NS = 'http://www.w3.org/2000/svg'

export interface UseNumberDragOptions {
  getValue: () => number
  step: MaybeRef<number>
  min?: MaybeRef<number | undefined>
  max?: MaybeRef<number | undefined>
  onUpdate: (value: number) => void
  formatDelta?: (value: number) => string
}

export function useNumberDrag(options: UseNumberDragOptions): {
  onMouseDown: (event: MouseEvent) => void
  isDragging: Ref<boolean>
} {
  const isDragging = ref(false)
  let accumulatedDelta = 0
  let accumulatedPixels = 0
  let knobElement: HTMLElement | null = null
  let guideElem: SVGSVGElement | null = null
  let guideBodyElem: SVGPathElement | null = null
  let guideHeadElem: SVGPathElement | null = null
  let tooltipElem: HTMLDivElement | null = null

  function createGuide() {
    if (!knobElement) return

    // SVG guide
    guideElem = document.createElementNS(SVG_NS, 'svg')
    guideElem.classList.add('leches-guide')
    knobElement.appendChild(guideElem)

    guideBodyElem = document.createElementNS(SVG_NS, 'path')
    guideBodyElem.classList.add('leches-guide_b')
    guideElem.appendChild(guideBodyElem)

    guideHeadElem = document.createElementNS(SVG_NS, 'path')
    guideHeadElem.classList.add('leches-guide_h')
    guideElem.appendChild(guideHeadElem)

    // Tooltip
    tooltipElem = document.createElement('div')
    tooltipElem.classList.add('leches-tooltip')
    knobElement.appendChild(tooltipElem)
  }

  function updateGuide() {
    if (!guideBodyElem || !guideHeadElem || !tooltipElem) return

    const x = accumulatedPixels
    // Arrow offset: slight inset from the tip
    const aox = x + (x > 0 ? -1 : x < 0 ? 1 : 0)
    const adx = Math.max(-4, Math.min(4, -aox))

    guideBodyElem.setAttributeNS(null, 'd', `M 0,4 L${x},4`)
    guideHeadElem.setAttributeNS(null, 'd', [
      `M ${aox + adx},0 L${aox},4 L${aox + adx},8`,
      `M ${x},-1 L${x},9`,
    ].join(' '))

    // Tooltip: show formatted value, position at x
    const formatted = options.formatDelta
      ? options.formatDelta(Math.abs(accumulatedDelta))
      : String(Math.abs(accumulatedDelta).toFixed(2))
    const sign = accumulatedDelta >= 0 ? '+' : '-'
    tooltipElem.textContent = `${sign}${formatted}`
    tooltipElem.style.left = `${x}px`
  }

  function removeGuide() {
    guideElem?.remove()
    tooltipElem?.remove()
    guideElem = null
    guideBodyElem = null
    guideHeadElem = null
    tooltipElem = null
  }

  function onMouseMove(e: MouseEvent) {
    const diff = e.movementX
    const modifier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
    const delta = diff * toValue(options.step) * modifier

    accumulatedDelta += delta
    accumulatedPixels += diff
    const newValue = clampValue(
      options.getValue() + delta,
      toValue(options.min),
      toValue(options.max),
    )
    options.onUpdate(newValue)
    updateGuide()
  }

  function onMouseUp() {
    isDragging.value = false
    accumulatedDelta = 0
    accumulatedPixels = 0
    document.exitPointerLock?.()
    removeGuide()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseDown(event: MouseEvent) {
    accumulatedDelta = 0
    accumulatedPixels = 0
    isDragging.value = true
    knobElement = event.currentTarget as HTMLElement
    knobElement?.requestPointerLock?.()
    createGuide()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      removeGuide()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })
  }

  return {
    onMouseDown,
    isDragging,
  }
}
