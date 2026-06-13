import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  detail: string
  color: string
  icon: LucideIcon
}

export function StatCard({
  label,
  value,
  detail,
  color,
  icon: Icon,
}: StatCardProps) {
  return (
    <article className="stat-card" style={{ '--stat-color': color } as React.CSSProperties}>
      <div className="stat-card__icon">
        <Icon size={16} />
      </div>
      <span className="stat-card__label">{label}</span>
      <strong className="stat-card__value" title={value}>
        {value}
      </strong>
      <span className="stat-card__detail">{detail}</span>
    </article>
  )
}
