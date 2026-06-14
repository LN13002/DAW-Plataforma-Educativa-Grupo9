import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

export function publishedLabel(value) {
  return value ? 'Publicado' : 'Borrador'
}

export function getCourseTitle(course) {
  return course?.title ?? 'Curso sin identificar'
}

export function ModuleSummary({ stats }) {
  const items = [
    ['view_module', stats.total, 'Módulos'],
    ['school', stats.courseCount, 'Cursos con módulos'],
    ['visibility', stats.published, 'Publicados'],
    ['edit_note', stats.drafts, 'Borradores'],
  ]

  return (
    <section className="module-summary-grid">
      {items.map(([icon, value, label]) => (
        <article className="module-summary-card" key={label}>
          <Icon name={icon} />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

export function ModuleForm({
  form,
  formMode,
  selectedCourse,
  visibleCourses,
  onCancel,
  onChange,
  onSubmit,
}) {
  return (
    <section className="admin-panel module-editor-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">{formMode === 'create' ? 'Nuevo bloque de aprendizaje' : 'Editar bloque de aprendizaje'}</span>
          <h2>{formMode === 'create' ? 'Crear módulo' : 'Actualizar módulo'}</h2>
          <p>Define a qué curso pertenece, qué aprenderá el estudiante y en qué orden debe aparecer.</p>
        </div>
      </div>

      <form className="module-editor-form" onSubmit={onSubmit}>
        <label className="form-label">
          Curso
          <select className="form-input" value={form.courseId} onChange={onChange('courseId')} required>
            <option value="">Selecciona un curso</option>
            {visibleCourses.map((course) => (
              <option value={course.id} key={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Estado
          <select className="form-input" value={form.published} onChange={onChange('published')}>
            <option value="true">Publicado</option>
            <option value="false">Borrador</option>
          </select>
        </label>

        <label className="form-label">
          Título del módulo
          <input className="form-input" value={form.title} onChange={onChange('title')} placeholder="Ej. Fundamentos de JavaScript" required />
        </label>

        <label className="form-label">
          Posición
          <input className="form-input" type="number" min="1" value={form.position} onChange={onChange('position')} required />
        </label>

        <label className="form-label module-field-wide">
          Descripción para orientar al estudiante
          <textarea
            className="form-input module-textarea"
            value={form.description}
            onChange={onChange('description')}
            placeholder="Resume qué se logrará en este bloque y por qué es importante dentro del curso."
          />
        </label>

        <div className="module-preview-card">
          <Icon name="route" />
          <div>
            <strong>{form.title || 'Nombre del módulo'}</strong>
            <span>
              {getCourseTitle(selectedCourse)} · Módulo {form.position || '1'} · {publishedLabel(form.published === 'true')}
            </span>
          </div>
        </div>

        <div className="enrollment-form-actions">
          <Button type="submit">
            <Icon name="save" />
            Guardar módulo
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}

export function ModuleList({
  courseFilter,
  coursesById,
  filteredModules,
  loading,
  onCreate,
  onDelete,
  onEdit,
  onSearchChange,
  onStatusFilterChange,
  onCourseFilterChange,
  search,
  statusFilter,
  visibleCourses,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-header module-list-header">
        <div>
          <span className="eyebrow">Mapa de contenidos</span>
          <h2>Módulos por curso</h2>
          <p>Revisa el orden, estado y propósito de cada bloque antes de publicar nuevas lecciones.</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="add" />
          Nuevo módulo
        </Button>
      </div>

      <div className="module-toolbar">
        <label className="search admin-search">
          <Icon name="search" />
          <input placeholder="Buscar por curso, módulo o descripción" type="search" value={search} onChange={onSearchChange} />
        </label>

        <select className="form-input module-course-filter" value={courseFilter} onChange={onCourseFilterChange}>
          <option value="all">Todos los cursos</option>
          {visibleCourses.map((course) => (
            <option value={course.id} key={course.id}>
              {course.title}
            </option>
          ))}
        </select>

        <div className="enrollment-filter-group" aria-label="Filtrar módulos por estado">
          {[
            ['all', 'Todos'],
            ['published', 'Publicados'],
            ['draft', 'Borradores'],
          ].map(([value, label]) => (
            <button className={statusFilter === value ? 'active' : ''} type="button" key={value} onClick={() => onStatusFilterChange(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="module-card-list">
        {loading ? (
          <div className="comment-empty-state">Cargando módulos...</div>
        ) : filteredModules.length === 0 ? (
          <div className="comment-empty-state">No hay módulos con esos filtros.</div>
        ) : (
          filteredModules.map((module) => (
            <article className="module-admin-card" key={module.id}>
              <div className="module-position-pill">Módulo {module.position}</div>
              <div className="module-admin-main">
                <span>{module.courseTitle ?? getCourseTitle(coursesById.get(module.courseId))}</span>
                <h3>{module.title}</h3>
                <p>{module.description || 'Sin descripción todavía.'}</p>
              </div>
              <div className="module-admin-meta">
                <span className={module.published ? 'status-badge status-active' : 'status-badge status-cancelled'}>
                  {publishedLabel(module.published)}
                </span>
                <div className="row-actions">
                  <button type="button" onClick={() => onEdit(module)} aria-label={`Editar ${module.title}`}>
                    <Icon name="edit" />
                  </button>
                  <button type="button" onClick={() => onDelete(module)} aria-label={`Eliminar ${module.title}`}>
                    <Icon name="delete" />
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

export function ModuleDeleteDialog({ module, onCancel, onConfirm }) {
  if (!module) return null

  return (
    <div className="modal-overlay">
      <div className="auth-card module-delete-card">
        <div className="auth-card-header">
          <span className="eyebrow">Eliminar módulo</span>
          <h2>{module.title}</h2>
          <p>Se eliminará este bloque del curso {module.courseTitle}. Verifica que no tenga lecciones que quieras conservar.</p>
        </div>
        <div className="enrollment-form-actions">
          <Button onClick={onConfirm}>
            <Icon name="delete" />
            Eliminar
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
