import { expect, test } from '@playwright/test'

test('redirects the root directly to the booking webapp', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/booking$/)
  await expect(page.getByRole('heading', { name: 'Temukan ruang untuk pulang.' })).toBeVisible()
})

test('navigates a complete single-room demo flow', async ({ page }) => {
  await page.goto('/booking')
  await expect(page.locator('html')).toHaveAttribute('data-nuxt-ready', 'true')
  await page.getByRole('button', { name: 'Cari kamar' }).click()
  await expect(page.getByRole('heading', { name: 'Pilih kamar.' })).toBeVisible()
  const firstCard = page.locator('.room-card').first()
  await firstCard.getByLabel('Varian / tempat tidur').selectOption('deluxe-king-bay')
  await firstCard.getByLabel('Room Only').check()
  await firstCard.getByRole('button', { name: 'Pilih kamar & paket' }).click()
  await page.getByRole('button', { name: 'Lanjut ke detail tamu' }).click()
  await page.getByLabel('Nama lengkap').fill('Tamu Demo')
  await page.getByLabel('Email').fill('demo@example.test')
  await page.getByRole('button', { name: 'Tinjau booking' }).click()
  await page.getByLabel(/Saya membaca/).check()
  await page.getByLabel(/Saya menyetujui pemrosesan data/).check()
  await page.getByRole('button', { name: 'Simulasikan booking' }).click()
  await expect(page.getByRole('heading', { name: 'Menunggu pembayaran demo' })).toBeVisible()
})

test('restores search from the URL and rejects invalid query', async ({ page }) => {
  await page.goto('/booking/results?v=1&check_in=2026-10-03&check_out=2026-10-04&guests=2:7')
  await expect(page.locator('html')).toHaveAttribute('data-nuxt-ready', 'true')
  await expect(page.getByText('Pilih satu varian & paket')).toBeVisible()
  await page.goto('/booking/results?check_in=nope')
  await expect(page.getByText(/URL pencarian tidak valid/)).toBeVisible()
})
