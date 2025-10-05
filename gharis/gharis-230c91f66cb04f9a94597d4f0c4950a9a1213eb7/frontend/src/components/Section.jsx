import React from 'react'

export default function Section({ id, title, children, subtitle }) {
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
  )
}
