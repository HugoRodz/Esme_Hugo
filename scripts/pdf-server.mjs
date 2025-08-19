import express from 'express'
import playwright from 'playwright'
import url from 'url'
import path from 'path'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 4410

// simple request logger to help debugging
app.use((req, res, next) => {
  try { console.log('REQ>', req.method, req.originalUrl || req.url) } catch (e) {}
  next()
})

app.get('/api/pdf', async (req, res) => {
  const query = req.query || {}
  const invite = String(query.invite || '5')
  const code = String(query.code || '001')
  // try to use local dev server if available
  const baseHosts = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174']

  // pick first reachable
  let base = null
  for (const b of baseHosts) {
    try {
      // quick HEAD
    const resp = await (await import('node-fetch')).default(b)
    if (resp && resp.status < 500) { base = b; break }
    } catch (e) {}
  }
  if (!base) base = null

  // decide page URL: prefer base dev server, otherwise fallback to local static test file
  const fallbackPath = path.join(process.cwd(), 'tmp', 'invite-test.html')
  const fallbackExists = fs.existsSync(fallbackPath)
  const fallbackUrl = `file://${fallbackPath}`
  if (!fallbackExists) console.warn('fallback test file missing at', fallbackPath)
  // prefer dev server if available, otherwise explicit fallback file URL
  const pageUrl = base ? (base + '/') : fallbackUrl
  console.log('base host detected =', base)
  console.log('fallbackUrl =', fallbackUrl)
  console.log('rendering invite', invite, 'from', pageUrl, '(fallbackExists=' + fallbackExists + ')')

  let browser
  try {
    browser = await playwright.chromium.launch({ headless: true })
  } catch (e) {
    console.error('failed to launch Chromium via Playwright:', e.message)
    res.status(500).send('Server misconfiguration: failed to launch headless Chromium: ' + e.message)
    return
  }
  const context = await browser.newContext({ viewport: { width: 800, height: 1200 } })
  const page = await context.newPage()
  page.on('console', m => console.log('PW>', m.type(), m.text()))

  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 15000 })
  } catch (e) {
    console.warn('initial goto failed', e.message)
    // fallback: try a static test file shipped with the repo (explicit path)
    try {
      if (!fallbackExists) throw new Error('fallback file missing: ' + fallbackPath)
      console.log('Attempting explicit fallback to', fallbackUrl)
      await page.goto(fallbackUrl, { waitUntil: 'networkidle', timeout: 15000 })
    } catch (e2) {
      console.error('fallback goto failed', e2.message)
      await browser.close()
      res.status(500).send(`PDF render failed: navigation error: ${e2.message}`)
      return
    }
  }

  // inject localStorage values then reload to ensure resolved card
  await page.evaluate(({ invite, code }) => {
    try { localStorage.setItem('invite-number', invite) } catch (e) {}
    try { localStorage.setItem('invite-code', code) } catch (e) {}
  }, { invite, code })

  await page.reload({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {})

  // wait for card
  try { await page.waitForSelector('[data-invite-card]', { timeout: 5000 }) } catch (e) { }

  // option: wait a short time for fonts
  await page.waitForTimeout(600)

  // set pdf size for A6 in mm
  const mmToPx = mm => Math.round(mm * (96/25.4))
  const widthPx = mmToPx(105)
  const heightPx = mmToPx(148)

  // set viewport to target size for good rendering
  await page.setViewportSize({ width: Math.max(600, widthPx), height: Math.max(800, heightPx) })

  // capture screenshot into pdf using page.pdf
  let pdfBuffer
  try {
    pdfBuffer = await page.pdf({ width: '105mm', height: '148mm', printBackground: true, margin: { top: '6mm', bottom: '6mm', left: '6mm', right: '6mm' } })
  } catch (e) {
    console.error('page.pdf failed', e.message)
    await browser.close()
    res.status(500).send(`PDF generation failed: ${e.message}`)
    return
  }

  await browser.close()

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename=invite-${invite}.pdf`)
  res.send(pdfBuffer)
})

// simple health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, ts: Date.now(), pid: process.pid })
})

app.listen(port, () => console.log('PDF server listening on', port))
