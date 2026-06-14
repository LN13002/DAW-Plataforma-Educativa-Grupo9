import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import {
  getCourseTitle,
  ModuleDeleteDialog,
  ModuleForm,
  ModuleList,
  ModuleSummary,
} from './ModuleAdminSections'

const emptyForm = {
  courseId: '',
  title: '',
  description: '',
  position: '1',
  published: 'true',
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
  const visibleCourses = useMemo(
    () => (allowedCourseIds ? courses.filter((course) => allowedCourseIds.has(course.id)) : courses),
    [allowedCourseIds, courses]
  )

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
        return courseCompare || Number(a.position ?? 0) - Number(b.position ?? 0)
      })
  }, [allowedCourseIds, courseFilter, coursesById, modules, search, statusFilter])

  const stats = useMemo(() => {
    const visible = allowedCourseIds ? modules.filter((module) => allowedCourseIds.has(module.courseId)) : modules
    const published = visible.filter((module) => module.published).length

    return {
      total: visible.length,
      published,
      drafts: visible.length - published,
      courseCount: new Set(visible.map((module) => module.courseId)).size,
    }
  }, [allowedCourseIds, modules])

  useEffect(() => {
    loadData()
  }, [])

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  async function loadData() {
    setLoading(true)
    try {
      const [modulesDto, coursesDto] = await Promise.all([api.getModules(), api.getCourses()])
      setModules(modulesDto)
      setCourses(coursesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar los módulos.')
    } finally {
      setLoading(false)
    }
  }

  function closeForm() {
    setFormMode(null)
    setSelected(null)
    setForm(emptyForm)
  }

  function openCreate() {
    setSelected(null)
    setForm({
      ...emptyForm,
      courseId: visibleCourses[0]?.id ?? '',
      position: String(Math.max(1, modules.length + 1)),
    })
    setFormMode('create')
  }

  function openEdit(module) {
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

  async function submit(event) {
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

  async function remove() {
    try {
      await api.deleteModule(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el módulo. Revisa si tiene lecciones asociadas.')
    }
  }

  return (
    <main className="page modules-admin-page">
      <section className="page-header">
        <span className="eyebrow">Arquitectura de cursos</span>
        <h1>Módulos</h1>
        <p>Organiza cada curso en bloques claros, ordenados y listos para que el estudiante avance sin perderse.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}
      <ModuleSummary stats={stats} />
      {formMode ? (
        <ModuleForm
          form={form}
          formMode={formMode}
          selectedCourse={selectedCourse}
          visibleCourses={visibleCourses}
          onCancel={closeForm}
          onChange={field}
          onSubmit={submit}
        />
      ) : null}
      <ModuleList
        courseFilter={courseFilter}
        coursesById={coursesById}
        filteredModules={filteredModules}
        loading={loading}
        onCreate={openCreate}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
        onSearchChange={(event) => setSearch(event.target.value)}
        onStatusFilterChange={setStatusFilter}
        onCourseFilterChange={(event) => setCourseFilter(event.target.value)}
        search={search}
        statusFilter={statusFilter}
        visibleCourses={visibleCourses}
      />
      <ModuleDeleteDialog module={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </main>
  )
}
