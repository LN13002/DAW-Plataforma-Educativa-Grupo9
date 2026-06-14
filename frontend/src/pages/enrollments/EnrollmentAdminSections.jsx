import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

export const STATUS_LABELS = {
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

export const STATUS_OPTIONS = [
  ['active', 'Activa'],
  ['completed', 'Completada'],
  ['cancelled', 'Cancelada'],
]

export function getUserName(user) {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || user.id
}

export function getEnrollmentStudent(enrollment, usersById) {
  return enrollment.studentName || getUserName(usersById.get(enrollment.userId) ?? {})
}

export function getEnrollmentCourse(enrollment, coursesById) {
  return enrollment.courseTitle || coursesById.get(enrollment.courseId)?.title || enrollment.courseId
}

export function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('es-SV') : '-'
}

export function formatProgress(value) {
  return `${Number(value ?? 0).toFixed(0)}%`
}

export function EnrollmentSummary({ enrollmentCount, stats }) {
  const items = [
    ['how_to_reg', enrollmentCount, 'Total de inscripciones'],
    ['play_circle', stats.active, 'En curso'],
    ['task_alt', stats.completed, 'Completadas'],
    ['trending_up', `${stats.average}%`, 'Avance promedio'],
  ]

  return (
    <section className="enrollment-summary-grid">
      {items.map(([icon, value, label]) => (
        <article className="enrollment-summary-card" key={label}>
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

export function EnrollmentForm({
  availableUsers,
  courses,
  form,
  formMode,
  onCancel,
  onChange,
  onSubmit,
  selectedCourse,
  selectedStudent,
}) {
  return (
    <section className="admin-panel enrollment-form-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">{formMode === 'create' ? 'Nueva asignación' : 'Cambio de estado'}</span>
          <h2>{formMode === 'create' ? 'Inscribir estudiante a curso' : 'Actualizar inscripción'}</h2>
          <p>
            {formMode === 'create'
              ? 'Selecciona el estudiante y el curso. El progreso inicia en cero y el estado queda activo.'
              : 'El estudiante y el curso se mantienen; solo actualiza el estado de la inscripción.'}
          </p>
        </div>
      </div>

      <form className="enrollment-form" onSubmit={onSubmit}>
        <label className="form-label">
          Estudiante
          <select className="form-input" value={form.userId} onChange={onChange('userId')} required disabled={formMode === 'edit'}>
            <option value="">Selecciona un estudiante</option>
            {availableUsers.map((user) => (
              <option value={user.id} key={user.id}>
                {getUserName(user)} · {user.email}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Curso
          <select className="form-input" value={form.courseId} onChange={onChange('courseId')} required disabled={formMode === 'edit'}>
            <option value="">Selecciona un curso</option>
            {courses.map((course) => (
              <option value={course.id} key={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Estado
          <select className="form-input" value={form.status} onChange={onChange('status')} disabled={formMode === 'create'}>
            {STATUS_OPTIONS.map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <div className="enrollment-preview">
          <Icon name="assignment_ind" />
          <div>
            <strong>{selectedStudent ? getUserName(selectedStudent) : 'Estudiante pendiente'}</strong>
            <span>{selectedCourse?.title ?? 'Curso pendiente'}</span>
          </div>
        </div>

        <div className="enrollment-form-actions">
          <Button type="submit">
            <Icon name={formMode === 'create' ? 'how_to_reg' : 'save'} />
            {formMode === 'create' ? 'Inscribir estudiante' : 'Guardar estado'}
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}

export function EnrollmentTable({
  coursesById,
  enrollments,
  loading,
  onCreate,
  onDelete,
  onEdit,
  onSearchChange,
  onStatusFilterChange,
  search,
  statusFilter,
  usersById,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-header enrollment-list-header">
        <div>
          <span className="eyebrow">Seguimiento</span>
          <h2>Listado de inscripciones</h2>
          <p>Filtra por estudiante, curso o estado para encontrar rápidamente el registro correcto.</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="add" />
          Nueva inscripción
        </Button>
      </div>

      <div className="enrollment-toolbar">
        <label className="search admin-search">
          <Icon name="search" />
          <input placeholder="Buscar estudiante o curso" type="search" value={search} onChange={onSearchChange} />
        </label>
        <div className="enrollment-filter-group" aria-label="Filtrar por estado">
          {[['all', 'Todas'], ...STATUS_OPTIONS].map(([value, label]) => (
            <button className={statusFilter === value ? 'active' : ''} type="button" key={value} onClick={() => onStatusFilterChange(value)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table enrollment-table">
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Progreso</th>
              <th>Inscrito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <EnrollmentRows enrollments={enrollments} loading={loading} usersById={usersById} coursesById={coursesById} onEdit={onEdit} onDelete={onDelete} />
          </tbody>
        </table>
      </div>
    </section>
  )
}

function EnrollmentRows({ coursesById, enrollments, loading, onDelete, onEdit, usersById }) {
  if (loading) return <EnrollmentEmptyRow text="Cargando inscripciones..." />
  if (enrollments.length === 0) return <EnrollmentEmptyRow text="No hay inscripciones con esos filtros." />

  return enrollments.map((item) => (
    <tr key={item.id}>
      <td>
        <strong>{getEnrollmentStudent(item, usersById)}</strong>
        <span>{usersById.get(item.userId)?.email ?? item.userId}</span>
      </td>
      <td>{getEnrollmentCourse(item, coursesById)}</td>
      <td>
        <span className={`status-badge status-${item.status}`}>{STATUS_LABELS[item.status] ?? item.status}</span>
      </td>
      <td>
        <div className="enrollment-progress-cell">
          <span>{formatProgress(item.progress)}</span>
          <div className="mini-progress-track">
            <div style={{ width: `${Math.min(100, Number(item.progress ?? 0))}%` }} />
          </div>
        </div>
      </td>
      <td>{formatDate(item.enrolledAt)}</td>
      <td>
        <div className="row-actions">
          <button type="button" aria-label="Editar estado" onClick={() => onEdit(item)}>
            <Icon name="edit" />
          </button>
          <button type="button" aria-label="Eliminar inscripción" onClick={() => onDelete(item)}>
            <Icon name="delete" />
          </button>
        </div>
      </td>
    </tr>
  ))
}

function EnrollmentEmptyRow({ text }) {
  return (
    <tr>
      <td colSpan={6}>{text}</td>
    </tr>
  )
}
