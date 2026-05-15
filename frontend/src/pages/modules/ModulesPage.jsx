import { useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { backendResources } from '../../data/mockData'

const mockModules = backendResources.find((r) => r.key === 'modules').records

export function ModulesPage() {
  const [modules, setModules] = useState(mockModules)
  const [formMode, setFormMode] = useState(null) // 'create' | 'edit'
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ courseTitle: '', title: '', position: '', published: 'false' })

  const openCreate = () => {
    setForm({ courseTitle: '', title: '', position: '', published: 'false' })
    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (module) => {
    setForm({ ...module })
    setSelected(module)
    setFormMode('edit')
  }

const handleSubmit = (e) => {
  e.preventDefault()

  if (formMode === 'create') {
    const newId = `MOD-${String(modules.length + 1).padStart(3, '0')}`

    const newModule = {
      ...form,
      id: newId
    }

    setModules([...modules, newModule])
  } else {
    setModules(
      modules.map((m) =>
        m.id === selected.id
          ? { ...selected, ...form }
          : m
      )
    )
  }

  setFormMode(null)
}

  const confirmDelete = () => {
    setModules(modules.filter((m) => m.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">/api/modules</span>
        <h1>Módulos</h1>
        <p>Bloques de contenido ordenados dentro de cada curso.</p>
      </section>

      {/* FORMULARIO — POST / PUT */}
      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'POST /api/modules' : 'PUT /api/modules/:id'}</span>
              <h2>{formMode === 'create' ? 'Crear módulo' : 'Editar módulo'}</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
            <label>
              Curso
              <input
                value={form.courseTitle}
                onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                placeholder="Nombre del curso"
                required
              />
            </label>
            <label>
              Título del módulo
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Fundamentos"
                required
              />
            </label>
            <label>
              Posición
              <input
                type="number"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="1"
                required
              />
            </label>
            <label>
              Publicado
              <select value={form.published} onChange={(e) => setForm({ ...form, published: e.target.value })}>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit">
                <Icon name={formMode === 'create' ? 'add' : 'save'} />
                {formMode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
              <Button variant="secondary" onClick={() => setFormMode(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {/* TABLA — GET */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">GET /api/modules</span>
            <h2>Listado de módulos</h2>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Crear módulo
          </Button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Curso</th>
                <th>Título</th>
                <th>Posición</th>
                <th>Publicado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.id}>
                  <td>{module.id}</td>
                  <td>{module.courseTitle}</td>
                  <td>{module.title}</td>
                  <td>{module.position}</td>
                  <td>
                    <span style={{ color: module.published === 'true' ? 'var(--color-success, green)' : 'var(--color-muted, gray)' }}>
                      {module.published === 'true' ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button type="button" aria-label="Editar" onClick={() => openEdit(module)}>
                        <Icon name="edit" />
                      </button>
                      <button type="button" aria-label="Eliminar" onClick={() => setDeleteTarget(module)}>
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

      {/* MODAL DELETE */}
      {deleteTarget ? (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '360px', width: '100%' }}>
            <div className="auth-card-header">
              <h2>Eliminar módulo</h2>
              <p>¿Estás seguro que deseas eliminar <strong>{deleteTarget.title}</strong>? Esta acción no se puede deshacer.</p>
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