import { useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { backendResources } from '../../data/mockData'

const mockProgress =
  backendResources.find((r) => r.key === 'lesson-progress').records

const emptyForm = {
  enrollmentId: '',
  lessonId: '',
  completed: 'false',
  secondsWatched: '',
  lastWatchedAt: '',
}

export function LessonProgressPage() {
  const [records, setRecords] = useState(mockProgress)
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const field = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const openCreate = () => {
    setForm(emptyForm)
    setSelected(null)
    setFormMode('create')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEdit = (record) => {
    setForm({ ...record })
    setSelected(record)
    setFormMode('edit')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formMode === 'create') {
      const newId = `LPR-${String(records.length + 1).padStart(3, '0')}`
      setRecords([...records, { ...form, id: newId }])
    } else {
      setRecords(
        records.map((r) =>
          r.id === selected.id ? { ...selected, ...form } : r
        )
      )
    }
    setFormMode(null)
  }

  const confirmDelete = () => {
    setRecords(records.filter((r) => r.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const ProgressMini = ({ seconds, total = 750 }) => {
    const pct = Math.min(100, Math.round((Number(seconds) / total) * 100))
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            flexGrow: 1,
            height: '6px',
            borderRadius: '999px',
            background: 'var(--color-border)',
            overflow: 'hidden',
            minWidth: '60px',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'var(--color-primary)',
            }}
          />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
          {seconds}s
        </span>
      </div>
    )
  }

  const completedBadge = (val) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      background: val === 'true' ? '#e6f9f0' : 'var(--color-primary-soft)',
      color: val === 'true' ? '#1a7a45' : 'var(--color-primary-strong)',
    }}>
      <Icon name={val === 'true' ? 'check_circle' : 'pending'} />
      {val === 'true' ? 'Completada' : 'En progreso'}
    </span>
  )

  return (
    <main className="page">

      <section className="page-header">
        <span className="eyebrow">/api/lesson-progress</span>
        <h1>Progreso de lecciones</h1>
        <p>
          Seguimiento granular del avance por inscripción y lección: segundos
          vistos, estado de completado y última fecha de actividad.
        </p>
      </section>

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">
                {formMode === 'create'
                  ? 'POST /api/lesson-progress'
                  : 'PUT /api/lesson-progress/:id'}
              </span>
              <h2>
                {formMode === 'create'
                  ? 'Registrar progreso'
                  : 'Editar progreso'}
              </h2>
              <p>
                {formMode === 'create'
                  ? 'Asocia una inscripción con una lección y registra el avance del estudiante.'
                  : `Modificando registro ${selected?.id}.`}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'grid',
              gap: '1rem',
              padding: '24px',
              maxWidth: '560px',
            }}
          >
      
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label className="form-label">
                Inscripción ID
                <input
                  className="form-input"
                  value={form.enrollmentId}
                  onChange={field('enrollmentId')}
                  placeholder="ENR-001"
                  required
                />
              </label>

              <label className="form-label">
                Lección ID
                <input
                  className="form-input"
                  value={form.lessonId}
                  onChange={field('lessonId')}
                  placeholder="LES-001"
                  required
                />
              </label>
            </div>

           
            <label className="form-label">
              Segundos vistos
              <input
                className="form-input"
                type="number"
                min="0"
                value={form.secondsWatched}
                onChange={field('secondsWatched')}
                placeholder="0"
                required
              />
            </label>

     
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label className="form-label">
                Estado
                <select
                  className="form-input"
                  value={form.completed}
                  onChange={field('completed')}
                >
                  <option value="false">En progreso</option>
                  <option value="true">Completada</option>
                </select>
              </label>

              <label className="form-label">
                Última actividad
                <input
                  className="form-input"
                  type="date"
                  value={form.lastWatchedAt}
                  onChange={field('lastWatchedAt')}
                  required
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="submit">
                <Icon name={formMode === 'create' ? 'add' : 'save'} />
                {formMode === 'create' ? 'Registrar' : 'Guardar cambios'}
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
            <span className="eyebrow">GET /api/lesson-progress</span>
            <h2>Registros de progreso</h2>
            <p>
              Vista consolidada del avance de cada estudiante por lección.
              Refleja los mismos campos del endpoint del backend.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nuevo registro
          </Button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Inscripción</th>
                <th>Lección</th>
                <th>Estado</th>
                <th>Progreso</th>
                <th>Última actividad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.enrollmentId}</td>
                  <td>{record.lessonId}</td>
                  <td>{completedBadge(record.completed)}</td>
                  <td style={{ minWidth: '130px' }}>
                    <ProgressMini seconds={record.secondsWatched} />
                  </td>
                  <td>{record.lastWatchedAt}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        aria-label="Editar"
                        onClick={() => openEdit(record)}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        type="button"
                        aria-label="Eliminar"
                        onClick={() => setDeleteTarget(record)}
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {deleteTarget ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            className="auth-card"
            style={{ maxWidth: '380px', width: '100%', margin: '0 16px' }}
          >
            <div className="auth-card-header">
              <span className="eyebrow">DELETE /api/lesson-progress/:id</span>
              <h2>Eliminar registro</h2>
              <p>
                ¿Estás seguro de que deseas eliminar el registro{' '}
                <strong>{deleteTarget.id}</strong> (Inscripción{' '}
                {deleteTarget.enrollmentId} · Lección{' '}
                {deleteTarget.lessonId})? Esta acción no se puede deshacer.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1.5rem',
              }}
            >
              <Button onClick={confirmDelete}>
                <Icon name="delete" />
                Eliminar
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}