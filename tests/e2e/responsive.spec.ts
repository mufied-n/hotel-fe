import { mkdirSync } from 'node:fs'
import { expect, test } from '@playwright/test'

const evidenceDir = 'docs/qa/redesign/evidence/2026-10-04-responsive'
const cases = [
  { label: 'mobile-small', width: 360, height: 800, routes: ['/booking/results?v=1&check_in=2026-10-04&check_out=2026-10-05&guests=1', '/staff/housekeeping'] },
  { label: 'mobile', width: 390, height: 844, routes: ['/booking/rooms/deluxe-king-balcony?v=1&check_in=2026-10-04&check_out=2026-10-05&guests=1', '/staff/rates'] },
  { label: 'tablet-portrait', width: 768, height: 1024, routes: ['/booking/results?v=1&check_in=2026-10-04&check_out=2026-10-05&guests=1', '/staff/rates'] },
  { label: 'tablet-landscape', width: 1024, height: 768, routes: ['/staff/housekeeping', '/staff/finance/cases'] },
  { label: 'desktop', width: 1440, height: 900, routes: ['/booking/results?v=1&check_in=2026-10-04&check_out=2026-10-05&guests=1', '/staff/channels'] },
  { label: 'zoom-pressure', width: 640, height: 800, routes: ['/staff/housekeeping', '/staff/rates'] },
]

for (const scenario of cases) {
  test(`keeps representative layouts within ${scenario.label}`, async ({ page }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const [index, route] of scenario.routes.entries()) {
      await page.goto(route)
      await expect(page.locator('html')).toHaveAttribute('data-nuxt-ready', 'true')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      if (route.startsWith('/booking/results')) await expect(page.locator('.room-card').first()).toBeVisible()
      if (route === '/staff/housekeeping') await expect(page.getByText('6 kamar pada hasil filter.')).toBeVisible()
      if (route === '/staff/finance/cases') await expect(page.getByText('demo-late-001')).toBeVisible()
      if (route === '/staff/channels') await expect(page.getByRole('heading', { name: 'Direct booking' })).toBeVisible()
      if (route === '/staff/rates') await expect(page.getByRole('heading', { name: 'Room Only' })).toBeVisible()
      const dimensions = await page.evaluate(() => ({ documentWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth, bodyWidth: document.body.scrollWidth }))
      expect(dimensions.documentWidth, `${route} document overflow`).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
      expect(dimensions.bodyWidth, `${route} body overflow`).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
      if (process.env.CAPTURE_RESPONSIVE_EVIDENCE === '1') {
        mkdirSync(evidenceDir, { recursive: true })
        const slug = route.startsWith('/staff') ? route.slice(1).replaceAll('/', '-') : `guest-${index + 1}`
        await page.screenshot({ path: `${evidenceDir}/${scenario.label}-${slug}.jpg`, fullPage: true, type: 'jpeg', quality: 72 })
      }
    }
  })
}
