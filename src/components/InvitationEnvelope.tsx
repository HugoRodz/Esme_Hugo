import { useEffect, useMemo, useState } from 'react'
import { getInvitations } from '../data/invitations'

export default function InvitationEnvelope({ onOpen }: { onOpen?: (inviteNumber: number) => void }) {
  const invites = useMemo(() => getInvitations(), [])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [verCode, setVerCode] = useState('')
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
  const [isMobile, setIsMobile] = useState(false)

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
  const checkMobile = () => setIsMobile(window.innerWidth <= 480)
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => { window.removeEventListener('resize', calc); window.removeEventListener('resize', checkMobile) }
  }, [])


  useEffect(() => {
    try {
      const stored = localStorage.getItem('invite-number')
    const storedCode = localStorage.getItem('invite-code')
      if (stored) {
        const n = Number(stored)
        if (invites[n]) {
          setResolved(n)
      if (storedCode) setVerCode(storedCode)
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
    // verify 3-digit code
    const expected = invites[n].code
    const cleaned = String(verCode || '').trim()
    if (!/^\d{3}$/.test(cleaned)) {
      setError('Introduce el código de verificación de 3 dígitos')
      return
    }
    if (cleaned !== expected) {
      setError('Código de verificación incorrecto')
      return
    }
    setResolved(n)
    try { localStorage.setItem('invite-number', String(n)) } catch (e) { /* ignore */ }
    try { localStorage.setItem('invite-code', String(cleaned)) } catch (e) { /* ignore */ }
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
        <div style={{ width: 'min(540px, 94vw)', borderRadius: 12, position: 'relative', zIndex: 30 }}>
          <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
            {/* Invitation pass card - refined, centered layout with gold badge */}
            <div
              data-invite-card
              style={{
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(180deg,#fffef8,#fffaf4)',
                border: '1px solid rgba(160,130,40,0.06)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.14)',
                padding: 28,
                fontFamily: 'Marcellus, serif',
                color: '#2f3f37',
                borderRadius: 14,
                overflow: 'hidden'
              }}
            >
              {/* subtle decorative leaves: top-left and bottom-right for balance */}
              <img
                src={`${import.meta.env.BASE_URL}images/hojas-de-rama.png`}
                alt=""
                aria-hidden
                style={{ position: 'absolute', top: 10, left: 10, width: 110, height: 'auto', opacity: 0.6, pointerEvents: 'none', zIndex: 0, transform: 'scaleX(-1) rotate(-6deg)' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <img
                src={`${import.meta.env.BASE_URL}images/hojas-de-rama.png`}
                alt=""
                aria-hidden
                style={{ position: 'absolute', bottom: 10, right: 10, width: 110, height: 'auto', opacity: 0.5, pointerEvents: 'none', zIndex: 0 }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />

              {/* gold circular table badge (top-right) */}
              <div style={{ position: 'absolute', top: isMobile ? -12 : -18, right: isMobile ? -12 : -18, zIndex: 5 }}>
                <div style={{ width: isMobile ? 64 : 92, height: isMobile ? 64 : 92, borderRadius: isMobile ? 32 : 46, background: 'radial-gradient(circle at 30% 30%, #FFDFA0, #C99E2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.12)', border: '2px solid rgba(255,255,255,0.6)' }}>
                  <div style={{ textAlign: 'center', lineHeight: 1 }}>
                    <div style={{ fontSize: isMobile ? 10 : 12, color: '#5a3f13', fontWeight: 600 }}>Mesa</div>
                    <div style={{ fontSize: isMobile ? 18 : 26, color: '#3a2b12', fontWeight: 800 }}>{info.table}</div>
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '8px 12px' }}>
                <div style={{ fontSize: 18, color: '#8a6b1f', letterSpacing: 0.6 }}>Jorge &amp; Esmeralda</div>
                <div style={{ fontSize: 13, marginTop: 6, color: '#42524a' }}>29 de noviembre de 2025 — Comala, Colima</div>

                <div style={{ marginTop: 18, fontFamily: 'Dancing Script, Marcellus, serif', fontSize: isMobile ? 30 : 46, color: '#C99E2A', textShadow: '0 2px 0 rgba(255,255,255,0.6)' }}>{info.name}</div>

                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: isMobile ? 12 : 22, alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#6b6b6b' }}>Pases</div>
                    <div style={{ fontSize: isMobile ? 18 : 20, fontWeight: 700, color: '#284536' }}>{info.passes}</div>
                  </div>
                  {!isMobile && <div style={{ width: 1, height: 36, background: 'linear-gradient(180deg,#eee,#fff)', opacity: 0.8 }} />}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#6b6b6b' }}>Núm.</div>
                    <div style={{ fontFamily: 'monospace', fontSize: isMobile ? 16 : 18, color: '#284536' }}>{resolved}</div>
                  </div>
                </div>

                {/* divider + download */}
                <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                  <div style={{ width: 120, height: 1, background: 'linear-gradient(90deg,#e9e6dd,#fff)', borderRadius: 2 }} />
                  <DownloadButton resolved={resolved} info={info} />
                  <div style={{ width: 120, height: 1, background: 'linear-gradient(90deg,#fff,#e9e6dd)', borderRadius: 2 }} />
                </div>

                  <div className="mt-4 flex justify-center">
                    <button onClick={() => setShowInvite(false)} className="rounded-lg px-4 py-2 ring-1 ring-emerald-200" style={{ background: '#fff' }}>Cerrar</button>
                  </div>
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
                    </div>
                </div>
                <input value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2 handwritten" placeholder="Ej. 5" style={{ color: '#C59A2A', borderColor: 'rgba(197,154,42,0.18)', fontSize: '20px', lineHeight: '1.1' }} />
                <input
                  value={verCode}
                  onChange={(e) => {
                    // allow only digits and limit to 3 chars
                    const cleaned = String(e.target.value).replace(/\D/g, '').slice(0, 3)
                    setVerCode(cleaned)
                  }}
                  className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2 handwritten text-center"
                  placeholder="Ej. 001"
                  inputMode="numeric"
                  pattern="\\d{3}"
                  maxLength={3}
                  style={{ color: '#C59A2A', borderColor: 'rgba(197,154,42,0.12)', fontSize: '20px', lineHeight: '1.1' }}
                />
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

// Small component to download the visible pass as PDF
function DownloadButton({ resolved, info }: { resolved: number | null, info: any }) {
  const [loading, setLoading] = useState(false)

  const download = async () => {
    if (!resolved || !info) return
    setLoading(true)
    try {
      // load html2canvas and jspdf dynamically by injecting script tags
      const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve()
        const s = document.createElement('script')
        s.src = src
        s.async = true
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('Failed to load ' + src))
        document.head.appendChild(s)
      })
      if (!(window as any).html2canvas) {
        await loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')
      }
      if (!(window as any).jspdf) {
        await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js')
      }
  const html2canvas = (window as any).html2canvas
  const { jsPDF } = (window as any).jspdf || (window as any)

  // find the card element by attribute
  const card = document.querySelector('[data-invite-card]') as HTMLElement | null
  if (!card) throw new Error('No se encontró la tarjeta')

  // To avoid html2canvas/jsPDF failing on unsupported CSS color functions
  // (for example: "oklch(...)") we clone the card and inline computed
  // styles as concrete color strings. We try to normalize color functions
  // via a canvas fallback which yields a browser-normalized color string
  // (e.g. "rgb(...)" or "#rrggbb"). The clone is rendered off-screen.

  // helper to normalize a single color token using canvas (best-effort)
  const normalizeColor = (raw: string) => {
    try {
      const cvs = document.createElement('canvas')
      const ctx = cvs.getContext('2d')
      if (!ctx) return raw
      // setting fillStyle will cause the canvas to normalize many color formats
      // including named colors and some functions; if it fails, we keep raw
      ctx.fillStyle = raw
      return ctx.fillStyle || raw
    } catch (e) {
      return raw
    }
  }

  // properties we want to inline from computed styles
  const colorProps = [
    'color', 'background-color', 'background', 'border-color',
    'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
    'box-shadow', 'text-shadow'
  ]

  // clone node and inline styles
  const clone = card.cloneNode(true) as HTMLElement
  // ensure clone is not visible and does not affect layout
  clone.style.position = 'absolute'
  clone.style.left = '-9999px'
  clone.style.top = '0'
  clone.style.pointerEvents = 'none'
  clone.style.opacity = '1'

  const originals = Array.from(card.querySelectorAll('*')) as HTMLElement[]
  const clones = Array.from(clone.querySelectorAll('*')) as HTMLElement[]
  // include the root element too
  originals.unshift(card)
  clones.unshift(clone)

  for (let i = 0; i < originals.length; i++) {
    const o = originals[i]
    const c = clones[i]
    try {
      const cs = window.getComputedStyle(o)
      colorProps.forEach((prop) => {
        try {
          // prefer the resolved color for background (background-color)
          if (prop === 'background') {
            const v = cs.getPropertyValue('background-color')
            if (v) c.style.setProperty('background-color', v)
            return
          }
          let v = cs.getPropertyValue(prop)
          if (!v) return

          // if the value contains function-like color tokens, try to normalize them
          // e.g. "oklch(...)" inside box-shadow/text-shadow
          const fnColorRegex = /(oklch|oklab|lch|lab|color)\([^\)]+\)/gi
          if (fnColorRegex.test(v) || /oklch/i.test(v)) {
            // If we still detect modern color functions like oklch, use conservative fallbacks
            // to avoid html2canvas/jsPDF parsing errors in some browsers.
            const lowerProp = prop.toLowerCase()
            if (lowerProp === 'color') {
              v = '#2f3f37' // default body text color used in the card
            } else if (lowerProp.includes('background') || lowerProp === 'background-color') {
              v = '#fffef8' // pale cream background similar to card baseline
            } else if (lowerProp.includes('border')) {
              v = 'transparent'
            } else if (lowerProp === 'box-shadow' || lowerProp === 'text-shadow') {
              v = 'none'
            } else {
              // generic fallback
              v = normalizeColor(v) || '#000'
            }
          } else {
            // try to normalize remaining possible function-like tokens
            if (fnColorRegex.test(v)) {
              v = v.replace(fnColorRegex, (match) => {
                const normalized = normalizeColor(match.trim())
                return normalized || match
              })
            }
            const wholeFnRegex = /^\s*(oklch|oklab|lch|lab|color)\([^\)]+\)\s*$/i
            if (wholeFnRegex.test(v)) {
              v = normalizeColor(v) || v
            }
          }

          if (v) c.style.setProperty(prop, v)
        } catch (e) {
          // ignore per-element property failures
        }
      })
    } catch (e) {
      // ignore getComputedStyle failures
    }
  }

  // attach clone off-screen, render it, then remove
  document.body.appendChild(clone)

  // hide interactive elements (buttons, inputs) inside the clone so labels like
  // "Generando..." are not captured in the final image
  try {
    Array.from(clone.querySelectorAll('button,input,textarea,select')).forEach((el: Element) => {
      try { (el as HTMLElement).style.display = 'none' } catch (e) {}
    })
  } catch (e) {}

  // Ensure the clone matches the on-screen card dimensions so the capture
  // contains the full card (no accidental cropping). Wait images to decode.
  try {
    const rect = card.getBoundingClientRect()
    clone.style.width = Math.round(rect.width) + 'px'
    clone.style.height = Math.round(rect.height) + 'px'
    // wait for images inside clone to decode
    const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[]
    await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : (img.decode ? img.decode() : Promise.resolve())))
  } catch (e) {
    // continue anyway
  }

  // Render at a decent pixel ratio for print clarity
  const canvas = await html2canvas(clone, { scale: 2, useCORS: true, backgroundColor: null, width: clone.clientWidth, height: clone.clientHeight })
  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  // cleanup cloned node
  try { document.body.removeChild(clone) } catch (e) { /* ignore */ }

  // A6 size in points (pt = 1/72in). A6 = 105 x 148 mm
  const mmToPt = (mm: number) => mm * 72 / 25.4
  const a6W = mmToPt(105) // ~297.7pt
  const a6H = mmToPt(148) // ~419.5pt

  // Canvas is in pixels; convert px -> pt (1px = 72/96 pt assuming 96dpi)
  const pxToPt = (px: number) => px * 72 / 96
  const imgWPt = pxToPt(canvas.width)
  const imgHPt = pxToPt(canvas.height)

  // Fit the rendered card inside A6 using 'contain' so the whole card is visible
  // and centered. Add a small margin (6mm) so the card doesn't touch the page edges.
  const marginMm = 6
  const a6WAvail = a6W - mmToPt(marginMm) * 2
  const a6HAvail = a6H - mmToPt(marginMm) * 2
  const scale = Math.min(a6WAvail / imgWPt, a6HAvail / imgHPt)
  const drawW = imgWPt * scale
  const drawH = imgHPt * scale
  const x = (a6W - drawW) / 2
  const y = (a6H - drawH) / 2

  const pdf = new jsPDF({ unit: 'pt', format: [a6W, a6H] })
  // Add a subtle white background so exported page looks natural when opened
  pdf.setFillColor(255, 255, 255)
  pdf.rect(0, 0, a6W, a6H, 'F')
  pdf.addImage(imgData, 'JPEG', x, y, drawW, drawH)
  const safeName = (info && info.name) ? String(info.name).replace(/\s+/g, '_').toLowerCase() : String(resolved)
  pdf.save(`${safeName}-invitacion-a6.pdf`)
    } catch (e) {
      // fallback: open in new tab as image
      console.error(e)
      alert('Error generando PDF: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={download} className="rounded-lg px-3 py-1" style={{ background: 'rgba(197,154,42,0.08)', color: '#6b6b6b', borderRadius: 8 }}>
      {loading ? 'Generando...' : 'Descarga la tarjeta'}
    </button>
  )
}
