import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  moduleId: '',
  title: '',
  description: '',
  videoUrl: '',
  durationMinutes: '10',
  position: '1',
}

const TYPE_LABELS = {
  video: 'Video',
  article: 'Lectura',
  quiz: 'Evaluación',
}

function formatMinutes(seconds) {
  const minutes = Math.max(1, Math.round(Number(seconds ?? 0) / 60))
  return `${minutes} min`
}

function getModuleLabel(module) {
  if (!module) return 'Módulo sin identificar'
  return `${module.courseTitle ?? 'Curso'} · ${module.title}`
}

function getLessonModule(lesson, modulesById) {
  return modulesById.get(lesson.moduleId)
}

function getLessonCourse(lesson, modulesById) {
  return getLessonModule(lesson, modulesById)?.courseTitle ?? 'Curso sin identificar'
}

export function LessonsPage() {
  const [lessons, setLessons] = useState([])
  const [modules, setModules] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')

  const modulesById = useMemo(() => new Map(modules.map((module) => [module.id, module])), [modules])
  const selectedModule = modulesById.get(form.moduleId)

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [lessonsDto, modulesDto] = await Promise.all([api.getLessons(), api.getModules()])
      setLessons(lessonsDto)
      setModules(modulesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar las lecciones desde la API.')
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

  const openEdit = (lesson) => {
    setSelected(lesson)
    setForm({
      moduleId: lesson.moduleId,
      title: lesson.title,
      description: lesson.description ?? '',
      videoUrl: lesson.videoUrl ?? '',
      durationMinutes: String(Math.max(1, Math.round(Number(lesson.durationSeconds ?? 0) / 60))),
      position: String(lesson.position),
    })
    setFormMode('edit')
  }

  const submit = async (event) => {
    event.preventDefault()
    const payload = {
      moduleId: form.moduleId,
      title: form.title,
      description: form.description,
      videoUrl: form.videoUrl,
      durationSeconds: Number(form.durationMinutes) * 60,
      position: Number(form.position),
    }

    try {
      if (formMode === 'create') await api.createLesson(payload)
      else await api.updateLesson(selected.id, payload)
      setFormMode(null)
      await loadData()
    } catch {
      setError('No se pudo guardar la lección. Revisa el módulo, el título y la posición.')
    }
  }

  const remove = async () => {
    try {
      await api.deleteLesson(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar la lección.')
    }
  }

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase()

    return lessons
      .filter((lesson) => {
        const module = getLessonModule(lesson, modulesById)
        const course = getLessonCourse(lesson, modulesById)
        const matchesModule = moduleFilter === 'all' || lesson.moduleId === moduleFilter
        const matchesSearch =
          !query ||
          lesson.title.toLowerCase().includes(query) ||
          (lesson.description ?? '').toLowerCase().includes(query) ||
          (module?.title ?? '').toLowerCase().includes(query) ||
          course.toLowerCase().includes(query)

        return matchesModule && matchesSearch
      })
      .sort((a, b) => {
        const courseA = getLessonCourse(a, modulesById)
        const courseB = getLessonCourse(b, modulesById)
        const moduleA = getLessonModule(a, modulesById)?.position ?? 0
        const moduleB = getLessonModule(b, modulesById)?.position ?? 0

        return courseA.localeCompare(courseB) || moduleA - moduleB || Number(a.position) - Number(b.position)
      })
  }, [lessons, moduleFilter, modulesById, search])

  const stats = useMemo(() => {
    const videos = lessons.filter((lesson) => lesson.type === 'video').length
    const published = lessons.filter((lesson) => lesson.published).length
    const totalMinutes = lessons.reduce((sum, lesson) => sum + Math.max(1, Math.round(Number(lesson.durationSeconds ?? 0) / 60)), 0)

    return { videos, published, totalMinutes }
  }, [lessons])

  return (
    <main className="page lessons-admin-page">
      <section className="page-header">
        <span className="eyebrow">Gestión de contenido</span>
        <h1>Lecciones</h1>
        <p>Organiza las clases por curso y módulo, edita contenido y revisa duración sin trabajar con UUIDs.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      <section className="lesson-summary-grid">
        <article className="lesson-summary-card">
          <Icon name="play_lesson" />
          <div>
            <strong>{lessons.length}</strong>
            <span>Lecciones totales</span>
          </div>
        </article>
        <article className="lesson-summary-card">
          <Icon name="video_library" />
          <div>
            <strong>{stats.videos}</strong>
            <span>Con video</span>
          </div>
        </article>
        <article className="lesson-summary-card">
          <Icon name="visibility" />
          <div>
            <strong>{stats.published}</strong>
            <span>Publicadas</span>
          </div>
        </article>
        <article className="lesson-summary-card">
          <Icon name="schedule" />
          <div>
            <strong>{stats.totalMinutes}</strong>
            <span>Minutos de contenido</span>
          </div>
        </article>
      </section>

      {formMode ? (
        <section className="admin-panel lesson-editor-panel">
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'Nueva lección' : 'Editar lección'}</span>
              <h2>{formMode === 'create' ? 'Crear clase dentro de un módulo' : 'Actualizar contenido de clase'}</h2>
              <p>Selecciona el módulo por nombre, define el orden y agrega la información que verá el estudiante.</p>
            </div>
          </div>

          <form className="lesson-editor-form" onSubmit={submit}>
            <label className="form-label lesson-field-wide">
              Módulo
              <select className="form-input" value={form.moduleId} onChange={field('moduleId')} required>
                <option value="">Selecciona un módulo</option>
                {modules.map((module) => (
                  <option value={module.id} key={module.id}>
                    {getModuleLabel(module)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label lesson-field-wide">
              Título de la lección
              <input className="form-input" value={form.title} onChange={field('title')} placeholder="Ej. Introducción a componentes" required />
            </label>

            <label className="form-label lesson-field-wide">
              Descripción
              <textarea className="form-input lesson-textarea" value={form.description} onChange={field('description')} placeholder="Breve resumen de lo que aprenderá el estudiante" />
            </label>

            <label className="form-label lesson-field-wide">
              Enlace de video o recurso
              <input className="form-input" value={form.videoUrl} onChange={field('videoUrl')} placeholder="https://..." />
            </label>

            <label className="form-label">
              Duración
              <div className="lesson-inline-field">
                <input className="form-input" type="number" min="1" value={form.durationMinutes} onChange={field('durationMinutes')} required />
                <span>minutos</span>
              </div>
            </label>

            <label className="form-label">
              Orden en el módulo
              <input className="form-input" type="number" min="1" value={form.position} onChange={field('position')} required />
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
              <Button variant="secondary" type="button" onClick={() => setFormMode(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header lesson-list-header">
          <div>
            <span className="eyebrow">Biblioteca de clases</span>
            <h2>Lecciones por módulo</h2>
            <p>Busca por título, curso o módulo. La tabla oculta IDs internos para enfocarse en el contenido.</p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nueva lección
          </Button>
        </div>

        <div className="lesson-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar lección, módulo o curso"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select className="form-input lesson-module-filter" value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)}>
            <option value="all">Todos los módulos</option>
            {modules.map((module) => (
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
              {loading ? (
                <tr>
                  <td colSpan={6}>Cargando lecciones...</td>
                </tr>
              ) : filteredLessons.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay lecciones con esos filtros.</td>
                </tr>
              ) : (
                filteredLessons.map((lesson) => {
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
                          <button type="button" aria-label="Editar lección" onClick={() => openEdit(lesson)}>
                            <Icon name="edit" />
                          </button>
                          <button type="button" aria-label="Eliminar lección" onClick={() => setDeleteTarget(lesson)}>
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
          <div className="auth-card lesson-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar lección</span>
              <h2>Quitar clase del módulo</h2>
              <p>
                Se eliminará <strong>{deleteTarget.title}</strong> de{' '}
                <strong>{getModuleLabel(getLessonModule(deleteTarget, modulesById))}</strong>.
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
