import { useEffect, useMemo, useState } from 'react'
import { getInvitations } from '../data/invitations'

export default function InvitationEnvelope({ onOpen }: { onOpen: () => void }) {
  const invites = useMemo(() => getInvitations(), [])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [verCode, setVerCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgRatio, setImgRatio] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(480)

  // Responsive container width (92vw up to 480px)
  useEffect(() => {
    const calc = () => setContainerWidth(Math.round(Math.min(window.innerWidth * 0.92, 480)))
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // Preload envelope image
  useEffect(() => {
    const src = `${import.meta.env.BASE_URL}images/Sobreboda.jpeg`
    const img = new Image()
    img.src = src
    img.onload = () => {
      setImgLoaded(true)
      setImgError(false)
      try { setImgRatio(img.naturalHeight / img.naturalWidth) } catch (e) { setImgRatio(null) }
    }
    img.onerror = () => {
      setImgLoaded(false)
      setImgError(true)
      setImgRatio(null)
    }
    return () => {
      img.onload = null
      img.onerror = null
    }
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
    
    try { 
      localStorage.setItem('invite-number', String(n))
      localStorage.setItem('invite-code', cleaned)
      onOpen()
    } catch (e) {
      setError('Error al guardar la verificación')
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white min-h-screen w-full">
      <div className="fixed inset-0 bg-white"></div>
      <div className="envelope-container relative z-10">
        <div
          className={`envelope rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200 bg-white ${open ? 'open' : ''}`}
          style={{
            width: `${containerWidth}px`,
            height: imgRatio ? `${Math.round(containerWidth * imgRatio)}px` : '320px',
            position: 'relative',
            backgroundImage: `url(${import.meta.env.BASE_URL}images/Sobreboda.jpeg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 50%',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#FFFFFF'
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
        </div>

        {open && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-emerald-100" style={{ border: '1px solid rgba(46, 80, 54, 0.06)', fontFamily: 'Marcellus, "Dancing Script", serif' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold" style={{ fontFamily: 'Dancing Script, Marcellus, serif', color: '#C59A2A', textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>Introduce tu número de invitación</h3>
                </div>
              </div>
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2 handwritten" 
                placeholder="Ej. 5" 
                style={{ color: '#C59A2A', borderColor: 'rgba(197,154,42,0.18)', fontSize: '20px', lineHeight: '1.1' }} 
              />
              <input
                value={verCode}
                onChange={(e) => {
                  const cleaned = String(e.target.value).replace(/\D/g, '').slice(0, 3)
                  setVerCode(cleaned)
                }}
                className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2 handwritten text-center"
                placeholder="Código de 3 dígitos"
                inputMode="numeric"
                pattern="\\d{3}"
                maxLength={3}
                style={{ color: '#C59A2A', borderColor: 'rgba(197,154,42,0.12)', fontSize: '20px', lineHeight: '1.1' }}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <div className="mt-4 flex justify-end gap-2">
                <button 
                  onClick={() => setOpen(false)} 
                  className="rounded-lg px-3 py-2 ring-1 ring-emerald-200"
                >
                  Cancelar
                </button>
                <button 
                  onClick={submit} 
                  className="rounded-lg bg-emerald-600 text-white px-3 py-2"
                >
                  Abrir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
