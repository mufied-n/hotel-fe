<script setup lang="ts">
import { sampleChannels } from '~/data/management-scenarios'
import type { ChannelSnapshot } from '~/types/management'

interface LiveSyncIssue {
  id: string
  provider: string
  external_reference?: string
  externalReference?: string
  event_type?: string
  eventType?: string
  status: string
  reason?: string
  created_at?: string
  createdAt?: string
}

definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Channel sync' })

const apiMode = computed(() => useRuntimeConfig().public.operationsMode === 'api')
const status = ref('')
const selected = ref<ChannelSnapshot | null>(null)
const review = ref(false)
const notice = ref('')
const liveIssues = ref<LiveSyncIssue[]>([])
const loadingIssues = ref(false)
const issuesError = ref('')

const activeFilters = computed(() => (status.value ? [`Status ${status.value}`] : []))
const filtered = computed(() => sampleChannels.filter(item => !status.value || item.status === status.value))

function reset() {
  status.value = ''
}

function openRetry(item: ChannelSnapshot) {
  selected.value = item
  review.value = true
}

function retry() {
  if (!selected.value) return
  notice.value = `Retry ${selected.value.name} disimulasikan. Status tidak diubah sebelum acknowledgment authoritative.`
  review.value = false
}

async function loadLiveIssues() {
  if (!apiMode.value) return
  loadingIssues.value = true
  issuesError.value = ''
  try {
    const res = await $fetch<{ issues: LiveSyncIssue[] | null }>('/api/bff/staff/staff/channel-sync-issues')
    liveIssues.value = res.issues || []
  }
  catch (cause) {
    const err = cause as { data?: { statusMessage?: string }, statusMessage?: string }
    issuesError.value = err.data?.statusMessage || err.statusMessage || 'Gagal memuat insiden sinkronisasi live.'
  }
  finally {
    loadingIssues.value = false
  }
}

onMounted(() => {
  if (apiMode.value) {
    loadLiveIssues()
  }
})
</script>

