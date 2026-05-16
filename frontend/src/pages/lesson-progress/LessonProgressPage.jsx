import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  enrollmentId: '',
  lessonId: '',
  completed: 'false',
  minutesWatched: '0',
}

function formatMinutes(seconds) {
  return `${Math.max(0, Math.round(Number(seconds ?? 0) / 60))} min`
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' }) : '-'
}

function getLessonPercent(progress, lesson) {
  const duration = Number(lesson?.durationSeconds ?? 0)
  if (progress.completed) return 100
  if (!duration) return 0
  return Math.min(100, Math.round((Number(progress.secondsWatched ?? 0) / duration) * 100))
}

function getEnrollmentLabel(enrollment) {
  if (!enrollment) return 'Inscripción sin identificar'
  return `${enrollment.studentName ?? 'Estudiante'} · ${enrollment.courseTitle ?? 'Curso'}`
}

function getLessonLabel(lesson, module) {
  if (!lesson) return 'Lección sin identificar'
  return `${module?.title ?? 'Módulo'} · ${lesson.title}`
}

export function LessonProgressPage() {
  const [progressRows, setProgressRows] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [lessons, setLessons] = useState([])
  const [modules, setModules] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const enrollmentsById = useMemo(() => new Map(enrollments.map((item) => [item.id, item])), [enrollments])
  const lessonsById = useMemo(() => new Map(lessons.map((lesson) => [lesson.id, lesson])), [lessons])
  const modulesById = useMemo(() => new Map(modules.map((module) => [module.id, module])), [modules])

  const selectedEnrollment = enrollmentsById.get(form.enrollmentId)
  const selectedLesson = lessonsById.get(form.lessonId)
  const selectedLessonModule = selectedLesson ? modulesById.get(selectedLesson.moduleId) : null

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [progressDto, enrollmentsDto, lessonsDto, modulesDto] = await Promise.all([
        api.getLessonProgress(),
        api.getEnrollments(),
        api.getLessons(),
        api.getModules(),
      ])
      setProgressRows(progressDto)
      setEnrollments(enrollmentsDto)
      setLessons(lessonsDto)
      setModules(modulesDto)
      setError('')
    } catch {
      setError('No se pudo cargar el progreso de lecciones desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setFormMode('create')
  }

  const openEdit = (progress) => {
    setForm({
      enrollmentId: progress.enrollmentId,
      lessonId: progress.lessonId,
      completed: String(Boolean(progress.completed)),
      minutesWatched: String(Math.max(0, Math.round(Number(progress.secondsWatched ?? 0) / 60))),
    })
    setFormMode('edit')
  }

  const submit = async (event) => {
    event.preventDefault()
    try {
      await api.upsertLessonProgress({
        enrollmentId: form.enrollmentId,
        lessonId: form.lessonId,
        secondsWatched: Number(form.minutesWatched) * 60,
        completed: form.completed === 'true',
      })
      setFormMode(null)
      await loadData()
    } catch {
      setError('No se pudo guardar el progreso. Revisa que la inscripción y la lección correspondan a datos existentes.')
    }
  }

  const remove = async () => {
    try {
      await api.deleteLessonProgress(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el progreso.')
    }
  }

  const filteredProgress = useMemo(() => {
    const query = search.trim().toLowerCase()

    return progressRows.filter((progress) => {
      const enrollment = enrollmentsById.get(progress.enrollmentId)
      const lesson = lessonsById.get(progress.lessonId)
      const module = lesson ? modulesById.get(lesson.moduleId) : null
      const status = progress.completed ? 'completed' : 'in-progress'
      const matchesStatus = statusFilter === 'all' || statusFilter === status
      const matchesSearch =
        !query ||
        (enrollment?.studentName ?? '').toLowerCase().includes(query) ||
        (enrollment?.courseTitle ?? '').toLowerCase().includes(query) ||
        (lesson?.title ?? '').toLowerCase().includes(query) ||
        (module?.title ?? '').toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [enrollmentsById, lessonsById, modulesById, progressRows, search, statusFilter])

  const stats = useMemo(() => {
    const completed = progressRows.filter((progress) => progress.completed).length
    const inProgress = progressRows.length - completed
    const totalMinutes = progressRows.reduce((sum, progress) => sum + Math.max(0, Math.round(Number(progress.secondsWatched ?? 0) / 60)), 0)

    return { completed, inProgress, totalMinutes }
  }, [progressRows])

  return (
    <main className="page lesson-progress-page">
      <section className="page-header">
        <span className="eyebrow">Seguimiento académico</span>
        <h1>Progreso de lecciones</h1>
        <p>Consulta qué está viendo cada estudiante, cuánto avanzó y qué lecciones ya completó.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      <section className="progress-summary-grid">
        <article className="progress-summary-card">
          <Icon name="track_changes" />
          <div>
            <strong>{progressRows.length}</strong>
            <span>Registros</span>
          </div>
        </article>
        <article className="progress-summary-card">
          <Icon name="task_alt" />
          <div>
            <strong>{stats.completed}</strong>
            <span>Completadas</span>
          </div>
        </article>
        <article className="progress-summary-card">
          <Icon name="play_circle" />
          <div>
            <strong>{stats.inProgress}</strong>
            <span>En progreso</span>
          </div>
        </article>
        <article className="progress-summary-card">
          <Icon name="schedule" />
          <div>
            <strong>{stats.totalMinutes}</strong>
            <span>Minutos vistos</span>
          </div>
        </article>
      </section>

      {formMode ? (
        <section className="admin-panel progress-editor-panel">
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'Registrar avance' : 'Actualizar avance'}</span>
              <h2>{formMode === 'create' ? 'Agregar progreso de estudiante' : 'Editar progreso de lección'}</h2>
              <p>Selecciona una inscripción y una lección por nombre. El tiempo se captura en minutos.</p>
            </div>
          </div>

          <form className="progress-editor-form" onSubmit={submit}>
            <label className="form-label progress-field-wide">
              Inscripción
              <select className="form-input" value={form.enrollmentId} onChange={field('enrollmentId')} required>
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
              <select className="form-input" value={form.lessonId} onChange={field('lessonId')} required>
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
                <input className="form-input" type="number" min="0" value={form.minutesWatched} onChange={field('minutesWatched')} />
                <span>minutos</span>
              </div>
            </label>

            <label className="form-label">
              Estado
              <select className="form-input" value={form.completed} onChange={field('completed')}>
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
              <Button variant="secondary" type="button" onClick={() => setFormMode(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header progress-list-header">
          <div>
            <span className="eyebrow">Actividad de aprendizaje</span>
            <h2>Avance por estudiante</h2>
            <p>Filtra por estudiante, curso, módulo o lección para revisar el progreso real.</p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nuevo progreso
          </Button>
        </div>

        <div className="progress-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar estudiante, curso o lección"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="enrollment-filter-group" aria-label="Filtrar progreso">
            {[
              ['all', 'Todos'],
              ['completed', 'Completadas'],
              ['in-progress', 'En progreso'],
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
              {loading ? (
                <tr>
                  <td colSpan={6}>Cargando progreso...</td>
                </tr>
              ) : filteredProgress.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay progreso con esos filtros.</td>
                </tr>
              ) : (
                filteredProgress.map((progress) => {
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
                          <span className={`status-badge ${progress.completed ? 'status-active' : 'status-cancelled'}`}>
                            {progress.completed ? 'Completada' : 'En progreso'}
                          </span>
                          <div className="mini-progress-track">
                            <div style={{ width: `${percent}%` }} />
                          </div>
                          <small>{percent}% de la lección</small>
                        </div>
                      </td>
                      <td>{formatMinutes(progress.secondsWatched)}</td>
                      <td>{formatDate(progress.lastWatchedAt)}</td>
                      <td>
                        <div className="row-actions">
                          <button type="button" aria-label="Editar progreso" onClick={() => openEdit(progress)}>
                            <Icon name="edit" />
                          </button>
                          <button type="button" aria-label="Eliminar progreso" onClick={() => setDeleteTarget(progress)}>
                            <Icon name="delete" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {deleteTarget ? (
        <div className="modal-overlay">
          <div className="auth-card progress-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar progreso</span>
              <h2>Quitar registro de avance</h2>
              <p>
                Se eliminará el avance de{' '}
                <strong>{enrollmentsById.get(deleteTarget.enrollmentId)?.studentName ?? 'este estudiante'}</strong> en{' '}
                <strong>{lessonsById.get(deleteTarget.lessonId)?.title ?? 'esta lección'}</strong>.
              </p>
            </div>
            <div className="enrollment-form-actions">
              <Button onClick={remove}>
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
