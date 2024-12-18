<template>
  <q-page class="column q-gutter-y-md q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Environment Info</div>
        <div v-for="(value, key) in officeHelper.info" :key="key">{{ key }}: {{ `${value}` }}</div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section v-if="error" class="text-negative">
        <div class="text-h6">Error</div>
        <div style="white-space: pre">
          {{ error }}
        </div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">Completion</div>
        <div style="white-space: pre">
          {{ completion }}
        </div>
      </q-card-section>
      <q-inner-loading :showing="loading">
        <q-spinner-rings size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { rawModelApi } from 'boot/axios'
import { officeHelper } from 'boot/office'

interface GenerateBody {
  generated_text: string
  details: object
}

const completion = ref('')
const error = ref<Error>()
const loading = ref(false)

const generateCompletion = async (prefix: string, suffix: string) => {
  const { data } = await rawModelApi.post<GenerateBody>('/generate', {
    inputs: `<|fim_prefix|>${prefix}<|fim_suffix|>${suffix}<|fim_middle|>`,
    parameters: {
      best_of: 1,
      decoder_input_details: false,
      details: true,
      do_sample: true,
      frequency_penalty: 0.01,
      max_new_tokens: 128,
      repetition_penalty: 1.05,
      return_full_text: false,
      seed: null,
      stop: [],
      temperature: 0.2,
      top_p: 0.95,
      truncate: null,
    },
  })
  completion.value = data.generated_text
}

officeHelper.onSelectionChanged(async ({ prefix, infix, suffix }) => {
  loading.value = true
  try {
    if (!infix.length) {
      await generateCompletion(prefix.substring(prefix.length - 4000), suffix.substring(0, 1000))
    }
  } catch (e) {
    error.value = <Error>e
  }
  loading.value = false
})
</script>
