<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { i18nSubPath } from 'src/utils/common'
import { useSettingsStore } from 'stores/settings'

const { toggleDarkMode } = useSettingsStore()
const { darkModeColorAndIcon } = storeToRefs(useSettingsStore())

const i18n = i18nSubPath('components.ThemeButton')
</script>

<template>
  <q-btn
    :icon="darkModeColorAndIcon.icon"
    :text-color="darkModeColorAndIcon.color"
    flat
    round
    @click="toggleDarkMode"
  >
    <q-tooltip
      class="text-no-wrap"
      anchor="center right"
      self="center left"
      transition-hide="jump-left"
      transition-show="jump-right"
    >
      {{ i18n('labels.toggleTheme') }}
    </q-tooltip>
  </q-btn>
</template>

<style scoped></style>
