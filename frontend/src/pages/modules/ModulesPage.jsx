import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  courseId: '',
  title: '',
  description: '',
  position: '1',
  published: 'true',
}

function publishedLabel(value) {
  return value ? 'Publicado' : 'Borrador'
}

function getCourseTitle(course) {
  return course?.title ?? 'Curso sin identificar'
}

export function ModulesPage({ allowedCourseIds = null }) {
  const [modules, setModules] = useState([])
  const [courses, setCourses] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const coursesById = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses])
  const selectedCourse = form.courseId ? coursesById.get(form.courseId) : null

  // Si hay allowedCourseIds, solo mostrar esos cursos (vista instructor)
  const visibleCourses = useMemo(
    () => (allowedCourseIds ? courses.filter((course) => allowedCourseIds.has(course.id)) : courses),
    [allowedCourseIds, courses]
  )

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [modulesDto, coursesDto] = await Promise.all([api.getModules(), api.getCourses()])
      setModules(modulesDto)
      setCourses(coursesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar los módulos desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const closeForm = () => {
    setFormMode(null)
    setSelected(null)
    setForm(emptyForm)
  }

  const openCreate = () => {
    setSelected(null)
    setForm({
      ...emptyForm,
      courseId: visibleCourses[0]?.id ?? '',
      position: String(Math.max(1, modules.length + 1)),
    })
    setFormMode('create')
  }

  const openEdit = (module) => {
    setSelected(module)
    setForm({
      courseId: module.courseId,
      title: module.title,
      description: module.description ?? '',
      position: String(module.position),
      published: String(Boolean(module.published)),
    })
    setFormMode('edit')
  }

  const submit = async (event) => {
    event.preventDefault()
    const payload = {
      courseId: form.courseId,
      title: form.title,
      description: form.description,
      position: Number(form.position),
      published: form.published === 'true',
    }

    try {
      if (formMode === 'create') await api.createModule(payload)
      else await api.updateModule(selected.id, payload)
      closeForm()
      await loadData()
    } catch {
      setError('No se pudo guardar el módulo. Verifica el curso, título y posición.')
    }
  }

  const remove = async () => {
    try {
      await api.deleteModule(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el módulo. Revisa si tiene lecciones asociadas.')
    }
  }

  const filteredModules = useMemo(() => {
    const query = search.trim().toLowerCase()

    return modules
      .filter((module) => {
        if (allowedCourseIds && !allowedCourseIds.has(module.courseId)) return false
        const courseTitle = module.courseTitle ?? getCourseTitle(coursesById.get(module.courseId))
        const matchesCourse = courseFilter === 'all' || module.courseId === courseFilter
        const matchesStatus =
          statusFilter === 'all' ||
          (statusFilter === 'published' && module.published) ||
          (statusFilter === 'draft' && !module.published)
        const matchesSearch =
          !query ||
          module.title.toLowerCase().includes(query) ||
          (module.description ?? '').toLowerCase().includes(query) ||
          courseTitle.toLowerCase().includes(query)

        return matchesCourse && matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        const courseCompare = (a.courseTitle ?? '').localeCompare(b.courseTitle ?? '')
        if (courseCompare !== 0) return courseCompare
        return Number(a.position ?? 0) - Number(b.position ?? 0)
      })
  }, [allowedCourseIds, courseFilter, coursesById, modules, search, statusFilter])

  const stats = useMemo(() => {
    const visible = allowedCourseIds ? modules.filter((m) => allowedCourseIds.has(m.courseId)) : modules
    const published = visible.filter((module) => module.published).length
    const drafts = visible.length - published
    const courseCount = new Set(visible.map((module) => module.courseId)).size
    return { total: visible.length, published, drafts, courseCount }
  }, [allowedCourseIds, modules])

  return (
    <main className="page modules-admin-page">
      <section className="page-header">
        <span className="eyebrow">Arquitectura de cursos</span>
        <h1>Módulos</h1>
        <p>Organiza cada curso en bloques claros, ordenados y listos para que el estudiante avance sin perderse.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      <section className="module-summary-grid">
        <article className="module-summary-card">
          <Icon name="view_module" />
          <div>
            <strong>{stats.total}</strong>
            <span>Módulos</span>
          </div>
        </article>
        <article className="module-summary-card">
          <Icon name="school" />
          <div>
            <strong>{stats.courseCount}</strong>
            <span>Cursos con módulos</span>
          </div>
        </article>
        <article className="module-summary-card">
          <Icon name="visibility" />
          <div>
            <strong>{stats.published}</strong>
            <span>Publicados</span>
          </div>
        </article>
        <article className="module-summary-card">
          <Icon name="edit_note" />
          <div>
            <strong>{stats.drafts}</strong>
            <span>Borradores</span>
          </div>
        </article>
      </section>

      {formMode ? (
        <section className="admin-panel module-editor-panel">
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'Nuevo bloque de aprendizaje' : 'Editar bloque de aprendizaje'}</span>
              <h2>{formMode === 'create' ? 'Crear módulo' : 'Actualizar módulo'}</h2>
              <p>Define a qué curso pertenece, qué aprenderá el estudiante y en qué orden debe aparecer.</p>
            </div>
          </div>

          <form className="module-editor-form" onSubmit={submit}>
            <label className="form-label">
              Curso
              <select className="form-input" value={form.courseId} onChange={field('courseId')} required>
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
              <select className="form-input" value={form.published} onChange={field('published')}>
                <option value="true">Publicado</option>
                <option value="false">Borrador</option>
              </select>
            </label>

            <label className="form-label">
              Título del módulo
              <input className="form-input" value={form.title} onChange={field('title')} placeholder="Ej. Fundamentos de JavaScript" required />
            </label>

            <label className="form-label">
              Posición
              <input className="form-input" type="number" min="1" value={form.position} onChange={field('position')} required />
            </label>

            <label className="form-label module-field-wide">
              Descripción para orientar al estudiante
              <textarea
                className="form-input module-textarea"
                value={form.description}
                onChange={field('description')}
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
              <Button variant="secondary" type="button" onClick={closeForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header module-list-header">
          <div>
            <span className="eyebrow">Mapa de contenidos</span>
            <h2>Módulos por curso</h2>
            <p>Revisa el orden, estado y propósito de cada bloque antes de publicar nuevas lecciones.</p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nuevo módulo
          </Button>
        </div>

        <div className="module-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar por curso, módulo o descripción"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select className="form-input module-course-filter" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
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
              <button className={statusFilter === value ? 'active' : ''} type="button" key={value} onClick={() => setStatusFilter(value)}>
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
                    <button type="button" onClick={() => openEdit(module)} aria-label={`Editar ${module.title}`}>
                      <Icon name="edit" />
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(module)} aria-label={`Eliminar ${module.title}`}>
                      <Icon name="delete" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {deleteTarget ? (
        <div className="modal-overlay">
          <div className="auth-card module-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar módulo</span>
              <h2>{deleteTarget.title}</h2>
              <p>Se eliminará este bloque del curso {deleteTarget.courseTitle}. Verifica que no tenga lecciones que quieras conservar.</p>
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
