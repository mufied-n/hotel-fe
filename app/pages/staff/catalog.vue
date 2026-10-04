<script setup lang="ts">
import type { BackendRoomVariant } from '~~/shared/types/backend'
import { roomVariants } from '~/data/rooms'
import { compressImage } from '~/utils/image-compress'
import { formatMoney, rupiah } from '~/utils/money'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Catalog management' })
const MAX_PHOTOS = 20
const apiMode = computed(() => useRuntimeConfig().public.operationsMode === 'api')
const rooms = ref<BackendRoomVariant[]>([]); const selectedId = ref(''); const loading = ref(false); const error = ref(''); const notice = ref('')
const saving = ref(false); const uploading = ref(false); const creating = ref(false)
function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) }
const blank = (): BackendRoomVariant => ({ id: '', code: '', name: '', family_name: '', bed_type: '', room_size_sqm: 0, max_capacity: 1, max_adults: 1, max_children: 0, description: '', base_price_minor: 0, amenities: [], photos: [] })
const draft = reactive<BackendRoomVariant>(blank())
const { dirty, accept, restore } = useUnsavedChanges(() => draft)
const amenitiesText = computed({ get: () => draft.amenities.join('\n'), set: (value: string) => { draft.amenities = value.split('\n').map(item => item.trim()).filter(Boolean) } })
const reviewItems = computed(() => {
  const current = rooms.value.find(item => item.id === selectedId.value)
  return current
    ? [
        { label: 'Nama', before: current.name, after: draft.name },
        { label: 'Kapasitas', before: String(current.max_capacity), after: String(draft.max_capacity) },
        { label: 'Harga dasar', before: formatMoney(rupiah(current.base_price_minor)), after: formatMoney(rupiah(draft.base_price_minor)) },
        { label: 'Fasilitas', before: current.amenities.join(', '), after: draft.amenities.join(', ') },
        { label: 'Foto', before: `${current.photos.length} foto`, after: `${draft.photos.length} foto` },
      ]
    : []
})
function mockRooms(): BackendRoomVariant[] { return roomVariants.map(room => ({ id: room.id, code: room.id, name: room.name, family_name: room.familyId, bed_type: room.bed, room_size_sqm: 0, max_capacity: room.capacity, max_adults: room.capacity, max_children: 0, description: 'Deskripsi sample mengikuti konten katalog booking.', base_price_minor: room.startingPrice?.amount || 0, amenities: [...room.features], photos: room.photos || (room.imageUrl ? [{ url: room.imageUrl, alt: room.imageAlt }] : []) })) }
function errorMessage(cause: unknown, fallback: string) {
  const value = cause as { statusMessage?: string, data?: { statusMessage?: string, message?: string }, message?: string }
  return value.data?.statusMessage || value.data?.message || value.statusMessage || value.message || fallback
}
function select(id: string, force = false) {
  if (dirty.value && !force && id !== selectedId.value && !window.confirm('Buang perubahan yang belum disimpan?')) return
  const room = rooms.value.find(item => item.id === id); if (!room) return
  creating.value = false
  selectedId.value = id; Object.assign(draft, clone(room)); accept(); notice.value = ''
}
function startCreate() {
  if (dirty.value && !window.confirm('Buang perubahan yang belum disimpan?')) return
  creating.value = true; selectedId.value = ''; Object.assign(draft, blank()); accept(); notice.value = ''
}
async function load(keepId = '') {
  loading.value = true; error.value = ''
  try {
    rooms.value = apiMode.value ? (await $fetch<{ total: number, rooms: BackendRoomVariant[] }>('/api/bff/staff/catalog/rooms')).rooms : mockRooms()
    const target = rooms.value.find(item => item.id === keepId) || rooms.value[0]
    if (target) select(target.id, true)
  }
  catch (cause) { error.value = errorMessage(cause, 'Katalog belum dapat dimuat.') }
  finally { loading.value = false }
}
function discard() { Object.assign(draft, restore()); notice.value = 'Perubahan yang belum disimpan dibuang.' }
function payload() { return { ...clone(draft), photos: draft.photos.map(photo => ({ url: photo.url.trim(), alt: photo.alt.trim() })) } }
async function save() {
  if (!apiMode.value) {
    const index = rooms.value.findIndex(item => item.id === selectedId.value); if (index >= 0) rooms.value[index] = clone(draft)
    accept(); notice.value = 'Perubahan katalog tersimpan pada simulasi browser ini. Quote live tidak berubah.'
    return
  }
  saving.value = true
  try {
    const headers = { 'X-Pulang-CSRF': '1' }
    const saved = creating.value
      ? await $fetch<BackendRoomVariant>('/api/bff/staff/catalog/rooms', { method: 'POST', headers, body: payload() })
      : await $fetch<BackendRoomVariant>(`/api/bff/staff/catalog/rooms/${encodeURIComponent(selectedId.value)}`, { method: 'PUT', headers, body: payload() })
    accept()
    await load(saved.id)
    notice.value = `Varian ${saved.name} tersimpan. Card di halaman booking ikut berubah.`
  }
  catch (cause) { notice.value = `Gagal menyimpan: ${errorMessage(cause, 'Backend menolak perubahan.')}` }
  finally { saving.value = false }
}
async function remove() {
  if (!apiMode.value || creating.value || !selectedId.value) return
  if (!window.confirm(`Hapus varian ${draft.name}? Tindakan ini tidak dapat dibatalkan.`)) return
  saving.value = true
  try {
    await $fetch(`/api/bff/staff/catalog/rooms/${encodeURIComponent(selectedId.value)}`, { method: 'DELETE', headers: { 'X-Pulang-CSRF': '1' } })
    accept(); await load(); notice.value = 'Varian dihapus.'
  }
  catch (cause) { notice.value = `Gagal menghapus: ${errorMessage(cause, 'Varian masih dipakai.')}` }
  finally { saving.value = false }
}
const variantSlug = computed(() => draft.code.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/^-+/, '').slice(0, 60))
async function upload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || []); input.value = ''
  if (!files.length || !variantSlug.value) { if (files.length) notice.value = 'Isi kode varian dulu sebelum upload foto.'; return }
  uploading.value = true; notice.value = ''
  try {
    for (const file of files) {
      if (draft.photos.length >= MAX_PHOTOS) { notice.value = `Maksimal ${MAX_PHOTOS} foto per varian.`; break }
      const form = new FormData(); form.append('variant', variantSlug.value); form.append('file', await compressImage(file), 'photo.jpg')
      const { url } = await $fetch<{ url: string }>('/api/bff/staff/catalog/photos', { method: 'POST', headers: { 'X-Pulang-CSRF': '1' }, body: form })
      draft.photos.push({ url, alt: `${draft.name || draft.code} - foto ${draft.photos.length + 1}` })
    }
    if (!notice.value) notice.value = 'Foto diunggah. Klik Simpan agar tampil di halaman booking.'
  }
  catch (cause) { notice.value = `Upload gagal: ${errorMessage(cause, 'Foto tidak dapat diunggah.')}` }
  finally { uploading.value = false }
}
function removePhoto(index: number) { draft.photos.splice(index, 1) }
function movePhoto(index: number, delta: number) {
  const target = index + delta; if (target < 0 || target >= draft.photos.length) return
  const [item] = draft.photos.splice(index, 1); draft.photos.splice(target, 0, item!)
}
onMounted(() => load())
onBeforeRouteLeave(() => !dirty.value || window.confirm('Tinggalkan editor dan buang perubahan yang belum disimpan?'))
</script>

