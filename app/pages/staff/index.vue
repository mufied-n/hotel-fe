<script setup lang="ts">
definePageMeta({ layout: 'staff' })
const session = useStaffSession()
const preview = useStaffPreview()
const can = (capability: Parameters<typeof preview.can>[0]) => session.apiMode.value ? session.can(capability) : preview.can(capability)
const destination = can('front_desk') ? '/staff/front-desk' : can('housekeeping') ? '/staff/housekeeping' : can('finance') ? '/staff/finance' : can('catalog') ? '/staff/catalog' : '/staff/forbidden'
await navigateTo(destination)
</script>
<template><span /></template>
