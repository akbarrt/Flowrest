import type { FlowerType } from '../../core/types'

type FlowerProps = {
  type: FlowerType
  className?: string
}

type BloomProps = {
  type: FlowerType
}

function Bloom({ type }: BloomProps) {
  if (type === 'daisy') {
    return (
      <g>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="24"
            cy="10"
            rx="3.2"
            ry="6"
            fill="var(--color-surface)"
            stroke="var(--color-sage)"
            strokeWidth="1.2"
            transform={`rotate(${angle} 24 16)`}
          />
        ))}
        <circle cx="24" cy="16" r="4" fill="var(--color-warning)" />
      </g>
    )
  }

  if (type === 'tulip') {
    return (
      <g>
        <path
          d="M15 13c0-2 1.5-4 4-4 1.8 0 3.2.9 5 2.5 1.8-1.6 3.2-2.5 5-2.5 2.5 0 4 2 4 4v5c0 5.5-4 9-9 9s-9-3.5-9-9v-5Z"
          fill="var(--color-sage)"
          stroke="var(--color-moss)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M24 19v10"
          stroke="var(--color-moss)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    )
  }

  if (type === 'sunflower') {
    return (
      <g>
        {Array.from({ length: 12 }, (_, index) => index * 30).map((angle) => (
          <ellipse
            key={angle}
            cx="24"
            cy="8.5"
            rx="2.4"
            ry="5.5"
            fill="var(--color-warning)"
            transform={`rotate(${angle} 24 16)`}
          />
        ))}
        <circle cx="24" cy="16" r="5.5" fill="var(--color-ink)" />
      </g>
    )
  }

  return (
    <g>
      <circle cx="24" cy="16" r="8.5" fill="var(--color-terracotta)" />
      <path
        d="M24 9.5c4 0 6.5 2.7 6.5 6.2 0 4-3 6.8-6.8 6.8-3.2 0-5.7-2.1-5.7-5 0-2.4 1.8-4.2 4.2-4.2 2 0 3.5 1.4 3.5 3.3 0 1.6-1.2 2.8-2.8 2.8-1.2 0-2.1-.8-2.1-1.9"
        fill="none"
        stroke="var(--color-surface)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </g>
  )
}

export function Flower({ type, className = 'h-10 w-10 shrink-0' }: FlowerProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M24 44V24"
        stroke="var(--color-moss)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M24 36c-5 0-8-3-8-7 4 0 8 3 8 7Z" fill="var(--color-sage)" />
      <path d="M24 31c5 0 9-3 9-7-4 0-9 3-9 7Z" fill="var(--color-sage)" />
      <Bloom type={type} />
    </svg>
  )
}
