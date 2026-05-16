import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  userId: '',
  courseId: '',
  status: 'active',
}

const STATUS_LABELS = {
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const STATUS_OPTIONS = [
  ['active', 'Activa'],
  ['completed', 'Completada'],
  ['cancelled', 'Cancelada'],
]

function getUserName(user) {
  return `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email || user.id
}

function getEnrollmentStudent(enrollment, usersById) {
  return enrollment.studentName || getUserName(usersById.get(enrollment.userId) ?? {})
}

function getEnrollmentCourse(enrollment, coursesById) {
  return enrollment.courseTitle || coursesById.get(enrollment.courseId)?.title || enrollment.courseId
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('es-SV') : '-'
}

function formatProgress(value) {
  return `${Number(value ?? 0).toFixed(0)}%`
}

export function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([])
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])
  const coursesById = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses])

  const availableUsers = useMemo(() => users.filter((user) => user.role === 'student' || user.role === 'STUDENT'), [users])
  const selectedStudent = usersById.get(form.userId)
  const selectedCourse = coursesById.get(form.courseId)

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [enrollmentsDto, usersDto, coursesDto] = await Promise.all([
        api.getEnrollments(),
        api.getUsers(),
        api.getCourses(),
      ])
      setEnrollments(enrollmentsDto)
      setUsers(usersDto)
      setCourses(coursesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar las inscripciones desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (enrollment) => {
    setForm({
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
    })
    setSelected(enrollment)
    setFormMode('edit')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (formMode === 'create') {
        await api.createEnrollment({ userId: form.userId, courseId: form.courseId })
      } else {
        await api.updateEnrollmentStatus(selected.id, { status: form.status })
      }
      await loadData()
      setFormMode(null)
    } catch {
      setError('No se pudo guardar la inscripción. Revisa que el estudiante no esté inscrito ya en ese curso.')
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteEnrollment(deleteTarget.id)
      await loadData()
      setDeleteTarget(null)
    } catch {
      setError('No se pudo eliminar la inscripción en la API.')
    }
  }

  const filteredEnrollments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return enrollments.filter((enrollment) => {
      const student = getEnrollmentStudent(enrollment, usersById).toLowerCase()
      const course = getEnrollmentCourse(enrollment, coursesById).toLowerCase()
      const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter
      const matchesSearch = !query || student.includes(query) || course.includes(query)

      return matchesStatus && matchesSearch
    })
  }, [coursesById, enrollments, search, statusFilter, usersById])

  const stats = useMemo(() => {
    const active = enrollments.filter((item) => item.status === 'active').length
    const completed = enrollments.filter((item) => item.status === 'completed').length
    const average = enrollments.length
      ? Math.round(enrollments.reduce((sum, item) => sum + Number(item.progress ?? 0), 0) / enrollments.length)
      : 0

    return { active, completed, average }
  }, [enrollments])

  return (
    <main className="page enrollments-page">
      <section className="page-header">
        <span className="eyebrow">Gestión académica</span>
        <h1>Inscripciones</h1>
        <p>Asigna estudiantes a cursos, revisa su avance y actualiza el estado sin manejar UUIDs manualmente.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      <section className="enrollment-summary-grid">
        <article className="enrollment-summary-card">
          <Icon name="how_to_reg" />
          <div>
            <strong>{enrollments.length}</strong>
            <span>Total de inscripciones</span>
          </div>
        </article>
        <article className="enrollment-summary-card">
          <Icon name="play_circle" />
          <div>
            <strong>{stats.active}</strong>
            <span>En curso</span>
          </div>
        </article>
        <article className="enrollment-summary-card">
          <Icon name="task_alt" />
          <div>
            <strong>{stats.completed}</strong>
            <span>Completadas</span>
          </div>
        </article>
        <article className="enrollment-summary-card">
          <Icon name="trending_up" />
          <div>
            <strong>{stats.average}%</strong>
            <span>Avance promedio</span>
          </div>
        </article>
      </section>

      {formMode ? (
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

          <form className="enrollment-form" onSubmit={handleSubmit}>
            <label className="form-label">
              Estudiante
              <select className="form-input" value={form.userId} onChange={field('userId')} required disabled={formMode === 'edit'}>
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
              <select className="form-input" value={form.courseId} onChange={field('courseId')} required disabled={formMode === 'edit'}>
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
              <select className="form-input" value={form.status} onChange={field('status')} disabled={formMode === 'create'}>
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
              <Button variant="secondary" type="button" onClick={() => setFormMode(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header enrollment-list-header">
          <div>
            <span className="eyebrow">Seguimiento</span>
            <h2>Listado de inscripciones</h2>
            <p>Filtra por estudiante, curso o estado para encontrar rápidamente el registro correcto.</p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nueva inscripción
          </Button>
        </div>

        <div className="enrollment-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar estudiante o curso"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="enrollment-filter-group" aria-label="Filtrar por estado">
            {[
              ['all', 'Todas'],
              ...STATUS_OPTIONS,
            ].map(([value, label]) => (
              <button
                className={statusFilter === value ? 'active' : ''}
                type="button"
                key={value}
                onClick={() => setStatusFilter(value)}
              >
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
              {loading ? (
                <tr>
                  <td colSpan={6}>Cargando inscripciones...</td>
                </tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay inscripciones con esos filtros.</td>
                </tr>
              ) : (
                filteredEnrollments.map((item) => (
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
                        <button type="button" aria-label="Editar estado" onClick={() => openEdit(item)}>
                          <Icon name="edit" />
                        </button>
                        <button type="button" aria-label="Eliminar inscripción" onClick={() => setDeleteTarget(item)}>
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {deleteTarget ? (
        <div className="modal-overlay">
          <div className="auth-card enrollment-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar inscripción</span>
              <h2>Quitar estudiante del curso</h2>
              <p>
                Se eliminará la inscripción de <strong>{getEnrollmentStudent(deleteTarget, usersById)}</strong> en{' '}
                <strong>{getEnrollmentCourse(deleteTarget, coursesById)}</strong>.
              </p>
            </div>
            <div className="enrollment-form-actions">
              <Button onClick={confirmDelete}>
                <Icon name="delete" />
                Eliminar
              </Button>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
