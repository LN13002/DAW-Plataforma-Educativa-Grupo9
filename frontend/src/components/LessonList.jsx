import { Icon } from './Icon'

const statusIcon = {
  completed: ['check_circle', true],
  active: ['play_circle', true],
  available: ['radio_button_unchecked', false],
  locked: ['lock', false],
}

export function LessonList({ lessons, onSelect }) {
  return (
    <aside className="lesson-panel">
      <div className="lesson-panel-header">
        <h2>Contenido del curso</h2>
        <span>8/14 lecciones</span>
      </div>

      <div className="module-title">Modulo 4: Microservicios</div>

      <div className="lesson-list">
        {lessons.map((lesson) => {
          const [icon, filled] = statusIcon[lesson.status]

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
        })}
      </div>
    </aside>
  )
}
