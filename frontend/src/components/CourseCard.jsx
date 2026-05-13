import { Icon } from './Icon'
import { ProgressBar } from './ProgressBar'

export function CourseCard({ course, compact = false, onOpen, actionLabel = 'Ver curso' }) {
  return (
    <article className={compact ? 'course-card compact' : 'course-card'}>
      <div className="course-cover">
        <img src={course.image} alt="" />
        <span>{course.category}</span>
      </div>
      <div className="course-body">
        <div>
          <h3>{course.title}</h3>
          <p>{course.instructor}</p>
        </div>

        {course.progress > 0 ? (
          <ProgressBar value={course.progress} label="Curso" />
        ) : (
          <div className="course-stats">
            <span>
              <Icon name="star" filled />
              {course.rating}
            </span>
            <span>{course.duration} de contenido</span>
          </div>
        )}

        {onOpen ? (
          <button className="text-action" type="button" onClick={() => onOpen(course)}>
            {actionLabel}
            <Icon name="arrow_forward" />
          </button>
        ) : null}
      </div>
    </article>
  )
}
