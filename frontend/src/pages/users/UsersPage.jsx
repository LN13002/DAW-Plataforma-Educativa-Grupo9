import { useState, useEffect } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

export function UsersPage() {
  const [users, setUsers] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'student',
    avatarUrl: ''
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await api.getUsers()
      setUsers(data)
      setError('')
    } catch (err) {
      setError('No se pudieron cargar los usuarios.')
    } finally {
      setLoading(false)
    }
  }

  const openCreate = () => {
    setForm({ firstName: '', lastName: '', email: '', password: '', role: 'student', avatarUrl: '' })
    setSelected(null)
    setFormMode('create')
  }

  const openEdit = (user) => {
    const role = String(user.role ?? 'student').toLowerCase()
    setForm({ 
      firstName: user.firstName, 
      lastName: user.lastName, 
      email: user.email, 
      password: '',
      role: role === 'teacher' ? 'instructor' : role,
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
      setError('')
      loadUsers()
    } catch (err) {
      setError('No se pudo guardar el usuario. Verifica que el correo sea único y que la contraseña tenga al menos 8 caracteres.')
    }
  }

  const confirmDelete = async () => {
    try {
      await api.deleteUser(deleteTarget.id)
      setDeleteTarget(null)
      setError('')
      loadUsers()
    } catch (err) {
      setError('No se pudo eliminar el usuario. Revisa si tiene cursos o registros asociados.')
    }
  }

  return (
    <main className="page">
      <section className="page-header">
        <span className="eyebrow">Personas y roles</span>
        <h1>Gestión de usuarios</h1>
        <p>Administra los estudiantes, docentes y administradores de la plataforma.</p>
      </section>

      {error ? <div className="data-notice">{error}</div> : null}

      {formMode ? (
        <section className="admin-panel" style={{ marginBottom: '2rem' }}>
          <div className="admin-panel-header">
            <div>
              <span className="eyebrow">{formMode === 'create' ? 'Nueva persona' : 'Actualizar persona'}</span>
              <h2>{formMode === 'create' ? 'Crear usuario' : 'Editar usuario'}</h2>
              <p>Define los datos de acceso y el rol con el que esta persona navegará la plataforma.</p>
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
              Correo institucional
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
                <option value="instructor">Instructor</option>
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
          <div>
            <span className="eyebrow">Directorio</span>
            <h2>Usuarios registrados</h2>
            <p>Revisa quién puede ingresar y qué vista verá al cambiar de persona.</p>
          </div>
          <Button onClick={openCreate}><Icon name="add" /> Crear usuario</Button>
        </div>

        <div className="admin-table-wrap">
          {loading ? <p style={{padding: '20px'}}>Cargando usuarios...</p> : users.length === 0 ? (
            <div className="comment-empty-state">Aún no hay usuarios registrados.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre completo</th>
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

      {deleteTarget && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="auth-card" style={{ maxWidth: '400px', width: '100%' }}>
            <h2>Eliminar usuario</h2>
            <p>Se eliminará a <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong>. Revisa antes si tiene inscripciones, cursos o actividad asociada.</p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button onClick={confirmDelete}><Icon name="delete" /> Sí, eliminar</Button>
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
