import { Icon } from './Icon'

export function StatCard({ icon, value, label, onClick }) {
  return (
    <article className="stat-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <Icon name={icon} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  )
}
