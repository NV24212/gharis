import React from 'react'
import Section from '../components/Section.jsx'
import { week1Video } from '../data/site.js'

export default function WeekDetail() {
  const items = [
    {
      t: 'عن الاحترام',
      d: 'الاحترام هو أساس العلاقات الناجحة في المدرسة والبيت والمجتمع. نُظهر الاحترام بالكلمة الطيبة، والإنصات، والمحافظة على النظام، وتقدير جهود الآخرين. خلال هذا الأسبوع نسعى لقياس مظاهر الاحترام يوميًا ومنح نقاط تعزز هذا السلوك.'
    },
    { t: 'الحديث بأدب', d: 'التواصل بلطف مع الزملاء والمعلمين، واختيار الألفاظ المناسبة.' },
    { t: 'احترام الوقت والدور', d: 'الالتزام بالدور في الصف والمرافق، والوصول في الوقت المحدد.' },
    { t: 'النظافة والمسؤولية', d: 'المحافظة على نظافة الصف والممرات والمرافق العامة.' },
  ]

  return (
    <Section id="week1" title="الأسبوع الأول: قيمة الاحترام">
      <div className="grid gap-8 lg:grid-cols-2" data-animate>
        {/* Video */}
        <div className="rounded-20 overflow-hidden border border-white/10 shadow-card">
          <div className="aspect-video bg-black">
            <iframe
              src={week1Video}
              title="فيديو قيمة الاحترام"
              allow="autoplay; encrypted-media"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          <div className="bg-black/40 border-t border-white/10 px-4 py-3 text-center text-brand-gray text-sm">
            <a href="https://drive.google.com/file/d/125hbuZvwJ0OjicHPkPD2YTUR9XwsRXCL/view" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">فتح الفيديو في نافذة جديدة</a>
          </div>
        </div>

        {/* Cards */}
        <div>
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((i, idx) => (
              <div key={idx} className="rounded-20 border border-brand-gray/30 bg-black/40 p-5 shadow-card hover:translate-y-[-2px] hover:border-white/40 transition">
                <h3 className="text-white font-bold mb-2">{i.t}</h3>
                {i.d && <p className="text-brand-gray">{i.d}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
