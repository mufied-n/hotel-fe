<script setup lang="ts">
import { samplePromos } from '~/data/management-scenarios'
import type { PromoSnapshot } from '~/types/management'

definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Promo Management' })

interface BackendPromoItem {
  id: string
  code: string
  name: string
  discount_type: 'PERCENT' | 'FIXED'
  discount_value: number
  max_discount_idr?: number | null
  min_stay_nights?: number
  quota_total: number
  quota_used: number
  valid_from: string
  valid_to: string
  is_active: boolean
}

const promos = ref<PromoSnapshot[]>(structuredClone(samplePromos))
const editingIndex = ref<number | null>(null)
const loading = ref(false)

const defaultDraft: PromoSnapshot = {
  code: '',
  name: '',
  type: 'percent',
  value: 10,
  status: 'active',
  startsAt: new Date().toISOString().split('T')[0] || '2026-10-01',
  endsAt: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] || '2026-10-31',
  quotaTotal: 100,
  quotaUsed: 0,
}

const draft = reactive<PromoSnapshot>(structuredClone(defaultDraft))
const { dirty, accept, restore } = useUnsavedChanges(() => draft)
const notice = ref('')
const review = ref(false)

const valid = computed(() =>
  draft.code.trim().length > 0
  && draft.code.length <= 24
  && draft.value > 0
  && (draft.type !== 'percent' || draft.value <= 100)
  && draft.startsAt <= draft.endsAt,
)

const activeOriginal = computed(() => {
  if (editingIndex.value !== null && promos.value[editingIndex.value]) {
    return promos.value[editingIndex.value]
  }
  return null
})

const reviewItems = computed(() => {
  const orig = activeOriginal.value
  const beforeCode = orig ? orig.code : 'Promo baru'
  const beforeVal = orig ? (orig.type === 'percent' ? `${orig.value}%` : `IDR ${orig.value.toLocaleString('id-ID')}`) : '—'
  const beforeStatus = orig ? orig.status : '—'
  const beforePeriod = orig ? `${orig.startsAt}–${orig.endsAt}` : '—'

  return [
    { label: 'Kode', before: beforeCode, after: draft.code.toUpperCase() },
    { label: 'Nilai', before: beforeVal, after: draft.type === 'percent' ? `${draft.value}%` : `IDR ${draft.value.toLocaleString('id-ID')}` },
    { label: 'Status', before: beforeStatus, after: draft.status },
    { label: 'Periode', before: beforePeriod, after: `${draft.startsAt}–${draft.endsAt}` },
    { label: 'Kuota', before: orig ? `${orig.quotaTotal || 100}` : '—', after: `${draft.quotaTotal || 100}` },
  ]
})

async function loadPromos() {
  try {
    const res = await $fetch<{ items?: BackendPromoItem[] }>('/api/bff/staff/revenue/promos')
    if (res?.items && Array.isArray(res.items) && res.items.length > 0) {
      promos.value = res.items.map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        type: p.discount_type === 'PERCENT' ? 'percent' : 'fixed',
        value: p.discount_value,
        status: p.is_active ? 'active' : 'expired',
        startsAt: (p.valid_from ? p.valid_from.split('T')[0] : '2026-10-01') || '2026-10-01',
        endsAt: (p.valid_to ? p.valid_to.split('T')[0] : '2026-10-31') || '2026-10-31',
        quotaTotal: p.quota_total,
        quotaUsed: p.quota_used,
      }))
    }
  }
  catch {
    // Keep initial fallback if offline
  }
}

onMounted(() => {
  loadPromos()
})

function selectPromo(index: number) {
  if (editingIndex.value === index) return
  if (dirty.value && !window.confirm('Buang perubahan draft saat ini untuk mengedit promo lain?')) return

  const target = promos.value[index]
  if (target) {
    editingIndex.value = index
    Object.assign(draft, structuredClone(toRaw(target)))
    accept()
    notice.value = `Mengedit promo ${target.code}.`
  }
}

function newPromo() {
  if (dirty.value && !window.confirm('Buang perubahan yang belum disimpan?')) return
  editingIndex.value = null
  Object.assign(draft, structuredClone(defaultDraft))
  accept()
  notice.value = 'Mode pembuatan promo baru.'
}

