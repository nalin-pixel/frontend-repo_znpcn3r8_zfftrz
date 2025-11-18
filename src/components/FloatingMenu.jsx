import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Home, School, Building2, Briefcase, CalendarClock } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/core-advising', label: 'Core Advising', icon: School },
  { to: '/campus-services', label: 'Campus Services', icon: Building2 },
  { to: '/career-advising', label: 'Career Advising', icon: Briefcase },
  { to: '/course-scheduling', label: 'Course Scheduling', icon: CalendarClock },
]

export default function FloatingMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="fixed left-4 bottom-6 z-50 select-none">
      <div
        className="relative"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpen(v => !v)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-700/30 grid place-items-center border border-white/10 backdrop-blur"
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7" />
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, x: -8, y: 8 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -8, y: 8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="absolute left-16 bottom-0 origin-bottom-left"
            >
              <div className="p-2 rounded-2xl bg-slate-900/80 border border-cyan-300/10 backdrop-blur-md shadow-2xl">
                {links.map((l, i) => {
                  const Icon = l.icon
                  const active = location.pathname === l.to
                  return (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i }}
                    >
                      <Link
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-cyan-500/20 text-cyan-200' : 'text-slate-200 hover:text-white hover:bg-white/5'}`}
                      >
                        <span className={`w-8 h-8 grid place-items-center rounded-lg ${active ? 'bg-cyan-500/30' : 'bg-white/5 group-hover:bg-white/10'}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        {l.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
