// ============================================================
// ModulesPage.jsx
// Página de gestión de módulos - CRUD completo
// Entidad: Module | Endpoint: /api/modules
// Autor: Kevin González
// ============================================================

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { backendResources } from '../../data/mockData'

// Datos mock obtenidos del archivo mockData.js
// En producción estos datos vendrían de: GET /api/modules
const mockModules = backendResources.find((r) => r.key === 'modules').records

export function ModulesPage() {
  // Estado principal de la lista de módulos
  const [modules, setModules] = useState(mockModules)

  // Estado del formulario: 'create' | 'edit' | null
  const [formMode, setFormMode] = useState(null)

  // Módulo seleccionado para editar
  const [selected, setSelected] = useState(null)

  // Módulo seleccionado para eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Campos del formulario
  const [form, setForm] = useState({ courseTitle: '', title: '', position: '', published: 'false' })

  // Errores de validación del formulario
  const [errors, setErrors] = useState({})

  // Mensaje de éxito temporal
  const [successMsg, setSuccessMsg] = useState('')

  // Valida que los campos requeridos no estén vacíos
  const validate = () => {
    const newErrors = {}
    if (!form.courseTitle.trim()) newErrors.courseTitle = 'El curso es requerido'
    if (!form.title.trim()) newErrors.title = 'El título es requerido'
    if (!form.position || isNaN(form.position)) newErrors.position = 'La posición debe ser un número'
    return newErrors
  }

  // Muestra mensaje de éxito temporal por 3 segundos
  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Abre el formulario en modo creación — equivalente a POST /api/modules
  const openCreate = () => {
    setForm({ courseTitle: '', title: '', position: '', published: 'false' })
    setErrors({})
    setSelected(null)
    setFormMode('create')
  }

  // Abre el formulario en modo edición — equivalente a PUT /api/modules/:id
  const openEdit = (module) => {
    setForm({ ...module })
    setErrors({})
    setSelected(module)
    setFormMode('edit')
  }

  // Maneja el envío del formulario para crear o editar un módulo
  const handleSubmit = (e) => {
    e.preventDefault()

    // Ejecuta validación antes de guardar
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (formMode === 'create') {
      // Simula POST /api/modules — crea nuevo módulo con id autoincremental
      const newModule = { ...form, id: `MOD-${String(modules.length + 1).padStart(3, '0')}` }
      setModules([...modules, newModule])
      showSuccess('Módulo creado exitosamente')
    } else {
      // Simula PUT /api/modules/:id — actualiza módulo existente
      setModules(modules.map((m) => (m.id === selected.id ? { ...selected, ...form } : m)))
      showSuccess('Módulo actualizado exitosamente')
    }

    setFormMode(null)
  }

  // Confirma y ejecuta el DELETE del módulo seleccionado
  const confirmDelete = () => {
    setModules(modules.filter((m) => m.id !== deleteTarget.id))
    setDeleteTarget(null)
    showSuccess('Módulo eliminado')
  }

  return (
    <main className="page">

      {/* Toast de éxito — aparece temporalmente tras cada operación */}
      {successMsg ? (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: '#2d6a4f',
          color: 'white',
          padding: '0.75rem 1.25rem',
          borderRadius: '8px',
          zIndex: 200,
          fontWeight: '600'
        }}>
          {successMsg}
        </div>
      ) : null}

      {/* Encabezado de la página */}
      <section className="page-header">
        <span className="eyebrow">/api/modules</span>
        <h1>Módulos</h1>
        <p>Bloques de contenido ordenados dentro de cada curso. Total: {modules.length} módulos registrados.</p>
      </section>

      {/* Formulario — se muestra al crear (POST) o editar (PUT) */}
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
              />
              {/* Mensaje de error de validación */}
              {errors.courseTitle ? <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.courseTitle}</span> : null}
            </label>
            <label>
              Título del módulo
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ej. Fundamentos"
              />
              {errors.title ? <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.title}</span> : null}
            </label>
            <label>
              Posición
              <input
                type="number"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="1"
              />
              {errors.position ? <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.position}</span> : null}
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

      {/* Tabla principal — equivalente a GET /api/modules */}
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
              {/* Si no hay módulos, muestra mensaje vacío */}
              {modules.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay módulos registrados.
                  </td>
                </tr>
              ) : (
                modules.map((module) => (
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
                        {/* Botón editar — abre formulario en modo PUT */}
                        <button type="button" aria-label="Editar" onClick={() => openEdit(module)}>
                          <Icon name="edit" />
                        </button>
                        {/* Botón eliminar — abre modal de confirmación DELETE */}
                        <button type="button" aria-label="Eliminar" onClick={() => setDeleteTarget(module)}>
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

      {/* Modal de confirmación — equivalente a DELETE /api/modules/:id */}
      {deleteTarget ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
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