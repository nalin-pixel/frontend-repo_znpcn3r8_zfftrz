import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import FloatingMenu from '../components/FloatingMenu'
import { ShoppingBasket, Clock4, Bus, Users, Utensils, CalendarCheck } from 'lucide-react'

export default function CampusServices() {
  const [food, setFood] = useState({ items: [], hero_image: '' })
  const [courts, setCourts] = useState({ courts: [], slots: [] })
  const [study, setStudy] = useState({ groups: [] })
  const [course, setCourse] = useState('CS301')
  const [selected, setSelected] = useState({})
  const [bus, setBus] = useState({ routes: [] })

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/campus/food`).then(r => r.json()).then(setFood)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/campus/courts`).then(r => r.json()).then(setCourts)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/campus/study-groups?course=${course}`).then(r => r.json()).then(setStudy)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/campus/bus-schedules`).then(r => r.json()).then(setBus)
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/campus/study-groups?course=${course}`).then(r => r.json()).then(setStudy)
  }, [course])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-10">
        {/* Food Ordering */}
        <section className="rounded-2xl border border-cyan-300/10 overflow-hidden bg-slate-900/60">
          <div className="relative h-56">
            <img src={food.hero_image} alt="Cafeteria" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80"/>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-cyan-100 font-semibold"><Utensils/> University Kitchen • Pickup only</div>
          </div>
          <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {food.items.map(item => (
              <motion.div whileHover={{ y: -4 }} key={item.id} className="rounded-xl border border-white/10 bg-slate-800/60 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-32 object-cover"/>
                <div className="p-4">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-cyan-200">${item.price.toFixed(2)}</div>
                  <button className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm"><ShoppingBasket className="w-4 h-4"/> Add to order</button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Court Reservation */}
        <section className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-200 font-semibold mb-4"><CalendarCheck/> Court Reservation</div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {courts.courts.map(c => (
                <div key={c.name} className="p-4 rounded-xl border border-white/10 bg-slate-800/60">
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-slate-300 text-sm">Select a time:</div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {courts.slots.map(t => (
                      <button
                        key={t}
                        onClick={() => setSelected({ court: c.name, time: t })}
                        className={`px-3 py-2 rounded-lg text-sm border transition ${selected.court===c.name && selected.time===t ? 'bg-cyan-600/40 border-cyan-400/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-slate-800/60">
              <div className="text-slate-300">Selected:</div>
              <div className="text-white font-semibold mt-1">{selected.court || '—'} {selected.time ? `• ${selected.time}` : ''}</div>
              <button disabled={!selected.court} className="mt-4 px-4 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white disabled:opacity-50" onClick={async ()=>{
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/campus/courts/reserve`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ court: selected.court, date: '2025-01-01', time: selected.time, name:'Student'})})
                const data = await res.json(); alert(`Reserved ${data.court} at ${data.time}`)
              }}>Reserve</button>
            </div>
          </div>
        </section>

        {/* Study Group Finder */}
        <section className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-200 font-semibold mb-4"><Users/> Study Group Finder</div>
          <div className="mb-4">
            <select value={course} onChange={e=>setCourse(e.target.value)} className="px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10">
              {['CS301','CS302','CS303','MTH210'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {study.groups?.map(g => (
              <motion.div whileHover={{ y: -4 }} key={g.id} className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/fun-emoji/svg?seed=${g.avatar_seed}`} className="w-10 h-10"/>
                  <div>
                    <div className="font-semibold">{g.title}</div>
                    <div className="text-sm text-slate-300">{g.members} members • {g.time}</div>
                  </div>
                </div>
                <button className="mt-3 px-3 py-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm">Join Group</button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bus schedules */}
        <section className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-6">
          <div className="flex items-center gap-2 text-cyan-200 font-semibold mb-4"><Bus/> Bus Schedules</div>
          <div className="grid md:grid-cols-3 gap-4">
            {bus.routes.map((r,i)=>(
              <motion.div whileHover={{ y: -3 }} key={i} className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                <div className="font-semibold">{r.route}</div>
                <div className="text-sm text-slate-300 flex items-center gap-2 mt-1"><Clock4 className="w-4 h-4"/> {r.time}</div>
                <div className="text-sm text-cyan-200 mt-1">{r.days}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <FloatingMenu />
    </div>
  )
}
