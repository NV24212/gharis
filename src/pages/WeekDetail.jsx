import React from 'react'
import Section from '../components/Section.jsx'
import { week1Video } from '../data/site.js'

export default function WeekDetail() {
  return (
    <Section id="week1" title="الأسبوع الأول: قيمة الاحترام" subtitle="فيديو وكلمات مختصرة">
      <div className="grid gap-8 lg:grid-cols-2" data-animate>
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
        <div className="flex flex-col justify-center">
          <p className="text-brand-gray leading-8">
            الاحترام هو أساس العلاقات الناجحة في المدرسة والبيت والمجتمع. نُظهر الاحترام بالكلمة الطيبة، والإنصات، والمحافظة على النظام، وتقدير جهود الآخرين. خلال هذا الأسبوع نسعى لقياس مظاهر الاحترام يوميًا ومنح نقاط تعزز هذا السلوك.
          </p>
          <ul className="mt-6 space-y-3 text-brand-gray">
            <li className="rounded-20 border border-brand-gray/30 px-4 py-3 hover:border-white/40 transition">الحديث بأدب مع الزملاء والمعلمين</li>
            <li className="rounded-20 border border-brand-gray/30 px-4 py-3 hover:border-white/40 transition">الالتزام بالدور واحترام الوقت</li>
            <li className="rounded-20 border border-brand-gray/30 px-4 py-3 hover:border-white/40 transition">المحافظة على نظافة الصف والمرافق</li>
          </ul>
        </div>
      </div>
    </Section>
  )
}
