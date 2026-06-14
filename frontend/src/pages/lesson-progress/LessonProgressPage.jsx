import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import { LessonProgressDeleteDialog } from './LessonProgressDeleteDialog'
import {
  ProgressForm,
  ProgressSummary,
  ProgressTable,
} from './LessonProgressSections'

const emptyForm = {
  enrollmentId: '',
  lessonId: '',
  completed: 'false',
  minutesWatched: '0',
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

  useEffect(() => {
    loadData()
  }, [])

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  async function loadData() {
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
      setError('No se pudo cargar el progreso de lecciones.')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm(emptyForm)
    setFormMode('create')
  }

  function openEdit(progress) {
    setForm({
      enrollmentId: progress.enrollmentId,
      lessonId: progress.lessonId,
      completed: String(Boolean(progress.completed)),
      minutesWatched: String(Math.max(0, Math.round(Number(progress.secondsWatched ?? 0) / 60))),
    })
    setFormMode('edit')
  }

  async function submit(event) {
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

  async function remove() {
    try {
      await api.deleteLessonProgress(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el progreso.')
    }
  }

  return (
    <main className="page lesson-progress-page">
      <section className="page-header">
        <span className="eyebrow">Seguimiento académico</span>
        <h1>Progreso de lecciones</h1>
        <p>Consulta qué está viendo cada estudiante, cuánto avanzó y qué lecciones ya completó.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}
      <ProgressSummary recordCount={progressRows.length} stats={stats} />
      {formMode ? (
        <ProgressForm
          enrollments={enrollments}
          form={form}
          formMode={formMode}
          lessons={lessons}
          modulesById={modulesById}
          onCancel={() => setFormMode(null)}
          onChange={field}
          onSubmit={submit}
          selectedEnrollment={selectedEnrollment}
          selectedLesson={selectedLesson}
          selectedLessonModule={selectedLessonModule}
        />
      ) : null}
      <ProgressTable
        enrollmentsById={enrollmentsById}
        lessonsById={lessonsById}
        loading={loading}
        modulesById={modulesById}
        onCreate={openCreate}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
        onSearchChange={(event) => setSearch(event.target.value)}
        onStatusFilterChange={setStatusFilter}
        progressRows={filteredProgress}
        search={search}
        statusFilter={statusFilter}
      />
      <LessonProgressDeleteDialog
        progress={deleteTarget}
        enrollmentsById={enrollmentsById}
        lessonsById={lessonsById}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={remove}
      />
    </main>
  )
}
