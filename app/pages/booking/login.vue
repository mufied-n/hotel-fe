<script setup lang="ts">
definePageMeta({ layout: 'booking' })
useSeoMeta({ title: 'Masuk penghuni' })
const route = useRoute()
const { profile, requestCode, verify } = useGuestSession()
const email = ref('')
const code = ref('')
const step = ref<'email' | 'code'>('email')
const pending = ref(false)
const error = ref('')
const cooldown = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
const returnTo = computed(() => {
  const value = typeof route.query.returnTo === 'string' ? route.query.returnTo : '/booking/my'
  return value.startsWith('/booking/') && !value.startsWith('//') ? value : '/booking/my'
})

onBeforeUnmount(() => clearInterval(timer))
onMounted(() => { if (profile.value) navigateTo(returnTo.value) })

function readable(cause: unknown) {
  const value = cause as { data?: { statusMessage?: string }, statusMessage?: string }
  return value.data?.statusMessage || value.statusMessage || 'Permintaan belum dapat diproses.'
}

async function sendCode() {
  if (pending.value) return
  pending.value = true; error.value = ''
  try {
    const result = await requestCode(email.value.trim().toLowerCase())
    step.value = 'code'; cooldown.value = result.cooldown_seconds
    clearInterval(timer); timer = setInterval(() => { if (cooldown.value > 0) cooldown.value-- }, 1000)
  }
  catch (cause) { error.value = readable(cause) }
  finally { pending.value = false }
}

async function submitCode() {
  if (pending.value) return
  pending.value = true; error.value = ''
  try { await verify(email.value.trim().toLowerCase(), code.value); await navigateTo(returnTo.value) }
  catch (cause) { error.value = readable(cause) }
  finally { pending.value = false }
}
function changeEmail() { clearInterval(timer); cooldown.value = 0; step.value = 'email'; code.value = ''; error.value = '' }
</script>

<template>
  <div class="container auth-page">
    <div class="auth-copy"><p class="eyebrow">Booking Saya</p><h1>Kembali ke rencana menginap Anda.</h1><p class="lede">Masukkan email yang digunakan saat booking. Kami akan mengirim kode singkat untuk membuka reservasi Anda.</p><p class="privacy-note">Kode hanya dipakai untuk memverifikasi akses ke booking.</p></div>
    <form v-if="step === 'email'" class="panel stack" novalidate @submit.prevent="sendCode">
      <UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert>
      <UiFormField id="login-email" label="Email booking"><template #default="{ describedby }"><input id="login-email" v-model.trim="email" type="email" autocomplete="email" required maxlength="254" :aria-describedby="describedby"></template></UiFormField>
      <BrandButton type="submit" :loading="pending" loading-label="Meminta kode…" slow-loading-label="Pengiriman memerlukan waktu…">Kirim kode verifikasi</BrandButton>
    </form>
    <form v-else class="panel stack" novalidate @submit.prevent="submitCode">
      <p class="eyebrow">Periksa email</p><h2>Masukkan kode 6 digit</h2><p>Kode dikirim ke <strong>{{ email }}</strong>.</p><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert>
      <UiFormField id="login-code" label="Kode 6 digit"><template #default="{ describedby }"><input id="login-code" v-model.trim="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" :aria-describedby="describedby"></template></UiFormField>
      <BrandButton type="submit" :disabled="!/^[0-9]{6}$/.test(code)" :loading="pending" loading-label="Memverifikasi…" slow-loading-label="Verifikasi memerlukan waktu…">Masuk</BrandButton>
      <button class="text-action" type="button" :disabled="cooldown > 0 || pending" @click="sendCode">{{ cooldown > 0 ? `Kirim ulang dalam ${cooldown} detik` : 'Kirim ulang kode' }}</button>
      <button class="text-action" type="button" :disabled="pending" @click="changeEmail">Ganti email</button>
    </form>
  </div>
</template>

<style scoped>.auth-page { max-width: 1020px; display: grid; gap: 34px; }.auth-copy { padding-block: 12px; }.auth-copy h1 { max-width: 750px; }.privacy-note { padding-left: 13px; border-left: 3px solid var(--brand); color: var(--muted); font-size: .9rem; }.auth-page form { border: 1px solid var(--line); background: #fff; box-shadow: var(--shadow-small); }.auth-page form h2 { font-size: clamp(2rem, 5vw, 3rem); }.text-action { border: 0; background: none; font-weight: 800; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; }.text-action:disabled { opacity: .5; cursor: default; } @media (min-width: 800px) { .auth-page { grid-template-columns: 1.05fr .95fr; align-items: start; }.auth-page form { margin-top: 24px; } }</style>
