import './index.css'
import { useEffect, useState } from 'react'
import { EVENT_DATETIME, GIFTS, MAP, RSVP, HOTELS } from './config'

function PreferenciasForm() {
  const [nombre, setNombre] = useState('')
  const [vegetariano, setVegetariano] = useState<'si' | 'no' | ''>('')
  const [alergias, setAlergias] = useState('')
  const [notas, setNotas] = useState('')

  const mensaje = () => {
    const v = vegetariano === '' ? 'No especificado' : (vegetariano === 'si' ? 'Sí' : 'No')
    const lineas = [
      `Preferencias de invitado`,
      `Nombre: ${nombre || 'No especificado'}`,
      `Vegetariano: ${v}`,
      `Alergias: ${alergias || 'Ninguna'}`,
      `Notas: ${notas || 'Sin notas'}`,
    ]
    return lineas.join('\n')
  }

  const enviarWhatsApp = () => {
    const to = (RSVP.whatsapps && RSVP.whatsapps[0]) ? RSVP.whatsapps[0].replace('+','') : ''
    const url = `https://wa.me/${to}?text=${encodeURIComponent(mensaje())}`
    window.open(url, '_blank', 'noopener')
  }

  const enviarCorreo = () => {
    const subject = `Preferencias invitado - ${nombre || 'Sin nombre'}`
    const body = mensaje()
    const to = RSVP.emailAddress || ''
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <div className="mt-3 rounded-xl border border-emerald-200 bg-white p-5 shadow-sm sm:max-w-2xl">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm text-emerald-700">Nombre</label>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm text-emerald-700">¿Eres vegetariano?</label>
          <div className="mt-2 flex gap-4">
            <label className="inline-flex items-center gap-2 text-slate-700">
              <input type="radio" name="veg" value="si" checked={vegetariano==='si'} onChange={() => setVegetariano('si')} /> Sí
            </label>
            <label className="inline-flex items-center gap-2 text-slate-700">
              <input type="radio" name="veg" value="no" checked={vegetariano==='no'} onChange={() => setVegetariano('no')} /> No
            </label>
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-emerald-700">Alergias</label>
          <input value={alergias} onChange={(e) => setAlergias(e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Ej. nueces, mariscos" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-emerald-700">Otras preferencias / notas</label>
          <textarea value={notas} onChange={(e) => setNotas(e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-200 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400" rows={3} placeholder="Háznos saber cualquier detalle" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={enviarWhatsApp} className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Enviar por WhatsApp</button>
        <button onClick={enviarCorreo} className="rounded-lg bg-white px-4 py-2 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-50">Enviar por correo</button>
      </div>
    </div>
  )
}

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-base ring-1 ring-emerald-200 shadow-sm">
      <span aria-hidden="true">{children}</span>
    </span>
  )
}

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
  const mapLink = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}`
  const mapEmbed = (q: string) => `${mapLink(q)}&output=embed`
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
          <img src={heroSrc} alt="Comala, Colima" className="h-full w-full object-cover opacity-60" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-emerald-50/30 to-white"></div>
        </div>
        <div className="absolute inset-0 pointer-events-none -z-10">
          <svg className="absolute -top-10 -left-10 h-40 w-40 text-emerald-200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/></svg>
          <svg className="absolute -bottom-10 -right-10 h-48 w-48 text-emerald-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/></svg>
        </div>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <p className="tracking-widest text-emerald-700/90 uppercase text-xs sm:text-sm">Comala, Colima</p>
          <h1 className="mt-3 text-5xl sm:text-7xl font-serif text-emerald-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">Jorge & Esmeralda</h1>
          <p className="mt-3 text-slate-700/90">Nos casamos el 29 de noviembre de 2025</p>
          <Countdown date={EVENT_DATETIME} />
          <LeafDivider />
          <nav aria-label="Secciones" className="mx-auto mt-2 flex flex-wrap items-center justify-center gap-3 text-sm">
            <a href="#evento" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Evento</a>
            <a href="#como-llegar" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Cómo llegar</a>
            <a href="#alojamiento" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Alojamiento</a>
            <a href="#galeria" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Galería</a>
            <a href="#regalos" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Regalos</a>
            <a href="#rsvp" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">RSVP</a>
          </nav>
          <div className="relative z-10 mt-3 flex items-center justify-center gap-3">
            <a href="#rsvp" className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow-md hover:shadow-lg hover:bg-emerald-700 transition">Confirmar asistencia</a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-emerald-800 ring-1 ring-emerald-200/70 hover:bg-white shadow-sm"
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
                } catch {
                  // Ignorar si el usuario cancela o el navegador bloquea compartir
                  void 0
                }
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
          {MAP.streetNote && (
            <p className="mt-2 text-slate-700">Zona de referencia: {MAP.streetNote}</p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl ring-1 ring-emerald-200 bg-white/70 backdrop-blur">
              <div className="px-4 pt-4">
                <h3 className="font-medium text-emerald-900">{MAP.ceremony.name}</h3>
                <a href={mapLink(MAP.ceremony.query)} target="_blank" rel="noopener" className="text-sm text-emerald-700 hover:underline">Abrir en Google Maps</a>
              </div>
              <iframe
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbed(MAP.ceremony.query)}
                title={`Mapa ${MAP.ceremony.name}`}
              />
            </div>
            <div className="overflow-hidden rounded-xl ring-1 ring-emerald-200 bg-white/70 backdrop-blur">
              <div className="px-4 pt-4">
                <h3 className="font-medium text-emerald-900">{MAP.reception.name}{MAP.streetNote ? ` · ${MAP.streetNote}` : ''}</h3>
                <a href={mapLink(MAP.reception.query)} target="_blank" rel="noopener" className="text-sm text-emerald-700 hover:underline">Abrir en Google Maps</a>
              </div>
              <iframe
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbed(MAP.reception.query)}
                title={`Mapa ${MAP.reception.name}`}
              />
            </div>
          </div>
        </section>

        <section id="evento" className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <IconBadge>💍</IconBadge>
              Ceremonia
            </h3>
            <p className="mt-2 text-slate-700">29/11/2025 • 13:30 h</p>
      <p className="text-slate-600">{MAP.ceremony.name}</p>
      <a href={mapLink(MAP.ceremony.query)} target="_blank" rel="noopener" className="mt-1 inline-block text-emerald-700 hover:underline">Ver mapa</a>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <IconBadge>🥂</IconBadge>
              Recepción
            </h3>
            <p className="mt-2 text-slate-700">29/11/2025 • 15:45 h</p>
      <p className="text-slate-600">{MAP.reception.name}{MAP.streetNote ? ` · ${MAP.streetNote}` : ''}</p>
      <a href={mapLink(MAP.reception.query)} target="_blank" rel="noopener" className="mt-1 inline-block text-emerald-700 hover:underline">Ver mapa</a>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <IconBadge>👔</IconBadge>
              Código de vestimenta
            </h3>
            <p className="mt-2 text-slate-700">Formal</p>
          </div>
        </section>

        {/* La Molienda (Museo) */}
        <section id="museo-la-molienda" className="mt-8 grid gap-6 sm:grid-cols-5 items-center">
          <div className="sm:col-span-3">
            <h2 className="text-2xl font-semibold text-emerald-900">La Molienda (Museo)</h2>
            <p className="mt-2 text-slate-700">La Molienda es un museo y espacio cultural en Comala, parte de la antigua Hacienda Noguera. Antiguamente vinculada a las labores de molienda, hoy preserva su historia entre muros de cal y jardines arbolados. Es un sitio íntimo y con encanto, ideal para celebrar rodeados de tradición y naturaleza.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href={mapLink(MAP.reception.query)} target="_blank" rel="noopener" className="inline-block text-emerald-700 hover:underline">Ver ubicación</a>
              {MAP.streetNote && <span className="text-slate-600">Referencia: {MAP.streetNote}</span>}
            </div>
          </div>
          {/* Se retiró el mapa embebido para no saturar con iframes */}
        </section>

        {/* Comala, tierra de Esmeralda */}
        <section id="comala" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Comala, tierra de Esmeralda</h2>
          <p className="mt-2 text-slate-700">Comala es un Pueblo Mágico conocido por sus fachadas blancas, portales y cafés tradicionales. Entre sus volcanes cercanos y su historia literaria, el pueblo guarda una calidez que nos acompaña en este día especial. Es de aquí de donde es originaria Esmeralda, y por eso quisimos celebrar en su tierra.</p>
          <a href={mapLink('Comala, Colima')} target="_blank" rel="noopener" className="mt-3 inline-block text-emerald-700 hover:underline">Ver Comala en Maps</a>
        </section>

        {/* Alojamiento */}
        <section id="alojamiento" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Alojamiento</h2>
          <p className="mt-2 text-slate-700">Por disponibilidad, te sugerimos reservar con anticipación. Opciones en Comala:</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {HOTELS.map((h) => (
              <div key={h.name} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
                <h3 className="font-medium text-emerald-900 flex items-center gap-2"><IconBadge>🏨</IconBadge>{h.name}</h3>
                <p className="mt-1 text-slate-700">{h.address}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {h.phones.map((p) => (
                    <a key={p} className="text-emerald-700 hover:underline" href={`tel:${p.replace(/\s/g,'')}`}>{p}</a>
                  ))}
                </div>
                <a className="mt-2 inline-block text-emerald-700 hover:underline" href={mapLink(h.mapQuery)} target="_blank" rel="noopener">Ver en Maps</a>
              </div>
            ))}
          </div>
        </section>

        {/* Itinerario de boda */}
        <section id="itinerario" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Itinerario</h2>
          <ol className="mt-4 space-y-4">
            <li className="relative pl-6">
              <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-emerald-600" aria-hidden="true"></span>
              <p className="text-sm text-emerald-700">13:30</p>
              <h3 className="font-medium text-emerald-900">Ceremonia</h3>
              <p className="text-slate-700">{MAP.ceremony.name}</p>
            </li>
            <li className="relative pl-6">
              <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-emerald-600" aria-hidden="true"></span>
              <p className="text-sm text-emerald-700">15:45</p>
              <h3 className="font-medium text-emerald-900">Recepción</h3>
              <p className="text-slate-700">{MAP.reception.name}{MAP.streetNote ? ` · ${MAP.streetNote}` : ''}</p>
            </li>
          </ol>
        </section>

        {/* Avisos y restricciones */}
        <section id="avisos" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Avisos y restricciones</h2>
          <ul className="mt-3 list-disc pl-6 text-slate-700 space-y-1">
            <li>Evento principalmente al aire libre. Considera calzado cómodo.</li>
            <li>Estacionamiento limitado. Sugerimos compartir vehículo cuando sea posible.</li>
            <li>Cuidemos el espacio: evita confeti o pirotecnia.</li>
            <li>Te recomendamos llegar 15 minutos antes de la ceremonia.</li>
          </ul>
        </section>

        {/* Preferencias de invitado */}
        <section id="preferencias" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Preferencias de invitado</h2>
          <PreferenciasForm />
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
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="text-sm text-emerald-800">WhatsApp</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(RSVP.whatsapps || []).map((num) => {
                    const normalized = num.replace('+','')
                    const local = normalized.startsWith('52') ? normalized.slice(2) : normalized
                    const label = local.startsWith('452') ? 'Jorge' : (local.startsWith('312') ? 'Esmeralda' : 'WhatsApp')
                    return (
                      <a
                        key={num}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-white text-center font-medium hover:bg-emerald-700"
                        href={`https://wa.me/${normalized}`}
                        target="_blank"
                        rel="noopener"
                        aria-label={`WhatsApp ${label} ${num}`}
                        title={`${label} · ${num}`}
                      >
                        {label}
                      </a>
                    )
                  })}
                </div>
              </div>
              <a className="rounded-lg bg-white px-4 py-2 text-emerald-800 text-center ring-1 ring-emerald-200 hover:bg-emerald-50" href={RSVP.mailto}>Confirmar por correo ({RSVP.emailAddress || 'correo'})</a>
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
