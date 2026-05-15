import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = {
  userId: '',
  courseId: '',
  status: 'active',
}

export function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)

  const field = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const loadEnrollments = async () => {
    setLoading(true)
    try {
      const response = await api.getEnrollments()
      setEnrollments(response)
      setError('')
    } catch {
      setError('No se pudieron cargar las inscripciones desde la API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrollments()
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (enrollment) => {
    setForm({ userId: enrollment.userId, courseId: enrollment.courseId, status: enrollment.status })
    setSelected(enrollment)
    setFormMode('edit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formMode === 'create') {
        await api.createEnrollment({ userId: form.userId, courseId: form.courseId })
      } else {
        await api.updateEnrollmentStatus(selected.id, { status: form.status })
      }
      await loadEnrollments()
      setFormMode(null)
    } catch {
      setError('No se pudo guardar la inscripción. Verifica userId/courseId y estado.')
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteEnrollment(deleteTarget.id)
      await loadEnrollments()
      setDeleteTarget(null)
    } catch {
      setError('No se pudo eliminar la inscripción en la API.')
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">/api/enrollments</span>
        <h1>Inscripciones</h1>
        <p>Gestión de inscripciones por estudiante y curso con estado y progreso real.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'POST /api/enrollments' : 'PATCH /api/enrollments/:id/status'}</span>
              <h2>{formMode === 'create' ? 'Crear inscripción' : 'Actualizar estado'}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', padding: '24px', maxWidth: '560px' }}>
            <label className="form-label">
              Usuario ID
              <input className="form-input" value={form.userId} onChange={field('userId')} placeholder="UUID" required disabled={formMode === 'edit'} />
            </label>

            <label className="form-label">
              Curso ID
              <input className="form-input" value={form.courseId} onChange={field('courseId')} placeholder="UUID" required disabled={formMode === 'edit'} />
            </label>

            <label className="form-label">
              Estado
              <select className="form-input" value={form.status} onChange={field('status')}>
                <option value="active">active</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit">
                <Icon name={formMode === 'create' ? 'add' : 'save'} />
                {formMode === 'create' ? 'Crear inscripción' : 'Guardar estado'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setFormMode(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">GET /api/enrollments</span>
            <h2>Listado de inscripciones</h2>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nueva inscripción
          </Button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Estudiante</th>
                <th>Curso</th>
                <th>Estado</th>
                <th>Progreso</th>
                <th>Inscrito</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>Cargando...</td>
                </tr>
              ) : enrollments.length === 0 ? (
                <tr>
                  <td colSpan={7}>Sin registros.</td>
                </tr>
              ) : (
                enrollments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.studentName}</td>
                    <td>{item.courseTitle}</td>
                    <td>{item.status}</td>
                    <td>{item.progress}</td>
                    <td>{item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString('es-SV') : '-'}</td>
                    <td>
                      <div className="row-actions">
                        <button type="button" aria-label="Editar" onClick={() => openEdit(item)}>
                          <Icon name="edit" />
                        </button>
                        <button type="button" aria-label="Eliminar" onClick={() => setDeleteTarget(item)}>
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {deleteTarget ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '380px', width: '100%', margin: '0 16px' }}>
            <div className="auth-card-header">
              <span className="eyebrow">DELETE /api/enrollments/:id</span>
              <h2>Eliminar inscripción</h2>
              <p>Se eliminará la inscripción <strong>{deleteTarget.id}</strong>. Esta acción no se puede deshacer.</p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <Button onClick={confirmDelete}>
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
