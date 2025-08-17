import { useEffect, useMemo, useState } from 'react'
import { getInvitations } from '../data/invitations'

export default function InvitationEnvelope({ onOpen }: { onOpen?: (inviteNumber: number) => void }) {
  const invites = useMemo(() => getInvitations(), [])
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resolved, setResolved] = useState<number | null>(null)

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
    setOpen(false)
  }

  if (resolved) {
    const info = invites[resolved]
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-white p-6 shadow-lg ring-1 ring-emerald-100">
          <h3 className="text-xl font-semibold text-emerald-900">Bienvenido, {info.name} 🎉</h3>
          <p className="mt-2 text-slate-700">Número de invitación: <span className="font-mono">{resolved}</span></p>
          <p className="mt-2 text-slate-700">Pases asignados: <strong>{info.passes}</strong></p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => { setResolved(null); try { localStorage.removeItem('invite-number') } catch(e){} }} className="rounded-lg px-3 py-2 ring-1 ring-emerald-200">Cambiar número</button>
            <button onClick={() => setResolved(resolved)} className="rounded-lg bg-emerald-600 text-white px-3 py-2">Cerrar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="envelope-container">
        <div className={`envelope rounded-2xl overflow-hidden shadow-lg ring-1 ring-emerald-200 bg-white ${open ? 'open' : ''}`} style={{width: '360px', height: '240px'}}>
          <div className="flap">
            <img src={`${import.meta.env.BASE_URL}images/Sobreboda.jpeg`} alt="Sobre de invitación" className="block h-36 w-full object-cover rounded-t-2xl" />
          </div>
          <div className="body">
            <img src={`${import.meta.env.BASE_URL}images/Sobreboda.jpeg`} alt="Sobre de invitación" className="block h-full w-full object-cover rounded-b-2xl" />
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full bg-white/90 p-3 shadow ring-1 ring-emerald-200 flex items-center gap-2"
              aria-label="Abrir invitación"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4 8.24 4 9.91 4.81 11 6.09 12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <span className="text-xs text-emerald-800">Da clic al corazón</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-sm">
            <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-emerald-100">
              <h3 className="text-lg font-semibold text-emerald-900">Introduce tu número de invitación</h3>
              <p className="mt-1 text-sm text-slate-600">Lo encontrarás en tu tarjeta</p>
              <input value={input} onChange={(e) => setInput(e.target.value)} className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2" placeholder="Ej. 5" />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
