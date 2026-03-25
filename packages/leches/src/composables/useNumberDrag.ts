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
  let accumulatedDelta = 0
  let tooltipEl: HTMLDivElement | null = null

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

  function updateTooltip(_e: MouseEvent, delta: number) {
    if (!tooltipEl || !knobElement) return
    const arrow = delta >= 0 ? '\u2192' : '\u2190'
    const sign = delta >= 0 ? '+' : '-'
    const formatted = options.formatDelta
      ? options.formatDelta(Math.abs(delta))
      : String(Math.abs(delta).toFixed(2))
    tooltipEl.textContent = `${arrow} ${sign}${formatted}`
    // Position tooltip above the knob element (cursor is locked)
    const rect = knobElement.getBoundingClientRect()
    tooltipEl.style.left = `${rect.left + rect.width / 2}px`
    tooltipEl.style.top = `${rect.top - 24}px`
  }

  function removeTooltip() {
    if (tooltipEl) {
      tooltipEl.remove()
      tooltipEl = null
    }
  }

  let knobElement: HTMLElement | null = null

  function onMouseMove(e: MouseEvent) {
    // Use movementX for pointer-locked drag (x-axis only)
    const diff = e.movementX
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
  }

  function onMouseUp() {
    isDragging.value = false
    accumulatedDelta = 0
    document.exitPointerLock?.()
    removeTooltip()
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseDown(event: MouseEvent) {
    accumulatedDelta = 0
    isDragging.value = true
    knobElement = event.currentTarget as HTMLElement
    knobElement?.requestPointerLock?.()
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
