import type { MaybeRef, Ref } from 'vue'
import { getCurrentInstance, onUnmounted, ref, toValue } from 'vue'
import { clampValue } from '../utils/format'

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
  let initialX = 0
  let accumulatedDelta = 0
  let tooltipEl: HTMLDivElement | null = null
  let savedCursor = ''

  function createTooltip() {
    tooltipEl = document.createElement('div')
    tooltipEl.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 99999;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
      white-space: nowrap;
      background: var(--tl-tooltip-bg, #1a1a1a);
      color: var(--tl-tooltip-color, #e5e5e5);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `
    document.body.appendChild(tooltipEl)
  }

  function updateTooltip(e: MouseEvent, delta: number) {
    if (!tooltipEl) return
    const arrow = delta >= 0 ? '\u2192' : '\u2190'
    const sign = delta >= 0 ? '+' : '-'
    const formatted = options.formatDelta
      ? options.formatDelta(Math.abs(delta))
      : String(Math.abs(delta).toFixed(2))
    tooltipEl.textContent = `${arrow} ${sign}${formatted}`
    tooltipEl.style.left = `${e.clientX + 12}px`
    tooltipEl.style.top = `${e.clientY - 24}px`
  }

  function removeTooltip() {
    if (tooltipEl) {
      tooltipEl.remove()
      tooltipEl = null
    }
  }

  function onMouseMove(e: MouseEvent) {
    const diff = e.clientX - initialX
    const modifier = e.shiftKey ? 10 : e.altKey ? 0.1 : 1
    const delta = diff * toValue(options.step) * modifier

    accumulatedDelta += delta
    const newValue = clampValue(
      options.getValue() + delta,
      toValue(options.min),
      toValue(options.max),
    )
    options.onUpdate(newValue)
    updateTooltip(e, accumulatedDelta)
    initialX = e.clientX
  }

  function onMouseUp() {
    isDragging.value = false
    accumulatedDelta = 0
    document.body.style.cursor = savedCursor
    removeTooltip()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseDown(event: MouseEvent) {
    initialX = event.clientX
    accumulatedDelta = 0
    isDragging.value = true
    savedCursor = document.body.style.cursor
    document.body.style.cursor = 'ew-resize'
    createTooltip()
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  if (getCurrentInstance()) {
    onUnmounted(() => {
      removeTooltip()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })
  }

  return {
    onMouseDown,
    isDragging,
  }
}
