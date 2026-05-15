import { useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { backendResources } from '../../data/mockData'

const mockLessons =
  backendResources.find((r) => r.key === 'lessons').records

const TYPE_OPTIONS = ['video', 'article', 'quiz']

const emptyForm = {
  moduleId: '',
  title: '',
  type: 'video',
  durationSeconds: '',
  published: 'false',
}

export function LessonsPage() {
  const [lessons, setLessons] = useState(mockLessons)
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

  const openEdit = (lesson) => {
    setForm({ ...lesson })
    setSelected(lesson)
    setFormMode('edit')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formMode === 'create') {
      const newId = `LES-${String(lessons.length + 1).padStart(3, '0')}`
      setLessons([...lessons, { ...form, id: newId }])
    } else {
      setLessons(
        lessons.map((l) =>
          l.id === selected.id ? { ...selected, ...form } : l
        )
      )
    }
    setFormMode(null)
  }

  const confirmDelete = () => {
    setLessons(lessons.filter((l) => l.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const typeBadge = (type) => {
    const map = {
      video:   { icon: 'play_circle',  label: 'Video' },
      article: { icon: 'article',      label: 'Artículo' },
      quiz:    { icon: 'quiz',         label: 'Quiz' },
    }
    const { icon, label } = map[type] ?? { icon: 'help', label: type }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 700,
        background: 'var(--color-primary-soft)',
        color: 'var(--color-primary-strong)',
      }}>
        <Icon name={icon} />
        {label}
      </span>
    )
  }

  const publishedBadge = (val) => (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '999px',
      fontSize: '12px',
      fontWeight: 700,
      background: val === 'true' ? '#e6f9f0' : 'var(--color-surface-muted)',
      color: val === 'true' ? '#1a7a45' : 'var(--color-muted)',
    }}>
      {val === 'true' ? 'Publicada' : 'Borrador'}
    </span>
  )

  return (
    <main className="page">

      <section className="page-header">
        <span className="eyebrow">/api/lessons</span>
        <h1>Lecciones</h1>
        <p>
          Videos, artículos y quizzes con posición, vista previa y estado de
          publicación.
        </p>
      </section>

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">
                {formMode === 'create'
                  ? 'POST /api/lessons'
                  : 'PUT /api/lessons/:id'}
              </span>
              <h2>
                {formMode === 'create' ? 'Nueva lección' : 'Editar lección'}
              </h2>
              <p>
                {formMode === 'create'
                  ? 'Completa los campos para registrar una nueva lección en el módulo.'
                  : `Modificando lección ${selected?.id}.`}
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
  
            <label className="form-label">
              Módulo ID
              <input
                className="form-input"
                value={form.moduleId}
                onChange={field('moduleId')}
                placeholder="MOD-001"
                required
              />
            </label>

       
            <label className="form-label">
              Título de la lección
              <input
                className="form-input"
                value={form.title}
                onChange={field('title')}
                placeholder="Ej. Introducción a los algoritmos cuánticos"
                required
              />
            </label>

        
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label className="form-label">
                Tipo
                <select
                  className="form-input"
                  value={form.type}
                  onChange={field('type')}
                >
                  {TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                Duración (segundos)
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={form.durationSeconds}
                  onChange={field('durationSeconds')}
                  placeholder="750"
                  required
                />
              </label>
            </div>

            <label className="form-label">
              Estado
              <select
                className="form-input"
                value={form.published}
                onChange={field('published')}
              >
                <option value="true">Publicada</option>
                <option value="false">Borrador</option>
              </select>
            </label>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button type="submit">
                <Icon name={formMode === 'create' ? 'add' : 'save'} />
                {formMode === 'create' ? 'Crear lección' : 'Guardar cambios'}
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
            <span className="eyebrow">GET /api/lessons</span>
            <h2>Listado de lecciones</h2>
            <p>
              Registros actuales en el sistema. Usa los botones de acción para
              editar o eliminar cada entrada.
            </p>
          </div>
          <Button onClick={openCreate}>
            <Icon name="add" />
            Nueva lección
          </Button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Módulo</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Duración (s)</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.id}</td>
                  <td>{lesson.moduleId}</td>
                  <td style={{ maxWidth: '220px' }}>{lesson.title}</td>
                  <td>{typeBadge(lesson.type)}</td>
                  <td>{lesson.durationSeconds}</td>
                  <td>{publishedBadge(lesson.published)}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        aria-label="Editar"
                        onClick={() => openEdit(lesson)}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        type="button"
                        aria-label="Eliminar"
                        onClick={() => setDeleteTarget(lesson)}
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
              <span className="eyebrow">DELETE /api/lessons/:id</span>
              <h2>Eliminar lección</h2>
              <p>
                ¿Estás seguro de que deseas eliminar{' '}
                <strong>{deleteTarget.title}</strong>? Esta acción no se puede
                deshacer.
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