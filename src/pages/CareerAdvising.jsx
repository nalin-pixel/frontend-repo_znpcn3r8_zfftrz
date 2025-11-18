import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FloatingMenu from '../components/FloatingMenu'

function SkillBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-slate-300"><span>{label}</span><span>{value}%</span></div>
      <div className="h-3 rounded-full bg-white/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${value}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-600" />
      </div>
    </div>
  )
}

export default function CareerAdvising() {
  const [overview, setOverview] = useState({ skills: {} })
  const [jobs, setJobs] = useState([])
  const [gap, setGap] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/career/overview`).then(r => r.json()).then(setOverview)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/career/jobs`).then(r => r.json()).then(d => setJobs(d.jobs))
  }, [])

  const runGap = async (job) => {
    setSelected(job.id)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/career/skill-gap`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_title: job.title, required_skills: job.skills, resume_text: 'Experienced with Python, SQL, and APIs on Linux' })
    })
    const data = await res.json()
    setGap({ id: job.id, data })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-10">
        {/* Overview */}
        <section className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-6">
          <div className="text-cyan-200 font-semibold mb-4">Student Career Overview • {overview.major}</div>
          <div className="grid md:grid-cols-2 gap-5">
            {Object.entries(overview.skills).map(([k,v]) => (
              <SkillBar key={k} label={k} value={v} />
            ))}
          </div>
        </section>

        {/* Jobs */}
        <section className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-6">
          <div className="text-cyan-200 font-semibold mb-4">Internship & Job Recommendations</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => (
              <motion.div whileHover={{ y: -4 }} key={job.id} className="rounded-xl border border-white/10 bg-slate-800/60 p-4">
                <div className="font-semibold">{job.title}</div>
                <div className="text-sm text-slate-300">{job.company}</div>
                <div className="text-sm text-cyan-200 mt-2">{job.skills.join(', ')}</div>
                <p className="text-sm text-slate-300 mt-2">{job.description}</p>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15">Apply</button>
                  <button className="px-3 py-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white" onClick={() => runGap(job)}>Skill Gap Analysis</button>
                </div>
                <AnimatePresence>
                  {gap?.id === job.id && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl border border-white/10 p-3 bg-slate-900/60">
                      <div className="text-sm text-slate-300">Fit: <span className="text-cyan-200 font-semibold">{gap.data.fit_percent}%</span></div>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <div className="text-xs text-cyan-200">Matched</div>
                          {gap.data.matched_skills.map(s => (
                            <div key={s} className="text-xs mt-1 bg-green-500/20 text-green-200 px-2 py-1 rounded">{s}</div>
                          ))}
                        </div>
                        <div>
                          <div className="text-xs text-red-300">Missing</div>
                          {gap.data.missing_skills.map(s => (
                            <div key={s} className="text-xs mt-1 bg-red-500/20 text-red-200 px-2 py-1 rounded">{s}</div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Interview Prep */}
        <section className="rounded-2xl border border-cyan-300/10 bg-slate-900/60 p-6">
          <div className="text-cyan-200 font-semibold mb-4">Interview Preparation Center</div>
          <div className="grid md:grid-cols-3 gap-5">
            {[{t:'Resume Tips'},{t:'Interview Advice'},{t:'Mock Questions'}].map((c,i)=>(
              <motion.div key={i} whileHover={{ rotateY: 8, y:-4 }} className="[transform-style:preserve-3d] perspective-1000 rounded-xl border border-white/10 bg-slate-800/60 p-4 shadow">
                <div className="font-semibold">{c.t}</div>
                <p className="text-sm text-slate-300 mt-2">Curated best practices to get you ready with examples and checklists.</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <FloatingMenu />
    </div>
  )
}
