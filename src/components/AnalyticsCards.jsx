import { motion } from 'framer-motion'
import { CalendarDays, GraduationCap, Clock, BookOpen } from 'lucide-react'

const cards = [
  {
    title: 'Current GPA',
    value: '3.62',
    icon: GraduationCap,
    accent: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Upcoming Lecture',
    value: 'CS302 • Today 2:00 PM • B-214',
    icon: CalendarDays,
    accent: 'from-blue-500 to-indigo-500'
  },
  {
    title: 'Completed Credits',
    value: '78',
    icon: BookOpen,
    accent: 'from-cyan-600 to-teal-500'
  },
  {
    title: 'Attendance',
    value: '92%',
    icon: Clock,
    accent: 'from-sky-500 to-blue-600'
  },
]

export default function AnalyticsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon
        return (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 * i, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-slate-900/60 border border-cyan-300/10 p-5 shadow-lg hover:shadow-cyan-900/30 transition-shadow"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${c.accent} text-white mb-4`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-slate-300 text-sm">{c.title}</div>
            <div className="text-white text-xl font-semibold mt-1">{c.value}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
