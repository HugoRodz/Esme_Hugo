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
  return (
    <div className="min-h-screen bg-emerald-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/60 via-emerald-50 to-white">
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute -top-10 -left-10 h-40 w-40 text-emerald-200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/></svg>
          <svg className="absolute -bottom-10 -right-10 h-48 w-48 text-emerald-100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c4 6 4 14 0 20-4-6-4-14 0-20z"/></svg>
        </div>
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="tracking-widest text-emerald-700 uppercase text-sm">Comala, Colima</p>
          <h1 className="mt-4 text-4xl sm:text-6xl font-serif text-emerald-900">Jorge & Esmeralda</h1>
          <p className="mt-3 text-slate-600">Nos casamos el 29 de noviembre de 2025</p>
          <LeafDivider />
          <a href="#rsvp" className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow hover:bg-emerald-700 transition">Confirmar asistencia</a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section id="historia" className="mt-16 grid gap-8 sm:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-900">Nuestra historia</h2>
            <p className="mt-3 text-slate-700">Bienvenidos a nuestra invitación digital. Queremos celebrar con ustedes en un jardín rodeado de hojas y ramas, con el toque natural que tanto nos gusta.</p>
          </div>
          <div className="rounded-2xl bg-emerald-100 aspect-[4/3] grid place-content-center text-emerald-700">Foto del jardín</div>
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
