<template>
  <q-page class="column q-gutter-y-md q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-body1 text-bold">Environment Info</div>
        <div class="row">
          <q-chip icon="mdi-microsoft-office">
            {{ officeHelper.info?.host }}
          </q-chip>
          <q-chip icon="mdi-laptop">
            {{ officeHelper.info?.platform }}
          </q-chip>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-body1 text-bold">Options</div>
        <q-checkbox label="Stop on new line" v-model="isNewLineShouldStop" />
        <q-checkbox label="Use suffix in prompt" v-model="isSuffixInPrompt" />
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section v-if="error" class="text-negative">
        <div class="text-body1 text-bold">Error</div>
        <div style="white-space: pre-line">
          {{ error }}
        </div>
      </q-card-section>
      <q-card-section v-else class="q-gutter-y-sm">
        <div class="text-body1 text-bold">Completion</div>
        <div style="white-space: pre-line">
          {{ completion }}
        </div>
        <q-btn
          class="full-width"
          color="primary"
          :disable="!completion.length"
          label="Insert Completion"
          no-caps
          @click="insertCompletion"
        />
      </q-card-section>
      <q-inner-loading :showing="loading">
        <q-spinner-rings size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-body1 text-bold">Prefix</div>
        <div style="white-space: pre-line">{{ prefix }}</div>
      </q-card-section>
      <q-separator v-show="isSuffixInPrompt" />
      <q-card-section v-show="isSuffixInPrompt">
        <div class="text-body1 text-bold">Suffix</div>
        <div style="white-space: pre-line">{{ suffix }}</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { rawModelApi } from 'boot/axios'
import { officeHelper } from 'boot/office'

interface GenerateBody {
  generated_text: string
  details: object
}

const completion = ref('aaa')
const error = ref<Error>()
const isNewLineShouldStop = ref(false)
const isSuffixInPrompt = ref(true)
const loading = ref(false)
const prefix = ref('')
const suffix = ref('')

const generateCompletion = async () => {
  const stop = ['/\n', '<|fim_pad|>']
  if (isNewLineShouldStop.value) {
    stop.push('\n')
  }
  const { data } = await rawModelApi.post<GenerateBody>('/generate', {
    inputs: `<|fim_prefix|>${prefix.value}<|fim_suffix|>${isSuffixInPrompt.value ? suffix.value : ''}<|fim_middle|>`,
    parameters: {
      best_of: 1,
      decoder_input_details: false,
      details: true,
      do_sample: true,
      frequency_penalty: 0.01,
      max_new_tokens: 512,
      repetition_penalty: 1.05,
      return_full_text: false,
      seed: null,
      stop,
      temperature: 0.2,
      top_p: 0.95,
      truncate: null,
    },
  })
  completion.value = data.generated_text
}

const insertCompletion = () => {
  officeHelper.insertText(completion.value)
}

onMounted(async () => {
  await officeHelper.registerParagraphChangeEvent(async (data) => {
    loading.value = true
    prefix.value = data.prefix.substring(data.prefix.length - 4000)
    suffix.value = data.suffix.substring(0, 1000)
    try {
      if (!data.infix.length) {
        await generateCompletion()
      }
    } catch (e) {
      error.value = <Error>e
    }
    loading.value = false
  })
})
</script>
