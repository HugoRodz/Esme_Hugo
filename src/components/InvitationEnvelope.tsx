import { useEffect, useMemo, useState } from 'react'
import { getInvitations } from '../data/invitations'
import { ACCESS_BASE, EXCEPTIONS, expandAccess } from '../data/access'

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
  const [containerWidth, setContainerWidth] = useState<number>(480)
  const [volcanSrc, setVolcanSrc] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)


  useEffect(() => {
    if (typeof window === 'undefined') return;
    let scrollY = 0;
    if (isMobile && !resolved) {
      scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.background = '#fff';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.background = '#fff';
    } else {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.background = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.background = '';
      if (top) {
        window.scrollTo(0, -parseInt(top || '0'));
      }
    }
    return () => {
      const top = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.background = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.background = '';
      if (top) {
        window.scrollTo(0, -parseInt(top || '0'));
      }
    };
  }, [isMobile, resolved]);

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
  } catch { if (!canceled) setVolcanSrc(`${import.meta.env.BASE_URL}images/colima.jpeg`) }
    }
    probe()
    return () => { canceled = true }
  }, [])

  useEffect(() => {
    if (resolved == null) {
      setQrDataUrl(null)
      return
    }
    const infoForQr = invites[resolved]
    if (!infoForQr) {
      setQrDataUrl(null)
      return
    }
    const payload = `${infoForQr.name}|Mesa:${infoForQr.table}|Pases:${infoForQr.passes}`
    const size = isMobile ? 120 : 160
    const data = encodeURIComponent(payload)
    const fallback = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`
    let cancelled = false
    setQrDataUrl(null)
  const tryGenerate = async () => {
      try {
    type QrLib = { toDataURL: (text: string, opts: { margin?: number; width?: number }, cb: (err: unknown, dataUrl: string) => void) => void }
    const QR = (window as unknown as { QRCode?: QrLib }).QRCode
        if (QR && typeof QR.toDataURL === 'function') {
          const url = await new Promise<string>((resolve, reject) => {
            QR.toDataURL(payload, { margin: 1, width: size }, (err: unknown, dataUrl: string) => err ? reject(err) : resolve(dataUrl))
          })
          if (!cancelled) setQrDataUrl(url)
          return
        }
        await new Promise<void>((resolve, reject) => {
          if (document.querySelector('script[data-qr-lib]')) return resolve()
          const s = document.createElement('script')
          s.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js'
          s.setAttribute('data-qr-lib', '1')
          s.async = true
          s.onload = () => resolve()
          s.onerror = () => reject(new Error('Failed to load QR lib'))
          document.head.appendChild(s)
        })
        const QR2 = (window as unknown as { QRCode?: QrLib }).QRCode
        if (QR2 && typeof QR2.toDataURL === 'function') {
          const url = await new Promise<string>((resolve, reject) => {
            QR2.toDataURL(payload, { margin: 1, width: size }, (err: unknown, dataUrl: string) => err ? reject(err) : resolve(dataUrl))
          })
          if (!cancelled) setQrDataUrl(url)
          return
        }
      } catch (e) { void e }
      if (!cancelled) setQrDataUrl(fallback)
    }
    tryGenerate()
    return () => { cancelled = true }
  }, [resolved, isMobile, invites])
  

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
  } catch { /* ignore */ }
  }, [invites])

  useEffect(() => {
  const src = `${import.meta.env.BASE_URL}images/nueva.png`
    const img = new Image()
    img.src = src
    img.onload = () => { setImgLoaded(true); setImgError(false) }
    img.onerror = () => { setImgLoaded(false); setImgError(true) }
    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [])

  useEffect(() => {
  const src = `${import.meta.env.BASE_URL}images/nueva.png`
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgLoaded(true)
      setImgError(false)
  try { setImgRatio(img.naturalHeight / img.naturalWidth) } catch { setImgRatio(null) }
    }
    img.onerror = () => { setImgLoaded(false); setImgError(true); setImgRatio(null) }
    return () => { img.onload = null; img.onerror = null }
  }, [])

  const submit = () => {
    setError(null)
    // Nueva validación: mesa + código
    const mesa = Number(input)
    const cleaned = String(verCode || '').trim()
    if (!Number.isInteger(mesa) || mesa < 1 || mesa > 50) {
      setError('Introduce un número de mesa válido')
      return
    }
    if (!/^\d{3}$/.test(cleaned)) {
      setError('Introduce el código de 3 dígitos')
      return
    }
  const expanded = expandAccess(ACCESS_BASE, EXCEPTIONS)
    const match = expanded.find(r => String(r.table) === String(mesa) && r.code === cleaned)
    if (!match) {
      setError('Mesa o código incorrectos')
      return
    }
    // Resolver invitado en el mapa 'invites' para mostrar tarjeta. Usamos primera coincidencia por nombre.
  const idx = Object.entries(invites).find((entry) => entry[1].name === match.name)?.[0]
    const base = ACCESS_BASE.find(b => b.name === match.name)
    const n = idx ? Number(idx) : null
    if (!n) {
      // Fallback: crear un invitado temporal
      const maxIndex = Object.keys(invites).map(Number).reduce((a, b) => Math.max(a, b), 0)
      const tempIndex = isFinite(maxIndex) ? maxIndex + 1 : 1000
      invites[tempIndex] = { name: match.name, passes: base?.passes ?? 1, code: cleaned, table: mesa }
      setResolved(tempIndex)
  try { localStorage.setItem('invite-number', String(tempIndex)) } catch { /* ignore */ }
  try { localStorage.setItem('invite-code', String(cleaned)) } catch { /* ignore */ }
      if (onOpen) onOpen(tempIndex)
    } else {
      // Sincronizar datos reales (pases correctos y mesa ingresada)
      if (base) {
        invites[n] = { ...invites[n], name: match.name, passes: base.passes, code: cleaned, table: mesa }
      } else {
        invites[n] = { ...invites[n], table: mesa, code: cleaned }
      }
      setResolved(n)
  try { localStorage.setItem('invite-number', String(n)) } catch { /* ignore */ }
  try { localStorage.setItem('invite-code', String(cleaned)) } catch { /* ignore */ }
      if (onOpen) onOpen(n)
    }
    setOpen(false)
    setShowInvite(true)
  }

  if (resolved && !showInvite) {
    const info = invites[resolved]
    const firstName = (info.name || '').trim().split(/\s+/)[0] || info.name
    const nNorm = (firstName || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    const fem = new Set([
      'norma','blanca','raquel','esmeralda','angelica','angela','paola','maria','marcela','diana','karla','alejandra','fernanda','patricia','veronica','brenda','guadalupe','lupita','sofia','andrea','pamela','adriana','monica','silvia','edith'
    ])
    const masc = new Set([
      'hugo','jorge','sabino','fernando','luis','carlos','jose','miguel','juan','ricardo','alejandro','manuel','antonio','roberto'
    ])
    const isFemale = fem.has(nNorm) || (!masc.has(nNorm) && nNorm.endsWith('a'))
    const saludo = `Bienvenid${isFemale ? 'a' : 'o'}, ${firstName} ❤️`
    return (
  <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
  {/* overlay removed to avoid global opacity */}
        <div
          className={`relative rounded-2xl shadow-lg overflow-visible transition-all ${minimized ? 'w-56 h-14' : ''}`}
          style={{
            width: minimized ? undefined : `${Math.min(containerWidth, 320)}px`,
            background: minimized ? 'rgba(255,255,255,0.35)' : 'linear-gradient(180deg,#ffffffef,#fffef6)',
            border: '1px solid rgba(160, 130, 40, 0.18)',
            boxShadow: minimized ? '0 2px 8px rgba(0,0,0,0.08)' : '0 10px 30px rgba(0,0,0,0.08)'
          }}
        >
          {/* decorative leaf image (oculta en modo minimizado para no estorbar) */}
          {!minimized && (
            <img
              src={`${import.meta.env.BASE_URL}images/hojas-de-rama.png`}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -top-14 -left-8"
              style={{ width: 120, height: 80, opacity: 0.9, objectFit: 'contain', zIndex: 1 }}
            />
          )}
          <div className={`p-3 ${minimized ? 'flex items-center gap-2' : 'p-4'}`} style={{ position: 'relative', zIndex: 2 }}>
            <div className="flex-1">
              <div
                style={{ color: '#70561A', fontFamily: 'Marcellus, "Brush Script MT", "Segoe Script", "Dancing Script", cursive' }}
                className={minimized ? 'text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[11.5rem]' : 'text-xl'}
                title={saludo}
              >
                {saludo}
              </div>
              {!minimized && (
                <div style={{ marginTop: 6, marginBottom: 10, textAlign: 'center' }}>
                  <div
                    aria-label="Pases asignados"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '4px 8px',
                      borderRadius: 10,
                      background: 'linear-gradient(180deg, #fffdf8, #fff7e9)',
                      border: '1px solid rgba(201,158,42,0.22)',
                      boxShadow: '0 6px 14px rgba(201,158,42,0.10)'
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Marcellus, serif',
                        fontSize: 10,
                        letterSpacing: 0.8,
                        textTransform: 'uppercase',
                        color: '#8a6b1f'
                      }}
                    >Pases</span>
                    <span aria-hidden style={{ width: 1, height: 14, background: 'rgba(201,158,42,0.25)' }} />
                    <span
                      style={{
                        fontFamily: 'Marcellus, serif',
                        fontWeight: 800,
                        fontSize: 16,
                        color: '#2f3f37'
                      }}
                    >{info.passes}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMinimized(!minimized)} title={minimized ? 'Maximizar' : 'Minimizar'} className="rounded-md p-1 ring-1 bg-white/70 border border-[rgba(160,130,40,0.12)]">
                {minimized ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor"><path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
                )}
              </button>
              <button onClick={() => { setResolved(null); try { localStorage.removeItem('invite-number') } catch { /* ignore */ } }} title="Cerrar" className="rounded-md p-1 bg-white/70 border border-[rgba(160,130,40,0.12)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
              </button>
              {!minimized && (
                <button onClick={() => setShowInvite(true)} title="Abrir" className="rounded-md px-2 py-1 text-sm bg-[rgba(46,80,54,0.06)] border border-[rgba(160,130,40,0.08)]">Abrir</button>
              )}
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
    // Calcular distribución de pases por mesa (excepciones) para mostrar en la tarjeta
  const baseItem = ACCESS_BASE.find(b => b.name === info.name)
  const arrangement = baseItem ? EXCEPTIONS[baseItem.name] : undefined
    const dist: Record<string, number> = {}
    if (arrangement && arrangement.length > 0) {
      for (const m of arrangement) dist[String(m)] = (dist[String(m)] || 0) + 1
    } else {
      const total = baseItem?.passes ?? info.passes
      dist[String(info.table)] = total
    }
  const hasException = arrangement && new Set(arrangement).size > 1
    // compute fallback external QR URL (inline generator handles dataURL via top-level hook)
    const qrSize = isMobile ? 120 : 160
    const qrData = encodeURIComponent(`${info.name}|Mesa:${info.table}|Pases:${info.passes}`)
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${qrData}`
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
                aria-hidden="true"
                style={{ position: 'absolute', top: 10, left: 10, width: 110, height: 'auto', opacity: 0.6, pointerEvents: 'none', zIndex: 0, transform: 'scaleX(-1) rotate(-6deg)' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <img
                src={`${import.meta.env.BASE_URL}images/hojas-de-rama.png`}
                alt=""
                aria-hidden="true"
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

              {/* Monogram watermark (centered, very low opacity) */}
              <div aria-hidden style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 0, pointerEvents: 'none', opacity: 0.06, color: '#C99E2A', fontFamily: 'Marcellus, serif', fontSize: isMobile ? 48 : 84, letterSpacing: 4, fontWeight: 700 }}>
                E &amp; H
              </div>

              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '12px 16px' }}>
                <div style={{ fontSize: 18, color: '#8a6b1f', letterSpacing: 0.6, fontWeight: 600 }}>Esmeralda &amp; Hugo</div>
                <div style={{ fontSize: 13, marginTop: 6, color: '#42524a' }}>29 de noviembre de 2025 — Comala, Colima</div>

                <div style={{ marginTop: 22, fontFamily: 'Dancing Script, Marcellus, serif', fontSize: isMobile ? 34 : 54, color: '#C99E2A', textShadow: '0 2px 0 rgba(255,255,255,0.7)', lineHeight: 1 }}>{info.name}</div>

                <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 140px', gap: isMobile ? 12 : 18, alignItems: 'center', justifyItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#6b6b6b', letterSpacing: 0.6 }}>Pases</div>
                    <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: '#284536', marginTop: 6 }}>{baseItem?.passes ?? info.passes}</div>
                  </div>

                  {/* QR badge: white rounded box with subtle border and shadow */}
                  <div style={{ width: isMobile ? 110 : 140, height: isMobile ? 110 : 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 14, boxShadow: '0 8px 20px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', padding: 8 }}>
                    <img src={qrDataUrl || qrSrc} alt={`QR ${info.name}`} style={{ width: isMobile ? 84 : 110, height: isMobile ? 84 : 110, objectFit: 'contain', borderRadius: 6 }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#6b6b6b', marginTop: isMobile ? 6 : 0, textAlign: 'center' }}>Presentar en acceso</div>
                </div>

                {/* Distribución por mesa (para excepciones) */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <img src={`${import.meta.env.BASE_URL}images/cena.png`} alt="icono cena" width={18} height={18} style={{ width: 18, height: 18, objectFit: 'contain', filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.06))' }} />
                    <div style={{ fontSize: 12, color: '#6b5520', letterSpacing: 0.4, fontWeight: 700 }}>Distribución por mesa</div>
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                    {Object.entries(dist).sort((a,b)=>Number(a[0])-Number(b[0])).map(([mesa, count]) => (
                      <div key={mesa} title={`Mesa ${mesa}: ${count} pase(s)`}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 999,
                          border: '1px solid rgba(160,130,40,0.16)',
                          background: Number(mesa)===info.table ? 'linear-gradient(180deg, rgba(255,244,217,0.9), rgba(255,238,200,0.9))' : 'rgba(255,255,255,0.85)',
                          color: '#3a2b12',
                          fontSize: 12,
                          boxShadow: Number(mesa)===info.table ? '0 4px 12px rgba(201,158,42,0.18)' : '0 2px 8px rgba(0,0,0,0.04)'
                        }}>
                        <span style={{ fontWeight: 700 }}>Mesa {mesa}</span>
                        <span style={{ opacity: 0.75 }}> × {count}</span>
                      </div>
                    ))}
                  </div>
                  {hasException ? (
                    <div style={{ marginTop: 10, textAlign: 'center', fontSize: 12, color: '#6b6b6b' }}>
                      Tus pases están repartidos entre varias mesas; por favor verifica tu mesa de acceso.
                    </div>
                  ) : null}
                </div>

                {/* La funcionalidad de descarga de PDF está temporalmente removida */}

                <div className="mt-4 flex justify-center">
                  <button onClick={() => setShowInvite(false)} className="rounded-lg px-4 py-2 bg-white border border-[rgba(46,80,54,0.08)] shadow-[0_6px_14px_rgba(46,80,54,0.03)]">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Fondo modal: blanco sólido, cubre toda la pantalla y bloquea scroll en móvil */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: isMobile && !resolved ? '#fff' : 'linear-gradient(to bottom, #fff9f0, #fff)',
          zIndex: 0
        }}
      ></div>
      {/* Bloquear scroll y fondo del body/html en móvil mientras el sobre está activo */}
      {/* Controlar scroll y fondo del body/html de forma reactiva */}
      <div className="envelope-container relative z-10">
        <div
          className={`envelope rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200 bg-white ${open ? 'open' : ''}`}
          style={{
            width: `${containerWidth}px`,
            height: imgRatio ? `${Math.round(containerWidth * imgRatio)}px` : '320px',
            position: 'relative',
            backgroundImage: imgLoaded && !imgError ? `url(${import.meta.env.BASE_URL}images/nueva.png)` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center 50%',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 12px 36px rgba(0,0,0,0.12)'
          }}
        >
          {imgError && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-white/80">
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
          {showInvite && resolved && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center"
              style={{ width: '86%', height: '78%' }}>
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(180deg,#fffef6,#fffefa)', borderRadius: 12, border: '1px solid rgba(160,130,40,0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Marcellus, serif', color: '#70561A' }}>
                <div style={{ fontSize: 20 }}>Esmeralda &amp; Hugo</div>
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
                      <h3 className="text-lg font-semibold" style={{ fontFamily: 'Dancing Script, Marcellus, serif', color: '#C59A2A', textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>Introduce tu mesa</h3>
                    </div>
                </div>
                <input value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2 handwritten" placeholder="Ej. 1" style={{ color: '#C59A2A', borderColor: 'rgba(197,154,42,0.18)', fontSize: '20px', lineHeight: '1.1' }} />
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
                <img src={volcanSrc || `${import.meta.env.BASE_URL}images/volcan.png`} alt="" aria-hidden="true" style={{ position: 'absolute', top: -22, right: -22, width: 64, height: 64, objectFit: 'cover', zIndex: 1, borderRadius: '50%', border: '3px solid white', boxShadow: '0 6px 18px rgba(0,0,0,0.12)' }} />
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 ring-1 ring-emerald-200">Cancelar</button>
                  <button onClick={submit} className="rounded-lg bg-emerald-600 text-white px-3 py-2 hover:bg-emerald-700 transition">Abrir</button>
                </div>
              </div>
            </div>
        )}
      </div>
    </div>
  )
}


