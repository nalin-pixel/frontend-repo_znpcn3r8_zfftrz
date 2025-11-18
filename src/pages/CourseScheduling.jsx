import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingMenu from '../components/FloatingMenu'

const days = ['Mon','Tue','Wed','Thu','Fri']

function Timetable({ items }) {
  return (
    <div className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-4">
      <div className="grid grid-cols-5 gap-3">
        {days.map(d => (
          <div key={d} className="min-h-[220px] p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="text-slate-300 text-sm mb-2">{d}</div>
            <AnimatePresence>
              {items.filter(i=>i.day===d).map((c,i)=>(
                <motion.div key={c.code+ i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y:0 }} exit={{ opacity:0 }} className="mb-2 p-2 rounded-lg bg-gradient-to-br from-cyan-600/40 to-blue-700/40 text-sm text-white border border-white/10">
                  <div className="font-semibold">{c.code}</div>
                  <div className="text-xs text-cyan-100">{c.time} • {c.room}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CourseScheduling() {
  const [blocks, setBlocks] = useState([])
  const [selectedBlock, setSelectedBlock] = useState(null)
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState(null)
  const conflict = useMemo(()=>{
    const map = {}
    for (const i of items) {
      const key = i.day + i.time
      map[key] = (map[key]||0)+1
      if (map[key] > 1) return true
    }
    return false
  },[items])

  useEffect(()=>{
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schedule/blocks`).then(r=>r.json()).then(d=> setBlocks(d.blocks))
  },[])

  const insertBlock = (b)=>{
    setSelectedBlock(b.id)
    setItems(b.courses)
  }

  const addElective = async ()=>{
    const newC = { code: query.toUpperCase(), title: 'Elective', day: 'Thu', time: '12:00-13:30', room: 'E-210'}
    const newItems = [...items, newC]
    setItems(newItems)
    // ask suggestions if conflict
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schedule/suggest`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ desired_code: newC.code, current_schedule: newItems }) })
    const data = await res.json()
    setSuggestions(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-10">
        <section>
          <h2 className="text-xl font-bold text-cyan-200 mb-3">Weekly Timetable</h2>
          <Timetable items={items} />
          {conflict && <div className="mt-2 text-sm text-red-300">Time clash detected. See suggestions below.</div>}
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-5">
            <div className="text-cyan-200 font-semibold mb-4">University Blocks</div>
            <div className="grid sm:grid-cols-2 gap-4">
              {blocks.map(b => (
                <motion.button whileHover={{ y: -3 }} key={b.id} onClick={()=>insertBlock(b)} className={`text-left p-4 rounded-xl border ${selectedBlock===b.id? 'border-cyan-400/50 bg-cyan-600/10':'border-white/10 bg-slate-800/60'} hover:bg-white/10`}>
                  <div className="font-semibold">{b.title}</div>
                  <ul className="mt-2 text-sm text-slate-300 space-y-1">
                    {b.courses.map(c => <li key={c.code}>{c.code} — {c.day} {c.time}</li>)}
                  </ul>
                </motion.button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-5">
            <div className="text-cyan-200 font-semibold mb-2">Elective Search</div>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Enter elective code (e.g., AI340)" className="w-full px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10"/>
            <button onClick={addElective} className="mt-3 w-full py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white">Add Elective</button>

            {suggestions && (
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="font-semibold text-cyan-200">Recommended Block Alternative</div>
                  <div className="text-sm text-slate-300 mt-1">{suggestions.recommended_blocks[0].id} — {suggestions.recommended_blocks[0].diff}</div>
                  <button className="mt-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm">Switch to this Block</button>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="font-semibold text-cyan-200">Alternative Electives</div>
                  <div className="mt-2 grid gap-2">
                    {suggestions.recommended_electives.map((e,i)=> (
                      <div key={i} className="text-sm flex items-center justify-between">
                        <span>{e.code} — {e.title}</span>
                        <span className="text-cyan-200">{e.day} {e.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <FloatingMenu />
    </div>
  )
}
