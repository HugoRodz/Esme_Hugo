import { useEffect, useState } from 'react'
import { getInvitations } from './data/invitations'
import InvitationEnvelope from './components/InvitationEnvelope'

export default function App() {
  const [showContent, setShowContent] = useState<boolean>(() => {
    try {
      const inviteNumber = localStorage.getItem('invite-number')
      const inviteCode = localStorage.getItem('invite-code')
      const invites = getInvitations()
      
      if (inviteNumber && inviteCode) {
        const num = Number(inviteNumber)
        return invites[num] && invites[num].code === inviteCode
      }
      return false
    } catch (e) {
      return false
    }
  })

  const [minimized, setMinimized] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [showInvite, setShowInvite] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset
      setScrolled(y > 20)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Si no hay verificación, mostrar el sobre
  if (!showContent) {
    return <InvitationEnvelope onOpen={() => setShowContent(true)} />
  }

  // Obtener información de la invitación para la tarjeta de bienvenida
  const inviteNumber = localStorage.getItem('invite-number')
  const invites = getInvitations()
  const inviteInfo = inviteNumber ? invites[Number(inviteNumber)] : null
  
  // Tarjeta de bienvenida flotante
  const welcomeCard = inviteInfo && (
    <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
      <div
        className={`relative rounded-2xl shadow-lg overflow-visible transition-all ${minimized ? 'w-56 h-14' : ''}`}
        style={{
          width: minimized ? undefined : '320px',
          background: scrolled ? 'rgba(255, 255, 255, 0.72)' : 'linear-gradient(180deg,#ffffffef,#fffef6)',
          border: '1px solid rgba(160, 130, 40, 0.18)',
          boxShadow: scrolled ? '0 6px 18px rgba(0,0,0,0.06)' : '0 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}images/hojas-de-rama.png`}
          alt="hoja decorativa"
          aria-hidden
          className="pointer-events-none absolute -top-14 -left-8"
          style={{ width: 120, height: 80, opacity: 0.9, objectFit: 'contain', zIndex: 1 }}
        />
        <div className={`p-3 ${minimized ? 'flex items-center gap-2' : 'p-4'}`} style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex-1">
            <div style={{ color: '#70561A', fontFamily: 'Marcellus, "Brush Script MT", "Segoe Script", "Dancing Script", cursive' }} className={`${minimized ? 'text-sm' : 'text-xl'}`}>
              Bienvenido, {inviteInfo.name}
            </div>
            {!minimized && (
              <>
                <p className="mt-1 text-slate-700 text-sm">Número de invitación: <span className="font-mono">{inviteNumber}</span></p>
                <p className="mt-1 text-slate-700 text-sm">Pases asignados: <strong>{inviteInfo.passes}</strong></p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMinimized(!minimized)} 
              title={minimized ? 'Maximizar' : 'Minimizar'} 
              className="rounded-md p-1 ring-1" 
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(160,130,40,0.12)' }}
            >
              {minimized ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-700" viewBox="0 0 20 20" fill="currentColor"><path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"/></svg>
              )}
            </button>
            <button 
              onClick={() => setShowInvite(true)} 
              title="Abrir invitación" 
              className="rounded-md px-2 py-1 text-sm" 
              style={{ background: 'rgba(46, 80, 54, 0.06)', border: '1px solid rgba(160,130,40,0.08)' }}
            >
              Abrir
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Modal de la invitación
  const inviteModal = showInvite && inviteInfo && (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => setShowInvite(false)} />
      <div style={{ width: 'min(540px, 94vw)', borderRadius: 12, position: 'relative', zIndex: 30 }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
          <div
            className="relative z-2 rounded-xl bg-gradient-to-b from-[#fffef8] to-[#fffaf4] p-7 shadow-2xl ring-1 ring-emerald-200/50"
          >
            <h2 className="text-center font-serif text-3xl text-emerald-900">Invitación</h2>
            <p className="mt-4 text-center text-slate-700">{inviteInfo.name}</p>
            <p className="mt-2 text-center text-sm text-emerald-700">Mesa: {inviteInfo.table} · Pases: {inviteInfo.passes}</p>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowInvite(false)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-emerald-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/60 via-emerald-50 to-white">
      {welcomeCard}
      {inviteModal}
      
      {/* Botón temporal para reiniciar */}
      <button
        onClick={() => {
          localStorage.clear()
          setShowContent(false)
        }}
        className="fixed bottom-4 right-4 z-50 rounded-lg bg-red-600 px-4 py-2 text-white shadow-lg"
        style={{ opacity: 0.7 }}
      >
        Reiniciar invitación
      </button>

      {/* Resto del contenido de la página */}
      <header className="relative isolate overflow-hidden">
        {/* ... resto del contenido ... */}
      </header>
    </div>
  )
}
