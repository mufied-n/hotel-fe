<script setup lang="ts">
import { ratePlans } from '~/data/rate-plans'
import { formatMoney, rupiah } from '~/utils/money'

definePageMeta({ layout: 'staff' }); useSeoMeta({ title: 'Rate plans preview' })
const notice = ref(''); const prices = reactive<Record<string, number>>({ room_only: 1000000, bed_and_breakfast: 1150000 })
function save() { notice.value = 'Rate plan disimpan sebagai simulasi. Quote live tidak berubah.' }
</script>
<template><div class="container ops-page"><header><p class="eyebrow">Revenue workspace</p><h1>Rate plans.</h1><div class="ops-subnav"><NuxtLink to="/staff/rates">Rate plans</NuxtLink><NuxtLink to="/staff/promos">Promo</NuxtLink></div></header><UiInlineAlert tone="info">Mode sample sampai API management rate tersedia.</UiInlineAlert><UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert><div class="ops-grid"><form v-for="rate in ratePlans" :key="rate.id" class="ops-card" @submit.prevent="save"><div class="ops-card__top"><h2>{{ rate.name }}</h2><span class="badge">{{ rate.breakfast ? 'Sarapan' : 'Tanpa sarapan' }}</span></div><ul><li v-for="benefit in rate.benefits" :key="benefit">{{ benefit }}</li></ul><div class="field"><label :for="`price-${rate.id}`">Harga dasar sample</label><input :id="`price-${rate.id}`" v-model.number="prices[rate.id]" type="number" min="0"></div><strong>{{ formatMoney(rupiah(prices[rate.id] || 0)) }}</strong><BrandButton type="submit">Simpan simulasi</BrandButton></form></div></div></template>
