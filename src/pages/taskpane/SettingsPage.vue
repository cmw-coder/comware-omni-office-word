<script setup lang="ts">
import AboutCard from 'components/SettingsCards/AboutCard.vue'
import GeneralCard from 'components/SettingsCards/GeneralCard.vue'
import CompletionCard from 'components/SettingsCards/CompletionCard.vue'
</script>

<template>
  <q-page class="column q-gutter-y-md q-pa-md">
    <general-card />
    <completion-card />
    <about-card />
  </q-page>
</template>

<style scoped></style>
