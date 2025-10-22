import React, { useEffect, useState } from 'react'

type Task = {
  _id?: string,
  titulo: string,
  descripcion?: string,
  estado: 'pendiente'|'completada'
}

export default function App(){
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Task>({ titulo: '', descripcion: '', estado: 'pendiente' })
  const [editingId, setEditingId] = useState<string | null>(null)

  async function fetchTasks(){
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/tasks')
      if(!res.ok) throw new Error('Error fetching tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err:any){
      setError(err.message || 'Error')
    } finally { setLoading(false) }
  }

  useEffect(()=>{ fetchTasks() }, [])

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/tasks/${editingId}` : '/api/tasks'
      const res = await fetch(url, {
        method,
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      if(!res.ok) throw new Error('Error saving')
      await fetchTasks()
      setForm({ titulo: '', descripcion: '', estado: 'pendiente' })
      setEditingId(null)
    } catch(err:any){
      setError(err.message || 'Error')
    }
  }

  function startEdit(t: Task){
    setEditingId(t._id || null)
    setForm({ titulo: t.titulo, descripcion: t.descripcion, estado: t.estado })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id?: string){
    if(!id) return
    if(!confirm('Eliminar tarea?')) return
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if(!res.ok) throw new Error('Error deleting')
      await fetchTasks()
    } catch(err:any){
      setError(err.message || 'Error')
    }
  }

  async function toggleDone(t: Task){
    if(!t._id) return
    const updated = { ...t, estado: t.estado === 'pendiente' ? 'completada' : 'pendiente' }
    await fetch(`/api/tasks/${t._id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(updated)
    })
    fetchTasks()
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1>Gestor de Tareas</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input required placeholder="Titulo" value={form.titulo} onChange={e=>setForm({...form, titulo: e.target.value})} style={{ padding:8, width:'100%', marginBottom:8 }}/>
        <textarea placeholder="Descripcion" value={form.descripcion} onChange={e=>setForm({...form, descripcion: e.target.value})} style={{ padding:8, width:'100%', marginBottom:8 }} />
        <div style={{ display:'flex', gap:8 }}>
          <select value={form.estado} onChange={e=>setForm({...form, estado: e.target.value as any})}>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
          </select>
          <button type="submit">{editingId ? 'Guardar cambios' : 'Crear tarea'}</button>
          {editingId && <button type="button" onClick={()=>{ setEditingId(null); setForm({ titulo:'', descripcion:'', estado:'pendiente' })}}>Cancelar</button>}
        </div>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t=>(
          <li key={t._id} style={{ border:'1px solid #ddd', padding:12, marginBottom:8, borderRadius:6, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <h3 style={{ margin:0, textDecoration: t.estado === 'completada' ? 'line-through' : 'none' }}>{t.titulo}</h3>
              <p style={{ margin:0 }}>{t.descripcion}</p>
              <small>Estado: {t.estado}</small>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>toggleDone(t)}>{t.estado === 'pendiente' ? 'Marcar completada' : 'Marcar pendiente'}</button>
              <button onClick={()=>startEdit(t)}>Editar</button>
              <button onClick={()=>handleDelete(t._id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
