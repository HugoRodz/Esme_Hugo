import './index.css'
import { useEffect, useState } from 'react'
import { EVENT_DATETIME, GIFTS, MAP, RSVP } from './config'

function LeafDivider() {
  return (
    <div className="flex items-center justify-center py-6">
      <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/>
        <circle cx="12" cy="12" r="1.5" className="fill-emerald-700" />
      </svg>
    </div>
  )
}

function Countdown({ date }: { date: Date }) {
  const calc = () => {
    const now = new Date().getTime()
    const target = date.getTime()
    const diff = Math.max(0, target - now)
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const m = Math.floor((diff / (1000 * 60)) % 60)
    const s = Math.floor((diff / 1000) % 60)
    return { d, h, m, s, done: diff === 0 }
  }
  const [t, setT] = useState(calc())
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mt-6 flex items-center justify-center gap-3 sm:gap-4">
      {[
        { label: 'Días', value: t.d },
        { label: 'Horas', value: t.h },
        { label: 'Min', value: t.m },
        { label: 'Seg', value: t.s },
      ].map((item) => (
        <div key={item.label} className="min-w-[64px] rounded-xl bg-white/70 ring-1 ring-emerald-200/60 px-3 py-2 text-center shadow-sm">
          <div className="text-xl font-semibold text-emerald-900 tabular-nums">{String(item.value).padStart(2, '0')}</div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-700">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const base = import.meta.env.BASE_URL
  const img = (name: string) => `${base}images/${encodeURIComponent(name)}`
  // Cache-buster para evitar posibles 404 cacheados en Pages en el hero
  const heroSrc = `${img('colima.jpeg')}?v=1`
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isLightboxOpen = lightboxIndex !== null
  const gallery = [
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (1).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (3).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (4).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (5).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (6).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (7).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM (8).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.13 AM.jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.14 AM (1).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.14 AM (2).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.14 AM (3).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.14 AM (4).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.14 AM (5).jpeg',
    'WhatsApp Image 2025-08-14 at 1.54.14 AM.jpeg',
  ]

  useEffect(() => {
    if (!isLightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? 0 : (i + 1) % gallery.length))
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLightboxOpen])

  const ornaments = (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      {/* Ramas decorativas suaves */}
      <svg className="absolute -top-12 -left-12 h-56 w-56 text-emerald-100/80 animate-[float_12s_ease-in-out_infinite]" viewBox="0 0 200 200" fill="currentColor">
        <path d="M20 120c40-40 70-60 120-70-30 20-50 40-60 60 20-10 40-15 60-10-25 10-45 25-60 45 10-5 25-5 40 0-30 10-55 25-80 45-10-20-15-45-20-70z" />
      </svg>
      <svg className="absolute -bottom-16 -right-16 h-72 w-72 text-emerald-100/70 animate-[float_16s_ease-in-out_infinite_reverse]" viewBox="0 0 200 200" fill="currentColor">
        <path d="M180 80c-30 10-60 30-90 70 15-35 20-60 10-90-5 30-20 55-45 80 5-15 5-30 0-40-15 25-25 50-30 80 35-25 70-40 110-50-20 0-30 0-50 10 25-25 55-45 95-60z" />
      </svg>
    </div>
  )
  return (
    <div className="min-h-screen bg-emerald-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/60 via-emerald-50 to-white">
      <header className="relative isolate overflow-hidden">
        {ornaments}
        {/* Imagen hero: Colima */}
        <div className="absolute inset-0 -z-10">
          <img src={heroSrc} alt="Comala, Colima" className="h-full w-full object-cover opacity-35" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-emerald-50/60 to-white"></div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute -top-10 -left-10 h-40 w-40 text-emerald-200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/></svg>
          <svg className="absolute -bottom-10 -right-10 h-48 w-48 text-emerald-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/></svg>
        </div>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="tracking-widest text-emerald-700 uppercase text-sm">Comala, Colima</p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-serif text-emerald-900">Jorge & Esmeralda</h1>
          <p className="mt-3 text-slate-700">Nos casamos el 29 de noviembre de 2025</p>
          <Countdown date={EVENT_DATETIME} />
          <LeafDivider />
          <div className="flex items-center justify-center gap-3">
            <a href="#rsvp" className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow hover:bg-emerald-700 transition">Confirmar asistencia</a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white"
              onClick={async () => {
                const shareData = {
                  title: 'Boda Jorge & Esmeralda',
                  text: 'Acompáñanos el 29 de noviembre de 2025 en Comala, Colima',
                  url: window.location.href,
                }
                try {
                  if (navigator.share) {
                    await navigator.share(shareData)
                  } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(shareData.url)
                    alert('Enlace copiado')
                  }
                } catch {}
              }}
            >
              Compartir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section id="historia" className="mt-16 grid gap-8 sm:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-900">Nuestra historia</h2>
            <ol className="mt-4 space-y-6">
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-emerald-600" aria-hidden="true"></span>
                <p className="text-sm text-emerald-700">26 feb, 2024 · Sahuayo</p>
                <h3 className="font-medium text-emerald-900">Primer encuentro</h3>
                <p className="mt-1 text-slate-700">Fue una tarde templada en Sahuayo, cuando el trabajo nos convirtió en presencia el uno del otro. Nos presentaron con cortesía; un saludo tranquilo y una conversación que, sin llamarlo así, prendió una curiosidad amable. Había en el aire una chispa delicada: palabras que encendieron la posibilidad de algo distinto. Sin promesas, solo la certeza de que algo hermoso había comenzado a germinar.</p>
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-emerald-600" aria-hidden="true"></span>
                <p className="text-sm text-emerald-700">26 ene, 2025 · Uruapan</p>
                <h3 className="font-medium text-emerald-900">La primera cita</h3>
                <p className="mt-1 text-slate-700">Aunque éramos compañeros, aquella noche en Uruapan se sintió como el primer acto verdadero. Esmeralda vino a visitarme y salimos a un bar pequeño, iluminado por la ciudad. Hablamos de sueños, miedos y pequeñas alegrías; cada palabra fue una concesión de confianza que acercó nuestras manos y nuestras historias. Al despedirnos, supimos que lo que había nacido aquella noche no era solo amistad.</p>
              </li>
              <li className="relative pl-6">
                <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-emerald-600" aria-hidden="true"></span>
                <p className="text-sm text-emerald-700">27 jun, 2025 · Uruapan</p>
                <h3 className="font-medium text-emerald-900">La promesa bajo la ciudad</h3>
                <p className="mt-1 text-slate-700">Una cena sorpresa, la ciudad extendiéndose como un velo de luces, y yo en un punto donde ya no quería esperar: le pedí que fuera mi compañera para siempre. Fue un sí dicho entre sonrisas y un abrazo sostenido, la promesa que cerró el círculo de nuestras pequeñas señales cotidianas y lo abrió a un camino compartido.</p>
              </li>
            </ol>
          </div>
          <div className="overflow-hidden rounded-2xl aspect-[4/3] shadow ring-1 ring-emerald-200/50">
            <img src={img('propuesta de matrimonio.jpeg')} alt="Propuesta de matrimonio" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </section>

        <LeafDivider />

        {/* Cómo llegar */}
        <section id="como-llegar" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Cómo llegar</h2>
          <p className="mt-2 text-slate-700">Lugar tentativo: {MAP.placeQuery}</p>
          <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-emerald-200 bg-white">
            <iframe
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={MAP.embedSrc}
              title="Mapa"
            />
          </div>
          <a href={MAP.mapsLink} target="_blank" rel="noopener" className="mt-3 inline-block text-emerald-700 hover:underline">Abrir en Google Maps</a>
        </section>

        <section id="evento" className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900">Ceremonia</h3>
            <p className="mt-2 text-slate-700">29/11/2025 • 17:00 h</p>
            <p className="text-slate-600">Lugar por confirmar en Comala</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900">Recepción</h3>
            <p className="mt-2 text-slate-700">Después de la ceremonia</p>
            <p className="text-slate-600">Jardín principal</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900">Dress code</h3>
            <p className="mt-2 text-slate-700">Formal jardín</p>
            <p className="text-slate-600">Tonos tierra, verdes, neutros</p>
          </div>
        </section>

        <LeafDivider />

        {/* Galería */}
        <section id="galeria" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Galería</h2>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gallery.map((name, idx) => (
              <button
                key={name}
                type="button"
                className="group overflow-hidden rounded-xl ring-1 ring-emerald-200/40 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={img(name)}
                  alt={name}
                  className="h-40 w-full object-cover sm:h-48 md:h-56 group-hover:scale-[1.03] transition"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>

        <LeafDivider />

        {/* Regalos */}
        <section id="regalos" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Regalos</h2>
          <p className="mt-2 text-slate-700">{GIFTS.message}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
              <h3 className="font-medium text-emerald-900">Transferencia bancaria</h3>
              <dl className="mt-3 space-y-2 text-slate-700">
                <div>
                  <dt className="text-sm text-emerald-700">Banco</dt>
                  <dd className="font-medium">{GIFTS.bank.bankName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-emerald-700">Beneficiario</dt>
                  <dd className="font-medium">{GIFTS.bank.beneficiary}</dd>
                </div>
                <div>
                  <dt className="text-sm text-emerald-700">CLABE</dt>
                  <dd className="font-mono select-all break-all">{GIFTS.bank.clabe}</dd>
                </div>
                <div>
                  <dt className="text-sm text-emerald-700">Cuenta</dt>
                  <dd className="font-mono select-all break-all">{GIFTS.bank.accountNumber}</dd>
                </div>
              </dl>
              <div className="mt-3 flex gap-2">
                <button
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-white text-sm hover:bg-emerald-700"
                  onClick={() => navigator.clipboard.writeText(GIFTS.bank.clabe)}
                >Copiar CLABE</button>
                <button
                  className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800 text-sm ring-1 ring-emerald-200 hover:bg-emerald-100"
                  onClick={() => navigator.clipboard.writeText(GIFTS.bank.accountNumber)}
                >Copiar cuenta</button>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
              <h3 className="font-medium text-emerald-900">Otras opciones</h3>
              <p className="mt-2 text-slate-700">Si prefieres, escríbenos y te compartimos más opciones o un número para transferencia.</p>
              <a href="#rsvp" className="mt-3 inline-block text-emerald-700 hover:underline">Contactarnos</a>
            </div>
          </div>
        </section>

        <section id="rsvp" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Confirma tu asistencia</h2>
          {RSVP.formUrl ? (
            <div className="mt-4">
              <a
                href={RSVP.formUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700"
              >Abrir formulario</a>
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:max-w-md">
              <a className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-center font-medium hover:bg-emerald-700" href={RSVP.whatsapp} target="_blank" rel="noopener">Confirmar por WhatsApp</a>
              <a className="rounded-lg bg-white px-4 py-2 text-emerald-800 text-center ring-1 ring-emerald-200 hover:bg-emerald-50" href={RSVP.mailto}>Confirmar por correo</a>
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-emerald-200 bg-white/60 backdrop-blur py-6 mt-16">
        <div className="mx-auto max-w-5xl px-6 text-sm text-slate-600 flex items-center justify-between">
          <span>Jorge & Esmeralda • 29 de noviembre de 2025</span>
          <a className="text-emerald-700 hover:underline" href="#">#JorgeYEsme</a>
        </div>
      </footer>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={img(gallery[lightboxIndex!])}
              alt={gallery[lightboxIndex!]}
              className="max-h-[80vh] w-full object-contain rounded-lg shadow-2xl"
            />
            <button
              className="absolute top-2 right-2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              onClick={() => setLightboxIndex(null)}
              aria-label="Cerrar"
            >✕</button>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80"
              onClick={() => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length))}
              aria-label="Anterior"
            >‹</button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white hover:bg-black/80"
              onClick={() => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % gallery.length))}
              aria-label="Siguiente"
            >›</button>
          </div>
        </div>
      )}
    </div>
  )
}
