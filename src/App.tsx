// ...existing code...
import './index.css'
import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import QRCode from 'qrcode'
import { EVENT_DATETIME, RECEPTION_DATETIME, GIFTS, MAP, RSVP, HOTELS, ALBUM, MUSIC } from './config'
import InvitationEnvelope from './components/InvitationEnvelope'

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

function IconBadge({ children, imgSrc, alt }: { children?: React.ReactNode, imgSrc?: string, alt?: string }) {
  if (imgSrc) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-base ring-1 ring-emerald-200 shadow-sm overflow-hidden">
        <img src={imgSrc} alt={alt || ''} className="h-8 w-8 object-contain" />
      </span>
    )
  }
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-base ring-1 ring-emerald-200 shadow-sm">
      <span aria-hidden="true" className="text-2xl">{children}</span>
    </span>
  )
}

function DressTuxBadge() {
  const src = `${import.meta.env.BASE_URL}images/vestido-de-novia.png`
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-base ring-2 ring-emerald-200 shadow-sm overflow-hidden">
      <img src={src} alt="Código de vestimenta" title="Código de vestimenta" className="h-8 w-8 object-contain" />
    </span>
  )
}

function LeafDivider() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center space-x-3">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-300"></div>
        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-300"></div>
      </div>
    </div>
  )
}

