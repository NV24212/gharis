import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Weeks from './pages/Weeks.jsx'
import WeekDetail from './pages/WeekDetail.jsx'
import { logoUrl } from './data/site.js'

export default function App() {
  useEffect(() => {
    document.documentElement.dir = 'rtl'
    document.documentElement.lang = 'ar'
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-full">
        <nav className="sticky top-0 z-40 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/60 border-b border-brand-gray/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="flex items-center gap-3 group">
                <img src={logoUrl} alt="شعار غرس" className="h-10 w-10 rounded-20 object-contain ring-1 ring-white/10 group-hover:ring-white/25 transition" />
                <span className="text-white text-lg font-bold">غرس</span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4 text-sm">
                <a href="/#about" className="text-brand-gray hover:text-white transition">عن غرس</a>
                <Link to="/weeks" className="text-brand-gray hover:text-white transition">الأسابيع</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weeks" element={<Weeks />} />
          <Route path="/weeks/1" element={<WeekDetail />} />
        </Routes>

        <footer className="mt-8 border-t border-brand-gray/30 bg-black/60">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-white text-sm text-center">
            <p>جميع الحقوق محفوظة، مدرسة أوال الاإعدادية للبنين © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}
