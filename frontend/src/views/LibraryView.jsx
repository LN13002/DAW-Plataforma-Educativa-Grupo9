import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { ProgressBar } from '../components/ProgressBar'

export function LibraryView({ courses, onOpenPlayer, onNavigate }) {
  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Mi aprendizaje</span>
        <h1>Biblioteca de aprendizaje</h1>
        <p>Continúa tus cursos activos y revisa tu avance por módulo.</p>
      </section>

      <section className="library-list">
        {courses.length > 0 ? (
          courses.map((course) => (
            <article className="library-item" key={course.id}>
              <img src={course.image} alt="" />
              <div>
                <h2>{course.title}</h2>
                <p>{course.instructor}</p>
                <ProgressBar value={course.progress} label="Progreso del curso" />
              </div>
              <Button onClick={() => onOpenPlayer(course)}>Continuar</Button>
            </article>
          ))
        ) : (
          <div className="comment-empty-state">
            Aún no tienes cursos inscritos. Explora cursos para comenzar tu ruta.
            <Button onClick={() => onNavigate('explore')}>
              <Icon name="explore" />
              Explorar cursos
            </Button>
          </div>
        )}
      </section>
    </main>
  )
}
