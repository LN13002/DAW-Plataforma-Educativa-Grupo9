import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import {
  getLessonCourse,
  getLessonModule,
  LessonDeleteDialog,
  LessonForm,
  LessonList,
  LessonSummary,
} from './LessonAdminSections'

const emptyForm = {
  moduleId: '',
  title: '',
  description: '',
  videoUrl: '',
  durationMinutes: '10',
  position: '1',
}

export function LessonsPage({ allowedCourseIds = null }) {
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
  const visibleModules = useMemo(
    () => (allowedCourseIds ? modules.filter((module) => allowedCourseIds.has(module.courseId)) : modules),
    [allowedCourseIds, modules]
  )
  const allowedModuleIds = useMemo(
    () => (allowedCourseIds ? new Set(visibleModules.map((module) => module.id)) : null),
    [allowedCourseIds, visibleModules]
  )

  const filteredLessons = useMemo(() => {
    const query = search.trim().toLowerCase()

    return lessons
      .filter((lesson) => {
        if (allowedModuleIds && !allowedModuleIds.has(lesson.moduleId)) return false
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
  }, [allowedModuleIds, lessons, moduleFilter, modulesById, search])

  const stats = useMemo(() => {
    const visible = allowedModuleIds ? lessons.filter((lesson) => allowedModuleIds.has(lesson.moduleId)) : lessons
    return {
      total: visible.length,
      videos: visible.filter((lesson) => lesson.type === 'video').length,
      published: visible.filter((lesson) => lesson.published).length,
      totalMinutes: visible.reduce((sum, lesson) => sum + Math.max(1, Math.round(Number(lesson.durationSeconds ?? 0) / 60)), 0),
    }
  }, [allowedModuleIds, lessons])

  useEffect(() => {
    loadData()
  }, [])

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  async function loadData() {
    setLoading(true)
    try {
      const [lessonsDto, modulesDto] = await Promise.all([api.getLessons(), api.getModules()])
      setLessons(lessonsDto)
      setModules(modulesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar las lecciones.')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm(emptyForm)
    setSelected(null)
    setFormMode('create')
  }

  function openEdit(lesson) {
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

  async function submit(event) {
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

  async function remove() {
    try {
      await api.deleteLesson(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar la lección.')
    }
  }

  return (
    <main className="page lessons-admin-page">
      <section className="page-header">
        <span className="eyebrow">Gestión de contenido</span>
        <h1>Lecciones</h1>
        <p>Organiza las clases por curso y módulo, edita contenido y revisa duración desde una vista clara.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}
      <LessonSummary stats={stats} />
      {formMode ? (
        <LessonForm
          form={form}
          formMode={formMode}
          selectedModule={selectedModule}
          visibleModules={visibleModules}
          onCancel={() => setFormMode(null)}
          onChange={field}
          onSubmit={submit}
        />
      ) : null}
      <LessonList
        filteredLessons={filteredLessons}
        loading={loading}
        moduleFilter={moduleFilter}
        modulesById={modulesById}
        onCreate={openCreate}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
        onModuleFilterChange={(event) => setModuleFilter(event.target.value)}
        onSearchChange={(event) => setSearch(event.target.value)}
        search={search}
        visibleModules={visibleModules}
      />
      <LessonDeleteDialog lesson={deleteTarget} modulesById={modulesById} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </main>
  )
}
