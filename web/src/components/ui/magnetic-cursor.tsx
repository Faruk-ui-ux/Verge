import * as React from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"

export interface MagneticCursorProps {
  children: React.ReactNode
  /** 0–1. How far the cursor is dragged from the pointer toward a magnetic element's centre. */
  magneticFactor?: number
  /** Blend mode of the cursor layer. "exclusion" inverts it against whatever it covers. */
  blendMode?: React.CSSProperties["mixBlendMode"]
  /** Diameter of the idle cursor in px. */
  cursorSize?: number
  className?: string
}

const SNAP_PADDING = 10
const ELEMENT_PULL = 0.22
const FOLLOW = { stiffness: 520, damping: 38, mass: 0.7 }
const SHAPE = { stiffness: 320, damping: 32, mass: 0.5 }

export function MagneticCursor({
  children,
  magneticFactor = 0.4,
  blendMode = "exclusion",
  cursorSize = 32,
  className,
}: MagneticCursorProps) {
  const reduceMotion = useReducedMotion()
  const [enabled, setEnabled] = React.useState(false)

  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const pointerRef = React.useRef({ x: 0, y: 0 })
  const targetRef = React.useRef<HTMLElement | null>(null)
  const offsetRef = React.useRef({ x: 0, y: 0 })

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const width = useMotionValue(cursorSize)
  const height = useMotionValue(cursorSize)
  const radius = useMotionValue(cursorSize / 2)
  const snap = useMotionValue(0)
  const opacity = useMotionValue(0)

  const springX = useSpring(x, FOLLOW)
  const springY = useSpring(y, FOLLOW)
  const springWidth = useSpring(width, SHAPE)
  const springHeight = useSpring(height, SHAPE)
  const springRadius = useSpring(radius, SHAPE)
  const springSnap = useSpring(snap, SHAPE)
  const springOpacity = useSpring(opacity, SHAPE)

  const velocityX = useVelocity(springX)
  const velocityY = useVelocity(springY)

  // Fast movement stretches the dot along its direction of travel and thins it
  // across — the trick that reads as weight. Suppressed while snapped to a target,
  // where the cursor is a rectangle and any distortion looks like a glitch.
  const angle = useTransform([velocityX, velocityY], (v: number[]) =>
    Math.hypot(v[0], v[1]) < 40 ? 0 : (Math.atan2(v[1], v[0]) * 180) / Math.PI,
  )
  const speed = useTransform([velocityX, velocityY], (v: number[]) =>
    Math.min(Math.hypot(v[0], v[1]) / 2400, 1),
  )
  const stretch = useTransform([speed, springSnap], (v: number[]) => 1 + v[0] * 0.55 * (1 - v[1]))
  const squash = useTransform([speed, springSnap], (v: number[]) => 1 - v[0] * 0.3 * (1 - v[1]))

  React.useEffect(() => {
    const query = window.matchMedia("(pointer: fine)")
    const sync = () => setEnabled(query.matches && !reduceMotion)
    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [reduceMotion])

  React.useEffect(() => {
    const wrapper = wrapperRef.current
    if (!enabled || !wrapper) return

    const release = (element: HTMLElement) => {
      element.style.transform = ""
      element.style.willChange = ""
    }

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      opacity.set(1)

      const next =
        (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-magnetic]") ?? null
      if (next !== targetRef.current) {
        if (targetRef.current) release(targetRef.current)
        targetRef.current = next
        offsetRef.current = { x: 0, y: 0 }
        if (next) next.style.willChange = "transform"
      }
    }

    const onPointerLeave = () => {
      opacity.set(0)
      if (targetRef.current) release(targetRef.current)
      targetRef.current = null
    }

    let frame = 0
    const tick = () => {
      const { x: px, y: py } = pointerRef.current
      const target = targetRef.current

      if (target) {
        const rect = target.getBoundingClientRect()
        const centreX = rect.left + rect.width / 2
        const centreY = rect.top + rect.height / 2

        x.set(px + (centreX - px) * magneticFactor)
        y.set(py + (centreY - py) * magneticFactor)
        width.set(rect.width + SNAP_PADDING * 2)
        height.set(rect.height + SNAP_PADDING * 2)
        radius.set(parseFloat(getComputedStyle(target).borderRadius) + SNAP_PADDING || SNAP_PADDING)
        snap.set(1)

        // The element leans toward the pointer. Eased here rather than through a CSS
        // transition so it keeps up with the cursor instead of trailing a fixed duration.
        const wantX = (px - centreX) * ELEMENT_PULL
        const wantY = (py - centreY) * ELEMENT_PULL
        offsetRef.current.x += (wantX - offsetRef.current.x) * 0.18
        offsetRef.current.y += (wantY - offsetRef.current.y) * 0.18
        target.style.transform = `translate3d(${offsetRef.current.x.toFixed(2)}px, ${offsetRef.current.y.toFixed(2)}px, 0)`
      } else {
        x.set(px)
        y.set(py)
        width.set(cursorSize)
        height.set(cursorSize)
        radius.set(cursorSize / 2)
        snap.set(0)
      }

      frame = requestAnimationFrame(tick)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    document.addEventListener("pointerleave", onPointerLeave)
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerleave", onPointerLeave)
      if (targetRef.current) release(targetRef.current)
      targetRef.current = null
    }
  }, [enabled, magneticFactor, cursorSize, x, y, width, height, radius, snap, opacity])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ isolation: "isolate", cursor: enabled ? "none" : undefined }}
    >
      {children}

      {enabled && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[9999]"
          // The blend mode belongs on this element, not the shape inside it. An element's
          // own mix-blend-mode composites it against its parent's backdrop, while the
          // transform here opens a stacking context that would trap a child's blending
          // against nothing.
          style={{ x: springX, y: springY, opacity: springOpacity, mixBlendMode: blendMode }}
        >
          <motion.div
            className="bg-white"
            style={{
              x: "-50%",
              y: "-50%",
              rotate: angle,
              scaleX: stretch,
              scaleY: squash,
              width: springWidth,
              height: springHeight,
              borderRadius: springRadius,
            }}
          />
        </motion.div>
      )}
    </div>
  )
}
