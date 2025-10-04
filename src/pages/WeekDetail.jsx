import React from 'react'
import Section from '../components/Section.jsx'

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-animate>
        {items.map((i, idx) => (
          <div key={idx} className="rounded-20 border border-brand-gray/30 bg-black/40 p-5 shadow-card hover:translate-y-[-2px] hover:border-white/40 transition">
            <h3 className="text-white font-bold mb-2">{i.t}</h3>
            {i.d && <p className="text-brand-gray">{i.d}</p>}
          </div>
        ))}
      </div>
    </Section>
  )
}