async function togglePromoStatus(index: number) {
  const target = promos.value[index]
  if (!target) return
  const newActive = target.status !== 'active'
  const newStatus = newActive ? 'active' : 'expired'

  if (target.id) {
    try {
      loading.value = true
      await $fetch(`/api/bff/staff/revenue/promos/${target.id}`, {
        method: 'PUT',
        headers: { 'X-Pulang-CSRF': '1' },
        body: {
          is_active: newActive,
          quota_total: target.quotaTotal || 100,
        },
      })
      target.status = newStatus
      notice.value = `Status promo ${target.code} berhasil diubah menjadi ${newActive ? 'Aktif' : 'Nonaktif'}.`
      await loadPromos()
    }
    catch (err: unknown) {
      const e = err as { data?: { message?: string }, message?: string }
      notice.value = `Gagal mengubah status promo: ${e?.data?.message || e?.message || 'Error backend'}`
    }
    finally {
      loading.value = false
    }
  }
  else {
    target.status = newStatus
    notice.value = `Status promo ${target.code} diubah menjadi ${newActive ? 'Aktif' : 'Nonaktif'} (simulasi).`
  }
}

function discard() {
  Object.assign(draft, restore())
  notice.value = editingIndex.value !== null ? 'Perubahan promo dibuang.' : 'Draft promo dibuang.'
}

async function save() {
  const code = draft.code.toUpperCase()
  loading.value = true
  const isActive = draft.status === 'active' || draft.status === 'scheduled'

  try {
    if (editingIndex.value !== null && promos.value[editingIndex.value]?.id && !promos.value[editingIndex.value]?.id?.startsWith('sample-')) {
      const targetId = promos.value[editingIndex.value]!.id!
      await $fetch(`/api/bff/staff/revenue/promos/${targetId}`, {
        method: 'PUT',
        headers: { 'X-Pulang-CSRF': '1' },
        body: {
          is_active: isActive,
          quota_total: Number(draft.quotaTotal || 100),
        },
      })
      notice.value = `Promo ${code} berhasil diperbarui di database backend!`
      await loadPromos()
    }
    else if (editingIndex.value === null) {
      await $fetch('/api/bff/staff/revenue/promos', {
        method: 'POST',
        headers: { 'X-Pulang-CSRF': '1' },
        body: {
          code,
          name: draft.name || code,
          discount_type: draft.type === 'percent' ? 'PERCENT' : 'FIXED',
          discount_value: Number(draft.value),
          valid_from: `${draft.startsAt}T00:00:00Z`,
          valid_to: `${draft.endsAt}T23:59:59Z`,
          quota_total: Number(draft.quotaTotal || 100),
        },
      })
      notice.value = `Promo baru ${code} berhasil dibuat dan tersimpan ke backend!`
      await loadPromos()
    }
    else {
      throw new Error('Simulation')
    }
  }
  catch {
    if (editingIndex.value !== null && promos.value[editingIndex.value]) {
      Object.assign(promos.value[editingIndex.value]!, {
        name: draft.name,
        type: draft.type,
        value: Number(draft.value),
        status: draft.status,
        startsAt: draft.startsAt,
        endsAt: draft.endsAt,
        quotaTotal: Number(draft.quotaTotal || 100),
      })
      notice.value = `Promo ${code} berhasil diperbarui (simulasi).`
    }
    else {
      promos.value.unshift({
        id: `sample-${Date.now()}`,
        code,
        name: draft.name || code,
        type: draft.type,
        value: Number(draft.value),
        status: draft.status,
        startsAt: draft.startsAt,
        endsAt: draft.endsAt,
        quotaTotal: Number(draft.quotaTotal || 100),
        quotaUsed: 0,
      })
      notice.value = `Promo baru ${code} berhasil dibuat (simulasi).`
    }
  }
  finally {
    accept()
    review.value = false
    loading.value = false
  }
}

onBeforeRouteLeave(() => !dirty.value || window.confirm('Tinggalkan editor dan buang perubahan promo?'))
</script>

