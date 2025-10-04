import React from 'react'
import Section from '../components/Section.jsx'
import { weeks } from '../data/site.js'
import { Link } from 'react-router-dom'

function WeekCard({ w }) {
  const locked = !w.unlocked
  return (
    <div className="relative rounded-20 border border-brand-gray/30 bg-black/40 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold">الأسبوع {w.id}</h3>
          <p className="text-brand-gray mt-1">{w.title || 'قيمة لاحقًا'}</p>
        </div>
        {locked ? (
          <span className="rounded-20 border border-brand-gray/40 text-brand-gray px-3 py-2 cursor-not-allowed select-none">مغلق</span>
        ) : (
          <Link to={`/weeks/${w.id}`} className="rounded-20 bg-white/10 hover:bg-white/20 text-white px-4 py-2 border border-white/20 transition">التفاصيل</Link>
        )}
      </div>
      {locked && (
        <div className="pointer-events-none absolute inset-0 rounded-20 bg-black/30"></div>
      )}
    </div>
  )
}

export default function Weeks() {
  return (
    <Section id="weeks" title="الأسابيع" subtitle="تصفح الأسابيع – الأسبوع الأول متاح والبقية قيد الإعداد">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {weeks.map(w => (
          <WeekCard key={w.id} w={w} />
        ))}
      </div>
    </Section>
  )
}
