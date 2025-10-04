import React, { useEffect } from 'react'
import Section from '../components/Section.jsx'
import { logoUrl } from '../data/site.js'
import { Link } from 'react-router-dom'

function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]')
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('animate-fade-in-up')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

export default function Home() {
  useRevealOnScroll()
  return (
    <>
      {/* Hero */}
      <header id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-20 bg-brand-gray/30 animate-float"></div>
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full blur-3xl opacity-10 bg-white/20 animate-float" style={{animationDelay:'-2s'}}></div>
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-12 sm:pt-16 pb-10">
          <div className="grid items-center gap-8 sm:grid-cols-2">
            <div data-animate>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight text-shadow-soft">مشروع غرس</h1>
              <p className="mt-4 text-brand-gray text-lg">غرس مشروع طلابي بإشراف الأستاذ علي الحر البصري، يهدف إلى غرس القيم النبيلة لدى الطلبة عبر قيمة أسبوعية وتتبّع للنقاط وتحفيز مستمر للمتميزين.</p>
              <div className="mt-6 flex items-center gap-3">
                <Link to="/weeks" className="rounded-20 bg-white/10 hover:bg-white/20 text-white px-5 py-3 border border-white/20 shadow-card transition">اذهب إلى صفحة الأسابيع</Link>
                <a href="#about" className="rounded-20 border border-brand-gray/40 hover:border-white/50 text-brand-gray hover:text-white px-5 py-3 transition">المزيد</a>
              </div>
            </div>
            <div className="relative" data-animate>
              <div className="rounded-20 border border-white/10 bg-black/60 p-4 shadow-card">
                <img src={logoUrl} alt="��عار غرس" className="mx-auto h-56 sm:h-72 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      <Section id="about" title="ما هو مشروع غرس؟" subtitle="مشروع طلابي بإشراف الأستاذ علي الحر البصري">
        <div className="grid gap-6 sm:grid-cols-3" data-animate>
          {[
            { t: 'مبادرة طلابية', d: 'يقود الطلبة تنفيذ القيم أسبوعيًا بمشاركة جميع الصفوف.' },
            { t: 'إشراف تربوي', d: 'بإشراف الأستاذ علي الحر البصري لضمان الأثر التربوي.' },
            { t: 'تحفيز ونقاط', d: 'يجمع الطالب نقاطًا يومية وتُصرف مكافآت كل نهاية أسبوع.' },
          ].map((i, idx) => (
            <div key={idx} className="rounded-20 border border-brand-gray/30 bg-black/40 p-5 shadow-card hover:translate-y-[-2px] hover:border-white/40 transition">
              <h3 className="text-white font-bold mb-2">{i.t}</h3>
              <p className="text-brand-gray">{i.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