function Countdown({ date }: { date: Date }) {
  const [t, setT] = useState(() => {
    const now = Date.now()
    const target = date.getTime()
    const diff = Math.max(0, target - now)
    const d = Math.floor(diff / (1000 * 60 * 60 * 24))
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const m = Math.floor((diff / (1000 * 60)) % 60)
    const s = Math.floor((diff / 1000) % 60)
    return { d, h, m, s, done: diff === 0 }
  })

  useEffect(() => {
    const calc = () => {
      const now = Date.now()
      const target = date.getTime()
      const diff = Math.max(0, target - now)
      const d = Math.floor(diff / (1000 * 60 * 60 * 24))
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const m = Math.floor((diff / (1000 * 60)) % 60)
      const s = Math.floor((diff / 1000) % 60)
      return { d, h, m, s, done: diff === 0 }
    }
    // set initial value and update every second
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [date])
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
  // Estado para minimizar la barra de música
  const [musicMinimized, setMusicMinimized] = useState(false)
  const base = import.meta.env.BASE_URL
  const img = (name: string) => `${base}images/${encodeURIComponent(name)}`
  // Cache-buster para evitar posibles 404 cacheados en Pages en el hero
  const heroSrc = `${img('colima.jpeg')}?v=1`
  const mapLink = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}`
  const mapEmbed = (q: string) => `${mapLink(q)}&output=embed`
  const fmtDate = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const y = d.getFullYear(); const m = pad(d.getMonth()+1); const day = pad(d.getDate())
    const h = pad(d.getHours()); const min = pad(d.getMinutes())
    return `${y}${m}${day}T${h}${min}00`
  }
  const makeGoogleCal = (title: string, start: Date, end: Date, details: string, location: string) => {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${fmtDate(start)}/${fmtDate(end)}`,
      details,
      location,
    })
    return `https://www.google.com/calendar/render?${params.toString()}`
  }
  const makeICS = (title: string, start: Date, end: Date, details: string, location: string) => {
    const ics = [
  'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//boda//esme-hugo//ES',
      'BEGIN:VEVENT',
      `DTSTART:${fmtDate(start)}`,
      `DTEND:${fmtDate(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/\n/g,'\\n')}`,
      `LOCATION:${location}`,
      'END:VEVENT','END:VCALENDAR',
    ].join('\n')
    return URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  }
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const isLightboxOpen = lightboxIndex !== null
  const gallery = useMemo(() => [
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
  ], [])

  useEffect(() => {
    if (!isLightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? 0 : (i + 1) % gallery.length))
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? 0 : (i - 1 + gallery.length) % gallery.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isLightboxOpen, gallery])

  // Reveal animation control for parents block
  const parentsRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const node = parentsRef.current || document.getElementById('parents-block')
    if (!node) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) node.classList.add('revealed')
      })
    }, { threshold: 0.15 })
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  // Background audio: attempt autoplay, fall back to user-play button if blocked by browser
  // Helper to resolve audio URL taking into account Vite base and origin
  const resolveAudioUrl = useCallback((url: string) => {
    if (!url) return ''
    if (/^https?:\/\//.test(url)) return url
    // base usually ends with '/'
    const basePath = base || '/'
    const clean = url.replace(/^\/+/, '')
    const resolved = `${window.location.origin}${basePath}${clean}`
    console.debug('Resolved audio URL', { url, base, resolved })
    return resolved
  }, [base])

  useEffect(() => {
    const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
    if (!audio) return
    audio.preload = 'auto'
    const tryPlay = async () => {
      try {
        await audio.play()
      } catch (err) {
        void err
      }
    }
    tryPlay()
    return () => {
      // optional: pause on unmount
      try { audio.pause() } catch (e) { void e }
    }
  }, [])

  // Track play/pause state for the floating button icon
  const [isPlaying, setIsPlaying] = useState(false)
  // Track audio loading / playback errors for diagnostics
  const [audioError, setAudioError] = useState<string | null>(null)
  // Small hint shown above the play button briefly
  const [showPlayHint, setShowPlayHint] = useState(true)
  // WebAudio refs so we can control gain on platforms that ignore audio.volume
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  // Volume control: 0-100 scale for the slider UI
  const [volume, setVolume] = useState<number>(() => {
    try {
      const v = localStorage.getItem('bg-volume')
      return v ? Number(v) : 80
    } catch { return 80 }
  })
  const [showVolume, setShowVolume] = useState(false)
  const [prevVolume, setPrevVolume] = useState<number | null>(null)
  useEffect(() => {
    const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
    if (!audio) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    // set initial state
  setIsPlaying(!audio.paused)
  // apply saved volume
  try { audio.volume = Math.max(0, Math.min(1, volume / 100)) } catch (e) { void e }
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [volume])

  // Auto-hide the play hint after a few seconds
  useEffect(() => {
    if (!showPlayHint) return
    const id = setTimeout(() => setShowPlayHint(false), 10000)
    return () => clearTimeout(id)
  }, [showPlayHint])

  // When volume changes, persist and apply to audio element
  useEffect(() => {
    try { localStorage.setItem('bg-volume', String(volume)) } catch (e) { void e }
    const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
    if (!audio) return
    try {
      const v = Math.max(0, Math.min(1, volume / 100))
      if (gainRef.current) {
        try { gainRef.current.gain.value = v } catch (e) { console.error('set gain failed', e) }
      } else {
        try { audio.volume = v } catch (e) { void e }
      }
    } catch (e) { void e }
  }, [volume])

  // Listen for audio load errors and readiness
  useEffect(() => {
    const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
    if (!audio) return
    const onErr = async () => {
      // Friendly message from the media error when available
      const code = audio.error?.code ?? 0
      const msg = audio.error?.message || `Error al cargar el audio (code ${code})`
      console.error('Audio element error', audio.error)

      // If there's a configured local audio, try to fetch it and create a blob URL as a fallback
      if (MUSIC.audioUrl) {
          try {
          const fetchUrl = resolveAudioUrl(MUSIC.audioUrl)
          const resp = await fetch(fetchUrl, { cache: 'no-store' })
          if (!resp.ok) {
            const text = `No se pudo descargar el audio (${resp.status})`
            setAudioError(text)
            return
          }
          const buffer = await resp.arrayBuffer()
          const blob = new Blob([buffer], { type: 'audio/mpeg' })
          const blobUrl = URL.createObjectURL(blob)
          // assign new src and attempt to play
          audio.src = blobUrl
          setAudioError(null)
          try {
            await audio.play()
            return
          } catch (playErr) {
            console.error('Reproducción tras fallback fallida', playErr)
            setAudioError('No se pudo reproducir el audio tras fallback')
            return
          }
        } catch (fetchErr) {
          console.error('Fallback fetch failed', fetchErr)
          setAudioError(String(fetchErr))
          return
        }
      }

      setAudioError(String(msg))
    }
    const onReady = () => {
      setAudioError(null)
    }
  audio.addEventListener('error', onErr as EventListener)
    audio.addEventListener('canplaythrough', onReady)
    audio.addEventListener('loadedmetadata', onReady)
    return () => {
      audio.removeEventListener('error', onErr as EventListener)
      audio.removeEventListener('canplaythrough', onReady)
      audio.removeEventListener('loadedmetadata', onReady)
    }
  }, [resolveAudioUrl])



  function AlbumQRCard() {
    const [dataUrl, setDataUrl] = useState<string>('')
  useEffect(() => {
      let cancelled = false
      async function gen() {
        if (!ALBUM.photosUrl) return
  try {
          const url = await QRCode.toDataURL(ALBUM.photosUrl, {
            margin: 1,
            width: 240,
            color: { dark: '#065f46', light: '#ffffff' },
          })
          if (!cancelled) setDataUrl(url)
  } catch (err) { void err }
      }
      gen()
      return () => { cancelled = true }
  }, [])
    return (
      <div className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm text-sm">
        <p className="text-emerald-900 font-medium">Escanéame para subir</p>
        {ALBUM.photosUrl ? (
          <div className="mt-3 flex flex-col items-center">
            {dataUrl ? (
              <img src={dataUrl} alt="QR del álbum compartido" className="h-40 w-40 rounded-lg ring-1 ring-emerald-200" />
            ) : (
              <div className="h-40 w-40 animate-pulse rounded-lg bg-emerald-50" aria-hidden="true" />
            )}
            <a
              href={ALBUM.photosUrl}
              target="_blank"
              rel="noopener"
              className="mt-3 inline-block rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
            >Abrir álbum</a>
          </div>
        ) : (
          <p className="mt-2 text-slate-700">Pronto habilitaremos el QR cuando tengamos el enlace del álbum.</p>
        )}
        <p className="mt-3 text-emerald-900 font-medium">Sugerencias</p>
        <ul className="mt-2 list-disc pl-5 text-slate-700 space-y-1">
          <li>Sube en alta calidad si puedes (Wi‑Fi recomendado).</li>
          <li>Añade una breve descripción o nombres si gustas.</li>
          <li>Si tomas en vertical, también es bienvenido.</li>
        </ul>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-emerald-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/60 via-emerald-50 to-white">
  {/* Background audio element (uses MUSIC.audioUrl if present) */}
  <audio id="bg-audio" src={resolveAudioUrl(MUSIC.audioUrl || `${base}audio/song.mp3`)} loop preload="auto" />
      {/* Invitation envelope UI */}
      <InvitationEnvelope />
      <header className="relative isolate overflow-hidden">
        {/* Imagen hero: Colima */}
        <div className="absolute inset-0 -z-10">
          <img src={heroSrc} alt="Comala, Colima" className="h-full w-full object-cover opacity-60" loading="eager" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-emerald-50/30 to-white"></div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <p className="tracking-widest text-emerald-700/90 uppercase text-xs sm:text-sm">Comala, Colima</p>
          <h1 className="mt-2 text-5xl sm:text-7xl font-serif text-emerald-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
            <span className="block sm:inline">Esmeralda</span>
            <span className="block sm:inline mx-2">&</span>
            <span className="block sm:inline">Hugo</span>
          </h1>
          <p className="mt-2 text-slate-700/90">Nos casamos el 29 de noviembre de 2025</p>
          <Countdown date={EVENT_DATETIME} />
          <LeafDivider />
          {/* Nuestros padres */}
          {/* sección 'Nuestros padres' movida justo encima de 'Nuestra historia' */}
          <nav aria-label="Secciones" className="mx-auto mt-1 flex flex-wrap items-center justify-center gap-2 text-sm">
            <a href="#evento" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Evento</a>
            <a href="#como-llegar" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Cómo llegar</a>
            <a href="#alojamiento" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Alojamiento</a>
            <a href="#galeria" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Galería</a>
            <a href="#album" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Álbum</a>
            <a href="#regalos" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">Regalos</a>
            <a href="#rsvp" className="rounded-full bg-white/70 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-white shadow-sm">RSVP</a>
          </nav>
          <div className="relative z-10 mt-8 flex items-center justify-center gap-3">
            <a href="#rsvp" className="inline-block rounded-full bg-emerald-600 px-6 py-3 text-white font-medium shadow-md hover:shadow-lg hover:bg-emerald-700 transition">Confirmar asistencia</a>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 text-emerald-800 ring-1 ring-emerald-200/70 hover:bg-white shadow-sm"
              onClick={async () => {
                const shareData = {
                  title: 'Boda Esmeralda & Hugo',
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
                } catch (err) {
                  // Ignorar errores de compartir/portapapeles — mantenemos la variable para linters
                  void err
                }
              }}
            >
              Compartir
            </button>
          </div>
        </div>
      </header>

      {/* Small floating control shown if autoplay was blocked */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center">
          <button
            type="button"
            onClick={async () => {
              if (musicMinimized) {
                // Si está minimizado y hacen clic, pausar música y restaurar mensaje
                const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
                if (audio && !audio.paused) {
                  audio.pause()
                  audio.currentTime = 0
                  setIsPlaying(false) // Actualiza visual inmediatamente
                }
                setMusicMinimized(false)
                setShowPlayHint(true)
              } else {
                // Expandir y reproducir música inmediatamente
                setMusicMinimized(true)
                const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
                if (audio && audio.paused) {
                  audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
                }
              }
            }}
            className="rounded-full p-3 shadow-md ring-1 ring-emerald-200 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.35)' }}
            aria-label={musicMinimized ? 'Restaurar barra de música' : 'Minimizar barra de música'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.24 4 9.91 4.81 11 6.09 12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 group-hover:animate-pulse" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9.5" fill="none" stroke="white" strokeWidth="1.2" opacity="0.95" />
                <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4.5 4.5 0 016.364 0L12 7.636l1.464-1.464a4.5 4.5 0 116.364 6.364L12 20.364l-7.828-7.828a4.5 4.5 0 010-6.364z" />
              </svg>
            )}
          </button>
          {!musicMinimized && (
            <button
              type="button"
              onClick={async () => {
                const audio = document.getElementById('bg-audio') as HTMLAudioElement | null
                if (!audio) return
                setShowPlayHint(false)
                try {
                  if (!audioCtxRef.current) {
                    const Ctx: typeof AudioContext | undefined = (window as unknown as { AudioContext?: typeof AudioContext }).AudioContext
                      || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
                    if (Ctx) {
                      const ctx = new Ctx()
                      try {
                        const src = ctx.createMediaElementSource(audio)
                        const gain = ctx.createGain()
                        src.connect(gain)
                        gain.connect(ctx.destination)
                        gain.gain.value = Math.max(0, Math.min(1, volume / 100))
                        audioCtxRef.current = ctx
                        gainRef.current = gain
                      } catch (e) {
                        console.warn('createMediaElementSource failed', e)
                      }
                    }
                  } else if (audioCtxRef.current.state === 'suspended') {
                    await audioCtxRef.current.resume()
                  }
                } catch (e) {
                  console.error('AudioContext setup failed', e)
                }
                if (audio.paused) {
                  audio.play().then(() => setIsPlaying(true)).catch((err) => { console.error('play failed', err); setAudioError(String(err)); setIsPlaying(false) })
                } else {
                  audio.pause()
                  setIsPlaying(false)
                }
              }}
              className="ml-2 rounded-full p-3 flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.0)' }}
              aria-label="Reproducir / Pausar música de fondo"
            >
              <span className="ml-2 text-emerald-900 font-serif text-[0.98rem] sm:text-[1.05rem] transition-all duration-500 group-hover:animate-fade-in-up" style={{letterSpacing: '0.01em'}}>
                <span className="inline-block align-middle">🎵</span> <span className="align-middle">Escucha nuestra canción</span>
              </span>
            </button>
          )}
        </div>
        {/* Volume control */}
        <div className="relative mt-3 flex justify-end">
          <button
            type="button"
            aria-label="Volumen"
            onClick={() => setShowVolume((s) => !s)}
            className="rounded-full p-2 shadow-md ring-1 ring-emerald-200"
            style={{ background: 'rgba(255,255,255,0.35)' }}
          >
            {volume === 0 ? (
              // Muted speaker with X — speaker base + an X (stroke)
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" d="M3 9v2h4l5 4V5L7 9H3z" />
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M14.5 8.5L17.5 11.5M17.5 8.5L14.5 11.5" />
              </svg>
            ) : volume <= 33 ? (
              // Low volume: speaker + single small wave
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" d="M3 9v2h4l5 4V5L7 9H3z" />
                <path fill="currentColor" d="M14.5 10a1.5 1.5 0 01-1.5 1.5v-3A1.5 1.5 0 0114.5 10z" />
              </svg>
            ) : volume <= 66 ? (
              // Medium volume: speaker + two waves
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" d="M3 9v2h4l5 4V5L7 9H3z" />
                <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M13.5 8.5c.7.6 1.1 1.4 1.1 2.5s-.4 1.9-1.1 2.5" />
                <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M15.5 7.5c1 .9 1.5 2.2 1.5 3.5s-.5 2.6-1.5 3.5" />
              </svg>
            ) : (
              // High volume: speaker + three waves
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-700" viewBox="0 0 20 20" aria-hidden="true">
                <path fill="currentColor" d="M3 9v2h4l5 4V5L7 9H3z" />
                <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M13.5 7.5c.9.8 1.4 1.9 1.4 3.5s-.5 2.7-1.4 3.5" />
                <path fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" d="M15.5 6.5c1.4 1.2 2.2 3 2.2 5s-.8 3.8-2.2 5" />
              </svg>
            )}
          </button>
          {showVolume && (
            <div className="absolute bottom-10 right-0 w-40 rounded-md bg-white/95 p-3 shadow ring-1 ring-emerald-200">
              <label className="block text-xs text-slate-600">Volumen: {volume}%</label>
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full mt-2"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <button type="button" onClick={() => { setPrevVolume(volume); setVolume(0) }} className="underline">Silenciar</button>
                <button type="button" onClick={() => { setVolume(prevVolume ?? 80); setPrevVolume(null) }} className="underline">Restaurar</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nuestros padres: bloque ubicado entre el hero y la sección 'Nuestra historia' */}

      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-2xl text-center mt-3 mb-4 parents-block">
          <div
            ref={parentsRef}
            className="inline-block w-full rounded-2xl border-2 border-emerald-300 bg-white/80 shadow-sm ring-1 ring-emerald-50/70 px-4 py-3 sm:px-6 sm:py-4 reveal"
            id="parents-block"
          >
            <h3 className="text-lg sm:text-xl font-bold text-emerald-900 flex items-center justify-center gap-2 mb-1">
              <img src={`${base}images/apreton-de-manos.png`} alt="Nuestros padres" className="h-6 w-6" />
              Nuestros padres
            </h3>
            <p className="text-emerald-800 font-serif text-base italic text-center mt-1 tracking-wide">
              Gracias mamá y papá por enseñarnos el valor del amor y acompañarnos siempre.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
              {/* Familia de Esmeralda */}
              <div className="flex-1 min-w-[0]">
                <div className="rounded-xl border border-pink-200 bg-pink-50/60 px-4 py-3 flex flex-col items-center shadow-sm">
                  <span className="text-emerald-700 font-medium flex items-center gap-2 tracking-wide text-sm mb-1">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                      <span className="text-white text-xs">👰</span>
                    </div>
                    Esmeralda
                  </span>
                  <span className="block sm:hidden text-xs text-pink-700 font-semibold mb-1">Familia de Esmeralda</span>
                  <span className="font-serif text-emerald-900 text-base sm:text-lg font-semibold text-center">Norma Angelica Fuentes Martinez</span>
                  <span className="font-serif text-emerald-900 text-base sm:text-lg font-semibold text-center">Sabino Dueñas Montes</span>
                </div>
              </div>
              {/* Familia de Hugo */}
              <div className="flex-1 min-w-[0] mt-2 sm:mt-0">
                <div className="rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 flex flex-col items-center shadow-sm">
                  <span className="text-emerald-700 font-medium flex items-center gap-2 tracking-wide text-sm mb-1">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs">🤵🏻‍♂️</span>
                    </div>
                    Hugo
                  </span>
                  <span className="block sm:hidden text-xs text-blue-700 font-semibold mb-1">Familia de Hugo</span>
                  <span className="font-serif text-emerald-900 text-base sm:text-lg font-semibold text-center">Raquel Peñaloza Cisneros</span>
                  <span className="font-serif text-emerald-900 text-base sm:text-lg font-semibold text-center">Jorge Rodríguez Alvarez</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  <main className="mx-auto max-w-5xl px-6 pb-16 content-body">
        <section id="historia" className="mt-8 grid gap-6 sm:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
              <img src={`${base}images/antiguo-rollo.png`} alt="Historia" className="h-6 w-6" />
              Nuestra historia
            </h2>
            <ol className="mt-3 space-y-4">
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
        <section id="como-llegar" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/destino.png`} alt="Destino" className="h-6 w-6" />
            Cómo llegar
          </h2>
          {MAP.streetNote && (
            <p className="mt-2 text-slate-700">Zona de referencia: {MAP.streetNote}</p>
          )}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-xl ring-1 ring-emerald-200 bg-white/70 backdrop-blur">
              <div className="flex flex-col h-64 sm:h-72">
                <div className="px-4 pt-4 pb-2 shrink-0">
                  <h3 className="font-medium text-emerald-900">{MAP.ceremony.name}</h3>
                  <a href={mapLink(MAP.ceremony.query)} target="_blank" rel="noopener" className="text-sm text-emerald-700 hover:underline">Abrir en Google Maps</a>
                </div>
                <div className="flex-1">
                  <iframe
                    className="w-full h-full min-h-[120px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbed(MAP.ceremony.query)}
                    title={`Mapa ${MAP.ceremony.name}`}
                    style={{ border: 0 }}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl ring-1 ring-emerald-200 bg-white/70 backdrop-blur">
              <div className="flex flex-col h-64 sm:h-72">
                <div className="px-4 pt-4 pb-2 shrink-0">
                  <h3 className="font-medium text-emerald-900">{MAP.reception.name}{MAP.streetNote ? ` · ${MAP.streetNote}` : ''}</h3>
                  <a href={mapLink(MAP.reception.query)} target="_blank" rel="noopener" className="text-sm text-emerald-700 hover:underline">Abrir en Google Maps</a>
                </div>
                <div className="flex-1">
                  <iframe
                    className="w-full h-full min-h-[120px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapEmbed(MAP.reception.query)}
                    title={`Mapa ${MAP.reception.name}`}
                    style={{ border: 0 }}
                    allowFullScreen
                  />
                </div>
              </div>
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
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <a className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100" href={makeGoogleCal('Ceremonia – Esmeralda & Hugo', EVENT_DATETIME, new Date(EVENT_DATETIME.getTime()+90*60000), 'Ceremonia de boda', MAP.ceremony.name)} target="_blank" rel="noopener">Agregar a Google</a>
              <a className="rounded-full bg-white px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-50" href={makeICS('Ceremonia – Esmeralda & Hugo', EVENT_DATETIME, new Date(EVENT_DATETIME.getTime()+90*60000), 'Ceremonia de boda', MAP.ceremony.name)} download="ceremonia.ics">Descargar .ics</a>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
              <IconBadge>🥂</IconBadge>
              Recepción
            </h3>
            <p className="mt-2 text-slate-700">29/11/2025 • 15:45 h</p>
      <p className="text-slate-600">{MAP.reception.name}{MAP.streetNote ? ` · ${MAP.streetNote}` : ''}</p>
      <a href={mapLink(MAP.reception.query)} target="_blank" rel="noopener" className="mt-1 inline-block text-emerald-700 hover:underline">Ver mapa</a>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <a className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100" href={makeGoogleCal('Recepción – Esmeralda & Hugo', RECEPTION_DATETIME, new Date(RECEPTION_DATETIME.getTime()+240*60000), 'Recepción de boda', MAP.reception.name)} target="_blank" rel="noopener">Agregar a Google</a>
              <a className="rounded-full bg-white px-3 py-1 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-50" href={makeICS('Recepción – Esmeralda & Hugo', RECEPTION_DATETIME, new Date(RECEPTION_DATETIME.getTime()+240*60000), 'Recepción de boda', MAP.reception.name)} download="recepcion.ics">Descargar .ics</a>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-6 shadow-sm">
            <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                <DressTuxBadge />
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
        <section id="comala" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900">Comala, tierra de Esmeralda</h2>
          <p className="mt-2 text-slate-700">Comala es un Pueblo Mágico conocido por sus fachadas blancas, portales y cafés tradicionales. Entre sus volcanes cercanos y su historia literaria, el pueblo guarda una calidez que nos acompaña en este día especial. Es de aquí de donde es originaria Esmeralda, y por eso quisimos celebrar en su tierra.</p>
          <a href={mapLink('Comala, Colima')} target="_blank" rel="noopener" className="mt-3 inline-block text-emerald-700 hover:underline">Ver Comala en Maps</a>
        </section>

        {/* Alojamiento */}
        <section id="alojamiento" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/hotel.png`} alt="Hotel" className="h-6 w-6" />
            Alojamiento
          </h2>
          <p className="mt-2 text-slate-700">Por disponibilidad, te sugerimos reservar con anticipación. Opciones en Comala:</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {HOTELS.map((h) => (
              <div key={h.name} className="rounded-xl border border-emerald-200 bg-white p-5 shadow-sm">
                <h3 className="font-medium text-emerald-900 flex items-center gap-2">
                  <IconBadge imgSrc={`${base}images/hotel.png`} alt="Hotel" />
                  {h.name}
                </h3>
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

        {/* Avisos y restricciones */}
        <section id="avisos" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/notificaciones.png`} alt="Avisos" className="h-6 w-6" />
            Avisos y restricciones
          </h2>
          <ul className="mt-2 list-disc pl-6 text-slate-700 space-y-1">
            <li>Para que todos puedan relajarse y disfrutar plenamente, la celebración será solo para adultos.</li>
            <li>Les invitamos a considerar que en Comala habrá fiestas durante esas fechas, por lo que lo mejor es reservar hospedaje lo antes posible.</li>
            <li>Estacionamiento limitado. Sugerimos compartir vehículo cuando sea posible.</li>
            <li>Te recomendamos llegar 15 minutos antes de la ceremonia.</li>
          </ul>
        </section>

        {/* Preferencias de invitado */}
        <section id="preferencias" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/retroalimentacion.png`} alt="Retroalimentación" className="h-6 w-6" />
            Preferencias de invitado
          </h2>
          <PreferenciasForm />
        </section>

        <LeafDivider />

        {/* Galería */}
        <section id="galeria" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/foto-familiar.png`} alt="Foto familiar" className="h-6 w-6" />
            Galería
          </h2>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                  className="h-36 w-full object-cover sm:h-44 md:h-48 group-hover:scale-[1.03] transition"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>

        <LeafDivider />

        {/* Álbum compartido */}
        <section id="album" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/galeria.png`} alt="Galería" className="h-6 w-6" />
            Álbum compartido
          </h2>
          <p className="mt-2 text-slate-700">Ayúdanos a guardar recuerdos de la fiesta. Sube tus fotos y videos al álbum compartido.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 items-start">
            <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm sm:col-span-2">
              <p className="text-sm text-emerald-800">Enlace al álbum</p>
              {ALBUM.photosUrl ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <a className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" href={ALBUM.photosUrl} target="_blank" rel="noopener">Abrir álbum</a>
                  <a className="inline-block rounded-lg bg-emerald-50 px-4 py-2 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100" href={ALBUM.photosUrl} target="_blank" rel="noopener">Subir ahora</a>
                </div>
              ) : (
                <p className="mt-2 text-slate-700">Pronto compartiremos el enlace del álbum. ¡Vuelve más tarde!</p>
              )}
              {ALBUM.photosUrl && (
                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-lg bg-white px-3 py-2 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-50"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(ALBUM.photosUrl)
                        alert('Enlace copiado')
                      } catch (err) { void err }
                    }}
                  >Copiar enlace</button>
                  <button
                    className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100"
                    onClick={async () => {
                      const shareData = { title: 'Álbum compartido', url: ALBUM.photosUrl }
                      if (navigator.share) {
                        try { await navigator.share(shareData) } catch (err) { void err }
                        } else {
                        try { await navigator.clipboard.writeText(ALBUM.photosUrl); alert('Enlace copiado') } catch (err) { void err }
                      }
                    }}
                  >Compartir</button>
                </div>
              )}
            </div>
            <AlbumQRCard />
          </div>
        </section>

        {/* Regalos */}
        <section id="regalos" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/presente-3d.png`} alt="Regalo" className="h-6 w-6" />
            Regalos
          </h2>
          <p className="mt-2 text-slate-700">{GIFTS.message}</p>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
              <h3 className="font-medium text-emerald-900">Transferencia bancaria</h3>
              <dl className="mt-2 space-y-2 text-slate-700">
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

          </div>
        </section>

        <section id="rsvp" className="mt-6">
          <h2 className="text-2xl font-semibold text-emerald-900 flex items-center gap-2">
            <img src={`${base}images/confirmado-rsvp.png`} alt="Confirmado" className="h-6 w-6" />
            Confirma tu asistencia
          </h2>
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
                    const label = local.startsWith('452') ? 'Hugo' : (local.startsWith('312') ? 'Esmeralda' : 'WhatsApp')
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

      <footer className="border-t border-emerald-200 bg-white/60 backdrop-blur py-4 mt-12">
        <div className="mx-auto max-w-5xl px-6 text-sm text-slate-600 flex items-center justify-between">
          <span>Esmeralda & Hugo • 29 de noviembre de 2025</span>
          <a className="text-emerald-700 hover:underline" href="#">#Esme&Hugo</a>
        </div>
      </footer>
  {/* Atribución de icono retirada a petición del usuario */}

      {/* Música: no renderizamos un reproductor nativo adicional. Si no hay audio propio, mostramos YouTube como fallback. */}
      {!MUSIC.audioUrl && MUSIC.youtubeId ? (
        <iframe
          width="320" height="180"
          src={`https://www.youtube.com/embed/${MUSIC.youtubeId}?modestbranding=1&rel=0`}
          title={MUSIC.title}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="fixed bottom-3 right-3 z-30"
        />
      ) : null}

      {/* Audio error notification */}
      {audioError && (
        <div className="fixed left-1/2 bottom-24 z-50 -translate-x-1/2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-800 shadow">
          <div className="flex items-center gap-3">
            <strong>Audio:</strong>
            <span className="truncate">{audioError}</span>
            <button className="ml-3 rounded-full bg-red-100 px-2 py-1 text-xs" onClick={() => setAudioError(null)} aria-label="Cerrar aviso audio">✕</button>
          </div>
        </div>
      )}

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
