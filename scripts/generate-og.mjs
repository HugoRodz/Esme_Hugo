import sharp from 'sharp'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const srcImage = path.join(projectRoot, 'public/images/colima.jpeg')
const outImage = path.join(projectRoot, 'public/images/og_colima_text.jpg')

const W = 1200
const H = 630

const title = 'Esmeralda & Jorge'
const subtitle = '29 de noviembre de 2025 • Comala, Colima'

const fontCss = `
@font-face {
  font-family: 'Inter';
  src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMWQKk.woff2') format('woff2');
  font-weight: 700;
}
@font-face {
  font-family: 'Marcellus';
  src: url('https://fonts.gstatic.com/s/marcellus/v16/wEO_EBrAnc9BLjLQAUk1VvoK.woff2') format('woff2');
  font-weight: 400;
}
body { margin: 0; padding: 0; width: ${W}px; height: ${H}px; display: flex; align-items: center; justify-content: center; }
.container { position: relative; width: ${W}px; height: ${H}px; font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; }
.title { position: absolute; left: 48px; bottom: 110px; font-family: 'Marcellus', serif; font-size: 80px; line-height: 1.05; color: #ffffff; text-shadow: 0 2px 14px rgba(0,0,0,.5); }
.subtitle { position: absolute; left: 48px; bottom: 48px; font-size: 28px; color: #e6fffa; text-shadow: 0 2px 10px rgba(0,0,0,.6); }
.badge { position: absolute; top: 24px; left: 24px; font-size: 16px; color: #064e3b; background: rgba(236, 253, 245, .85); padding: 6px 10px; border-radius: 999px; border: 1px solid rgba(16,185,129,.35); }
.overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.55) 100%); }
`.
replace(/\n/g, '')

async function main() {
  // Ensure file exists
  await fs.access(srcImage)

  // Background image: cover and center-crop to 1200x630
  const bg = await sharp(srcImage)
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .toBuffer()

  const html = `<!DOCTYPE html><html><head><meta charset='utf-8'><style>${fontCss}</style></head><body><div class='container'><img src='data:image/jpeg;base64,${bg.toString('base64')}' width='${W}' height='${H}'/><div class='overlay'></div><div class='badge'>Boda</div><div class='title'>${title}</div><div class='subtitle'>${subtitle}</div></div></body></html>`

  // Render HTML to image using sharp's SVG text overlay fallback (we'll build an SVG)
  const svg = `<?xml version='1.0' encoding='UTF-8'?>
  <svg width='${W}' height='${H}' viewBox='0 0 ${W} ${H}' xmlns='http://www.w3.org/2000/svg'>
    <image href='data:image/jpeg;base64,${bg.toString('base64')}' width='${W}' height='${H}' preserveAspectRatio='xMidYMid slice'/>
    <rect x='0' y='0' width='${W}' height='${H}' fill='url(#grad)'/>
    <defs>
      <linearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0%' stop-color='rgba(0,0,0,0.25)'/>
        <stop offset='60%' stop-color='rgba(0,0,0,0.35)'/>
        <stop offset='100%' stop-color='rgba(0,0,0,0.55)'/>
      </linearGradient>
      <style><![CDATA[
        @font-face { font-family: 'Marcellus'; src: url('https://fonts.gstatic.com/s/marcellus/v16/wEO_EBrAnc9BLjLQAUk1VvoK.woff2') format('woff2'); }
        @font-face { font-family: 'Inter'; src: url('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMWQKk.woff2') format('woff2'); font-weight: 700; }
      ]]></style>
    </defs>
    <rect x='18' y='18' rx='18' ry='18' fill='rgba(236,253,245,0.85)' stroke='rgba(16,185,129,0.35)' width='64' height='28'/>
    <text x='50' y='38' font-family='Inter' font-size='16' fill='#064e3b'>Boda</text>
    <text x='48' y='520' font-family='Marcellus' font-size='80' fill='#ffffff' style='text-shadow: 0 2px 14px rgba(0,0,0,.5)'>Jorge &amp; Esmeralda</text>
    <text x='48' y='575' font-family='Inter' font-size='28' fill='#e6fffa'>29 de noviembre de 2025 • Comala, Colima</text>
  </svg>`

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 86 })
    .toFile(outImage)

  console.log('OG creado:', path.relative(projectRoot, outImage))
}

main().catch((e) => { console.error(e); process.exit(1) })
