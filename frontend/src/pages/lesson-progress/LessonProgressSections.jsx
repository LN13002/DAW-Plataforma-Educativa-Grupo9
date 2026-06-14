import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

export function formatMinutes(seconds) {
  return `${Math.max(0, Math.round(Number(seconds ?? 0) / 60))} min`
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
}

export function getLessonPercent(progress, lesson) {
  const duration = Number(lesson?.durationSeconds ?? 0)
  if (progress.completed) return 100
  if (!duration) return 0
  return Math.min(100, Math.round((Number(progress.secondsWatched ?? 0) / duration) * 100))
}

export function getEnrollmentLabel(enrollment) {
  if (!enrollment) return 'Inscripción sin identificar'
  return `${enrollment.studentName ?? 'Estudiante'} · ${enrollment.courseTitle ?? 'Curso'}`
}

export function getLessonLabel(lesson, module) {
  if (!lesson) return 'Lección sin identificar'
  return `${module?.title ?? 'Módulo'} · ${lesson.title}`
}

export function ProgressSummary({ recordCount, stats }) {
  const items = [
    ['track_changes', recordCount, 'Registros'],
    ['task_alt', stats.completed, 'Completadas'],
    ['play_circle', stats.inProgress, 'En progreso'],
    ['schedule', stats.totalMinutes, 'Minutos vistos'],
  ]

  return (
    <section className="progress-summary-grid">
      {items.map(([icon, value, label]) => (
        <article className="progress-summary-card" key={label}>
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

export function ProgressForm({
  enrollments,
  form,
  formMode,
  lessons,
  modulesById,
  onCancel,
  onChange,
  onSubmit,
  selectedEnrollment,
  selectedLesson,
  selectedLessonModule,
}) {
  return (
    <section className="admin-panel progress-editor-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">{formMode === 'create' ? 'Registrar avance' : 'Actualizar avance'}</span>
          <h2>{formMode === 'create' ? 'Agregar progreso de estudiante' : 'Editar progreso de lección'}</h2>
          <p>Selecciona una inscripción y una lección por nombre. El tiempo se captura en minutos.</p>
        </div>
      </div>

      <form className="progress-editor-form" onSubmit={onSubmit}>
        <label className="form-label progress-field-wide">
          Inscripción
          <select className="form-input" value={form.enrollmentId} onChange={onChange('enrollmentId')} required>
            <option value="">Selecciona estudiante y curso</option>
            {enrollments.map((enrollment) => (
              <option value={enrollment.id} key={enrollment.id}>
                {getEnrollmentLabel(enrollment)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label progress-field-wide">
          Lección
          <select className="form-input" value={form.lessonId} onChange={onChange('lessonId')} required>
            <option value="">Selecciona una lección</option>
            {lessons.map((lesson) => (
              <option value={lesson.id} key={lesson.id}>
                {getLessonLabel(lesson, modulesById.get(lesson.moduleId))}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Tiempo visto
          <div className="lesson-inline-field">
            <input className="form-input" type="number" min="0" value={form.minutesWatched} onChange={onChange('minutesWatched')} />
            <span>minutos</span>
          </div>
        </label>

        <label className="form-label">
          Estado
          <select className="form-input" value={form.completed} onChange={onChange('completed')}>
            <option value="false">En progreso</option>
            <option value="true">Completada</option>
          </select>
        </label>

        <div className="progress-preview-card">
          <Icon name="school" />
          <div>
            <strong>{selectedEnrollment ? getEnrollmentLabel(selectedEnrollment) : 'Inscripción pendiente'}</strong>
            <span>{selectedLesson ? getLessonLabel(selectedLesson, selectedLessonModule) : 'Lección pendiente'}</span>
          </div>
        </div>

        <div className="enrollment-form-actions">
          <Button type="submit">
            <Icon name="save" />
            Guardar progreso
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}

export function ProgressTable({
  enrollmentsById,
  lessonsById,
  loading,
  modulesById,
  onCreate,
  onDelete,
  onEdit,
  onSearchChange,
  onStatusFilterChange,
  progressRows,
  search,
  statusFilter,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-header progress-list-header">
        <div>
          <span className="eyebrow">Actividad de aprendizaje</span>
          <h2>Avance por estudiante</h2>
          <p>Filtra por estudiante, curso, módulo o lección para revisar el progreso registrado.</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="add" />
          Nuevo progreso
        </Button>
      </div>

      <div className="progress-toolbar">
        <label className="search admin-search">
          <Icon name="search" />
          <input placeholder="Buscar estudiante, curso o lección" type="search" value={search} onChange={onSearchChange} />
        </label>
        <div className="enrollment-filter-group" aria-label="Filtrar progreso">
          {[
            ['all', 'Todos'],
            ['completed', 'Completadas'],
            ['in-progress', 'En progreso'],
          ].map(([value, label]) => (
            <button className={statusFilter === value ? 'active' : ''} type="button" key={value} onClick={() => onStatusFilterChange(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table lesson-progress-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Curso y lección</th>
              <th>Avance</th>
              <th>Tiempo visto</th>
              <th>Última actividad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <ProgressRows progressRows={progressRows} loading={loading} enrollmentsById={enrollmentsById} lessonsById={lessonsById} modulesById={modulesById} onEdit={onEdit} onDelete={onDelete} />
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ProgressRows({ enrollmentsById, lessonsById, loading, modulesById, onDelete, onEdit, progressRows }) {
  if (loading) return <ProgressEmptyRow text="Cargando progreso..." />
  if (progressRows.length === 0) return <ProgressEmptyRow text="No hay progreso con esos filtros." />

  return progressRows.map((progress) => {
    const enrollment = enrollmentsById.get(progress.enrollmentId)
    const lesson = lessonsById.get(progress.lessonId)
    const module = lesson ? modulesById.get(lesson.moduleId) : null
    const percent = getLessonPercent(progress, lesson)

    return (
      <tr key={progress.id}>
        <td>
          <strong>{enrollment?.studentName ?? 'Estudiante sin identificar'}</strong>
          <span>{enrollment?.courseTitle ?? 'Curso sin identificar'}</span>
        </td>
        <td>
          <strong>{lesson?.title ?? 'Lección sin identificar'}</strong>
          <span>{module?.title ?? 'Módulo sin identificar'}</span>
        </td>
        <td>
          <div className="progress-cell-stack">
            <span className={`status-badge ${progress.completed ? 'status-active' : 'status-cancelled'}`}>{progress.completed ? 'Completada' : 'En progreso'}</span>
            <div className="mini-progress-track"><div style={{ width: `${percent}%` }} /></div>
            <small>{percent}% de la lección</small>
          </div>
        </td>
        <td>{formatMinutes(progress.secondsWatched)}</td>
        <td>{formatDate(progress.lastWatchedAt)}</td>
        <td>
          <div className="row-actions">
            <button type="button" aria-label="Editar progreso" onClick={() => onEdit(progress)}><Icon name="edit" /></button>
            <button type="button" aria-label="Eliminar progreso" onClick={() => onDelete(progress)}><Icon name="delete" /></button>
          </div>
        </td>
      </tr>
    )
  })
}

function ProgressEmptyRow({ text }) {
  return (
    <tr>
      <td colSpan={6}>{text}</td>
    </tr>
  )
}
