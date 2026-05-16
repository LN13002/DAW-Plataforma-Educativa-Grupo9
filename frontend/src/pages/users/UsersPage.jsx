import { useState, useEffect } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api' // Importamos tu puente real

export function UsersPage() {
  const [users, setUsers] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(false)

  // Campos exactos de tu UserRequestDTO
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    avatarUrl: ''
  })

  // 1. CARGAR DATOS REALES AL INICIAR
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch (err) {
      console.error("Error al cargar usuarios:", err)
    } finally {
      setLoading(false)
    }
  }

  // 2. LÓGICA DE FORMULARIO
  const openCreate = () => {
    setForm({ firstName: '', lastName: '', email: '', password: '', role: 'student', avatarUrl: '' })
    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (user) => {
    setForm({ 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email, 
      password: '', // Password vacía por seguridad en edición
      role: user.role.toLowerCase(),
      avatarUrl: user.avatarUrl || ''
    })
    setSelected(user)
    setFormMode('edit')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (formMode === 'create') {
        await api.createUser(form)
      } else {
        await api.updateUser(selected.id, form)
      }
      setFormMode(null)
      loadUsers() // Recargar de la base de datos
    } catch (err) {
      alert("Error al guardar: Verifica que el email sea único y la contraseña tenga 8 caracteres.")
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteUser(deleteTarget.id)
      setDeleteTarget(null)
      loadUsers()
    } catch (err) {
      alert("No se pudo eliminar el usuario.")
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">/api/users</span>
        <h1>Gestión de Usuarios</h1>
        <p>Administra los estudiantes, docentes y administradores de la plataforma.</p>
      </section>

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'POST' : 'PUT'}</span>
              <h2>{formMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <label className="form-label">
                Nombre
                <input className="form-input" value={form.firstName} onChange={(e) => setForm({...form, firstName: e.target.value})} required />
              </label>
              <label className="form-label">
                Apellido
                <input className="form-input" value={form.lastName} onChange={(e) => setForm({...form, lastName: e.target.value})} required />
              </label>
            </div>

            <label className="form-label">
              Correo Institucional
              <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
            </label>

            <label className="form-label">
              Contraseña {formMode === 'edit' && '(dejar vacío para mantener)'}
              <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required={formMode === 'create'} minLength={8} />
            </label>

            <label className="form-label">
              Rol
              <select className="form-input" value={form.role} onChange={(e) => setForm({...form, role: e.target.value})}>
                <option value="student">Estudiante</option>
                <option value="teacher">Docente</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button type="submit">
                <Icon name="save" /> {formMode === 'create' ? 'Registrar' : 'Actualizar'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setFormMode(null)}>Cancelar</Button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel-header">
          <h2>Lista de Usuarios Real</h2>
          <Button onClick={openCreate}><Icon name="add" /> Crear Usuario</Button>
        </div>

        <div className="admin-table-wrap">
          {loading ? <p style={{padding: '20px'}}>Conectando con el backend...</p> : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre Completo</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.firstName} {u.lastName}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge ${u.role}`}>{u.role}</span></td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => openEdit(u)}><Icon name="edit" /></button>
                        <button onClick={() => setDeleteTarget(u)}><Icon name="delete" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* MODAL DE ELIMINACIÓN */}
      {deleteTarget && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '400px', width: '100%' }}>
            <h2>Confirmar eliminación</h2>
            <p>¿Estás seguro de eliminar a <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>?</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button onClick={confirmDelete}><Icon name="delete" /> Si, eliminar</Button>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}