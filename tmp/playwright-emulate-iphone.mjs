import playwright from 'playwright';
const { webkit, devices } = playwright;
const device = devices['iPhone 13'];

const urlsToTry = ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];

(async () => {
  for (const url of urlsToTry) {
    try {
      console.log('Trying', url)
      const browser = await webkit.launch({ headless: true })
      const context = await browser.newContext({ ...device })
      const page = await context.newPage()
      page.on('console', msg => console.log('PAGE LOG>', msg.type(), msg.text()))
      page.on('pageerror', err => console.log('PAGE ERROR>', err.message))
      page.on('dialog', async dialog => {
        console.log('DIALOG>', dialog.message())
        await dialog.dismiss()
      })

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 })
      } catch (e) {
        console.log('cannot reach', url, e.message)
        await browser.close()
        continue
      }

      // inject localStorage for invite #5 -> code 001
      await page.evaluate(() => {
        try { localStorage.setItem('invite-number', '5') } catch (e) {}
        try { localStorage.setItem('invite-code', '001') } catch (e) {}
      })

      await page.reload({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {})

      // try open the card: wait for the resolved mini-card to show "Bienvenido"
      try {
        await page.waitForSelector('text=Bienvenido', { timeout: 5000 })
        // click the small "Abrir" button that appears in the resolved card
        await page.click('button[title="Abrir"]', { timeout: 3000 })
      } catch (e) {
        // as a fallback try the envelope open control
        try { await page.click('button[aria-label="Abrir invitación"]', { timeout: 3000 }) } catch (e2) {}
      }

      // wait for the invite card to appear
      try {
        await page.waitForSelector('[data-invite-card]', { timeout: 5000 })
      } catch (e) {
        console.log('invite card not found after opening')
      }

      // click the download button
      try {
        await page.click('text=Descarga la tarjeta', { timeout: 5000 })
        console.log('Clicked download')
      } catch (e) {
        console.log('Could not click download button:', e.message)
      }

      // wait some seconds to capture any dialogs or console errors
      await page.waitForTimeout(5000)

      // save a screenshot for inspection
      await page.screenshot({ path: 'tmp/playwright-emulate-iphone-after.png', fullPage: true })

      await browser.close()
      console.log('Done for', url)
      process.exit(0)
    } catch (err) {
      console.error('run error', err)
    }
  }
  console.error('Could not reach any localhost dev server')
  process.exit(2)
})()