<template>
  <div class="container ops-page">
    <StaffPageHeader
      eyebrow="Revenue workspace"
      title="Promo"
      description="Jadwal, nilai, kuota, dan status promo ditinjau sebelum diterapkan ke pricing engine."
    >
      <template #nav>
        <div class="ops-subnav">
          <NuxtLink to="/staff/rates">Rate plans</NuxtLink>
          <NuxtLink to="/staff/promos">Promo</NuxtLink>
        </div>
      </template>
      <template #actions>
        <StaffStatusBadge v-if="dirty" label="Belum disimpan" status="pending" />
      </template>
    </StaffPageHeader>

    <UiInlineAlert tone="info">
      Sistem promosi terhubung langsung dengan backend Revenue Pricing Engine. Perubahan status dan kuota akan langsung memengaruhi validasi quote publik.
    </UiInlineAlert>

    <UiInlineAlert v-if="notice" tone="info" live>
      {{ notice }}
    </UiInlineAlert>

    <div class="ops-split">
      <section class="stack">
        <div class="list-heading">
          <h2>Daftar Promo ({{ promos.length }})</h2>
          <BrandButton v-if="editingIndex !== null" class="new-promo-btn" @click="newPromo">
            + Buat Promo Baru
          </BrandButton>
        </div>

        <article
          v-for="(promo, index) in promos"
          :key="promo.id || `${promo.code}-${promo.startsAt}`"
          class="ops-card ops-card--interactive"
          :class="{ 'ops-card--selected': editingIndex === index }"
          tabindex="0"
          role="button"
          :aria-label="`Pilih promo ${promo.code} untuk diedit`"
          @click="selectPromo(index)"
          @keydown.enter.prevent="selectPromo(index)"
          @keydown.space.prevent="selectPromo(index)"
        >
          <div class="ops-card__top">
            <div>
              <span v-if="editingIndex === index" class="editing-chip">Sedang Diedit</span>
              <h3>{{ promo.code }}</h3>
              <p v-if="promo.name" class="promo-name">{{ promo.name }}</p>
            </div>
            <StaffStatusBadge :label="promo.status === 'active' ? 'Aktif' : 'Nonaktif'" :status="promo.status" />
          </div>

          <p>
            <strong>{{ promo.type === 'percent' ? `${promo.value}%` : `IDR ${promo.value.toLocaleString('id-ID')}` }}</strong>
            · {{ promo.startsAt }} s.d. {{ promo.endsAt }}
          </p>

          <p v-if="promo.quotaTotal" class="quota-info">
            Kuota: <strong>{{ promo.quotaUsed || 0 }}</strong> / {{ promo.quotaTotal }} terpakai
          </p>

          <div class="ops-card__actions">
            <button
              type="button"
              class="card-action-btn card-action-btn--edit"
              @click.stop="selectPromo(index)"
            >
              {{ editingIndex === index ? '✓ Sedang Diedit' : '✎ Edit Promo' }}
            </button>
            <button
              type="button"
              class="card-action-btn card-action-btn--toggle"
              :class="{ 'card-action-btn--deactivate': promo.status === 'active' }"
              @click.stop="togglePromoStatus(index)"
            >
              {{ promo.status === 'active' ? '⏸ Nonaktifkan' : '▶ Aktifkan' }}
            </button>
          </div>
        </article>
      </section>

      <form class="panel stack promo-form" @submit.prevent="review = true">
        <div class="form-header">
          <h2>{{ editingIndex !== null ? `Edit Promo: ${promos[editingIndex]?.code}` : 'Buat Promo Baru' }}</h2>
          <button
            v-if="editingIndex !== null"
            type="button"
            class="switch-mode-btn"
            @click="newPromo"
          >
            Batal edit &amp; buat baru
          </button>
        </div>

        <div class="field">
          <label for="promo-code">Kode Promo</label>
          <input
            id="promo-code"
            v-model.trim="draft.code"
            :disabled="editingIndex !== null"
            required
            maxlength="24"
            placeholder="Contoh: OCTOBREAK"
            autocomplete="off"
          >
        </div>

        <div class="field">
          <label for="promo-name">Nama Kampanye Promo</label>
          <input
            id="promo-name"
            v-model.trim="draft.name"
            placeholder="Contoh: Diskon Menginap Awal Musim"
            autocomplete="off"
          >
        </div>

        <div class="two-col">
          <div class="field">
            <label for="promo-type">Tipe Diskon</label>
            <select id="promo-type" v-model="draft.type">
              <option value="percent">Persentase (%)</option>
              <option value="fixed">Nominal Tetap (IDR)</option>
            </select>
          </div>

          <div class="field">
            <label for="promo-status">Status Promo</label>
            <select id="promo-status" v-model="draft.status">
              <option value="active">Aktif (Active)</option>
              <option value="expired">Nonaktif (Inactive)</option>
            </select>
          </div>
        </div>

        <div class="two-col">
          <div class="field">
            <label for="promo-value">
              {{ draft.type === 'percent' ? 'Besaran Diskon (%)' : 'Besaran Diskon (IDR)' }}
            </label>
            <input
              id="promo-value"
              v-model.number="draft.value"
              type="number"
              min="1"
              :max="draft.type === 'percent' ? 100 : undefined"
              required
            >
          </div>

          <div class="field">
            <label for="promo-quota">Total Kuota Penggunaan</label>
            <input
              id="promo-quota"
              v-model.number="draft.quotaTotal"
              type="number"
              min="1"
              max="100000"
              required
            >
          </div>
        </div>

        <div class="two-col">
          <div class="field">
            <label for="promo-start">Mulai Berlaku</label>
            <input
              id="promo-start"
              v-model="draft.startsAt"
              type="date"
              required
            >
          </div>
          <div class="field">
            <label for="promo-end">Selesai</label>
            <input
              id="promo-end"
              v-model="draft.endsAt"
              type="date"
              :min="draft.startsAt"
              required
            >
          </div>
        </div>

        <UiInlineAlert v-if="dirty && !valid" tone="error">
          Lengkapi kode, nilai diskon, dan rentang tanggal yang valid.
        </UiInlineAlert>

        <div class="ops-actions">
          <BrandButton type="submit" dark :disabled="!dirty || !valid || loading">
            {{ editingIndex !== null ? 'Tinjau Perubahan' : 'Tinjau Promo' }}
          </BrandButton>
          <BrandButton :disabled="!dirty || loading" @click="discard">
            Buang Perubahan
          </BrandButton>
        </div>
      </form>
    </div>

    <StaffActionDialog
      id="promo-review"
      :open="review"
      :title="editingIndex !== null ? 'Konfirmasi Perubahan Promo' : 'Konfirmasi Pembuatan Promo Baru'"
      @close="review = false"
    >
      <StaffChangeReview :items="reviewItems" />
      <UiInlineAlert tone="info">
        Perubahan status aktif dan kuota akan langsung diterapkan ke sistem pricing backend secara real-time.
      </UiInlineAlert>
      <template #actions>
        <BrandButton dark :disabled="loading" @click="save">
          {{ loading ? 'Menyimpan...' : 'Simpan Simulasi' }}
        </BrandButton>
        <BrandButton @click="review = false">
          Kembali
        </BrandButton>
      </template>
    </StaffActionDialog>
  </div>
