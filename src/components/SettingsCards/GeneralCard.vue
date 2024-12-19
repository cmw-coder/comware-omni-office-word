<script setup lang="ts">
import DarkModeButton from 'components/ThemeButton.vue'
import { i18nSubPath } from 'src/utils/common'

const i18n = i18nSubPath('components.SettingsCards.GeneralCard')
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-bold">
        {{ i18n('labels.title') }}
      </div>
    </q-card-section>
    <q-separator />
    <q-list separator>
      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label>
            {{ i18n('labels.theme') }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <dark-mode-button />
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<style scoped></style>
