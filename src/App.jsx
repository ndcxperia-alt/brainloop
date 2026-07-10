import React, { useEffect, useMemo, useState } from 'react'

const seed = () => ({
  profile: { name: 'Tu nombre', goal: 'Capturar, planear y recordar todo.' },
  items: [
    {
      id: 1,
      type: 'todo',
      title: 'Ejemplo: estudiar',
      date: new Date().toISOString().slice(0, 10),
      status: 'open',
    },
  ],
})

const uid = () => Math.random().toString(36).slice(2, 9)

export default function App() {
  const [data, setData] = useState(
    () => JSON.parse(localStorage.getItem('brainloop') || 'null') || seed()
  )
  const [draft, setDraft] = useState('')
  const [kind, setKind] = useState('todo')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    localStorage.setItem('brainloop', JSON.stringify(data))
  }, [data])

  const counts = useMemo(
    () => ({
      todo: data.items.filter((i) => i.type === 'todo' && i.status === 'open').length,
      idea: data.items.filter((i) => i.type === 'idea').length,
      decision: data.items.filter((i) => i.type === 'decision').length,
      done: data.items.filter((i) => i.status === 'done').length,
    }),
    [data]
  )

  const add = () => {
    if (!draft.trim()) return
    setData((d) => ({
      ...d,
      items: [
        { id: uid(), type: kind, title: draft.trim(), date, status: 'open' },
        ...d.items,
      ],
    }))
    setDraft('')
  }

  const toggle = (id) =>
    setData((d) => ({
      ...d,
      items: d.items.map((i) =>
        i.id === id ? { ...i, status: i.status === 'done' ? 'open' : 'done' } : i
      ),
    }))

  const remove = (id) =>
    setData((d) => ({ ...d, items: d.items.filter((i) => i.id !== id) }))

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">BrainLoop</p>
          <h1>Brain dump con memoria</h1>
          <p className="sub">Todo queda guardado en tu perfil y se conecta con tu calendario.</p>
        </div>

        <div className="profile">
          <label>Perfil</label>
          <input
            value={data.profile.name}
            onChange={(e) =>
              setData((d) => ({ ...d, profile: { ...d.profile, name: e.target.value } }))
            }
          />
          <input
            value={data.profile.goal}
            onChange={(e) =>
              setData((d) => ({ ...d, profile: { ...d.profile, goal: e.target.value } }))
            }
          />
        </div>
      </header>

      <section className="stats">
        <Card label="TO-DOs" value={counts.todo} />
        <Card label="Ideas" value={counts.idea} />
        <Card label="Decisiones" value={counts.decision} />
        <Card label="Hecho" value={counts.done} />
      </section>

      <section className="composer">
        <select value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="todo">TO-DO</option>
          <option value="idea">Idea</option>
          <option value="decision">Decisión</option>
        </select>

        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe un pensamiento o tarea..."
        />

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={add}>Guardar</button>
      </section>

      <section className="timeline">
        <h2>Historial</h2>
        {data.items
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((item) => (
            <article key={item.id} className={`item ${item.status}`}>
              <div>
                <strong>{item.title}</strong>
                <p>
                  {item.type} · {item.date}
                </p>
              </div>

              <div className="actions">
                <button onClick={() => toggle(item.id)}>
                  {item.status === 'done' ? 'Reabrir' : 'Hecho'}
                </button>
                <button onClick={() => remove(item.id)}>Borrar</button>
              </div>
            </article>
          ))}
      </section>
    </div>
  )
}

function Card({ label, value }) {
  return (
    <div className="card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