<template>
  <div class="container ops-page">
    <StaffPageHeader
      eyebrow="Distribution & OTA"
      title="Channel sync"
      description="Status integrasi mitra OTA (Traveloka, Agoda, Tiket.com) dan pemantauan insiden sinkronisasi."
    />

    <UiInlineAlert v-if="apiMode" tone="info">
      Mode API Aktif: Terhubung ke NATS Event Hub dan backend channel service. Pemantauan karantina inventaris aktif.
    </UiInlineAlert>
    <UiInlineAlert v-else tone="info">
      Data sample. Backend belum menyediakan monitoring dan retry channel.
    </UiInlineAlert>

    <UiInlineAlert v-if="notice" tone="info" live>{{ notice }}</UiInlineAlert>
    <UiInlineAlert v-if="issuesError" tone="error" live>{{ issuesError }}</UiInlineAlert>

    <!-- Section: Live Quarantine & Sync Issues -->
    <section v-if="apiMode" class="stack issues-section">
      <div class="section-title-row">
        <div>
          <h2>Insiden Karantina Inventaris (Channel Issues)</h2>
          <p class="muted">Insiden konflik ketersediaan kamar atau anomali overbooking dari kanal pihak ketiga.</p>
        </div>
        <BrandButton :loading="loadingIssues" @click="loadLiveIssues">
          Perbarui Insiden
        </BrandButton>
      </div>

      <div v-if="loadingIssues && !liveIssues.length" class="ops-card">
        Memeriksa antrean karantina kanal…
      </div>

      <div v-else-if="!liveIssues.length" class="ops-card ops-card--healthy">
        <strong>✓ Semua Kanal Tersinkronisasi</strong>
        <p class="muted">Tidak ada insiden karantina inventaris atau konflik overbooking aktif saat ini.</p>
      </div>

      <div v-else class="ops-grid">
        <article v-for="issue in liveIssues" :key="issue.id" class="ops-card ops-card--alert">
          <div class="ops-card__top">
            <div>
              <p class="eyebrow">{{ issue.provider }}</p>
              <h3>{{ issue.external_reference || issue.externalReference || issue.id }}</h3>
            </div>
            <StaffStatusBadge :label="issue.status" status="attention" />
          </div>
          <p><strong>Alasan:</strong> {{ issue.reason || 'Konflik inventaris atau kuota' }}</p>
          <p v-if="issue.event_type || issue.eventType" class="muted">
            Tipe Event: {{ issue.event_type || issue.eventType }}
          </p>
          <small v-if="issue.created_at || issue.createdAt">
            Diterima: {{ new Date(issue.created_at || issue.createdAt || '').toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}
          </small>
        </article>
      </div>
    </section>

    <!-- Section: OTA Channel Partners & Queue -->
    <section class="stack">
      <h2>Status Mitra Kanal & Antrean Sinkronisasi</h2>

      <StaffFilterBar :active="activeFilters" :result-label="`${filtered.length} channel`" @apply="() => undefined" @reset="reset">
        <div class="field">
          <label for="channel-status">Status</label>
          <select id="channel-status" v-model="status">
            <option value="">Semua</option>
            <option value="healthy">Healthy</option>
            <option value="delayed">Delayed</option>
            <option value="attention">Attention</option>
            <option value="stale">Stale</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </StaffFilterBar>

      <StaffDataState v-if="!filtered.length && activeFilters.length" no-results @reset="reset" />

      <div v-else class="ops-grid">
        <article
          v-for="channel in filtered"
          :key="channel.id"
          class="ops-card"
          :class="{ 'ops-card--selected': selected?.id === channel.id }"
        >
          <div class="ops-card__top">
            <h2>{{ channel.name }}</h2>
            <StaffStatusBadge :label="channel.status" :status="channel.status" />
          </div>
          <strong>{{ channel.pendingUpdates }} pembaruan menunggu</strong>
          <p>{{ channel.message }}</p>
          <small>Sync terakhir {{ new Date(channel.lastSyncAt).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) }}</small>
          <BrandButton @click="selected = channel">Lihat detail</BrandButton>
        </article>
      </div>
    </section>

    <StaffDetailDrawer
      id="channel-detail"
      :open="Boolean(selected) && !review"
      :title="selected?.name || 'Detail channel'"
      eyebrow="Channel operation"
      @close="selected = null"
    >
      <div v-if="selected" class="stack">
        <StaffStatusBadge :label="selected.status" :status="selected.status" />
        <StaffChangeReview
          :items="[
            { label: 'Operation', before: selected.operation, after: selected.lastEvent },
            { label: 'Resource', before: selected.resource, after: selected.version },
            { label: 'Attempts', before: '0', after: String(selected.attempts) },
          ]"
        />
        <UiInlineAlert v-if="selected.sanitizedError" tone="error">
          {{ selected.sanitizedError }}
        </UiInlineAlert>
        <BrandButton dark :disabled="!selected.retryEligible" @click="openRetry(selected)">
          Tinjau retry sample
        </BrandButton>
      </div>
    </StaffDetailDrawer>

    <StaffActionDialog id="channel-retry" :open="review" title="Konfirmasi retry channel" @close="review = false">
      <p v-if="selected">
        <strong>{{ selected.operation }}</strong><br>
        {{ selected.resource }} · {{ selected.version }}
      </p>
      <UiInlineAlert tone="error">
        Retry dapat menduplikasi operasi bila provider sudah menerima attempt sebelumnya. Simulasi ini tidak mengirim payload.
      </UiInlineAlert>
      <template #actions>
        <BrandButton dark @click="retry">
          Simulasikan retry
        </BrandButton>
        <BrandButton @click="review = false">
          Kembali
        </BrandButton>
      </template>
    </StaffActionDialog>
  </div>
</template>

<style scoped>
.issues-section {
  margin-bottom: 24px;
}
.section-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}
.ops-card--healthy {
  border-left: 4px solid #198754;
  background: var(--soft);
}
.ops-card--alert {
  border-left: 4px solid var(--accent);
}
</style>
