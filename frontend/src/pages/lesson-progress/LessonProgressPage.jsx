import { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { Icon } from '../../components/Icon'
import { api } from '../../services/api'

const emptyForm = { enrollmentId: '', lessonId: '', completed: 'false', secondsWatched: '0' }

export function LessonProgressPage() {
  const [rows, setRows] = useState([])
  const [formMode, setFormMode] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const load = async () => { try { setRows(await api.getLessonProgress()); setError('') } catch { setError('No se pudo cargar progreso.') } }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api.upsertLessonProgress({ enrollmentId: form.enrollmentId, lessonId: form.lessonId, secondsWatched: Number(form.secondsWatched), completed: form.completed === 'true' })
      setFormMode(null)
      await load()
    } catch { setError('No se pudo guardar progreso.') }
  }

  return <main className="page"><section className="page-header"><span className="eyebrow">/api/lesson-progress</span><h1>Progreso de lecciones</h1></section>{error ? <div className="data-notice">{error}</div> : null}
    {formMode ? <section className="admin-panel" style={{ marginBottom:'2rem' }}><form onSubmit={submit} style={{ display:'grid', gap:'1rem', padding:'24px', maxWidth:'560px' }}>
      <input className="form-input" placeholder="Enrollment UUID" value={form.enrollmentId} onChange={(e)=>setForm((p)=>({...p,enrollmentId:e.target.value}))} required />
      <input className="form-input" placeholder="Lesson UUID" value={form.lessonId} onChange={(e)=>setForm((p)=>({...p,lessonId:e.target.value}))} required />
      <input className="form-input" type="number" min="0" value={form.secondsWatched} onChange={(e)=>setForm((p)=>({...p,secondsWatched:e.target.value}))} />
      <select className="form-input" value={form.completed} onChange={(e)=>setForm((p)=>({...p,completed:e.target.value}))}><option value="false">En progreso</option><option value="true">Completada</option></select>
      <div style={{ display:'flex', gap:'0.75rem' }}><Button type="submit"><Icon name="save" />Guardar</Button><Button variant="secondary" type="button" onClick={()=>setFormMode(null)}>Cancelar</Button></div>
    </form></section> : null}
    <section className="admin-panel"><div className="admin-panel-header"><h2>Listado</h2><Button onClick={()=>{setForm(emptyForm);setFormMode('create')}}><Icon name="add" />Nuevo</Button></div>
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ID</th><th>Enrollment</th><th>Lesson</th><th>Completada</th><th>Segundos</th><th>Acciones</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td>{r.id}</td><td>{r.enrollmentId}</td><td>{r.lessonId}</td><td>{String(r.completed)}</td><td>{r.secondsWatched}</td><td><div className="row-actions"><button type="button" onClick={()=>{setForm({ enrollmentId:r.enrollmentId,lessonId:r.lessonId,completed:String(Boolean(r.completed)),secondsWatched:String(r.secondsWatched??0) });setFormMode('edit')}}><Icon name="edit" /></button><button type="button" onClick={()=>setDeleteTarget(r)}><Icon name="delete" /></button></div></td></tr>)}</tbody></table></div></section>
    {deleteTarget ? <div className="modal-overlay" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><div className="auth-card"><h2>Eliminar</h2><div style={{ display:'flex', gap:'0.75rem' }}><Button onClick={async()=>{try{await api.deleteLessonProgress(deleteTarget.id);setDeleteTarget(null);await load()}catch{setError('No se pudo eliminar progreso.')}}}>Eliminar</Button><Button variant="secondary" onClick={()=>setDeleteTarget(null)}>Cancelar</Button></div></div></div> : null}
  </main>
}
