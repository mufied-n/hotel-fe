<script setup lang="ts">
import { samplePromos } from '~/data/management-scenarios'
import type { PromoSnapshot } from '~/types/management'

definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Promo preview' })

const promos = ref(structuredClone(samplePromos))
const editingIndex = ref<number | null>(null)

const defaultDraft: PromoSnapshot = {
  code: '',
  type: 'percent',
  value: 10,
  status: 'scheduled',
  startsAt: '2026-10-04',
  endsAt: '2026-10-31',
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
  && draft.startsAt < draft.endsAt,
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
  ]
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

function deletePromo(index: number) {
  const target = promos.value[index]
  if (!target) return
  if (window.confirm(`Hapus promo ${target.code} dari daftar simulasi?`)) {
    promos.value.splice(index, 1)
    if (editingIndex.value === index) {
      newPromo()
    }
    else if (editingIndex.value !== null && editingIndex.value > index) {
      editingIndex.value--
    }
    notice.value = `Promo ${target.code} berhasil dihapus dari simulasi.`
  }
}

function discard() {
  Object.assign(draft, restore())
  notice.value = editingIndex.value !== null ? 'Perubahan promo dibuang.' : 'Draft promo dibuang.'
}

function save() {
  const code = draft.code.toUpperCase()
  const payload = { ...structuredClone(toRaw(draft)), code }

  if (editingIndex.value !== null && promos.value[editingIndex.value]) {
    promos.value[editingIndex.value] = payload
    notice.value = `Promo ${code} berhasil diperbarui (simulasi).`
  }
  else {
    promos.value.unshift(payload)
    editingIndex.value = 0
    notice.value = `Promo baru ${code} berhasil dibuat (simulasi).`
  }

  accept()
  review.value = false
}

onBeforeRouteLeave(() => !dirty.value || window.confirm('Tinggalkan editor dan buang perubahan promo?'))
</script>

<template>
  <div class="container ops-page">
    <StaffPageHeader
      eyebrow="Revenue workspace"
      title="Promo"
      description="Jadwal, nilai, dan status promo ditinjau sebelum diterapkan ke pricing."
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
      Validasi kode promo pada quote publik tetap menjadi sumber harga final. Management di sini adalah simulasi revenue workspace.
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
          :key="`${promo.code}-${promo.startsAt}`"
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
            </div>
            <StaffStatusBadge :label="promo.status" :status="promo.status" />
          </div>

          <p>
            <strong>{{ promo.type === 'percent' ? `${promo.value}%` : `IDR ${promo.value.toLocaleString('id-ID')}` }}</strong>
            · {{ promo.startsAt }} s.d. {{ promo.endsAt }}
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
              class="card-action-btn card-action-btn--delete"
              @click.stop="deletePromo(index)"
            >
              🗑 Hapus
            </button>
          </div>
        </article>
      </section>

      <form class="panel stack promo-form" @submit.prevent="review = true">
        <div class="form-header">
          <h2>{{ editingIndex !== null ? `Edit Promo: ${promos[editingIndex]?.code}` : 'Buat Promo Sample' }}</h2>
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
            required
            maxlength="24"
            placeholder="Contoh: OCTOBREAK"
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
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

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

        <div class="two-col">
          <div class="field">
            <label for="promo-start">Mulai Berlaku</label>
            <input id="promo-start" v-model="draft.startsAt" type="date" required>
          </div>
          <div class="field">
            <label for="promo-end">Selesai</label>
            <input id="promo-end" v-model="draft.endsAt" type="date" :min="draft.startsAt" required>
          </div>
        </div>

        <UiInlineAlert v-if="dirty && !valid" tone="error">
          Lengkapi kode, nilai diskon, dan rentang tanggal yang valid.
        </UiInlineAlert>

        <div class="ops-actions">
          <BrandButton type="submit" dark :disabled="!dirty || !valid">
            {{ editingIndex !== null ? 'Tinjau Perubahan' : 'Tinjau Promo' }}
          </BrandButton>
          <BrandButton :disabled="!dirty" @click="discard">
            Buang Perubahan
          </BrandButton>
        </div>
      </form>
    </div>

    <StaffActionDialog
      id="promo-review"
      :open="review"
      :title="editingIndex !== null ? 'Konfirmasi Perubahan Promo' : 'Konfirmasi Promo Sample Baru'"
      @close="review = false"
    >
      <StaffChangeReview :items="reviewItems" />
      <UiInlineAlert tone="info">
        Stacking, blackout date, dan usage limit belum memiliki kontrak backend di lingkungan uji.
      </UiInlineAlert>
      <template #actions>
        <BrandButton dark @click="save">
          Simpan Simulasi
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
.card-action-btn--delete {
  color: #c92a2a;
  margin-left: auto;
}
.card-action-btn--delete:hover {
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
