import { useEffect, useMemo, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  enrollmentId: '',
  code: '',
  pdfUrl: '',
}

function formatDate(value) {
  return value
    ? new Date(value).toLocaleString('es-SV', { dateStyle: 'medium', timeStyle: 'short' })
    : '-'
}

function getEnrollmentLabel(enrollment) {
  if (!enrollment) return 'Inscripción sin identificar'
  return `${enrollment.studentName ?? 'Estudiante'} · ${enrollment.courseTitle ?? 'Curso'}`
}

export function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [formMode, setFormMode] = useState(null) // 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pdfFilter, setPdfFilter] = useState('all') // 'all' | 'with-pdf' | 'without-pdf'

  const enrollmentsById = useMemo(
    () => new Map(enrollments.map((e) => [e.id, e])),
    [enrollments]
  )

  const completedEnrollments = useMemo(
    () => enrollments.filter((e) => String(e.status).toUpperCase() === 'COMPLETED'),
    [enrollments]
  )

  const selectedEnrollment = enrollmentsById.get(form.enrollmentId)

  const field = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const loadData = async () => {
    setLoading(true)
    try {
      const [certificatesDto, enrollmentsDto] = await Promise.all([
        api.getCertificates(),
        api.getEnrollments(),
      ])
      setCertificates(certificatesDto)
      setEnrollments(enrollmentsDto)
      setError('')
    } catch {
      setError('No se pudo cargar los certificados desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setEditTarget(null)
    setFormMode('create')
  }

  const openEdit = (certificate) => {
    setForm({
      enrollmentId: certificate.enrollmentId ?? '',
      code: certificate.code ?? '',
      pdfUrl: certificate.pdfUrl ?? '',
    })
    setEditTarget(certificate)
    setFormMode('edit')
  }

  const submit = async (event) => {
    event.preventDefault()
    const payload = {
      enrollmentId: form.enrollmentId,
      code: form.code.trim() || null,
      pdfUrl: form.pdfUrl.trim() || null,
    }
    try {
      if (formMode === 'edit' && editTarget) {
        await api.updateCertificate(editTarget.id, payload)
      } else {
        await api.createCertificate(payload)
      }
      setFormMode(null)
      setEditTarget(null)
      await loadData()
    } catch {
      setError(
        formMode === 'edit'
          ? 'No se pudo actualizar el certificado. Verifica los datos e intenta de nuevo.'
          : 'No se pudo emitir el certificado. La inscripción debe estar completada.'
      )
    }
  }

  const remove = async () => {
    try {
      await api.deleteCertificate(deleteTarget.id)
      setDeleteTarget(null)
      await loadData()
    } catch {
      setError('No se pudo eliminar el certificado.')
    }
  }

  const filteredCertificates = useMemo(() => {
    const query = search.trim().toLowerCase()
    return certificates.filter((cert) => {
      const enrollment = enrollmentsById.get(cert.enrollmentId)
      const matchesPdf =
        pdfFilter === 'all' ||
        (pdfFilter === 'with-pdf' && cert.pdfUrl) ||
        (pdfFilter === 'without-pdf' && !cert.pdfUrl)
      const matchesSearch =
        !query ||
        (enrollment?.studentName ?? '').toLowerCase().includes(query) ||
        (enrollment?.courseTitle ?? '').toLowerCase().includes(query) ||
        (cert.code ?? '').toLowerCase().includes(query)
      return matchesPdf && matchesSearch
    })
  }, [certificates, enrollmentsById, search, pdfFilter])

  const stats = useMemo(() => {
    const withPdf = certificates.filter((c) => c.pdfUrl).length
    const withCode = certificates.filter((c) => c.code).length
    const now = new Date()
    const thisMonth = certificates.filter((c) => {
      if (!c.issuedAt) return false
      const issued = new Date(c.issuedAt)
      return issued.getMonth() === now.getMonth() && issued.getFullYear() === now.getFullYear()
    }).length
    return { withPdf, withCode, thisMonth }
  }, [certificates])

  return (
    <main className="page lesson-progress-page">
      <section className="page-header">
        <span className="eyebrow">Gestión académica</span>
        <h1>Certificados</h1>
        <p>
          Emite, revisa y administra los certificados de finalización de cursos
          vinculados a inscripciones completadas.
        </p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      {/* ── Stats ── */}
      <section className="progress-summary-grid">
        <article className="progress-summary-card">
          <Icon name="workspace_premium" />
          <div>
            <strong>{certificates.length}</strong>
            <span>Total emitidos</span>
          </div>
        </article>
        <article className="progress-summary-card">
          <Icon name="calendar_month" />
          <div>
            <strong>{stats.thisMonth}</strong>
            <span>Este mes</span>
          </div>
        </article>
        <article className="progress-summary-card">
          <Icon name="qr_code" />
          <div>
            <strong>{stats.withCode}</strong>
            <span>Con código</span>
          </div>
        </article>
        <article className="progress-summary-card">
          <Icon name="picture_as_pdf" />
          <div>
            <strong>{stats.withPdf}</strong>
            <span>Con PDF</span>
          </div>
        </article>
      </section>

      {/* ── Formulario crear / editar ── */}
      {formMode ? (
        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">
                {formMode === 'create' ? 'Emitir certificado' : 'Editar certificado'}
              </span>
              <h2>
                {formMode === 'create'
                  ? 'Nuevo certificado de finalización'
                  : 'Actualizar datos del certificado'}
              </h2>
              <p>
                {formMode === 'create'
                  ? 'Solo puedes emitir certificados para inscripciones con estado COMPLETED.'
                  : 'Puedes modificar el código identificador y la URL del PDF.'}
              </p>
            </div>
          </div>

          <form className="progress-editor-form" onSubmit={submit}>
            {/* Inscripción */}
            <label className="form-label progress-field-wide">
              Inscripción
              <select
                className="form-input"
                value={form.enrollmentId}
                onChange={field('enrollmentId')}
                required
                disabled={formMode === 'edit'}
              >
                <option value="">Selecciona una inscripción completada</option>
                {(formMode === 'edit' ? enrollments : completedEnrollments).map((e) => (
                  <option value={e.id} key={e.id}>
                    {getEnrollmentLabel(e)}
                  </option>
                ))}
              </select>
            </label>

            {/* Código */}
            <label className="form-label">
              Código del certificado
              <input
                className="form-input"
                type="text"
                maxLength={64}
                placeholder="Se genera automáticamente si se deja vacío"
                value={form.code}
                onChange={field('code')}
              />
            </label>

            {/* PDF URL */}
            <label className="form-label">
              URL del PDF
              <input
                className="form-input"
                type="url"
                placeholder="https://... (opcional)"
                value={form.pdfUrl}
                onChange={field('pdfUrl')}
              />
            </label>

            {/* Preview */}
            <div className="progress-preview-card">
              <Icon name="workspace_premium" />
              <div>
                <strong>
                  {selectedEnrollment
                    ? getEnrollmentLabel(selectedEnrollment)
                    : 'Inscripción pendiente de selección'}
                </strong>
                <span>
                  {form.code
                    ? `Código: ${form.code}`
                    : 'El código se asignará automáticamente al emitir'}
                </span>
              </div>
            </div>

            <div className="enrollment-form-actions">
              <Button type="submit">
                <Icon name="workspace_premium" />
                {formMode === 'create' ? 'Emitir certificado' : 'Guardar cambios'}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setFormMode(null)
                  setEditTarget(null)
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {/* ── Tabla de listado ── */}
      <section className="admin-panel">
        <div className="admin-panel-header progress-list-header">
          <div>
            <span className="eyebrow">Registro de certificados</span>
            <h2>Certificados emitidos</h2>
            <p>
              Busca por nombre de estudiante, curso o código. Filtra por
              disponibilidad de PDF.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Emitir certificado
          </Button>
        </div>

        {/* Toolbar: búsqueda + filtros */}
        <div className="progress-toolbar">
          <label className="search admin-search">
            <Icon name="search" />
            <input
              placeholder="Buscar por estudiante, curso o código"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <div className="enrollment-filter-group" aria-label="Filtrar por PDF">
            {[
              ['all', 'Todos'],
              ['with-pdf', 'Con PDF'],
              ['without-pdf', 'Sin PDF'],
            ].map(([value, label]) => (
              <button
                className={pdfFilter === value ? 'active' : ''}
                type="button"
                key={value}
                onClick={() => setPdfFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla */}
        <div className="admin-table-wrap">
          <table className="admin-table lesson-progress-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Curso</th>
                <th>Código</th>
                <th>Fecha de emisión</th>
                <th>PDF</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>Cargando certificados...</td>
                </tr>
              ) : filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={6}>No hay certificados con esos filtros.</td>
                </tr>
              ) : (
                filteredCertificates.map((cert) => {
                  const enrollment = enrollmentsById.get(cert.enrollmentId)
                  return (
                    <tr key={cert.id}>
                      <td>
                        <strong>
                          {enrollment?.studentName ?? cert.studentName ?? 'Sin identificar'}
                        </strong>
                        <span>{cert.id}</span>
                      </td>
                      <td>
                        {enrollment?.courseTitle ?? cert.courseTitle ?? 'Curso sin identificar'}
                      </td>
                      <td>
                        {cert.code ? (
                          <span className="status-badge status-active">{cert.code}</span>
                        ) : (
                          <span className="status-badge status-cancelled">Sin código</span>
                        )}
                      </td>
                      <td>{formatDate(cert.issuedAt)}</td>
                      <td>
                        {cert.pdfUrl ? (
                          <a
                            href={cert.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="link-button"
                          >
                            <Icon name="picture_as_pdf" />
                            Ver PDF
                          </a>
                        ) : (
                          <span style={{ color: 'var(--color-muted-2)', fontSize: 13 }}>
                            No disponible
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            aria-label="Descargar certificado"
                            onClick={() =>
                              window.open(`/api/certificates/${cert.id}/download`, '_blank')
                            }
                          >
                            <Icon name="download" />
                          </button>
                          <button
                            type="button"
                            aria-label="Editar certificado"
                            onClick={() => openEdit(cert)}
                          >
                            <Icon name="edit" />
                          </button>
                          <button
                            type="button"
                            aria-label="Eliminar certificado"
                            onClick={() => setDeleteTarget(cert)}
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

      {/* ── Modal de eliminación ── */}
      {deleteTarget ? (
        <div className="modal-overlay">
          <div className="auth-card progress-delete-card">
            <div className="auth-card-header">
              <span className="eyebrow">Eliminar certificado</span>
              <h2>¿Eliminar este certificado?</h2>
              <p>
                Se eliminará el certificado de{' '}
                <strong>
                  {enrollmentsById.get(deleteTarget.enrollmentId)?.studentName ??
                    deleteTarget.studentName ??
                    'este estudiante'}
                </strong>
                {deleteTarget.code ? (
                  <>
                    {' '}con código <strong>{deleteTarget.code}</strong>
                  </>
                ) : null}
                . Esta acción no se puede deshacer.
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