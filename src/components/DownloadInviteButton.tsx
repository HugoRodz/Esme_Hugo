import { useState } from 'react'

interface DownloadInviteButtonProps {
  resolved: number | null
  info: {
    name: string
    table: string
    passes: number
  }
}

export default function DownloadInviteButton({ resolved, info }: DownloadInviteButtonProps) {
  const [loading, setLoading] = useState(false)

  const download = async () => {
    if (!resolved || !info) return
    setLoading(true)
    try {
      // Cargar html2canvas y jspdf dinámicamente
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

      // Encontrar la tarjeta por atributo
      const card = document.querySelector('[data-invite-card]') as HTMLElement | null
      if (!card) throw new Error('No se encontró la tarjeta')

      const normalizeColor = (raw: string) => {
        try {
          const cvs = document.createElement('canvas')
          const ctx = cvs.getContext('2d')
          if (!ctx) return raw
          ctx.fillStyle = raw
          return ctx.fillStyle || raw
        } catch (e) {
          return raw
        }
      }

      const colorProps = [
        'color', 'background-color', 'background', 'border-color',
        'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
        'box-shadow', 'text-shadow'
      ]

      // Clonar nodo e inyectar estilos
      const clone = card.cloneNode(true) as HTMLElement
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.pointerEvents = 'none'
      clone.style.opacity = '1'

      const originals = Array.from(card.querySelectorAll('*')) as HTMLElement[]
      const clones = Array.from(clone.querySelectorAll('*')) as HTMLElement[]
      originals.unshift(card)
      clones.unshift(clone)

      for (let i = 0; i < originals.length; i++) {
        const o = originals[i]
        const c = clones[i]
        try {
          const cs = window.getComputedStyle(o)
          colorProps.forEach((prop) => {
            try {
              if (prop === 'background') {
                const v = cs.getPropertyValue('background-color')
                if (v) c.style.setProperty('background-color', v)
                return
              }
              let v = cs.getPropertyValue(prop)
              if (!v) return

              const fnColorRegex = /(oklch|oklab|lch|lab|color)\([^\)]+\)/gi
              if (fnColorRegex.test(v) || /oklch/i.test(v)) {
                const lowerProp = prop.toLowerCase()
                if (lowerProp === 'color') {
                  v = '#2f3f37'
                } else if (lowerProp.includes('background') || lowerProp === 'background-color') {
                  v = '#fffef8'
                } else if (lowerProp.includes('border')) {
                  v = 'transparent'
                } else if (lowerProp === 'box-shadow' || lowerProp === 'text-shadow') {
                  v = 'none'
                } else {
                  v = normalizeColor(v) || '#000'
                }
              } else {
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

      document.body.appendChild(clone)

      try {
        Array.from(clone.querySelectorAll('button,input,textarea,select')).forEach((el: Element) => {
          try { (el as HTMLElement).style.display = 'none' } catch (e) {}
        })
      } catch (e) {}

      try {
        const rect = card.getBoundingClientRect()
        clone.style.width = Math.round(rect.width) + 'px'
        clone.style.height = Math.round(rect.height) + 'px'
        const imgs = Array.from(clone.querySelectorAll('img')) as HTMLImageElement[]
        await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : (img.decode ? img.decode() : Promise.resolve())))
      } catch (e) {}

      const canvas = await html2canvas(clone, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: null, 
        width: clone.clientWidth, 
        height: clone.clientHeight 
      })
      
      const imgData = canvas.toDataURL('image/jpeg', 0.95)

      try { document.body.removeChild(clone) } catch (e) { }

      // A6 size (105 x 148 mm)
      const mmToPt = (mm: number) => mm * 72 / 25.4
      const a6W = mmToPt(105)
      const a6H = mmToPt(148)

      const pxToPt = (px: number) => px * 72 / 96
      const imgWPt = pxToPt(canvas.width)
      const imgHPt = pxToPt(canvas.height)

      const marginMm = 6
      const a6WAvail = a6W - mmToPt(marginMm) * 2
      const a6HAvail = a6H - mmToPt(marginMm) * 2
      const scale = Math.min(a6WAvail / imgWPt, a6HAvail / imgHPt)
      const drawW = imgWPt * scale
      const drawH = imgHPt * scale
      const x = (a6W - drawW) / 2
      const y = (a6H - drawH) / 2

      const pdf = new jsPDF({ unit: 'pt', format: [a6W, a6H] })
      pdf.setFillColor(255, 255, 255)
      pdf.rect(0, 0, a6W, a6H, 'F')
      pdf.addImage(imgData, 'JPEG', x, y, drawW, drawH)

      const cm = mmToPt(6)
      const markLen = mmToPt(4)
      pdf.setDrawColor(120)
      pdf.setLineWidth(0.5)
      
      // Marcas de corte
      pdf.line(cm - markLen, cm, cm, cm)
      pdf.line(cm, cm - markLen, cm, cm)
      pdf.line(a6W - cm + markLen, cm, a6W - cm, cm)
      pdf.line(a6W - cm, cm - markLen, a6W - cm, cm)
      pdf.line(cm - markLen, a6H - cm, cm, a6H - cm)
      pdf.line(cm, a6H - cm + markLen, cm, a6H - cm)
      pdf.line(a6W - cm + markLen, a6H - cm, a6W - cm, a6H - cm)
      pdf.line(a6W - cm, a6H - cm + markLen, a6W - cm, a6H - cm)

      const safeName = (info && info.name) ? 
        String(info.name).replace(/\s+/g, '_').toLowerCase() : 
        String(resolved)
      
      pdf.save(`${safeName}-invitacion-a6.pdf`)
    } catch (e) {
      console.error(e)
      alert('Error generando PDF: ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      onClick={download} 
      className="rounded-lg px-3 py-1" 
      style={{ 
        background: 'rgba(197,154,42,0.08)', 
        color: '#6b6b6b', 
        borderRadius: 8 
      }}
    >
      {loading ? 'Generando...' : 'Descarga la tarjeta'}
    </button>
  )
}
