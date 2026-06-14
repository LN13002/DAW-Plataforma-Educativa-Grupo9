import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ProgressBar } from '../components/ProgressBar'
import { courseProgress, getLearnerStats } from '../utils/learning'

export function UserProgressView({ user, courses, certificates, onOpenPlayer }) {
  const { enrolledCourses, completedCourses, nextCourse } = getLearnerStats(courses, certificates)
  const averageProgress = enrolledCourses.length
    ? Math.round(enrolledCourses.reduce((total, course) => total + courseProgress(course), 0) / enrolledCourses.length)
    : 0

  return (
    <main className="page user-progress-page">
      <section className="page-header">
        <span className="eyebrow">Mi avance</span>
        <h1>Progreso de aprendizaje</h1>
        <p>{user.name}, aquí puedes revisar cómo vas en tus cursos inscritos y qué puedes continuar ahora.</p>
      </section>

      <section className="user-progress-summary">
        <article>
          <Icon name="school" />
          <strong>{enrolledCourses.length}</strong>
          <span>Cursos inscritos</span>
        </article>
        <article>
          <Icon name="track_changes" />
          <strong>{averageProgress}%</strong>
          <span>Avance promedio</span>
        </article>
        <article>
          <Icon name="workspace_premium" />
          <strong>{certificates.length}</strong>
          <span>Certificados</span>
        </article>
        <article>
          <Icon name="task_alt" />
          <strong>{completedCourses.length}</strong>
          <span>Cursos completados</span>
        </article>
      </section>

      {nextCourse ? (
        <section className="admin-panel progress-continue-panel">
          <div>
            <span className="eyebrow">Siguiente paso</span>
            <h2>Continúa {nextCourse.title}</h2>
            <p>Vas al {Math.round(nextCourse.progress)}%. Retoma el curso para acercarte al certificado.</p>
          </div>
          <Button onClick={() => onOpenPlayer(nextCourse)}>
            <Icon name="play_arrow" />
            Continuar
          </Button>
        </section>
      ) : null}

      <section className="user-progress-list">
        {enrolledCourses.length === 0 ? (
          <div className="comment-empty-state">Aún no tienes cursos inscritos. Explora cursos para comenzar tu ruta.</div>
        ) : (
          enrolledCourses.map((course) => (
            <article className="user-progress-card" key={course.id}>
              <img src={course.image} alt="" />
              <div>
                <span>{course.category}</span>
                <h2>{course.title}</h2>
                <p>{course.instructor}</p>
                <ProgressBar value={course.progress} label="Progreso del curso" />
              </div>
              <div className="user-progress-actions">
                <strong>{Math.round(course.progress)}%</strong>
                <Button variant={course.progress >= 100 ? 'secondary' : 'primary'} onClick={() => onOpenPlayer(course)}>
                  <Icon name={course.progress >= 100 ? 'visibility' : 'play_arrow'} />
                  {course.progress >= 100 ? 'Revisar' : 'Continuar'}
                </Button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  )
}
