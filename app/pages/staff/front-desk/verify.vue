<script setup lang="ts">
import type { VoucherVerificationResult } from '~/types/operations'
import { formatMoney, rupiah } from '~/utils/money'
import { operationsMessage } from '~/utils/operations'

definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Verifikasi Voucher' })

const client = useOperationsClient()
const refCode = ref('')
const token = ref('')
const bookingId = ref('')
const rawInput = ref('')
const verifying = ref(false)
const error = ref('')
const verifiedData = ref<VoucherVerificationResult | null>(null)

function parseRawInput() {
  const input = rawInput.value.trim()
  if (!input) return

  // Cek jika input adalah URL atau query string
  try {
    const url = input.includes('?') ? new URL(input.startsWith('http') ? input : `http://dummy.local/${input}`) : null
    if (url) {
      const qRef = url.searchParams.get('ref')
      const qToken = url.searchParams.get('token')
      const qId = url.searchParams.get('id')
      if (qRef) refCode.value = qRef
      if (qToken) token.value = qToken
      if (qId) bookingId.value = qId
      return
    }
  }
  catch {
    // Abaikan jika bukan format URL
  }

  const parts = input.split(/\s+/)
  if (parts.length >= 2 && parts[0] && parts[1]) {
    refCode.value = parts[0]
    token.value = parts[1]
    if (parts[2]) bookingId.value = parts[2]
  }
}

async function verify() {
  if (!refCode.value.trim() || !token.value.trim()) {
    error.value = 'Kode referensi dan tanda tangan token wajib diisi.'
    return
  }

  verifying.value = true
  error.value = ''
  verifiedData.value = null

  try {
    const result = await client.verifyVoucher({
      ref: refCode.value.trim(),
      token: token.value.trim(),
      id: bookingId.value.trim() || undefined,
    })
    verifiedData.value = result
  }
  catch (cause) {
    error.value = operationsMessage(cause, 'Verifikasi voucher gagal atau tanda tangan tidak sah.')
  }
  finally {
    verifying.value = false
  }
}

function reset() {
  refCode.value = ''
  token.value = ''
  bookingId.value = ''
  rawInput.value = ''
  error.value = ''
  verifiedData.value = null
}
</script>

<template>
  <div class="container ops-page">
    <StaffPageHeader
      eyebrow="Front desk check-in"
      title="Verifikasi Voucher"
      description="Validasi keaslian tanda tangan kriptografis QR voucher saat tamu tiba di resepsionis."
    >
      <template #nav>
        <div class="ops-subnav">
          <NuxtLink to="/staff/front-desk">Roster</NuxtLink>
          <NuxtLink to="/staff/front-desk/handover">Handover</NuxtLink>
          <NuxtLink to="/staff/front-desk/verify">Verifikasi Voucher</NuxtLink>
        </div>
      </template>
    </StaffPageHeader>

    <UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert>

    <div class="ops-split">
      <section class="panel stack">
        <p class="eyebrow">Pindai / Masukkan Token</p>
        <h2>Form Validasi Voucher</h2>

        <div class="field">
          <label for="raw-input">Scan QR / Tempel URL Voucher</label>
          <input
            id="raw-input"
            v-model="rawInput"
            type="text"
            placeholder="Tempel teks QR atau URL verify-voucher di sini…"
            @input="parseRawInput"
          >
          <small class="muted">Mendukung format URL QR voucher atau pasangan referensi dan token.</small>
        </div>

        <form class="stack" @submit.prevent="verify">
          <div class="field">
            <label for="ref-code">Referensi Booking *</label>
            <input
              id="ref-code"
              v-model="refCode"
              type="text"
              required
              placeholder="Contoh: PKU-20261003-BKE2E001"
            >
          </div>

          <div class="field">
            <label for="token-code">Token Tanda Tangan Digital *</label>
            <input
              id="token-code"
              v-model="token"
              type="text"
              required
              placeholder="Signature hash token voucher"
            >
          </div>

          <div class="field">
            <label for="booking-id">ID Booking (Opsional)</label>
            <input
              id="booking-id"
              v-model="bookingId"
              type="text"
              placeholder="Contoh: bk-e2e-001"
            >
          </div>

          <div class="ops-actions">
            <BrandButton type="submit" dark :loading="verifying">
              Verifikasi Keaslian
            </BrandButton>
            <BrandButton type="button" :disabled="verifying" @click="reset">
              Reset
            </BrandButton>
          </div>
        </form>
      </section>

      <aside class="stack">
        <div v-if="verifiedData" class="panel stack verified-card">
          <div class="verified-card__header">
            <span class="badge badge--success">✓ Terverifikasi Asli</span>
            <p class="eyebrow">{{ verifiedData.verificationStatus }}</p>
          </div>

          <h2>{{ verifiedData.guestName }}</h2>
          <p class="muted">{{ verifiedData.reference }} · ID: {{ verifiedData.bookingId }}</p>

          <div class="ops-details-grid">
            <div>
              <span class="muted-label">Tipe Kamar</span>
              <strong>{{ verifiedData.roomTypeName }}</strong>
            </div>
            <div>
              <span class="muted-label">Kamar / Tamu</span>
              <strong>{{ verifiedData.numRooms }} kamar · {{ verifiedData.numGuests }} tamu</strong>
            </div>
            <div>
              <span class="muted-label">Jadwal Menginap</span>
              <strong>{{ verifiedData.checkIn }} s/d {{ verifiedData.checkOut }}</strong>
            </div>
            <div>
              <span class="muted-label">Total Terbayar</span>
              <strong>{{ formatMoney(rupiah(verifiedData.totalPaidIdr)) }}</strong>
            </div>
            <div>
              <span class="muted-label">Kontak Tamu</span>
              <p>{{ verifiedData.guestEmail }}<br>{{ verifiedData.guestPhone }}</p>
            </div>
            <div>
              <span class="muted-label">Status Reservasi</span>
              <StaffStatusBadge :label="verifiedData.status" status="inspected" />
            </div>
          </div>

          <BrandButton
            v-if="verifiedData.bookingId"
            :to="`/staff/bookings/${verifiedData.bookingId}/stay`"
            class="verified-action"
          >
            Lanjut ke Stay Operations & Penugasan Kamar →
          </BrandButton>
        </div>

        <div v-else class="panel stack placeholder-panel">
          <p class="eyebrow">Petunjuk Verifikasi</p>
          <h3>Validasi Tanda Tangan QR</h3>
          <p class="muted">
            Voucher resmi tamu dilengkapi QR code anti-pemalsuan berbasis kriptografi HMAC. Gunakan barcode scanner atau masukkan kode referensi dan token untuk memverifikasi keabsahan reservasi saat proses check-in.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.verified-card {
  border: 2px solid var(--accent);
  background: var(--soft);
}
.verified-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge--success {
  background: #198754;
  color: #fff;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
}
.ops-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-block: 12px;
}
.muted-label {
  display: block;
  font-size: 0.78rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  margin-bottom: 2px;
}
.verified-action {
  margin-top: 12px;
}
.placeholder-panel {
  color: var(--muted);
}
</style>
