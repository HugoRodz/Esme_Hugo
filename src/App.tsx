import './index.css'

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

export default function App() {
  const base = import.meta.env.BASE_URL
  const img = (name: string) => `${base}images/${encodeURIComponent(name)}`
  // Cache-buster para evitar posibles 404 cacheados en Pages en el hero
  const heroSrc = `${img('colima.jpeg')}?v=1`
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
  return (
    <div className="min-h-screen bg-emerald-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/60 via-emerald-50 to-white">
      <header className="relative isolate overflow-hidden">
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
          <LeafDivider />
          <a href="#rsvp" className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow hover:bg-emerald-700 transition">Confirmar asistencia</a>
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
            {gallery.map((name) => (
              <div key={name} className="overflow-hidden rounded-xl ring-1 ring-emerald-200/40 bg-white">
                <img
                  src={img(name)}
                  alt={name}
                  className="h-40 w-full object-cover sm:h-48 md:h-56 hover:scale-[1.02] transition"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        <LeafDivider />

        <section id="rsvp" className="mt-8">
          <h2 className="text-2xl font-semibold text-emerald-900">Confirma tu asistencia</h2>
          <form className="mt-4 grid gap-4 sm:max-w-md">
            <input className="rounded-lg border border-emerald-200 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Tu nombre" />
            <input className="rounded-lg border border-emerald-200 px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-400" placeholder="Número de acompañantes" type="number" min={0} />
            <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 transition" type="button">Enviar</button>
          </form>
        </section>
      </main>

      <footer className="border-t border-emerald-200 bg-white/60 backdrop-blur py-6 mt-16">
        <div className="mx-auto max-w-5xl px-6 text-sm text-slate-600 flex items-center justify-between">
          <span>Jorge & Esmeralda • 29 de noviembre de 2025</span>
          <a className="text-emerald-700 hover:underline" href="#">#JorgeYEsme</a>
        </div>
      </footer>
    </div>
  )
}
