const RING_CIRCUMFERENCE = 628.3

interface ProgressRingProps {
  ringOffset: number
  color: string
}

export const ProgressRing = ({ ringOffset, color }: ProgressRingProps) => {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      style={{ position: 'absolute', transform: 'rotate(-90deg)' }}
    >
      <circle
        cx="110"
        cy="110"
        r="100"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={ringOffset}
        strokeLinecap="round"
      />
    </svg>
  )
}
