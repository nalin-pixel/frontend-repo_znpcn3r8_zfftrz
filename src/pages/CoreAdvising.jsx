import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingMenu from '../components/FloatingMenu'

function Bubble({ role, text }) {
  const isUser = role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-[80%] p-4 rounded-2xl shadow bg-gradient-to-br ${isUser ? 'from-cyan-600/50 to-blue-700/40 text-white' : 'from-slate-800/70 to-slate-900/80 text-slate-100'} border border-white/10`}
      >
        {text}
      </motion.div>
    </div>
  )
}

export default function CoreAdvising() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I\'m the NUPal Advisor. Ask about courses, prerequisites, or load.' }
  ])
  const [input, setInput] = useState('What are the prerequisites for Algorithms?')
  const [plan, setPlan] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim()) return
    setMessages(m => [...m, { role: 'user', text: input }])
    setInput('')
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/advising/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    })
    const data = await res.json()
    setMessages(m => [...m, { role: 'assistant', text: data.message }])
  }

  const generatePlan = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/study-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_semester: 3, total_semesters: 8, major: 'Computer Science' })
    })
    const data = await res.json()
    setPlan(data.plan)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 grid lg:grid-cols-2 gap-8">
        <section className="rounded-2xl p-5 border border-cyan-300/10 bg-slate-900/60">
          <h2 className="text-xl font-bold text-cyan-200 mb-4">Ask the NUPal Advisor</h2>
          <div ref={listRef} className="h-[420px] overflow-y-auto pr-2 space-y-3">
            <AnimatePresence>
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role} text={m.text} />
              ))}
            </AnimatePresence>
          </div>
          <div className="mt-4 flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your question..." className="flex-1 px-4 py-3 rounded-xl bg-slate-800/70 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            <button onClick={send} className="px-5 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow hover:brightness-110">Send</button>
          </div>
        </section>

        <section className="rounded-2xl p-5 border border-cyan-300/10 bg-slate-900/60">
          <h2 className="text-xl font-bold text-cyan-200 mb-4">Study Plan Generator</h2>
          <button onClick={generatePlan} className="px-5 py-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold shadow hover:brightness-110">Generate Study Plan</button>
          {plan && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid md:grid-cols-2 gap-4">
              {plan.map(sem => (
                <div key={sem.semester} className="rounded-xl border border-white/10 p-4 bg-slate-800/60">
                  <div className="font-semibold text-cyan-200">Semester {sem.semester} • {sem.total_credits} credits</div>
                  <ul className="mt-2 text-sm text-slate-200 space-y-1">
                    {sem.courses.map(c => (
                      <li key={c.code} className="flex justify-between"><span>{c.code} — {c.title}</span><span className="text-white/60">{c.credits} cr</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </section>
      </div>
      <FloatingMenu />
    </div>
  )
}
