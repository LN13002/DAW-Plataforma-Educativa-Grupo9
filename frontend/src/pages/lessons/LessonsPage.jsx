import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = { moduleId: '', title: '', description: '', videoUrl: '', durationSeconds: '0', position: '1' }

export function LessonsPage() {
  const [rows, setRows] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const load = async () => { try { setRows(await api.getLessons()); setError('') } catch { setError('No se pudieron cargar lecciones.') } }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { moduleId: form.moduleId, title: form.title, description: form.description, videoUrl: form.videoUrl, durationSeconds: Number(form.durationSeconds), position: Number(form.position) }
    try {
      if (formMode === 'create') await api.createLesson(payload)
      else await api.updateLesson(selected.id, payload)
      setFormMode(null)
      await load()
    } catch { setError('No se pudo guardar lección.') }
  }

  return <main className="page"><section className="page-header"><span className="eyebrow">/api/lessons</span><h1>Lecciones</h1></section>{error ? <div className="data-notice">{error}</div> : null}
    {formMode ? <section className="admin-panel" style={{ marginBottom:'2rem' }}><form onSubmit={submit} style={{ display:'grid', gap:'1rem', padding:'24px', maxWidth:'560px' }}>
      <input className="form-input" placeholder="Module UUID" value={form.moduleId} onChange={(e)=>setForm((p)=>({...p,moduleId:e.target.value}))} required />
      <input className="form-input" placeholder="Título" value={form.title} onChange={(e)=>setForm((p)=>({...p,title:e.target.value}))} required />
      <input className="form-input" placeholder="Descripción" value={form.description} onChange={(e)=>setForm((p)=>({...p,description:e.target.value}))} />
      <input className="form-input" placeholder="Video URL" value={form.videoUrl} onChange={(e)=>setForm((p)=>({...p,videoUrl:e.target.value}))} />
      <input className="form-input" type="number" min="0" value={form.durationSeconds} onChange={(e)=>setForm((p)=>({...p,durationSeconds:e.target.value}))} />
      <input className="form-input" type="number" min="1" value={form.position} onChange={(e)=>setForm((p)=>({...p,position:e.target.value}))} required />
      <div style={{ display:'flex', gap:'0.75rem' }}><Button type="submit"><Icon name="save" />Guardar</Button><Button variant="secondary" type="button" onClick={()=>setFormMode(null)}>Cancelar</Button></div>
    </form></section> : null}
    <section className="admin-panel"><div className="admin-panel-header"><h2>Listado</h2><Button onClick={()=>{setForm(emptyForm);setSelected(null);setFormMode('create')}}><Icon name="add" />Nueva</Button></div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Módulo</th><th>Título</th><th>Duración</th><th>Posición</th><th>Acciones</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td>{r.id}</td><td>{r.moduleId}</td><td>{r.title}</td><td>{r.durationSeconds}</td><td>{r.position}</td><td><div className="row-actions"><button type="button" onClick={()=>{setSelected(r);setForm({ moduleId:r.moduleId,title:r.title,description:r.description??'',videoUrl:r.videoUrl??'',durationSeconds:String(r.durationSeconds??0),position:String(r.position) });setFormMode('edit')}}><Icon name="edit" /></button><button type="button" onClick={()=>setDeleteTarget(r)}><Icon name="delete" /></button></div></td></tr>)}</tbody></table></div></section>
    {deleteTarget ? <div className="modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="auth-card"><h2>Eliminar</h2><div style={{ display:'flex', gap:'0.75rem' }}><Button onClick={async()=>{try{await api.deleteLesson(deleteTarget.id);setDeleteTarget(null);await load()}catch{setError('No se pudo eliminar lección.')}}}>Eliminar</Button><Button variant="secondary" onClick={()=>setDeleteTarget(null)}>Cancelar</Button></div></div></div> : null}
  </main>
}
