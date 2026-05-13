export function ProgressBar({ value, label }) {
  return (
    <div className="progress-group" aria-label={label}>
      <div className="progress-meta">
        {label ? <span>{label}</span> : <span>Progreso</span>}
        <strong>{value}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
