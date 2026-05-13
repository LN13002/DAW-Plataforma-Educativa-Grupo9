import { Icon } from './Icon'

export function StatCard({ icon, value, label }) {
  return (
    <article className="stat-card">
      <Icon name={icon} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  )
}
