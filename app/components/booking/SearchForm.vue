<script setup lang="ts">
import type { Occupancy, SearchInput } from '~/types/booking'
import { validateSearch } from '~/utils/validation'
import { addDays, todayInJakarta } from '~/utils/dates'

const props = defineProps<{ initial?: SearchInput }>()
const emit = defineEmits<{ search: [value: SearchInput] }>()
const today = todayInJakarta()
const form = reactive<SearchInput>(props.initial ? structuredClone(props.initial) : { checkIn: today, checkOut: addDays(today, 1), occupancy: [{ roomIndex: 0, adults: 1, childrenAges: [] }], locale: 'id-ID', currency: 'IDR' })
const errors = ref<string[]>([])
const { setSearch } = useBookingDraft()

function setRooms(event: Event) {
  const count = Number((event.target as HTMLSelectElement).value)
  const next: Occupancy[] = Array.from({ length: count }, (_, roomIndex) => form.occupancy[roomIndex] ?? { roomIndex, adults: 1, childrenAges: [] })
  form.occupancy = next.map((room, roomIndex) => ({ ...room, roomIndex }))
}
function setChildren(room: Occupancy, event: Event) {
  const count = Number((event.target as HTMLSelectElement).value)
  room.childrenAges = Array.from({ length: count }, (_, index) => room.childrenAges[index] ?? 7)
}
function submit() {
  errors.value = validateSearch(form)
  if (!errors.value.length) {
    const input = JSON.parse(JSON.stringify(form)) as SearchInput
    setSearch(input)
    emit('search', input)
  }
}
</script>

<template>
  <form class="search-form panel" novalidate @submit.prevent="submit">
    <UiInlineAlert v-if="errors.length" tone="error"><strong>Periksa pencarian:</strong><ul><li v-for="error in errors" :key="error">{{ error }}</li></ul></UiInlineAlert>
    <div class="date-grid">
      <UiFormField id="check-in" label="Check-in"><template #default="{ describedby }"><input id="check-in" v-model="form.checkIn" type="date" :aria-describedby="describedby" required></template></UiFormField>
      <UiFormField id="check-out" label="Check-out"><template #default="{ describedby }"><input id="check-out" v-model="form.checkOut" type="date" :aria-describedby="describedby" required></template></UiFormField>
      <UiFormField id="room-count" label="Jumlah kamar"><template #default="{ describedby }"><select id="room-count" :value="form.occupancy.length" :aria-describedby="describedby" @change="setRooms"><option v-for="n in 4" :key="n" :value="n">{{ n }} kamar</option></select></template></UiFormField>
    </div>
    <fieldset v-for="room in form.occupancy" :key="room.roomIndex" class="guest-room">
      <legend>Kamar {{ room.roomIndex + 1 }}</legend>
      <label>Dewasa<select v-model.number="room.adults"><option v-for="n in 4" :key="n" :value="n">{{ n }}</option></select></label>
      <label>Anak<select :value="room.childrenAges.length" @change="setChildren(room, $event)"><option v-for="n in 4" :key="n - 1" :value="n - 1">{{ n - 1 }}</option></select></label>
      <label v-for="(_, childIndex) in room.childrenAges" :key="childIndex">Usia anak {{ childIndex + 1 }}<select v-model.number="room.childrenAges[childIndex]"><option v-for="age in 18" :key="age - 1" :value="age - 1">{{ age - 1 }}</option></select></label>
    </fieldset>
    <UiFormField id="promo" label="Kode promo" hint="Opsional. Coba OCTOBREAK pada demo."><template #default="{ describedby }"><input id="promo" v-model.trim="form.promoCode" type="text" maxlength="30" :aria-describedby="describedby" autocomplete="off"></template></UiFormField>
    <button class="button" type="submit">Cari kamar</button>
  </form>
</template>

<style scoped>
.search-form { display: grid; gap: 22px; background: #fff; color: #000; box-shadow: var(--shadow); }.date-grid { display: grid; gap: 16px; }.guest-room { border: 1px solid var(--line); border-radius: 18px; padding: 16px; display: flex; flex-wrap: wrap; gap: 12px; }.guest-room legend { font-weight: 800; padding-inline: 5px; }.guest-room label { display: grid; gap: 5px; font-size: .9rem; }.guest-room select { border: 1px solid #777; border-radius: 10px; padding: 7px 28px 7px 10px; background: #fff; }
@media (min-width: 700px) { .date-grid { grid-template-columns: 1fr 1fr .75fr; } }
</style>
