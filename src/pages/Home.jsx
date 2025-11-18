import Hero from '../components/Hero'
import AnalyticsCards from '../components/AnalyticsCards'
import FloatingMenu from '../components/FloatingMenu'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8 space-y-10">
        <Hero />
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-cyan-200">Quick Glance</h2>
          <AnalyticsCards />
        </section>
      </div>
      <FloatingMenu />
    </div>
  )
}
