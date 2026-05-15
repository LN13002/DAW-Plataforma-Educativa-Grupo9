import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = { courseId: '', title: '', description: '', position: '1', published: 'true' }

export function ModulesPage() {
  const [rows, setRows] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const load = async () => {
    try { setRows(await api.getModules()); setError('') } catch { setError('No se pudieron cargar módulos.') }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setSelected(null); setFormMode('create') }
  const openEdit = (row) => {
    setForm({ courseId: row.courseId, title: row.title, description: row.description ?? '', position: String(row.position), published: String(Boolean(row.published)) })
    setSelected(row)
    setFormMode('edit')
  }

  const submit = async (e) => {
    e.preventDefault()
    const payload = { courseId: form.courseId, title: form.title, description: form.description, position: Number(form.position), published: form.published === 'true' }
    try {
      if (formMode === 'create') await api.createModule(payload)
      else await api.updateModule(selected.id, payload)
      setFormMode(null)
      await load()
    } catch { setError('No se pudo guardar módulo. Verifica datos.') }
  }

  const remove = async () => { try { await api.deleteModule(deleteTarget.id); setDeleteTarget(null); await load() } catch { setError('No se pudo eliminar módulo.') } }

  return (
    <main className="page">
      <section className="page-header"><span className="eyebrow">/api/modules</span><h1>Módulos</h1></section>
      {error ? <div className="data-notice">{error}</div> : null}
      {formMode ? <section className="admin-panel" style={{ marginBottom: '2rem' }}><form onSubmit={submit} style={{ display: 'grid', gap: '1rem', padding: '24px', maxWidth: '560px' }}>
        <input className="form-input" placeholder="Course UUID" value={form.courseId} onChange={(e)=>setForm((p)=>({...p,courseId:e.target.value}))} required />
        <input className="form-input" placeholder="Título" value={form.title} onChange={(e)=>setForm((p)=>({...p,title:e.target.value}))} required />
        <input className="form-input" placeholder="Descripción" value={form.description} onChange={(e)=>setForm((p)=>({...p,description:e.target.value}))} />
        <input className="form-input" type="number" min="1" value={form.position} onChange={(e)=>setForm((p)=>({...p,position:e.target.value}))} required />
        <select className="form-input" value={form.published} onChange={(e)=>setForm((p)=>({...p,published:e.target.value}))}><option value="true">Publicado</option><option value="false">Borrador</option></select>
        <div style={{ display:'flex', gap:'0.75rem' }}><Button type="submit"><Icon name="save" />Guardar</Button><Button variant="secondary" type="button" onClick={()=>setFormMode(null)}>Cancelar</Button></div>
      </form></section> : null}
      <section className="admin-panel"><div className="admin-panel-header"><h2>Listado</h2><Button onClick={openCreate}><Icon name="add" />Nuevo</Button></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Curso</th><th>Título</th><th>Posición</th><th>Publicado</th><th>Acciones</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td>{r.id}</td><td>{r.courseTitle}</td><td>{r.title}</td><td>{r.position}</td><td>{String(r.published)}</td><td><div className="row-actions"><button type="button" onClick={()=>openEdit(r)}><Icon name="edit" /></button><button type="button" onClick={()=>setDeleteTarget(r)}><Icon name="delete" /></button></div></td></tr>)}</tbody></table></div></section>
      {deleteTarget ? <div className="modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="auth-card"><h2>Eliminar módulo</h2><div style={{ display:'flex', gap:'0.75rem' }}><Button onClick={remove}>Eliminar</Button><Button variant="secondary" onClick={()=>setDeleteTarget(null)}>Cancelar</Button></div></div></div> : null}
    </main>
  )
}
