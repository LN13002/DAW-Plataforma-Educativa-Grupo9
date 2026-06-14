import { CategoryPills } from '../components/CategoryPills'
import { CourseCard } from '../components/CourseCard'
import { roleLabel } from '../utils/learning'

export function ExploreView({ courses, categories, activeCategory, setActiveCategory, onOpenCourse, user }) {
  const isStaff = user?.plan === 'admin' || user?.plan === 'instructor'
  const isInstructor = user?.plan === 'instructor'

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">{isStaff ? `Cursos · ${roleLabel(user.plan)}` : 'Catálogo'}</span>
        <h1>{isInstructor ? 'Mis cursos asignados' : isStaff ? 'Vista de cursos' : 'Explora cursos de AprendeUes'}</h1>
        <p>
          {isInstructor
            ? 'Revisa únicamente los cursos asignados a tu usuario docente.'
            : isStaff
            ? 'Revisa cursos desde una mirada de gestión: contenido, instructor, módulos y estado general.'
            : 'Filtra por facultad o área y abre el detalle para revisar contenido, instructor y recursos.'}
        </p>
      </section>

      {!isStaff ? (
        <section className="section-block">
          <CategoryPills categories={categories} activeCategory={activeCategory} onSelect={setActiveCategory} />
        </section>
      ) : null}

      <section className="catalog-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard compact course={course} key={course.id} onOpen={onOpenCourse} actionLabel={isStaff ? 'Revisar curso' : undefined} />
          ))
        ) : (
          <div className="comment-empty-state">
            {isInstructor ? 'Aún no tienes cursos asignados.' : 'No hay cursos disponibles con estos filtros.'}
          </div>
        )}
      </section>
    </main>
  )
}
