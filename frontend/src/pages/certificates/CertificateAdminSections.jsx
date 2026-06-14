import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'

export function formatCertificateDate(dateString) {
  if (!dateString) return 'Pendiente'
  return new Date(dateString).toLocaleDateString('es-SV', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getEnrollmentLabel(enrollment, usersById, coursesById) {
  const user = usersById.get(enrollment.userId)
  const course = coursesById.get(enrollment.courseId)
  const userName = user
    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    : `Usuario ${enrollment.userId?.toString().slice(0, 6)}`
  const courseTitle = course?.title ?? `Curso ${enrollment.courseId?.toString().slice(0, 6)}`
  return `${userName} - ${courseTitle}`
}

export function CertificateSummary({ stats }) {
  const items = [
    ['workspace_premium', stats.total, 'Certificados emitidos'],
    ['school', stats.uniqueCourses, 'Cursos con certificado'],
    ['picture_as_pdf', stats.withPdf, 'Con documento PDF'],
    ['event', stats.issuedThisMonth, 'Emitidos este mes'],
  ]

  return (
    <section className="module-summary-grid">
      {items.map(([icon, value, label]) => (
        <article className="module-summary-card" key={label}>
          <Icon name={icon} />
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

export function CertificateForm({
  enrollments,
  form,
  formMode,
  onCancel,
  onChange,
  onSubmit,
  selectedEnrollment,
  usersById,
  coursesById,
}) {
  return (
    <section className="admin-panel module-editor-panel">
      <div className="admin-panel-header">
        <div>
          <span className="eyebrow">{formMode === 'create' ? 'Nuevo reconocimiento' : 'Editar certificado'}</span>
          <h2>{formMode === 'create' ? 'Emitir certificado' : 'Actualizar certificado'}</h2>
          <p>
            {formMode === 'create'
              ? 'Selecciona la inscripción completada para la que deseas generar el certificado.'
              : 'Modifica el código identificador o la URL del documento PDF generado.'}
          </p>
        </div>
      </div>

      <form className="module-editor-form" onSubmit={onSubmit}>
        <label className="form-label module-field-wide">
          Inscripción
          <select className="form-input" value={form.enrollmentId} onChange={onChange('enrollmentId')} required disabled={formMode === 'edit'}>
            <option value="">Selecciona una inscripción</option>
            {enrollments.map((enrollment) => (
              <option value={enrollment.id} key={enrollment.id}>
                {getEnrollmentLabel(enrollment, usersById, coursesById)}
              </option>
            ))}
          </select>
        </label>

        <label className="form-label">
          Código del certificado
          <input className="form-input" value={form.code} onChange={onChange('code')} placeholder="Ej. CERT-2024-00142" maxLength={64} />
        </label>

        <label className="form-label">
          URL del documento PDF
          <input className="form-input" value={form.pdfUrl} onChange={onChange('pdfUrl')} placeholder="Opcional: se genera automáticamente si lo dejas vacío" type="text" />
        </label>

        <div className="module-preview-card module-field-wide">
          <Icon name="workspace_premium" />
          <div>
            <strong>{form.code || 'Código pendiente de asignación'}</strong>
            <span>
              {selectedEnrollment
                ? getEnrollmentLabel(selectedEnrollment, usersById, coursesById)
                : 'Selecciona una inscripción para ver el detalle'}
              {form.pdfUrl ? ' · Con PDF adjunto' : ''}
            </span>
          </div>
        </div>

        <div className="enrollment-form-actions module-field-wide">
          <Button type="submit">
            <Icon name="save" />
            {formMode === 'create' ? 'Emitir certificado' : 'Guardar cambios'}
          </Button>
          <Button variant="secondary" type="button" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </section>
  )
}

export function CertificateTable({
  certificates,
  coursesById,
  enrollmentFilter,
  enrollments,
  enrollmentsById,
  loading,
  onCreate,
  onDelete,
  onEdit,
  onEnrollmentFilterChange,
  onSearchChange,
  search,
  usersById,
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-header module-list-header">
        <div>
          <span className="eyebrow">Registro de certificados</span>
          <h2>Certificados emitidos</h2>
          <p>Revisa el estado de cada certificado, edita su código o descarga el documento generado para cada estudiante.</p>
        </div>
        <Button onClick={onCreate}>
          <Icon name="add" />
          Emitir certificado
        </Button>
      </div>

      <div className="module-toolbar">
        <label className="search admin-search">
          <Icon name="search" />
          <input placeholder="Buscar por alumno, curso o código" type="search" value={search} onChange={onSearchChange} />
        </label>

        <select className="form-input module-course-filter" value={enrollmentFilter} onChange={onEnrollmentFilterChange}>
          <option value="all">Todas las inscripciones</option>
          {enrollments.map((enrollment) => (
            <option value={enrollment.id} key={enrollment.id}>
              {getEnrollmentLabel(enrollment, usersById, coursesById)}
            </option>
          ))}
        </select>
      </div>

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
            <CertificateRows
              certificates={certificates}
              coursesById={coursesById}
              enrollmentsById={enrollmentsById}
              loading={loading}
              onDelete={onDelete}
              onEdit={onEdit}
              usersById={usersById}
            />
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CertificateRows({ certificates, coursesById, enrollmentsById, loading, onDelete, onEdit, usersById }) {
  if (loading) return <CertificateEmptyRow text="Cargando certificados..." />
  if (certificates.length === 0) return <CertificateEmptyRow text="No hay certificados con esos filtros." />

  return certificates.map((certificate) => {
    const enrollment = enrollmentsById.get(certificate.enrollmentId)
    const user = enrollment ? usersById.get(enrollment.userId) : null
    const course = enrollment ? coursesById.get(enrollment.courseId) : null
    const userName = user
      ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
      : certificate.studentName ?? '-'
    const courseTitle = course?.title ?? certificate.courseTitle ?? '-'

    return (
      <tr key={certificate.id}>
        <td>
          <strong>{userName}</strong>
          <span style={{ display: 'block', marginTop: 2, fontSize: 12, color: 'var(--color-muted-2)' }}>{user?.email ?? ''}</span>
        </td>
        <td>{courseTitle}</td>
        <td>
          <span className="status-badge status-completed">{certificate.code ?? 'Sin código'}</span>
        </td>
        <td>{formatCertificateDate(certificate.issuedAt)}</td>
        <td>
          {certificate.pdfUrl ? (
            <a href={`/api/certificates/${certificate.id}/download`} className="text-action" style={{ fontSize: 13 }} download>
              <Icon name="download" />
              Descargar
            </a>
          ) : (
            <span style={{ color: 'var(--color-muted-2)', fontSize: 13 }}>Sin PDF</span>
          )}
        </td>
        <td>
          <div className="row-actions">
            <button type="button" onClick={() => onEdit(certificate)} aria-label={`Editar certificado ${certificate.code ?? certificate.id}`}>
              <Icon name="edit" />
            </button>
            <button type="button" onClick={() => onDelete(certificate)} aria-label={`Eliminar certificado ${certificate.code ?? certificate.id}`}>
              <Icon name="delete" />
            </button>
          </div>
        </td>
      </tr>
    )
  })
}

function CertificateEmptyRow({ text }) {
  return (
    <tr>
      <td colSpan={6}>
        <div className="comment-empty-state">{text}</div>
      </td>
    </tr>
  )
}

export function CertificateDeleteDialog({ certificate, onCancel, onConfirm }) {
  if (!certificate) return null

  return (
    <div className="modal-overlay">
      <div className="auth-card module-delete-card">
        <div className="auth-card-header">
          <span className="eyebrow">Eliminar certificado</span>
          <h2>{certificate.code ?? 'Sin código'}</h2>
          <p>Se eliminará permanentemente este certificado. El estudiante perderá acceso al documento desde la plataforma. Esta acción no se puede deshacer.</p>
        </div>
        <div className="enrollment-form-actions">
          <Button onClick={onConfirm}>
            <Icon name="delete" />
            Eliminar
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
