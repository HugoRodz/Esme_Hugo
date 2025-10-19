import { useEffect, useMemo, useState } from 'react'
import { getInvitations } from '../data/invitations'

export default function InvitationEnvelope({ onOpen }: { onOpen: () => void }) {
  // Estados principales
  const invites = useMemo(() => getInvitations(), [])
  const [resolved, setResolved] = useState<number | null>(() => {
    try {
      const num = localStorage.getItem('invite-number')
      const code = localStorage.getItem('invite-code')
      if (num && code) {
        const n = Number(num)
        if (invites[n] && invites[n].code === code) {
          return n
        }
      }
      return null
    } catch (e) {
      return null
    }
  })

  // Estados de la interfaz principal
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [verCode, setVerCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  // Estados para la imagen del sobre
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [imgRatio, setImgRatio] = useState<number | null>(null)
  
  // Estados responsivos y de diseño
  const [containerWidth, setContainerWidth] = useState<number>(480)
  const [isMobile, setIsMobile] = useState(false)
  const [minimized, setMinimized] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  
  // Estados para imágenes y contenido adicional
  const [volcanSrc, setVolcanSrc] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  // Efectos
  useEffect(() => {
    if (resolved && onOpen) {
      onOpen()
    }
  }, [resolved, onOpen])

  return <div>Work in progress...</div>
}
