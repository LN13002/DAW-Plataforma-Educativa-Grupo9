import { useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { backendResources } from '../../data/mockData'

const mockComments =
  backendResources.find((r) => r.key === 'comments').records

export function CommentsPage() {
  const [comments, setComments] = useState(mockComments)
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [form, setForm] = useState({
    userId: '',
    lessonId: '',
    parentId: '-',
    content: '',
    likes: '0'
  })

  const openCreate = () => {
    setForm({
      userId: '',
      lessonId: '',
      parentId: '-',
      content: '',
      likes: '0'
    })

    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (comment) => {
    setForm({ ...comment })
    setSelected(comment)
    setFormMode('edit')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (formMode === 'create') {
      const newId = `COM-${String(comments.length + 1).padStart(3, '0')}`

      setComments([
        ...comments,
        {
          ...form,
          id: newId
        }
      ])
    } else {
      setComments(
        comments.map((c) =>
          c.id === selected.id
            ? { ...selected, ...form }
            : c
        )
      )
    }

    setFormMode(null)
  }

  const confirmDelete = () => {
    setComments(
      comments.filter((c) => c.id !== deleteTarget.id)
    )

    setDeleteTarget(null)
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">/api/comments</span>

        <h1>Comentarios</h1>

        <p>
          Discusión por lección con respuestas anidadas y likes.
        </p>
      </section>

      {formMode ? (
        <section
          className="admin-panel"
          style={{ marginBottom: '2rem' }}
        >
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">
                {formMode === 'create'
                  ? 'POST /api/comments'
                  : 'PUT /api/comments/:id'}
              </span>

              <h2>
                {formMode === 'create'
                  ? 'Crear comentario'
                  : 'Editar comentario'}
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '480px'
            }}
          >
            <label>
              Usuario ID

              <input
                value={form.userId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    userId: e.target.value
                  })
                }
                placeholder="USR-001"
                required
              />
            </label>

            <label>
              Lección ID

              <input
                value={form.lessonId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    lessonId: e.target.value
                  })
                }
                placeholder="LES-001"
                required
              />
            </label>

            <label>
              Responde a (Parent ID)

              <input
                value={form.parentId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    parentId: e.target.value
                  })
                }
                placeholder="- (ninguno)"
              />
            </label>

            <label>
              Contenido

              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: e.target.value
                  })
                }
                placeholder="Escribe tu comentario..."
                rows={3}
                required
              />
            </label>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem'
              }}
            >
              <Button type="submit">
                <Icon
                  name={
                    formMode === 'create'
                      ? 'add'
                      : 'save'
                  }
                />

                {formMode === 'create'
                  ? 'Publicar'
                  : 'Guardar'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setFormMode(null)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">
              GET /api/comments
            </span>

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
                <th>Responde a</th>
                <th>Contenido</th>
                <th>Likes</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.userId}</td>
                  <td>{comment.lessonId}</td>
                  <td>{comment.parentId}</td>
                  <td>{comment.content}</td>
                  <td>{comment.likes}</td>

                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        aria-label="Editar"
                        onClick={() => openEdit(comment)}
                      >
                        <Icon name="edit" />
                      </button>

                      <button
                        type="button"
                        aria-label="Eliminar"
                        onClick={() =>
                          setDeleteTarget(comment)
                        }
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
            zIndex: 100
          }}
        >
          <div
            className="auth-card"
            style={{
              maxWidth: '360px',
              width: '100%'
            }}
          >
            <div className="auth-card-header">
              <h2>Eliminar comentario</h2>

              <p>
                ¿Estás seguro que deseas eliminar este comentario?
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                marginTop: '1rem'
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