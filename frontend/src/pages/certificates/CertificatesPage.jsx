import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api'
import {
  CertificateDeleteDialog,
  CertificateForm,
  CertificateSummary,
  CertificateTable,
} from './CertificateAdminSections'

const emptyForm = {
  enrollmentId: '',
  code: '',
  pdfUrl: '',
}

export function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [enrollmentFilter, setEnrollmentFilter] = useState('all')

  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users])
  const coursesById = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses])
  const enrollmentsById = useMemo(() => new Map(enrollments.map((enrollment) => [enrollment.id, enrollment])), [enrollments])
  const selectedEnrollment = form.enrollmentId ? enrollmentsById.get(form.enrollmentId) : null

  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase()

    return certificates.filter((certificate) => {
      const enrollment = enrollmentsById.get(certificate.enrollmentId)
      const user = enrollment ? usersById.get(enrollment.userId) : null
      const course = enrollment ? coursesById.get(enrollment.courseId) : null
      const userName = user ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() : ''
      const matchesEnrollment = enrollmentFilter === 'all' || certificate.enrollmentId === enrollmentFilter
      const matchesSearch =
        !query ||
        userName.toLowerCase().includes(query) ||
        (course?.title ?? '').toLowerCase().includes(query) ||
        (certificate.code ?? '').toLowerCase().includes(query)

      return matchesEnrollment && matchesSearch
    })
  }, [certificates, coursesById, enrollmentFilter, enrollmentsById, search, usersById])

  const stats = useMemo(() => {
    const now = new Date()
    const issuedThisMonth = certificates.filter((certificate) => {
      if (!certificate.issuedAt) return false
      const issued = new Date(certificate.issuedAt)
      return issued.getMonth() === now.getMonth() && issued.getFullYear() === now.getFullYear()
    }).length

    return {
      total: certificates.length,
      withPdf: certificates.filter((certificate) => Boolean(certificate.pdfUrl)).length,
      issuedThisMonth,
      uniqueCourses: new Set(certificates.map((certificate) => enrollmentsById.get(certificate.enrollmentId)?.courseId).filter(Boolean)).size,
    }
  }, [certificates, enrollmentsById])

  useEffect(() => {
    loadData()
  }, [])

  const field = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))

  async function loadData() {
    setLoading(true)
    try {
      const [certificatesDto, enrollmentsDto, usersDto, coursesDto] = await Promise.all([
        api.getCertificates(),
        api.getEnrollments(),
        api.getUsers(),
        api.getCourses(),
      ])
      setCertificates(certificatesDto)
      setEnrollments(enrollmentsDto)
      setUsers(usersDto)
      setCourses(coursesDto)
      setError('')
    } catch {
      setError('No se pudieron cargar los certificados.')
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
    setForm({ ...emptyForm, enrollmentId: enrollments[0]?.id ?? '' })
    setFormMode('create')
  }

  function openEdit(certificate) {
    setSelected(certificate)
    setForm({
      enrollmentId: certificate.enrollmentId ?? '',
      code: certificate.code ?? '',
      pdfUrl: certificate.pdfUrl ?? '',
    })
    setFormMode('edit')
  }

  async function submit(event) {
    event.preventDefault()
    const payload = {
      enrollmentId: form.enrollmentId,
      code: form.code.trim() || undefined,
      pdfUrl: form.pdfUrl.trim() || undefined,
    }

    try {
      if (formMode === 'create') await api.createCertificate(payload)
      else await api.updateCertificate(selected.id, payload)
      closeForm()
      await loadData()
    } catch {
      setError(formMode === 'create'
        ? 'No se pudo emitir el certificado. Verifica que la inscripción sea válida y esté completada.'
        : 'No se pudo actualizar el certificado. Revisa los datos e intenta de nuevo.')
    }
  }

  async function remove() {
    try {
      await api.deleteCertificate(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el certificado.')
    }
  }

  return (
    <main className="page modules-admin-page">
      <section className="page-header">
        <span className="eyebrow">Reconocimientos académicos</span>
        <h1>Certificados</h1>
        <p>Emite, actualiza y revoca los certificados de finalización vinculados a inscripciones completadas en la plataforma.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}
      <CertificateSummary stats={stats} />
      {formMode ? (
        <CertificateForm
          coursesById={coursesById}
          enrollments={enrollments}
          form={form}
          formMode={formMode}
          onCancel={closeForm}
          onChange={field}
          onSubmit={submit}
          selectedEnrollment={selectedEnrollment}
          usersById={usersById}
        />
      ) : null}
      <CertificateTable
        certificates={filteredCertificates}
        coursesById={coursesById}
        enrollmentFilter={enrollmentFilter}
        enrollments={enrollments}
        enrollmentsById={enrollmentsById}
        loading={loading}
        onCreate={openCreate}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
        onEnrollmentFilterChange={(event) => setEnrollmentFilter(event.target.value)}
        onSearchChange={(event) => setSearch(event.target.value)}
        search={search}
        usersById={usersById}
      />
      <CertificateDeleteDialog certificate={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </main>
  )
}
