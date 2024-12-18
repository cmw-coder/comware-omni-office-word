<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>
        <div>Info: {{ officeHelper.info }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { officeHelper } from 'boot/office'
</script>
