import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden rounded-3xl">
      <img
        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1800&auto=format&fit=crop"
        alt="University campus"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/60 to-slate-900/90" />

      {/* Floating spheres */}
      <motion.div
        className="absolute -top-10 -left-20 w-72 h-72 rounded-full bg-cyan-500/30 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-blue-600/30 blur-3xl"
        animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 px-6 md:px-10 pt-24 pb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg"
        >
          NUPal — Your Smart University Assistant
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 text-lg md:text-2xl text-cyan-100 max-w-3xl"
        >
          A friendly dashboard for everything academics, campus life, and career growth.
        </motion.p>
      </div>
    </section>
  )
}
