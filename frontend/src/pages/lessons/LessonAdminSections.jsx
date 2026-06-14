import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

const TYPE_LABELS = {
  video: 'Video',
  article: 'Lectura',
  quiz: 'Evaluación',
}

export function formatMinutes(seconds) {
  const minutes = Math.max(1, Math.round(Number(seconds ?? 0) / 60))
  return `${minutes} min`
}

export function getModuleLabel(module) {
  if (!module) return 'Módulo sin identificar'
  return `${module.courseTitle ?? 'Curso'} · ${module.title}`
}

export function getLessonModule(lesson, modulesById) {
  return modulesById.get(lesson.moduleId)
}

export function getLessonCourse(lesson, modulesById) {
  return getLessonModule(lesson, modulesById)?.courseTitle ?? 'Curso sin identificar'
}

export function LessonSummary({ stats }) {
  const items = [
    ['play_lesson', stats.total, 'Lecciones totales'],
    ['video_library', stats.videos, 'Con video'],
    ['visibility', stats.published, 'Publicadas'],
    ['schedule', stats.totalMinutes, 'Minutos de contenido'],
  ]

  return (
    <section className="lesson-summary-grid">
      {items.map(([icon, value, label]) => (
        <article className="lesson-summary-card" key={label}>
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

export function LessonForm({
  form,
  formMode,
  selectedModule,
  visibleModules,
  onCancel,
  onChange,
  onSubmit,
}) {
  return (
    <section className="admin-panel lesson-editor-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">{formMode === 'create' ? 'Nueva lección' : 'Editar lección'}</span>
          <h2>{formMode === 'create' ? 'Crear clase dentro de un módulo' : 'Actualizar contenido de clase'}</h2>
          <p>Selecciona el módulo por nombre, define el orden y agrega la información que verá el estudiante.</p>
        </div>
      </div>

      <form className="lesson-editor-form" onSubmit={onSubmit}>
        <label className="form-label lesson-field-wide">
          Módulo
          <select className="form-input" value={form.moduleId} onChange={onChange('moduleId')} required>
            <option value="">Selecciona un módulo</option>
            {visibleModules.map((module) => (
              <option value={module.id} key={module.id}>
                {getModuleLabel(module)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label lesson-field-wide">
          Título de la lección
          <input className="form-input" value={form.title} onChange={onChange('title')} placeholder="Ej. Introducción a componentes" required />
        </label>

        <label className="form-label lesson-field-wide">
          Descripción
          <textarea className="form-input lesson-textarea" value={form.description} onChange={onChange('description')} placeholder="Breve resumen de lo que aprenderá el estudiante" />
        </label>

        <label className="form-label lesson-field-wide">
          Enlace de video o recurso
          <input className="form-input" value={form.videoUrl} onChange={onChange('videoUrl')} placeholder="https://..." />
        </label>

        <label className="form-label">
          Duración
          <div className="lesson-inline-field">
            <input className="form-input" type="number" min="1" value={form.durationMinutes} onChange={onChange('durationMinutes')} required />
            <span>minutos</span>
          </div>
        </label>

        <label className="form-label">
          Orden en el módulo
          <input className="form-input" type="number" min="1" value={form.position} onChange={onChange('position')} required />
        </label>

        <div className="lesson-preview-card">
          <Icon name="menu_book" />
          <div>
            <strong>{form.title || 'Lección sin título'}</strong>
            <span>{selectedModule ? getModuleLabel(selectedModule) : 'Módulo pendiente'}</span>
          </div>
        </div>

        <div className="enrollment-form-actions">
          <Button type="submit">
            <Icon name="save" />
            Guardar lección
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}

export function LessonList({
  filteredLessons,
  loading,
  moduleFilter,
  modulesById,
  onCreate,
  onDelete,
  onEdit,
  onModuleFilterChange,
  onSearchChange,
  search,
  visibleModules,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-header lesson-list-header">
        <div>
          <span className="eyebrow">Biblioteca de clases</span>
          <h2>Lecciones por módulo</h2>
          <p>Busca por título, curso o módulo. La tabla oculta IDs internos para enfocarse en el contenido.</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="add" />
          Nueva lección
        </Button>
      </div>

      <div className="lesson-toolbar">
        <label className="search admin-search">
          <Icon name="search" />
          <input placeholder="Buscar lección, módulo o curso" type="search" value={search} onChange={onSearchChange} />
        </label>

        <select className="form-input lesson-module-filter" value={moduleFilter} onChange={onModuleFilterChange}>
          <option value="all">Todos los módulos</option>
          {visibleModules.map((module) => (
            <option value={module.id} key={module.id}>
              {getModuleLabel(module)}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table lesson-admin-table">
          <thead>
            <tr>
              <th>Lección</th>
              <th>Curso y módulo</th>
              <th>Duración</th>
              <th>Estado</th>
              <th>Orden</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <LessonRows filteredLessons={filteredLessons} loading={loading} modulesById={modulesById} onDelete={onDelete} onEdit={onEdit} />
          </tbody>
        </table>
      </div>
    </section>
  )
}

function LessonRows({ filteredLessons, loading, modulesById, onDelete, onEdit }) {
  if (loading) {
    return (
      <tr>
        <td colSpan={6}>Cargando lecciones...</td>
      </tr>
    )
  }

  if (filteredLessons.length === 0) {
    return (
      <tr>
        <td colSpan={6}>No hay lecciones con esos filtros.</td>
      </tr>
    )
  }

  return filteredLessons.map((lesson) => {
    const module = getLessonModule(lesson, modulesById)

    return (
      <tr key={lesson.id}>
        <td>
          <strong>{lesson.title}</strong>
          <span>{lesson.description || 'Sin descripción registrada.'}</span>
        </td>
        <td>
          <strong>{module?.courseTitle ?? 'Curso sin identificar'}</strong>
          <span>{module?.title ?? 'Módulo sin identificar'}</span>
        </td>
        <td>{formatMinutes(lesson.durationSeconds)}</td>
        <td>
          <div className="lesson-status-stack">
            <span className={`status-badge ${lesson.published ? 'status-active' : 'status-cancelled'}`}>
              {lesson.published ? 'Publicada' : 'Borrador'}
            </span>
            <span className="lesson-type-badge">{TYPE_LABELS[lesson.type] ?? lesson.type}</span>
            {lesson.preview ? <span className="lesson-type-badge">Vista previa</span> : null}
          </div>
        </td>
        <td>{lesson.position}</td>
        <td>
          <div className="row-actions">
            <button type="button" aria-label="Editar lección" onClick={() => onEdit(lesson)}>
              <Icon name="edit" />
            </button>
            <button type="button" aria-label="Eliminar lección" onClick={() => onDelete(lesson)}>
              <Icon name="delete" />
            </button>
          </div>
        </td>
      </tr>
    )
  })
}

export function LessonDeleteDialog({ lesson, modulesById, onCancel, onConfirm }) {
  if (!lesson) return null

  return (
    <div className="modal-overlay">
      <div className="auth-card lesson-delete-card">
        <div className="auth-card-header">
          <span className="eyebrow">Eliminar lección</span>
          <h2>Quitar clase del módulo</h2>
          <p>
            Se eliminará <strong>{lesson.title}</strong> de{' '}
            <strong>{getModuleLabel(getLessonModule(lesson, modulesById))}</strong>.
          </p>
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
