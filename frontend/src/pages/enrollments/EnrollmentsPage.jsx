import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import {
  EnrollmentForm,
  EnrollmentSummary,
  EnrollmentTable,
  getEnrollmentCourse,
  getEnrollmentStudent,
} from './EnrollmentAdminSections'
import { EnrollmentDeleteDialog } from './EnrollmentDeleteDialog'

const emptyForm = {
  userId: '',
  courseId: '',
  status: 'active',
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

  useEffect(() => {
    loadData()
  }, [])

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  async function loadData() {
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
      setError('No se pudieron cargar las inscripciones.')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setForm(emptyForm)
    setSelected(null)
    setFormMode('create')
  }

  function openEdit(enrollment) {
    setForm({
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
    })
    setSelected(enrollment)
    setFormMode('edit')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      if (formMode === 'create') await api.createEnrollment({ userId: form.userId, courseId: form.courseId })
      else await api.updateEnrollmentStatus(selected.id, { status: form.status })
      await loadData()
      setFormMode(null)
    } catch {
      setError('No se pudo guardar la inscripción. Revisa que el estudiante no esté inscrito ya en ese curso.')
    }
  }

  async function confirmDelete() {
    try {
      await api.deleteEnrollment(deleteTarget.id)
      await loadData()
      setDeleteTarget(null)
    } catch {
      setError('No se pudo eliminar la inscripción.')
    }
  }

  return (
    <main className="page enrollments-page">
      <section className="page-header">
        <span className="eyebrow">Gestión académica</span>
        <h1>Inscripciones</h1>
        <p>Asigna estudiantes a cursos, revisa su avance y actualiza el estado de cada inscripción.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}
      <EnrollmentSummary enrollmentCount={enrollments.length} stats={stats} />
      {formMode ? (
        <EnrollmentForm
          availableUsers={availableUsers}
          courses={courses}
          form={form}
          formMode={formMode}
          onCancel={() => setFormMode(null)}
          onChange={field}
          onSubmit={handleSubmit}
          selectedCourse={selectedCourse}
          selectedStudent={selectedStudent}
        />
      ) : null}
      <EnrollmentTable
        coursesById={coursesById}
        enrollments={filteredEnrollments}
        loading={loading}
        onCreate={openCreate}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
        onSearchChange={(event) => setSearch(event.target.value)}
        onStatusFilterChange={setStatusFilter}
        search={search}
        statusFilter={statusFilter}
        usersById={usersById}
      />
      <EnrollmentDeleteDialog
        enrollment={deleteTarget}
        usersById={usersById}
        coursesById={coursesById}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </main>
  )
}
