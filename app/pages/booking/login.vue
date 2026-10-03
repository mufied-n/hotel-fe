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
  pending.value = true; error.value = ''
  try { await verify(email.value.trim().toLowerCase(), code.value); await navigateTo(returnTo.value) }
  catch (cause) { error.value = readable(cause) }
  finally { pending.value = false }
}
</script>

<template>
  <div class="container auth-page">
    <div class="auth-copy"><p class="eyebrow">Akses penghuni</p><h1>Masuk dengan email booking.</h1><p>Kode verifikasi berlaku singkat. Token sesi disimpan pada cookie HttpOnly dan tidak ditampilkan di browser.</p></div>
    <form v-if="step === 'email'" class="panel stack" novalidate @submit.prevent="sendCode">
      <UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert>
      <UiFormField id="login-email" label="Email booking"><template #default="{ describedby }"><input id="login-email" v-model.trim="email" type="email" autocomplete="email" required maxlength="254" :aria-describedby="describedby"></template></UiFormField>
      <BrandButton type="submit" :disabled="pending">{{ pending ? 'Meminta kode…' : 'Kirim kode verifikasi' }}</BrandButton>
    </form>
    <form v-else class="panel stack" novalidate @submit.prevent="submitCode">
      <p>Kode dikirim ke <strong>{{ email }}</strong>.</p><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert>
      <UiFormField id="login-code" label="Kode 6 digit"><template #default="{ describedby }"><input id="login-code" v-model.trim="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" :aria-describedby="describedby"></template></UiFormField>
      <BrandButton type="submit" :disabled="pending || !/^\d{6}$/.test(code)">{{ pending ? 'Memverifikasi…' : 'Masuk' }}</BrandButton>
      <button class="text-action" type="button" :disabled="cooldown > 0" @click="sendCode">{{ cooldown > 0 ? `Kirim ulang dalam ${cooldown} detik` : 'Kirim ulang kode' }}</button>
      <button class="text-action" type="button" @click="step = 'email'; code = ''; error = ''">Ganti email</button>
    </form>
  </div>
</template>

<style scoped>.auth-page { max-width: 900px; display: grid; gap: 32px; }.auth-copy h1 { max-width: 750px; }.text-action { border: 0; background: none; text-decoration: underline; cursor: pointer; }.text-action:disabled { opacity: .5; cursor: default; } @media (min-width: 800px) { .auth-page { grid-template-columns: 1fr 1fr; align-items: start; } }</style>
