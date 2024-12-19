<template>
  <q-page class="column q-gutter-y-md q-pa-md">
    <q-card>
      <q-card-section v-if="error" class="text-negative">
        <div class="text-body1 text-bold">Error</div>
        <div style="white-space: pre-line">
          {{ error }}
        </div>
      </q-card-section>
      <q-card-section v-else class="q-gutter-y-sm">
        <div class="row items-center justify-between">
          <div class="text-body1 text-bold">Completion</div>
          <q-btn
            class="q-ml-md"
            color="accent"
            dense
            icon="mdi-refresh"
            label="Generate"
            no-caps
            @click="manualCompletion"
          />
        </div>
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
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import { NEW_LINE_REGEX, officeHelper } from 'boot/office'
import { completionManager } from 'boot/completion'
import { PromptElements } from 'src/types/CompletionManager/types'
import type { ContentContext } from 'src/types/CompletionManager/types'
import { useSettingsStore } from 'stores/settings'

const { singleParagraph } = storeToRefs(useSettingsStore())

const completion = ref('')
const error = ref<Error>()
const loading = ref(false)

const insertCompletion = () => {
  officeHelper.insertText(completion.value)
}

const manualCompletion = async () => {
  loading.value = true
  await triggerCompletion(await officeHelper.retrieveContext())
  loading.value = false
}

const triggerCompletion = async (context: ContentContext) => {
  const promptElements = new PromptElements(context)
  if (!promptElements.contentContext.infix.length) {
    const result = await completionManager.generate(promptElements)
    if (result) {
      completion.value = singleParagraph.value ? (result.split(NEW_LINE_REGEX)[0] ?? result) : result
    } else {
      error.value = new Error('Failed to generate completion')
    }
  }
}

// TODO: Add unmount event
onMounted(() => {
  officeHelper.registerSelectionChangedEvent(async (context) => {
    loading.value = true
    await triggerCompletion(context)
    loading.value = false
  })
})
</script>