</template>

<style scoped>
.list-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.list-heading h2 {
  margin: 0;
  font-size: 1.25rem;
}
.new-promo-btn {
  font-size: 0.85rem;
  padding: 6px 14px;
}
.ops-card--interactive {
  cursor: pointer;
  transition: transform var(--motion-fast) var(--ease-standard), border-color var(--motion-fast) var(--ease-standard), box-shadow var(--motion-fast) var(--ease-standard);
}
.ops-card--interactive:hover {
  border-color: var(--brand);
}
.ops-card--selected {
  border-color: var(--brand);
  background: var(--soft-orange, #fff8f5);
  box-shadow: 0 4px 16px rgba(245, 129, 50, 0.16);
}
.editing-chip {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--brand);
  letter-spacing: 0.06em;
  margin-bottom: 2px;
}
.promo-name {
  font-size: 0.82rem;
  color: var(--text-muted, #666);
  margin: 2px 0 0 0;
}
.quota-info {
  font-size: 0.82rem;
  color: var(--text-muted, #666);
  margin-top: 4px;
}
.ops-card__actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
}
.card-action-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  border-radius: 6px;
  transition: background var(--motion-fast) var(--ease-standard);
}
.card-action-btn--edit {
  color: var(--brand);
}
.card-action-btn--edit:hover {
  background: rgba(245, 129, 50, 0.1);
}
.card-action-btn--toggle {
  color: #2b8a3e;
  margin-left: auto;
}
.card-action-btn--toggle:hover {
  background: #ebfbee;
}
.card-action-btn--deactivate {
  color: #c92a2a;
}
.card-action-btn--deactivate:hover {
  background: #ffe3e3;
}
.promo-form {
  position: sticky;
  top: 90px;
  align-self: start;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.form-header h2 {
  margin: 0;
}
.switch-mode-btn {
  background: none;
  border: none;
  color: var(--brand);
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}
</style>
