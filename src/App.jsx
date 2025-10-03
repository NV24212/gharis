import React, { useEffect } from 'react'

const logoUrl = 'https://cdn.builder.io/api/v1/image/assets%2F6cb987f4f6054cf88b5f469a13f2a67e%2Faa4cf312487f4851a160ff070e6b8847?format=webp&width=800'
const week1Video = 'https://drive.google.com/uc?export=preview&id=125hbuZvwJ0OjicHPkPD2YTUR9XwsRXCL'

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

function Section({ id, title, children, subtitle }) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
      <div className="rounded-20 border border-brand-gray/30 bg-black/40 shadow-card shadow-black/60 backdrop-blur-[2px]">
        <div className="p-6 sm:p-10">
          {title && (
            <header className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">{title}</h2>
              {subtitle && <p className="mt-2 text-brand-gray">{subtitle}</p>}
            </header>
          )}
          {children}
        </div>
      </div>
    </section>
  )}

export default function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
  }, [])
  useRevealOnScroll()

  return (
    <div className="min-h-full">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-brand-gray/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <a href="#home" className="flex items-center gap-3 group">
              <img src={logoUrl} alt="شعار غرس" className="h-10 w-10 rounded-20 object-contain ring-1 ring-white/10 group-hover:ring-white/25 transition" />
              <span className="text-white text-lg font-bold">غرس</span>
            </a>
            <div className="flex items-center gap-2 sm:gap-4 text-sm">
              <a href="#about" className="text-brand-gray hover:text-white transition">عن المشروع</a>
              <a href="#week1" className="text-brand-gray hover:text-white transition">الأسبوع الأول</a>
            </div>
          </div>
        </div>
      </nav>

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
              <p className="mt-4 text-brand-gray text-lg">غرس قيم عند الطالب عبر قيمة أسبوعية. الطالب يجمع نقاط، وفي نهاي�� كل شهر مكافأة قيمة للمتميزين.</p>
              <div className="mt-6 flex items-center gap-3">
                <a href="#week1" className="rounded-20 bg-white/10 hover:bg-white/20 text-white px-5 py-3 border border-white/20 shadow-card transition">ابدأ من الأسبوع الأول</a>
                <a href="#about" className="rounded-20 border border-brand-gray/40 hover:border-white/50 text-brand-gray hover:text-white px-5 py-3 transition">اعرف المزيد</a>
              </div>
            </div>
            <div className="relative" data-animate>
              <div className="rounded-20 border border-white/10 bg-black/60 p-4 shadow-card">
                <img src={logoUrl} alt="شعار غرس" className="mx-auto h-56 sm:h-72 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      <Section id="about" title="ما هو مشروع غرس؟" subtitle="زرع القيم، أسبوعًا بعد أسبوع">
        <div className="grid gap-6 sm:grid-cols-3" data-animate>
          {[
            { t: 'قيمة أسبوعية', d: 'كل أسبوع نتعلم قيمة جديدة ونطبقها في حياتنا المدرسية.' },
            { t: 'نقاط وتحف��ز', d: 'يجمع الطالب نقاطًا يومية، وتُصرف مكافآت قيمة للملتزمين.' },
            { t: 'تأثير مستدام', d: 'هدفنا بناء سلوكٍ راسخ يعكس القيم النبيلة لدى الطلبة.' },
          ].map((i, idx) => (
            <div key={idx} className="rounded-20 border border-brand-gray/30 bg-black/40 p-5 shadow-card hover:translate-y-[-2px] hover:border-white/40 transition">
              <h3 className="text-white font-bold mb-2">{i.t}</h3>
              <p className="text-brand-gray">{i.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Week 1 */}
      <Section id="week1" title="الأسبوع الأول: قيمة الاحترام" subtitle="فيديو وكلمات مختصرة">
        <div className="grid gap-8 lg:grid-cols-2" data-animate>
          <div className="rounded-20 overflow-hidden border border-white/10 shadow-card">
            <div className="aspect-video bg-black">
              <iframe
                src={week1Video}
                title="فيديو قيمة الاحترام"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="h-full w-full"
              />
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

      {/* Footer */}
      <footer className="mt-8 border-t border-brand-gray/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-brand-gray text-sm">
          <p>© {new Date().getFullYear()} غرس. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  )
}
