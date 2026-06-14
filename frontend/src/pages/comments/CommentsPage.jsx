// ============================================================
// CommentsPage.jsx
// Página de gestión de comentarios - CRUD completo
// Entidad: Comment | Endpoint: /api/comments
// Autor: Kevin González
// ============================================================

import { useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { backendResources } from '../../data/mockData'

// Datos mock obtenidos del archivo mockData.js
// En producción estos datos vendrían de: GET /api/comments
const mockComments = backendResources.find((r) => r.key === 'comments').records

export function CommentsPage() {
  // Estado principal de la lista de comentarios
  const [comments, setComments] = useState(mockComments)

  // Estado del formulario: 'create' | 'edit' | null
  const [formMode, setFormMode] = useState(null)

  // Comentario seleccionado para editar
  const [selected, setSelected] = useState(null)

  // Comentario seleccionado para eliminar
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Campos del formulario
  const [form, setForm] = useState({ userId: '', lessonId: '', parentId: '-', content: '', likes: '0' })

  // Errores de validación del formulario
  const [errors, setErrors] = useState({})

  // Mensaje de éxito temporal
  const [successMsg, setSuccessMsg] = useState('')

  // Valida que los campos requeridos no estén vacíos
  const validate = () => {
    const newErrors = {}
    if (!form.userId.trim()) newErrors.userId = 'El usuario es requerido'
    if (!form.lessonId.trim()) newErrors.lessonId = 'La lección es requerida'
    if (!form.content.trim()) newErrors.content = 'El contenido es requerido'
    return newErrors
  }

  // Muestra mensaje de éxito temporal por 3 segundos
  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Abre el formulario en modo creación — equivalente a POST /api/comments
  const openCreate = () => {
    setForm({ userId: '', lessonId: '', parentId: '-', content: '', likes: '0' })
    setErrors({})
    setSelected(null)
    setFormMode('create')
  }

  // Abre el formulario en modo edición — equivalente a PUT /api/comments/:id
  const openEdit = (comment) => {
    setForm({ ...comment })
    setErrors({})
    setSelected(comment)
    setFormMode('edit')
  }

  // Maneja el envío del formulario para crear o editar un comentario
  const handleSubmit = (e) => {
    e.preventDefault()

    // Ejecuta validación antes de guardar
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    if (formMode === 'create') {
      // Simula POST /api/comments — crea nuevo comentario con id autoincremental
      const newComment = { ...form, id: `COM-${String(comments.length + 1).padStart(3, '0')}` }
      setComments([...comments, newComment])
      showSuccess('Comentario publicado exitosamente')
    } else {
      // Simula PUT /api/comments/:id — actualiza comentario existente
      setComments(comments.map((c) => (c.id === selected.id ? { ...selected, ...form } : c)))
      showSuccess('Comentario actualizado exitosamente')
    }

    setFormMode(null)
  }

  // Confirma y ejecuta el DELETE del comentario seleccionado
  const confirmDelete = () => {
    setComments(comments.filter((c) => c.id !== deleteTarget.id))
    setDeleteTarget(null)
    showSuccess('Comentario eliminado')
  }

  // Verifica si un comentario es respuesta a otro
  const isReply = (comment) => comment.parentId && comment.parentId !== '-'

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
        <span className="eyebrow">/api/comments</span>
        <h1>Comentarios</h1>
        <p>
          Discusión por lección con respuestas anidadas y likes.
          Total: {comments.length} comentarios —{' '}
          {comments.filter((c) => isReply(c)).length} respuestas
        </p>
      </section>

      {/* Formulario — se muestra al crear (POST) o editar (PUT) */}
      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'POST /api/comments' : 'PUT /api/comments/:id'}</span>
              <h2>{formMode === 'create' ? 'Nuevo comentario' : 'Editar comentario'}</h2>
            </div>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}>
            <label>
              Usuario ID
              <input
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                placeholder="USR-001"
              />
              {errors.userId ? <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.userId}</span> : null}
            </label>
            <label>
              Lección ID
              <input
                value={form.lessonId}
                onChange={(e) => setForm({ ...form, lessonId: e.target.value })}
                placeholder="LES-001"
              />
              {errors.lessonId ? <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.lessonId}</span> : null}
            </label>
            <label>
              Responde a (Parent ID)
              <input
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                placeholder="- (comentario raíz)"
              />
            </label>
            <label>
              Contenido
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Escribe tu comentario..."
                rows={3}
              />
              {errors.content ? <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.content}</span> : null}
            </label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit">
                <Icon name={formMode === 'create' ? 'add' : 'save'} />
                {formMode === 'create' ? 'Publicar' : 'Guardar'}
              </Button>
              <Button variant="secondary" onClick={() => setFormMode(null)}>
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      {/* Tabla principal — equivalente a GET /api/comments */}
      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">GET /api/comments</span>
            <h2>Listado de comentarios</h2>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nuevo comentario
          </Button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Lección</th>
                <th>Tipo</th>
                <th>Contenido</th>
                <th>Likes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Si no hay comentarios, muestra mensaje vacío */}
              {comments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay comentarios registrados.
                  </td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.id}</td>
                    <td>{comment.userId}</td>
                    <td>{comment.lessonId}</td>
                    {/* Muestra visualmente si es respuesta o comentario raíz */}
                    <td>
                      {isReply(comment) ? (
                        <span style={{ color: 'var(--color-primary, #8b0000)', fontSize: '0.8rem' }}>
                          ↳ Respuesta
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem' }}>Comentario</span>
                      )}
                    </td>
                    <td>{comment.content}</td>
                    <td>❤️ {comment.likes}</td>
                    <td>
                      <div className="row-actions">
                        {/* Botón editar — abre formulario en modo PUT */}
                        <button type="button" aria-label="Editar" onClick={() => openEdit(comment)}>
                          <Icon name="edit" />
                        </button>
                        {/* Botón eliminar — abre modal de confirmación DELETE */}
                        <button type="button" aria-label="Eliminar" onClick={() => setDeleteTarget(comment)}>
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

      {/* Modal de confirmación — equivalente a DELETE /api/comments/:id */}
      {deleteTarget ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '360px', width: '100%' }}>
            <div className="auth-card-header">
              <h2>Eliminar comentario</h2>
              <p>¿Estás seguro que deseas eliminar este comentario? Esta acción no se puede deshacer.</p>
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