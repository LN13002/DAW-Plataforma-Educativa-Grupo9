import { useState, useEffect } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api' // Usando tu puente real con fetch

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(false)

  // Campos exactos de tu CategoryRequestDTO
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    parentId: null
  })

  // 1. CARGAR DATOS AL INICIAR
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (err) {
      console.error("Error al cargar categorías:", err)
    } finally {
      setLoading(false)
    }
  }

  // 2. LÓGICA DE FORMULARIO
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
      loadCategories() // Refrescar desde el backend
    } catch (err) {
      alert("Error al guardar: Revisa que el slug sea único (ej: 'programacion-java')")
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteCategory(deleteTarget.id)
      setDeleteTarget(null)
      loadCategories()
    } catch (err) {
      alert("No se pudo eliminar la categoría. Asegúrate de que no tenga cursos asociados.")
    }
  }

  // Función para auto-generar el slug mientras escribes el nombre
  const handleNameChange = (e) => {
    const name = e.target.value
    const slug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
    setForm({ ...form, name, slug })
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">/api/categories</span>
        <h1>Gestión de Categorías</h1>
        <p>Organiza los cursos de Aprende UES por áreas de conocimiento.</p>
      </section>

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'POST' : 'PUT'}</span>
              <h2>{formMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.2rem', maxWidth: '500px', padding: '20px' }}>
            <label className="form-label">
              Nombre de la Categoría
              <input className="form-input" value={form.name} onChange={handleNameChange} required placeholder="Ej. Ciencias de la Computación" />
            </label>

            <label className="form-label">
              Slug (Identificador en URL)
              <input className="form-input" value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} required placeholder="ej-ciencias-computacion" />
            </label>

            <label className="form-label">
              Descripción
              <textarea className="form-input" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows="3" placeholder="Breve resumen del área..." />
            </label>

            <label className="form-label">
              Categoría Superior (Opcional)
              <select className="form-input" value={form.parentId || ''} onChange={(e) => setForm({...form, parentId: e.target.value || null})}>
                <option value="">-- Ninguna (Categoría Raíz) --</option>
                {categories
                  .filter(c => c.id !== selected?.id) // No puede ser su propio padre
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
          <h2>Listado de Categorías</h2>
          <Button onClick={openCreate}><Icon name="add" /> Nueva Categoría</Button>
        </div>

        <div className="admin-table-wrap">
          {loading ? <p style={{padding: '20px'}}>Cargando datos desde el servidor...</p> : (
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

      {/* MODAL ELIMINAR */}
      {deleteTarget && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '380px' }}>
            <h2>Eliminar Categoría</h2>
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