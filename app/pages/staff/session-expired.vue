<script setup lang="ts">
definePageMeta({ layout: 'staff' })
useSeoMeta({ title: 'Sesi berakhir' })
</script>
<template><div class="container ops-page"><header><p class="eyebrow">401 preview</p><h1>Sesi berakhir.</h1><p>Masuk kembali sebelum melanjutkan pekerjaan staff.</p></header><UiInlineAlert tone="info">State ini adalah preview sampai backend menyediakan sesi staff yang tepercaya.</UiInlineAlert><BrandButton to="/staff/login" dark>Masuk kembali</BrandButton></div></template>
