import { useEffect, useMemo, useState } from 'react'
import { getInvitations } from '../data/invitations'

export default function InvitationEnvelope({ onOpen }: { onOpen?: (inviteNumber: number) => void }) {
  const invites = useMemo(() => getInvitations(), [])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resolved, setResolved] = useState<number | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgRatio, setImgRatio] = useState<number | null>(null)
  const [minimized, setMinimized] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [containerWidth, setContainerWidth] = useState<number>(480)
  const [volcanSrc, setVolcanSrc] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)

  // Probe which decorative image is actually available on the server to avoid
  // the static-server SPA fallback that returns index.html for missing files.
  useEffect(() => {
    let canceled = false
    async function probe() {
      const base = import.meta.env.BASE_URL
      try {
        const tryHead = async (path: string) => {
          const res = await fetch(`${base}images/${path}`, { method: 'HEAD' })
          const ct = res.headers.get('content-type') || ''
          return res.ok && ct.startsWith('image')
        }
        if (await tryHead('volcan.png')) {
          if (!canceled) setVolcanSrc(`${base}images/volcan.png`)
          return
        }
        if (await tryHead('volcan.svg')) {
          if (!canceled) setVolcanSrc(`${base}images/volcan.svg`)
          return
        }
        if (!canceled) setVolcanSrc(`${base}images/colima.jpeg`)
      } catch (e) {
        if (!canceled) setVolcanSrc(`${import.meta.env.BASE_URL}images/colima.jpeg`)
      }
    }
    probe()
    return () => { canceled = true }
  }, [])
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset
      setScrolled(y > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // responsive container width (92vw up to 480px)
  useEffect(() => {
    const calc = () => setContainerWidth(Math.round(Math.min(window.innerWidth * 0.92, 480)))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('invite-number')
      if (stored) {
        const n = Number(stored)
        if (invites[n]) {
          setResolved(n)
        }
      }
    } catch (e) { /* ignore */ }
  }, [invites])

  // preload the envelope image to detect load/error and avoid distortion
  useEffect(() => {
    const src = `${import.meta.env.BASE_URL}images/Sobreboda.jpeg`
    const img = new Image()
    img.src = src
    img.onload = () => { setImgLoaded(true); setImgError(false) }
    img.onerror = () => { setImgLoaded(false); setImgError(true) }
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [])

  // preload to capture natural size and compute aspect ratio
  useEffect(() => {
    const src = `${import.meta.env.BASE_URL}images/Sobreboda.jpeg`
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgLoaded(true)
      setImgError(false)
      try { setImgRatio(img.naturalHeight / img.naturalWidth) } catch (e) { setImgRatio(null) }
    }
    img.onerror = () => { setImgLoaded(false); setImgError(true); setImgRatio(null) }
    return () => { img.onload = null; img.onerror = null }
  }, [])

  const submit = () => {
    setError(null)
    const n = Number(input)
    if (!Number.isInteger(n) || n < 1 || n > 120) {
      setError('Introduce un número válido (1–120)')
      return
    }
    if (!invites[n]) {
      setError('No encontramos ese número. Revisa tu invitación.')
      return
    }
    setResolved(n)
    try { localStorage.setItem('invite-number', String(n)) } catch (e) { /* ignore */ }
    if (onOpen) onOpen(n)
    // close the input modal and open the decorative invitation view (difuminada)
    setOpen(false)
    setShowInvite(true)
  }

  if (resolved && !showInvite) {
    const info = invites[resolved]
    return (
  // top-left non-intrusive card with minimize/maximize and decorative plants
  <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
  {/* overlay removed to avoid global opacity */}
        <div
          className={`relative rounded-2xl shadow-lg overflow-visible transition-all ${minimized ? 'w-56 h-14' : ''}`}
          style={{
            width: minimized ? undefined : `${Math.min(containerWidth, 320)}px`,
            background: scrolled ? 'rgba(255, 255, 255, 0.72)' : 'linear-gradient(180deg,#ffffffef,#fffef6)',
            border: '1px solid rgba(160, 130, 40, 0.18)',
            boxShadow: scrolled ? '0 6px 18px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >
          {/* decorative leaf image uploaded by user (shows on the resolved card) */}
          <img
            src={`${import.meta.env.BASE_URL}images/hojas-de-rama.png`}
            alt="hoja decorativa"
            aria-hidden
            className="pointer-events-none absolute -top-14 -left-8"
            style={{ width: 120, height: 80, opacity: 0.9, objectFit: 'contain', zIndex: 1 }}
          />
          <div className={`p-3 ${minimized ? 'flex items-center gap-2' : 'p-4'}`} style={{ position: 'relative', zIndex: 2 }}>
            <div className="flex-1">
              <div style={{ color: '#70561A', fontFamily: 'Marcellus, "Brush Script MT", "Segoe Script", "Dancing Script", cursive' }} className={`${minimized ? 'text-sm' : 'text-xl'}`}>Bienvenido, {info.name}</div>
              {!minimized && (
                <>
                  <p className="mt-1 text-slate-700 text-sm">Número de invitación: <span className="font-mono">{resolved}</span></p>
                  <p className="mt-1 text-slate-700 text-sm">Pases asignados: <strong>{info.passes}</strong></p>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMinimized(!minimized)} title={minimized ? 'Maximizar' : 'Minimizar'} className="rounded-md p-1 ring-1" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(160,130,40,0.12)' }}>
                {minimized ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor"><path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
                )}
              </button>
              <button onClick={() => { setResolved(null); try { localStorage.removeItem('invite-number') } catch(e){} }} title="Cerrar" className="rounded-md p-1" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(160,130,40,0.12)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
              <button onClick={() => setShowInvite(true)} title="Abrir" className="rounded-md px-2 py-1 text-sm" style={{ background: 'rgba(46, 80, 54, 0.06)', border: '1px solid rgba(160,130,40,0.08)' }}>Abrir</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If an invite is resolved but `open` is true, render the invitation inner sheet as a modal
  // This keeps the resolved-card UI separate but allows the user to open the invitation.
  // The modal includes a diffused volcano image behind the sheet content.
  if (resolved && showInvite) {
    const info = invites[resolved]
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30" onClick={() => setShowInvite(false)} />
        <div style={{ width: 'min(520px, 92vw)', borderRadius: 14, position: 'relative', zIndex: 30 }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
            {/* diffused volcano background */}
            <img src={volcanSrc || `${import.meta.env.BASE_URL}images/volcan.png`} alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '120%', height: '120%', objectFit: 'cover', transform: 'translate(-8%, -6%)', opacity: 0.18, filter: 'blur(6px) saturate(0.9)', zIndex: 1 }} />
            <div style={{ position: 'relative', zIndex: 2, background: 'linear-gradient(180deg,#fffef6,#fffefa)', border: '1px solid rgba(160,130,40,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', padding: 26, fontFamily: 'Marcellus, serif', color: '#70561A', borderRadius: 12 }}>
              <div style={{ fontSize: 22, textAlign: 'center' }}>Jorge &amp; Esmeralda</div>
              <div style={{ fontSize: 14, marginTop: 8, color: '#42524a', textAlign: 'center' }}>{info.name} — {info.passes} pases</div>
                <div className="mt-4 flex justify-center">
                <button onClick={() => setShowInvite(false)} className="rounded-lg px-4 py-2 ring-1 ring-emerald-200">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="envelope-container">
        <div
          className={`envelope rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200 bg-white ${open ? 'open' : ''}`}
          style={{
            // compute height to match image aspect ratio so it doesn't get cropped
            width: `${containerWidth}px`,
            height: imgRatio ? `${Math.round(containerWidth * imgRatio)}px` : '320px',
            position: 'relative',
            backgroundImage: `url(${import.meta.env.BASE_URL}images/Sobreboda.jpeg)`,
            backgroundSize: 'cover',
            // keep focus centered vertically once the container has the correct ratio
            backgroundPosition: 'center 50%',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {!imgLoaded && imgError && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/60">
              <div className="text-slate-600 text-center">Imagen del sobre no encontrada</div>
            </div>
          )}

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-white/90 p-3 shadow ring-1 ring-emerald-200 flex items-center gap-2"
              aria-label="Abrir invitación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.24 4 9.91 4.81 11 6.09 12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span className="text-xs text-emerald-800">Da clic para abrir</span>
            </button>
          </div>

          {/* inner sheet visible only when the decorative invitation is shown (difuminada) */}
          {showInvite && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              style={{ width: '86%', height: '78%' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg,#fffef6,#fffefa)', borderRadius: 12, border: '1px solid rgba(160,130,40,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Marcellus, serif', color: '#70561A' }}>
                <div style={{ fontSize: 20 }}>Jorge &amp; Esmeralda</div>
                <div style={{ fontSize: 14, marginTop: 8, color: '#42524a' }}>29 de noviembre de 2025 — Comala, Colima</div>
              </div>
            </div>
          )}
        </div>

        {open && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm">
        <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-emerald-100" style={{ border: '1px solid rgba(46, 80, 54, 0.06)', fontFamily: 'Marcellus, "Dancing Script", serif', position: 'relative', overflow: 'visible' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ fontFamily: 'Dancing Script, Marcellus, serif', color: '#C59A2A', textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>Introduce tu número de invitación</h3>
                    <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>Lo encontrarás en tu tarjeta</p>
                  </div>
                </div>
                <input value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2" placeholder="Ej. 5" style={{ fontFamily: 'Dancing Script, Marcellus, serif', color: '#C59A2A', borderColor: 'rgba(197,154,42,0.18)', fontSize: '20px', lineHeight: '1.1' }} />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                {/* volcano image shown plainly in the input modal (no blur) */}
                <img src={volcanSrc || `${import.meta.env.BASE_URL}images/volcan.png`} alt="" aria-hidden style={{ position: 'absolute', top: -22, right: -22, width: 64, height: 64, objectFit: 'cover', zIndex: 1, borderRadius: '50%', border: '3px solid white', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }} />
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 ring-1 ring-emerald-200">Cancelar</button>
                  <button onClick={submit} className="rounded-lg bg-emerald-600 text-white px-3 py-2">Abrir</button>
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}
