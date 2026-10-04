<script setup lang="ts">
import type { Occupancy, SearchInput } from '~/types/booking'
import { validateSearch } from '~/utils/validation'
import { addDays, todayInJakarta } from '~/utils/dates'

const props = defineProps<{ initial?: SearchInput }>()
const emit = defineEmits<{ search: [value: SearchInput] }>()
const today = todayInJakarta()

function createDefaultForm(): SearchInput {
  return props.initial
    ? structuredClone(props.initial)
    : {
        checkIn: today,
        checkOut: addDays(today, 1),
        occupancy: [{ roomIndex: 0, adults: 1, childrenAges: [] }],
        locale: 'id-ID',
        currency: 'IDR',
      }
}

const form = reactive<SearchInput>(createDefaultForm())
const promoOpen = ref(Boolean(props.initial?.promoCode))
const errors = ref<string[]>([])
const { setSearch } = useBookingDraft()

watch(() => props.initial, (next) => {
  if (next) {
    Object.assign(form, structuredClone(next))
    if (next.promoCode) {
      promoOpen.value = true
    }
  }
}, { deep: true })

function setRooms(event: Event) {
  const count = Number((event.target as HTMLSelectElement).value)
  const next: Occupancy[] = Array.from({ length: count }, (_, roomIndex) => form.occupancy[roomIndex] ?? { roomIndex, adults: 1, childrenAges: [] })
  form.occupancy = next.map((room, roomIndex) => ({ ...room, roomIndex }))
}

function setChildren(room: Occupancy, event: Event) {
  const count = Number((event.target as HTMLSelectElement).value)
  room.childrenAges = Array.from({ length: count }, (_, index) => room.childrenAges[index] ?? 7)
}

function clearPromo() {
  form.promoCode = undefined
}

function submit() {
  errors.value = validateSearch(form)
  if (!errors.value.length) {
    const input = JSON.parse(JSON.stringify(form)) as SearchInput
    if (!input.promoCode || !input.promoCode.trim()) {
      delete input.promoCode
    }
    else {
      input.promoCode = input.promoCode.trim().toUpperCase()
    }
    setSearch(input)
    emit('search', input)
  }
}
</script>

<template>
  <form id="booking-search" class="search-form panel" novalidate @submit.prevent="submit">
    <UiInlineAlert v-if="errors.length" tone="error">
      <strong>Periksa pencarian:</strong>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </UiInlineAlert>

    <div class="date-grid">
      <UiFormField id="check-in" label="Check-in">
        <template #default="{ describedby }">
          <input id="check-in" v-model="form.checkIn" type="date" :aria-describedby="describedby" required>
        </template>
      </UiFormField>

      <UiFormField id="check-out" label="Check-out">
        <template #default="{ describedby }">
          <input id="check-out" v-model="form.checkOut" type="date" :aria-describedby="describedby" required>
        </template>
      </UiFormField>

      <UiFormField id="room-count" label="Jumlah kamar">
        <template #default="{ describedby }">
          <select id="room-count" :value="form.occupancy.length" :aria-describedby="describedby" @change="setRooms">
            <option v-for="n in 4" :key="n" :value="n">{{ n }} kamar</option>
          </select>
        </template>
      </UiFormField>
    </div>

    <fieldset v-for="room in form.occupancy" :key="room.roomIndex" class="guest-room">
      <legend>Kamar {{ room.roomIndex + 1 }}</legend>
      <label>
        Dewasa
        <select v-model.number="room.adults">
          <option v-for="n in 4" :key="n" :value="n">{{ n }}</option>
        </select>
      </label>
      <label>
        Anak
        <select :value="room.childrenAges.length" @change="setChildren(room, $event)">
          <option v-for="n in 4" :key="n - 1" :value="n - 1">{{ n - 1 }}</option>
        </select>
      </label>
      <label v-for="(_, childIndex) in room.childrenAges" :key="childIndex">
        Usia anak {{ childIndex + 1 }}
        <select v-model.number="room.childrenAges[childIndex]">
          <option v-for="age in 18" :key="age - 1" :value="age - 1">{{ age - 1 }}</option>
        </select>
      </label>
    </fieldset>

    <details
      class="promo-field"
      :open="promoOpen"
      @toggle="promoOpen = ($event.target as HTMLDetailsElement).open"
    >
      <summary>
        <span>Punya kode promo?</span>
        <span v-if="form.promoCode" class="promo-badge-tag">
          Kode: <strong>{{ form.promoCode }}</strong>
        </span>
      </summary>

      <div class="promo-input-wrapper">
        <UiFormField
          id="promo"
          label="Kode promo"
          hint="Opsional. Kode akan divalidasi bersama ketersediaan &amp; harga kamar."
        >
          <template #default="{ describedby }">
            <div class="promo-input-row">
              <input
                id="promo"
                v-model.trim="form.promoCode"
                type="text"
                maxlength="30"
                :aria-describedby="describedby"
                placeholder="Contoh: OCTOBREAK"
                autocomplete="off"
              >
              <button
                v-if="form.promoCode"
                type="button"
                class="promo-clear-btn"
                title="Hapus kode promo"
                @click="clearPromo"
              >
                ✕ Hapus
              </button>
            </div>
          </template>
        </UiFormField>
      </div>
    </details>

    <button class="button search-submit" type="submit">
      Cari kamar <span aria-hidden="true">→</span>
    </button>
  </form>
</template>

<style scoped>
.search-form {
  scroll-margin-top: 100px;
  display: grid;
  gap: 20px;
  background: #fff;
  color: #000;
  box-shadow: var(--shadow);
}
.date-grid {
  display: grid;
  gap: 16px;
}
.guest-room {
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.guest-room legend {
  font-weight: 900;
  padding-inline: 5px;
}
.guest-room label {
  display: grid;
  gap: 5px;
  min-width: 100px;
  font-size: .9rem;
}
.guest-room select {
  border: 1px solid #777;
  border-radius: 10px;
  padding: 7px 28px 7px 10px;
  background: #fff;
}
.promo-field {
  border-top: 1px solid var(--line);
  padding-top: 14px;
}
.promo-field summary {
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  cursor: pointer;
  flex-wrap: wrap;
}
.promo-badge-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  font-weight: 800;
  color: #d9480f;
  background: #fff0eb;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid #ffd8a8;
}
.promo-input-wrapper {
  margin-top: 12px;
}
.promo-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.promo-input-row input {
  flex: 1;
  text-transform: uppercase;
}
.promo-clear-btn {
  background: none;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 800;
  color: #c92a2a;
  cursor: pointer;
  transition: background var(--motion-fast) var(--ease-standard);
  white-space: nowrap;
}
.promo-clear-btn:hover {
  background: #ffe3e3;
  border-color: #ffa8a8;
}
.search-submit {
  width: 100%;
  justify-content: space-between;
  padding-inline: 24px;
}
.search-submit span {
  font-size: 1.2rem;
}
@media (min-width: 700px) {
  .date-grid {
    grid-template-columns: 1fr 1fr .75fr;
  }
}
</style>