<template>
  <div class="container ops-page">
    <StaffPageHeader eyebrow="Catalog management" title="Katalog kamar" description="Kelola identitas varian, kapasitas, harga dasar, fasilitas, dan foto dalam satu editor.">
      <template #actions>
        <BrandButton @click="startCreate">
          + Varian baru
        </BrandButton>
        <StaffStatusBadge :label="apiMode ? 'Live editor' : 'Sample editor'" :status="apiMode ? 'healthy' : 'neutral'" />
      </template>
    </StaffPageHeader>
    <UiInlineAlert v-if="notice" tone="info" live>
      {{ notice }}
    </UiInlineAlert>
    <UiInlineAlert v-if="apiMode" tone="info">
      Perubahan disimpan ke backend dan langsung memengaruhi card kamar di halaman booking. Edit memerlukan peran revenue manager atau GM admin; hapus hanya GM admin.
    </UiInlineAlert>
    <StaffDataState v-if="loading" loading loading-label="Memuat katalog…" />
    <StaffDataState v-else-if="error" :error="error" @retry="load()" />
    <StaffDataState v-else-if="!rooms.length && !creating" empty empty-label="Belum ada varian kamar." />
    <div v-else class="ops-split">
      <section class="ops-grid catalog-list" aria-label="Daftar varian kamar">
        <article v-for="room in rooms" :key="room.id" class="ops-card" :class="{ 'ops-card--selected': selectedId === room.id }">
          <img v-if="room.photos[0]" class="catalog-cover" :src="room.photos[0].url" :alt="room.photos[0].alt" loading="lazy">
          <div class="ops-card__top">
            <div>
              <p class="eyebrow">
                {{ room.code }} · {{ room.family_name }}
              </p>
              <h3>{{ room.name }}</h3>
            </div>
            <StaffStatusBadge :label="`${room.max_capacity} tamu`" />
          </div>
          <p>{{ room.bed_type }} · {{ room.room_size_sqm || '—' }} m²</p>
          <strong>{{ formatMoney(rupiah(room.base_price_minor)) }}</strong>
          <p class="muted">
            {{ room.amenities.join(' · ') || 'Belum ada fasilitas' }}
          </p>
          <BrandButton @click="select(room.id)">
            {{ selectedId === room.id ? 'Sedang diedit' : 'Buka editor' }}
          </BrandButton>
        </article>
      </section>
      <form class="panel stack catalog-editor" @submit.prevent="save">
        <div class="ops-card__top">
          <div>
            <p class="eyebrow">
              {{ creating ? 'Varian baru' : draft.code || 'Varian' }}
            </p>
            <h2>Editor katalog</h2>
          </div>
          <StaffStatusBadge v-if="dirty" label="Belum disimpan" status="pending" />
        </div>
        <div class="two-col">
          <div class="field">
            <label for="catalog-code">Kode</label><input id="catalog-code" v-model.trim="draft.code" required>
          </div>
          <div class="field">
            <label for="catalog-name">Nama</label><input id="catalog-name" v-model.trim="draft.name" required>
          </div>
          <div class="field">
            <label for="catalog-family">Family</label><input id="catalog-family" v-model.trim="draft.family_name">
          </div>
          <div class="field">
            <label for="catalog-bed">Tipe bed</label><input id="catalog-bed" v-model.trim="draft.bed_type">
          </div>
          <div class="field">
            <label for="catalog-size">Luas m²</label><input id="catalog-size" v-model.number="draft.room_size_sqm" type="number" min="0">
          </div>
          <div class="field">
            <label for="catalog-capacity">Kapasitas maksimum</label><input id="catalog-capacity" v-model.number="draft.max_capacity" type="number" min="1" required>
          </div>
          <div class="field">
            <label for="catalog-adults">Maksimum dewasa</label><input id="catalog-adults" v-model.number="draft.max_adults" type="number" min="0">
          </div>
          <div class="field">
            <label for="catalog-children">Maksimum anak</label><input id="catalog-children" v-model.number="draft.max_children" type="number" min="0">
          </div>
        </div>
        <div class="field">
          <label for="catalog-price">Harga dasar IDR</label><input id="catalog-price" v-model.number="draft.base_price_minor" type="number" min="1" step="1" required>
          <small>Harga ini menjadi sumber rate engine, bukan harga final untuk semua tanggal.</small>
        </div>
        <div class="field">
          <label for="catalog-description">Deskripsi</label><textarea id="catalog-description" v-model="draft.description" rows="5" />
        </div>
        <div class="field">
          <label for="catalog-amenities">Fasilitas, satu per baris</label><textarea id="catalog-amenities" v-model="amenitiesText" rows="6" />
        </div>
        <div class="field">
          <label>Foto ({{ draft.photos.length }}/{{ MAX_PHOTOS }}) — foto pertama menjadi cover card</label>
          <div v-for="(photo, index) in draft.photos" :key="`${photo.url}-${index}`" class="catalog-photo">
            <img v-if="photo.url" class="catalog-thumb" :src="photo.url" :alt="photo.alt" loading="lazy">
            <input v-model.trim="photo.url" :aria-label="`URL foto ${index + 1}`" placeholder="URL foto">
            <input v-model.trim="photo.alt" :aria-label="`Teks alternatif foto ${index + 1}`" placeholder="Teks alternatif" maxlength="200">
            <div class="catalog-photo__actions">
              <button type="button" :disabled="index === 0" :aria-label="`Naikkan foto ${index + 1}`" @click="movePhoto(index, -1)">
                ↑
              </button>
              <button type="button" :disabled="index === draft.photos.length - 1" :aria-label="`Turunkan foto ${index + 1}`" @click="movePhoto(index, 1)">
                ↓
              </button>
              <button type="button" :aria-label="`Hapus foto ${index + 1}`" @click="removePhoto(index)">
                Hapus
              </button>
            </div>
          </div>
          <label class="catalog-upload" :class="{ 'catalog-upload--disabled': !apiMode || uploading || draft.photos.length >= MAX_PHOTOS }">
            {{ uploading ? 'Mengunggah…' : '+ Upload foto' }}
            <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden :disabled="!apiMode || uploading || draft.photos.length >= MAX_PHOTOS" @change="upload">
          </label>
          <small>{{ apiMode ? 'JPG/PNG/WebP. Foto otomatis diperkecil (maks 1600px) sebelum diunggah.' : 'Upload tersedia pada mode live; mode sample hanya mengubah URL.' }}</small>
        </div>
        <StaffChangeReview v-if="dirty && !creating" :items="reviewItems" />
        <div class="ops-actions">
          <BrandButton type="submit" dark :loading="saving" :disabled="!dirty || saving || uploading">
            {{ apiMode ? 'Simpan perubahan' : 'Simpan simulasi' }}
          </BrandButton>
          <BrandButton :disabled="!dirty || saving" @click="discard">
            Buang perubahan
          </BrandButton>
          <BrandButton v-if="apiMode && !creating" :disabled="saving" @click="remove">
            Hapus varian
          </BrandButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.catalog-list { align-content: start; }
