import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

// ─── Formulario vacío ────────────────────────────────────────────────────────
const emptyForm = {
  enrollmentId: '',
  code: '',
  pdfUrl: '',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return 'Pendiente'
  return new Date(dateString).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getEnrollmentLabel(enrollment, usersById, coursesById) {
  const user = usersById.get(enrollment.userId)
  const course = coursesById.get(enrollment.courseId)
  const userName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    : `Usuario ${enrollment.userId?.toString().slice(0, 6)}`
  const courseTitle = course?.title ?? `Curso ${enrollment.courseId?.toString().slice(0, 6)}`
  return `${userName} — ${courseTitle}`
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function CertificatesPage() {
  // Datos
  const [certificates, setCertificates] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])

  // UI
  const [formMode, setFormMode] = useState(null) // null | 'create' | 'edit'
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [enrollmentFilter, setEnrollmentFilter] = useState('all')

  // Mapas derivados para lookups rápidos
  const usersById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users]
  )
  const coursesById = useMemo(
    () => new Map(courses.map((c) => [c.id, c])),
    [courses]
  )
  const enrollmentsById = useMemo(
    () => new Map(enrollments.map((e) => [e.id, e])),
    [enrollments]
  )

  // Enrollment seleccionado en el formulario (para la preview)
  const selectedEnrollment = form.enrollmentId
    ? enrollmentsById.get(form.enrollmentId)
    : null

  const field = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  // ─── Carga de datos ───────────────────────────────────────────────────────
  const loadData = async () => {
    setLoading(true)
    try {
      const [certificatesDto, enrollmentsDto, usersDto, coursesDto] =
        await Promise.all([
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
      setError('No se pudieron cargar los certificados desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ─── Gestión del formulario ───────────────────────────────────────────────
  const closeForm = () => {
    setFormMode(null)
    setSelected(null)
    setForm(emptyForm)
  }

  const openCreate = () => {
    setSelected(null)
    setForm({
      ...emptyForm,
      enrollmentId: enrollments[0]?.id ?? '',
    })
    setFormMode('create')
  }

  const openEdit = (certificate) => {
    setSelected(certificate)
    setForm({
      enrollmentId: certificate.enrollmentId ?? '',
      code: certificate.code ?? '',
      pdfUrl: certificate.pdfUrl ?? '',
    })
    setFormMode('edit')
  }

  // ─── Operaciones CRUD ─────────────────────────────────────────────────────

  // POST / PUT
  const submit = async (event) => {
    event.preventDefault()
    const payload = {
      enrollmentId: form.enrollmentId,
      code: form.code.trim() || undefined,
      pdfUrl: form.pdfUrl.trim() || undefined,
    }
    try {
      if (formMode === 'create') {
        await api.createCertificate(payload)
      } else {
        await api.updateCertificate(selected.id, payload)
      }
      closeForm()
      await loadData()
    } catch {
      setError(
        formMode === 'create'
          ? 'No se pudo emitir el certificado. Verifica que la inscripción sea válida y esté completada.'
          : 'No se pudo actualizar el certificado. Revisa los datos e intenta de nuevo.'
      )
    }
  }

  // DELETE
  const remove = async () => {
    try {
      await api.deleteCertificate(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el certificado.')
    }
  }

  // ─── Filtrado y búsqueda ──────────────────────────────────────────────────
  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase()
    return certificates.filter((cert) => {
      const matchesEnrollment =
        enrollmentFilter === 'all' || cert.enrollmentId === enrollmentFilter

      const enrollment = enrollmentsById.get(cert.enrollmentId)
      const user = enrollment ? usersById.get(enrollment.userId) : null
      const course = enrollment ? coursesById.get(enrollment.courseId) : null
      const userName = user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
        : ''
      const courseTitle = course?.title ?? ''
      const code = cert.code ?? ''

      const matchesSearch =
        !query ||
        userName.toLowerCase().includes(query) ||
        courseTitle.toLowerCase().includes(query) ||
        code.toLowerCase().includes(query)

      return matchesEnrollment && matchesSearch
    })
  }, [
    certificates,
    enrollmentFilter,
    search,
    enrollmentsById,
    usersById,
    coursesById,
  ])

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const withPdf = certificates.filter((c) => Boolean(c.pdfUrl)).length
    const issuedThisMonth = certificates.filter((c) => {
      if (!c.issuedAt) return false
      const issued = new Date(c.issuedAt)
      const now = new Date()
      return (
        issued.getMonth() === now.getMonth() &&
        issued.getFullYear() === now.getFullYear()
      )
    }).length
    const uniqueCourses = new Set(
      certificates
        .map((c) => enrollmentsById.get(c.enrollmentId)?.courseId)
        .filter(Boolean)
    ).size
    return {
      total: certificates.length,
      withPdf,
      issuedThisMonth,
      uniqueCourses,
    }
  }, [certificates, enrollmentsById])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <main className="page modules-admin-page">
      {/* Cabecera */}
      <section className="page-header">
        <span className="eyebrow">Reconocimientos académicos</span>
        <h1>Certificados</h1>
        <p>
          Emite, actualiza y revoca los certificados de finalización vinculados a
          inscripciones completadas en la plataforma.
        </p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      {/* ── KPIs ── */}
      <section className="module-summary-grid">
        <article className="module-summary-card">
          <Icon name="workspace_premium" />
          <div>
            <strong>{stats.total}</strong>
            <span>Certificados emitidos</span>
          </div>
        </article>
        <article className="module-summary-card">
          <Icon name="school" />
          <div>
            <strong>{stats.uniqueCourses}</strong>
            <span>Cursos con certificado</span>
          </div>
        </article>
        <article className="module-summary-card">
          <Icon name="picture_as_pdf" />
          <div>
            <strong>{stats.withPdf}</strong>
            <span>Con documento PDF</span>
          </div>
        </article>
        <article className="module-summary-card">
          <Icon name="event" />
          <div>
            <strong>{stats.issuedThisMonth}</strong>
            <span>Emitidos este mes</span>
          </div>
        </article>
      </section>

      {/* ── Formulario CREATE / EDIT ── */}
      {formMode ? (
        <section className="admin-panel module-editor-panel">
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">
                {formMode === 'create'
                  ? 'Nuevo reconocimiento'
                  : 'Editar certificado'}
              </span>
              <h2>
                {formMode === 'create'
                  ? 'Emitir certificado'
                  : 'Actualizar certificado'}
              </h2>
              <p>
                {formMode === 'create'
                  ? 'Selecciona la inscripción completada para la que deseas generar el certificado.'
                  : 'Modifica el código identificador o la URL del documento PDF generado.'}
              </p>
            </div>
          </div>

          <form className="module-editor-form" onSubmit={submit}>
            {/* Inscripción */}
            <label className="form-label module-field-wide">
              Inscripción
              <select
                className="form-input"
                value={form.enrollmentId}
                onChange={field('enrollmentId')}
                required
                disabled={formMode === 'edit'}
              >
                <option value="">Selecciona una inscripción</option>
                {enrollments.map((enrollment) => (
                  <option value={enrollment.id} key={enrollment.id}>
                    {getEnrollmentLabel(enrollment, usersById, coursesById)}
                  </option>
                ))}
              </select>
            </label>

            {/* Código */}
            <label className="form-label">
              Código del certificado
              <input
                className="form-input"
                value={form.code}
                onChange={field('code')}
                placeholder="Ej. CERT-2024-00142"
                maxLength={64}
              />
            </label>

            {/* URL del PDF */}
            <label className="form-label">
              URL del documento PDF
              <input
                className="form-input"
                value={form.pdfUrl}
                onChange={field('pdfUrl')}
                placeholder="https://storage.example.com/cert-00142.pdf"
                type="url"
              />
            </label>

            {/* Preview card */}
            <div className="module-preview-card module-field-wide">
              <Icon name="workspace_premium" />
              <div>
                <strong>
                  {form.code || 'Código pendiente de asignación'}
                </strong>
                <span>
                  {selectedEnrollment
                    ? getEnrollmentLabel(
                        selectedEnrollment,
                        usersById,
                        coursesById
                      )
                    : 'Selecciona una inscripción para ver el detalle'}
                  {form.pdfUrl ? ' · Con PDF adjunto' : ''}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="enrollment-form-actions module-field-wide">
              <Button type="submit">
                <Icon name="save" />
                {formMode === 'create' ? 'Emitir certificado' : 'Guardar cambios'}
              </Button>
              <Button variant="secondary" type="button" onClick={closeForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {/* ── Panel lista (GET) ── */}
      <section className="admin-panel">
        <div className="admin-panel-header module-list-header">
          <div>
            <span className="eyebrow">Registro de certificados</span>
            <h2>Certificados emitidos</h2>
            <p>
              Revisa el estado de cada certificado, edita su código o descarga el
              documento generado por el backend.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Emitir certificado
          </Button>
        </div>

        {/* Toolbar */}
        <div className="module-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar por alumno, curso o código"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            className="form-input module-course-filter"
            value={enrollmentFilter}
            onChange={(event) => setEnrollmentFilter(event.target.value)}
          >
            <option value="all">Todas las inscripciones</option>
            {enrollments.map((enrollment) => (
              <option value={enrollment.id} key={enrollment.id}>
                {getEnrollmentLabel(enrollment, usersById, coursesById)}
              </option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Curso</th>
                <th>Código</th>
                <th>Fecha de emisión</th>
                <th>Documento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className="comment-empty-state">
                      Cargando certificados...
                    </div>
                  </td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="comment-empty-state">
                      No hay certificados con esos filtros.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => {
                  const enrollment = enrollmentsById.get(cert.enrollmentId)
                  const user = enrollment
                    ? usersById.get(enrollment.userId)
                    : null
                  const course = enrollment
                    ? coursesById.get(enrollment.courseId)
                    : null
                  const userName = user
                    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
                    : cert.studentName ?? '—'
                  const courseTitle =
                    course?.title ?? cert.courseTitle ?? '—'

                  return (
                    <tr key={cert.id}>
                      {/* Estudiante */}
                      <td>
                        <strong>{userName}</strong>
                        <span style={{ display: 'block', marginTop: 2, fontSize: 12, color: 'var(--color-muted-2)' }}>
                          {user?.email ?? ''}
                        </span>
                      </td>

                      {/* Curso */}
                      <td>{courseTitle}</td>

                      {/* Código */}
                      <td>
                        <span className="status-badge status-completed">
                          {cert.code ?? 'Sin código'}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td>{formatDate(cert.issuedAt)}</td>

                      {/* Documento */}
                      <td>
                        {cert.pdfUrl ? (
                          <a
                            href={`/api/certificates/${cert.id}/download`}
                            className="text-action"
                            style={{ fontSize: 13 }}
                            download
                          >
                            <Icon name="download" />
                            Descargar
                          </a>
                        ) : (
                          <span style={{ color: 'var(--color-muted-2)', fontSize: 13 }}>
                            Sin PDF
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            onClick={() => openEdit(cert)}
                            aria-label={`Editar certificado ${cert.code ?? cert.id}`}
                          >
                            <Icon name="edit" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(cert)}
                            aria-label={`Eliminar certificado ${cert.code ?? cert.id}`}
                          >
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

      {/* ── Modal DELETE ── */}
      {deleteTarget ? (
        <div className="modal-overlay">
          <div className="auth-card module-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar certificado</span>
              <h2>{deleteTarget.code ?? 'Sin código'}</h2>
              <p>
                Se eliminará permanentemente este certificado. El estudiante perderá
                acceso al documento desde la plataforma. Esta acción no se puede
                deshacer.
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