import { useState, useEffect } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: null
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await api.getCategories()
      setCategories(data)
      setError('')
    } catch (err) {
      setError('No se pudieron cargar las categorías.')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setForm({ name: '', slug: '', description: '', parentId: null })
    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId || null
    })
    setSelected(category)
    setFormMode('edit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formMode === 'create') {
        await api.createCategory(form)
      } else {
        await api.updateCategory(selected.id, form)
      }
      setFormMode(null)
      setError('')
      loadCategories()
    } catch (err) {
      setError("No se pudo guardar la categoría. Revisa que el slug sea único, por ejemplo 'programacion-java'.")
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
      setError('')
      loadCategories()
    } catch (err) {
      setError('No se pudo eliminar la categoría. Revisa si tiene cursos asociados.')
    }
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    setForm({ ...form, name, slug })
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Catálogo académico</span>
        <h1>Gestión de categorías</h1>
        <p>Organiza los cursos de Aprende UES por áreas de conocimiento.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'Nueva área' : 'Actualizar área'}</span>
              <h2>{formMode === 'create' ? 'Crear categoría' : 'Editar categoría'}</h2>
              <p>Usa categorías claras para que estudiantes y docentes encuentren cursos sin adivinar.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem', maxWidth: '500px', padding: '20px' }}>
            <label className="form-label">
              Nombre de la categoría
              <input className="form-input" value={form.name} onChange={handleNameChange} required placeholder="Ej. Ciencias de la Computación" />
            </label>

            <label className="form-label">
              Slug para URL
              <input className="form-input" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} required placeholder="ej-ciencias-computacion" />
            </label>

            <label className="form-label">
              Descripción
              <textarea className="form-input" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" placeholder="Breve resumen del área..." />
            </label>

            <label className="form-label">
              Categoría superior (opcional)
              <select className="form-input" value={form.parentId || ''} onChange={(e) => setForm({...form, parentId: e.target.value || null})}>
                <option value="">Ninguna, es categoría principal</option>
                {categories
                  .filter(c => c.id !== selected?.id)
                  .map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))
                }
              </select>
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit">
                <Icon name="save" /> {formMode === 'create' ? 'Crear' : 'Guardar'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setFormMode(null)}>Cancelar</Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <span className="eyebrow">Áreas disponibles</span>
            <h2>Categorías publicadas</h2>
            <p>Estas categorías alimentan los filtros del catálogo que ve el estudiante.</p>
          </div>
          <Button onClick={openCreate}><Icon name="add" /> Nueva categoría</Button>
        </div>

        <div className="admin-table-wrap">
          {loading ? <p style={{padding: '20px'}}>Cargando categorías...</p> : categories.length === 0 ? (
            <div className="comment-empty-state">Aún no hay categorías creadas.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Slug</th>
                  <th>ID</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td><strong>{cat.name}</strong></td>
                    <td><code>{cat.slug}</code></td>
                    <td style={{fontSize: '10px', color: '#888'}}>{cat.id}</td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => openEdit(cat)}><Icon name="edit" /></button>
                        <button onClick={() => setDeleteTarget(cat)}><Icon name="delete" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {deleteTarget && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '380px' }}>
            <h2>Eliminar categoría</h2>
            <p>¿Estás seguro de borrar <strong>{deleteTarget.name}</strong>? Los cursos asociados podrían quedar sin categoría.</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button onClick={confirmDelete}><Icon name="delete" /> Confirmar</Button>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
