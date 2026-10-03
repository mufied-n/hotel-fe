<script setup lang="ts">
definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Sesi berakhir' })
</script>
<template><div class="container ops-page"><StaffPageHeader eyebrow="401" title="Sesi berakhir" description="Masuk kembali sebelum melanjutkan pekerjaan staff." /><UiInlineAlert tone="info">Draft sensitif tidak dipulihkan setelah sesi berakhir.</UiInlineAlert><BrandButton to="/staff/login" dark>Masuk kembali</BrandButton></div></template>
