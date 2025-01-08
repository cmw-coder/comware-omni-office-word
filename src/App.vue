<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useSettingsStore } from 'stores/settings'
import { onMounted } from 'vue'

const { applyDarkMode, detectBaseUrl } = useSettingsStore()
const { baseUrl } = storeToRefs(useSettingsStore())

onMounted(() => {
  applyDarkMode()
  if (!baseUrl.value.length) {
    detectBaseUrl().catch((e) => console.error(e))
  }
})
</script>

<template>
  <router-view />
</template>
