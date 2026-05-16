import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = { userId: '', lessonId: '', parentId: '', content: '' }

export function CommentsPage() {
  const [rows, setRows] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const load = async () => { try { setRows(await api.getComments()); setError('') } catch { setError('No se pudieron cargar comentarios.') } }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { userId: form.userId, lessonId: form.lessonId, parentId: form.parentId || null, content: form.content }
    try {
      if (formMode === 'create') await api.createComment(payload)
      else await api.updateComment(selected.id, payload)
      setFormMode(null)
      await load()
    } catch { setError('No se pudo guardar comentario.') }
  }

  return <main className="page"><section className="page-header"><span className="eyebrow">/api/comments</span><h1>Comentarios</h1></section>{error ? <div className="data-notice">{error}</div> : null}
  {formMode ? <section className="admin-panel" style={{ marginBottom:'2rem' }}><form onSubmit={submit} style={{ display:'grid', gap:'1rem', padding:'24px', maxWidth:'560px' }}>
    <input className="form-input" placeholder="User UUID" value={form.userId} onChange={(e)=>setForm((p)=>({...p,userId:e.target.value}))} required />
    <input className="form-input" placeholder="Lesson UUID" value={form.lessonId} onChange={(e)=>setForm((p)=>({...p,lessonId:e.target.value}))} required />
    <input className="form-input" placeholder="Parent UUID (opcional)" value={form.parentId} onChange={(e)=>setForm((p)=>({...p,parentId:e.target.value}))} />
    <textarea className="form-input" placeholder="Contenido" value={form.content} onChange={(e)=>setForm((p)=>({...p,content:e.target.value}))} required rows={3} />
    <div style={{ display:'flex', gap:'0.75rem' }}><Button type="submit"><Icon name="save" />Guardar</Button><Button variant="secondary" type="button" onClick={()=>setFormMode(null)}>Cancelar</Button></div>
  </form></section> : null}
  <section className="admin-panel"><div className="admin-panel-header"><h2>Listado</h2><Button onClick={()=>{setForm(emptyForm);setSelected(null);setFormMode('create')}}><Icon name="add" />Nuevo</Button></div>
  <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>User</th><th>Lesson</th><th>Contenido</th><th>Likes</th><th>Acciones</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td>{r.id}</td><td>{r.userId}</td><td>{r.lessonId}</td><td>{r.content}</td><td>{r.likes}</td><td><div className="row-actions"><button type="button" onClick={()=>{setSelected(r);setForm({ userId:r.userId,lessonId:r.lessonId,parentId:r.parentId??'',content:r.content });setFormMode('edit')}}><Icon name="edit" /></button><button type="button" onClick={()=>setDeleteTarget(r)}><Icon name="delete" /></button></div></td></tr>)}</tbody></table></div></section>
  {deleteTarget ? <div className="modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="auth-card"><h2>Eliminar</h2><div style={{ display:'flex', gap:'0.75rem' }}><Button onClick={async()=>{try{await api.deleteComment(deleteTarget.id);setDeleteTarget(null);await load()}catch{setError('No se pudo eliminar comentario.')}}}>Eliminar</Button><Button variant="secondary" onClick={()=>setDeleteTarget(null)}>Cancelar</Button></div></div></div> : null}
  </main>
}
