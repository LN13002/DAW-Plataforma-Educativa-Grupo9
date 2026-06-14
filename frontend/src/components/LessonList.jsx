import { Icon } from './Icon'

const statusIcon = {
  completed: ['check_circle', true],
  active: ['play_circle', true],
  available: ['radio_button_unchecked', false],
  locked: ['lock', false],
}

export function LessonList({ lessons, moduleTitle = 'Contenido disponible', onSelect }) {
  const completedCount = lessons.filter((lesson) => lesson.status === 'completed').length
  const totalCount = lessons.length

  return (
    <aside className="lesson-panel">
      <div className="lesson-panel-header">
        <h2>Contenido del curso</h2>
        <span>{completedCount}/{totalCount} lecciones</span>
      </div>

      <div className="module-title">{moduleTitle}</div>

      <div className="lesson-list">
        {lessons.length > 0 ? (
          lessons.map((lesson) => {
            const [icon, filled] = statusIcon[lesson.status] ?? statusIcon.available

            return (
              <button
                className={`lesson-item ${lesson.status}`}
                type="button"
                key={lesson.id}
                onClick={() => onSelect?.(lesson)}
                disabled={lesson.status === 'locked'}
              >
                <Icon name={icon} filled={filled} />
                <span>
                  <strong>{lesson.title}</strong>
                  <small>{lesson.duration}</small>
                </span>
              </button>
            )
          })
        ) : (
          <div className="lesson-empty-state">Aún no hay lecciones publicadas para este curso.</div>
        )}
      </div>
    </aside>
  )
}
