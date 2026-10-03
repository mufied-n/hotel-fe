<script setup lang="ts">
import type { StaffPreviewRole } from '~/types/management'
import { staffRoleLabels } from '~/composables/useStaffPreview'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Staff preview login' })
const route = useRoute(); const session = useStaffSession(); const selected = ref<StaffPreviewRole>('gm_admin'); const preview = useStaffPreview()
const credentials = reactive({ username: '', password: '' }); const busy = ref(false); const error = ref('')
function safeReturnTo() { const value = String(route.query.returnTo || '/staff'); return value.startsWith('/staff') && !value.startsWith('//') ? value : '/staff' }
async function enter() {
  if (!session.apiMode.value) { preview.enter(selected.value); await navigateTo('/staff/front-desk'); return }
  busy.value = true; error.value = ''
  try { await session.login(credentials.username, credentials.password); await navigateTo(safeReturnTo()) }
  catch (cause) { const value = cause as { statusMessage?: string, data?: { statusMessage?: string } }; error.value = value.data?.statusMessage || value.statusMessage || 'Sesi staff belum dapat dibuat.' }
  finally { busy.value = false }
}
</script>
<template><div class="container ops-page staff-login"><header><p class="eyebrow">Staff identity</p><h1>Masuk workspace staff.</h1><p class="muted">Akses mengikuti peran yang disimpan oleh sistem hotel.</p></header><UiInlineAlert v-if="error" tone="error" live>{{ error }}</UiInlineAlert><UiInlineAlert v-if="!session.apiMode.value" tone="info">Mode sample. Pilihan peran hanya berlaku pada browser ini dan tidak membuat sesi backend.</UiInlineAlert><form class="panel stack" @submit.prevent="enter"><template v-if="session.apiMode.value"><div class="field"><label for="staff-username">Username</label><input id="staff-username" v-model.trim="credentials.username" autocomplete="username" required /></div><div class="field"><label for="staff-password">Password</label><input id="staff-password" v-model="credentials.password" type="password" autocomplete="current-password" required /></div></template><div v-else class="field"><label for="preview-role">Peran sample</label><select id="preview-role" v-model="selected"><option v-for="(label, value) in staffRoleLabels" :key="value" :value="value">{{ label }}</option></select></div><BrandButton type="submit" dark :loading="busy" loading-label="Memeriksa sesi…">{{ session.apiMode.value ? 'Masuk' : 'Masuk preview' }}</BrandButton></form></div></template>
<style scoped>.staff-login { width: min(calc(100% - 32px), 680px); padding-top: clamp(16px, 5vw, 64px); }.staff-login :deep(.panel) { background: #fff; border: 1px solid var(--line); }</style>