.catalog-editor { position: sticky; top: 92px; max-height: calc(100vh - 120px); overflow-y: auto; }
.catalog-cover { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; border-radius: 12px; background: var(--soft); }
.catalog-photo { display: grid; grid-template-columns: 72px 1fr; gap: 8px; padding: 12px; border: 1px solid var(--line); border-radius: 14px; }
.catalog-photo input { grid-column: 2; }
.catalog-thumb { grid-column: 1; grid-row: 1 / span 2; width: 72px; height: 72px; object-fit: cover; border-radius: 10px; background: var(--soft); }
.catalog-photo__actions { grid-column: 1 / -1; display: flex; gap: 8px; }
.catalog-photo__actions button { padding: 4px 10px; border: 1px solid var(--line); border-radius: 8px; background: none; cursor: pointer; font-weight: 700; }
.catalog-photo__actions button:disabled { opacity: .4; cursor: not-allowed; }
.catalog-upload { display: inline-block; padding: 10px 16px; border: 1px dashed var(--brand); border-radius: 12px; color: var(--brand); font-weight: 800; cursor: pointer; text-align: center; }
.catalog-upload--disabled { opacity: .5; cursor: not-allowed; border-color: var(--line); color: var(--muted); }
@media (max-width: 719px) { .catalog-editor { position: static; max-height: none; } }
</style>
