import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { COURSE_PRICE_LABEL } from '../constants/app'
import { roleLabel } from '../utils/learning'

const LEARNING_OUTCOMES = [
  'Identificar oportunidades de mejora en proyectos académicos.',
  'Aplicar herramientas modernas con criterio práctico.',
  'Analizar casos reales y documentar decisiones técnicas.',
  'Preparar entregables listos para revisión docente.',
]

export function CourseDetailView({ course, modules, lessons, reviews, onBack, onStart, onEnroll, onNavigate, user, completedMessage }) {
  if (!course) return null

  const courseModules = modules.filter((module) => module.courseId === course.id)

  return (
    <main className="page">
      <button className="back-button" type="button" onClick={onBack}>
        <Icon name="arrow_back" />
        Volver al catálogo
      </button>

      <section className="course-hero">
        <img src={course.image} alt="" />
        <div className="course-hero-content">
          <span className="eyebrow">{course.category}</span>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <CourseMeta course={course} />
        </div>
      </section>

      <section className="course-detail-grid">
        <div className="content-stack">
          {completedMessage ? <div className="data-notice">{completedMessage}</div> : null}
          <LearningOutcomes />
          <CourseContent modules={courseModules} lessons={lessons} />
          <InstructorPanel instructor={course.instructor} />
          <ReviewsPanel reviews={reviews} />
        </div>

        <EnrollmentCard
          course={course}
          user={user}
          onBack={onBack}
          onEnroll={onEnroll}
          onNavigate={onNavigate}
          onStart={onStart}
        />
      </section>
    </main>
  )
}

function CourseMeta({ course }) {
  return (
    <div className="meta-row">
      {course.rating ? (
        <span>
          <Icon name="star" filled /> {course.rating}
        </span>
      ) : null}
      {Number(course.students) > 0 ? (
        <span>
          <Icon name="group" /> {course.students.toLocaleString()} estudiantes
        </span>
      ) : null}
      <span>
        <Icon name="schedule" /> {course.duration}
      </span>
      <span>{course.level}</span>
    </div>
  )
}

function LearningOutcomes() {
  return (
    <InfoPanel title="Lo que aprenderás">
      <div className="learn-grid">
        {LEARNING_OUTCOMES.map((item) => (
          <p key={item}>
            <Icon name="check_circle" />
            {item}
          </p>
        ))}
      </div>
    </InfoPanel>
  )
}

function CourseContent({ modules, lessons }) {
  return (
    <InfoPanel title="Contenido del curso">
      <div className="module-list">
        {modules.length > 0 ? (
          modules.map((module, index) => (
            <ModuleDetails index={index} key={module.id ?? module.title} lessons={lessons} module={module} />
          ))
        ) : (
          <div className="lesson-empty-state">Este curso aún no tiene módulos publicados.</div>
        )}
      </div>
    </InfoPanel>
  )
}

function ModuleDetails({ module, lessons, index }) {
  const moduleLessons = module.lessons ?? lessons.filter((lesson) => lesson.moduleId === module.id)
  const moduleMeta = module.meta ?? `${moduleLessons.length} lecciones`

  return (
    <details open={index === 0}>
      <summary>
        <strong>{module.title}</strong>
        <span>{moduleMeta}</span>
      </summary>
      {moduleLessons.length > 0 ? moduleLessons.map((lesson) => (
        <p key={lesson.id ?? lesson}>
          <Icon name="play_circle" />
          {lesson.rawTitle ?? lesson.title ?? lesson}
        </p>
      )) : (
        <p>
          <Icon name="info" />
          Aún no hay lecciones publicadas en este módulo.
        </p>
      )}
    </details>
  )
}

function InstructorPanel({ instructor }) {
  return (
    <InfoPanel title="Tu instructor">
      <div className="instructor-card">
        <div className="avatar large">AM</div>
        <div>
          <h3>{instructor}</h3>
          <p>Especialista de AprendeUes con enfoque en aprendizaje aplicado, proyectos guiados y evaluación progresiva.</p>
        </div>
      </div>
    </InfoPanel>
  )
}

function ReviewsPanel({ reviews }) {
  return (
    <InfoPanel title="Reseñas de estudiantes">
      <div className="review-list">
        {reviews.map((review) => (
          <article key={review.name}>
            <strong>{review.name}</strong>
            <span>{'★'.repeat(review.rating)}</span>
            <p>{review.text}</p>
          </article>
        ))}
      </div>
    </InfoPanel>
  )
}

function EnrollmentCard({ course, user, onBack, onEnroll, onNavigate, onStart }) {
  return (
    <aside className="enroll-card">
      {user?.plan === 'admin' ? (
        <StaffCourseActions label="Gestión" note={`Vista de revisión para ${roleLabel(user.plan)}. Aquí no se inscribe al curso.`} onNavigate={onNavigate} />
      ) : user?.plan === 'instructor' ? (
        <InstructorCourseActions onBack={onBack} onNavigate={onNavigate} />
      ) : (
        <StudentCourseActions course={course} onEnroll={onEnroll} onStart={onStart} />
      )}
      <ul>
        <li>Video bajo demanda</li>
        <li>Recursos descargables</li>
        <li>Acceso desde móvil y escritorio</li>
        <li>Certificado al finalizar</li>
      </ul>
    </aside>
  )
}

function StaffCourseActions({ label, note, onNavigate }) {
  return (
    <>
      <strong>{label}</strong>
      <p className="enroll-card-note">{note}</p>
      <Button onClick={() => onNavigate('modules')}>
        <Icon name="view_module" />
        Gestionar módulos
      </Button>
      <Button variant="secondary" onClick={() => onNavigate('lessons')}>
        <Icon name="play_lesson" />
        Gestionar lecciones
      </Button>
    </>
  )
}

function InstructorCourseActions({ onBack, onNavigate }) {
  return (
    <>
      <strong>Docencia</strong>
      <p className="enroll-card-note">Vista docente para revisar el contenido publicado sin inscribirte como estudiante.</p>
      <Button onClick={onBack}>
        <Icon name="school" />
        Ver cursos
      </Button>
      <Button variant="secondary" onClick={() => onNavigate('profile')}>
        <Icon name="person" />
        Ver perfil
      </Button>
    </>
  )
}

function StudentCourseActions({ course, onEnroll, onStart }) {
  const isEnrolled = course.progress > 0 || course.enrollmentId

  return (
    <>
      <strong>{COURSE_PRICE_LABEL}</strong>
      <p className="enroll-card-note">
        {course.enrollmentId ? 'Ya estás inscrito en este curso.' : 'Inscripción inmediata con tu usuario activo.'}
      </p>
      <Button onClick={() => (isEnrolled ? onStart() : onEnroll(course))}>
        <Icon name={isEnrolled ? 'play_circle' : 'how_to_reg'} />
        {isEnrolled ? 'Continuar curso' : 'Inscribirme gratis'}
      </Button>
    </>
  )
}

function InfoPanel({ title, children }) {
  return (
    <section className="info-panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
