<template>
  <q-page class="column q-gutter-y-md q-pa-md">
    <q-card>
      <q-card-section
        class="q-gutter-y-sm"
        :class="{
          'text-accent': result === GenerateResult.Empty,
          'text-negative': result === GenerateResult.Error,
        }"
      >
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
          {{ data }}
        </div>
        <q-btn
          class="full-width"
          color="primary"
          :disable="result !== GenerateResult.Cancel && result !== GenerateResult.Success"
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
import { GenerateResult, PromptElements } from 'src/types/CompletionManager/types'
import type { ContentContext } from 'src/types/CompletionManager/types'
import { useSettingsStore } from 'stores/settings'
import { i18nSubPath } from 'src/utils/common'

const { singleParagraph } = storeToRefs(useSettingsStore())

const data = ref('')
const loading = ref(false)
const result = ref<GenerateResult>()

const i18n = i18nSubPath('pages.taskpane.DashboardPage')

const insertCompletion = () => {
  officeHelper.insertText(data.value)
}

const manualCompletion = async () => {
  loading.value = true
  await triggerCompletion(await officeHelper.retrieveContext())
  loading.value = false
}

const triggerCompletion = async (context: ContentContext) => {
  const promptElements = new PromptElements(context)
  if (!promptElements.contentContext.infix.length) {
    const { result: _result, data: _data } = await completionManager.generate(promptElements)
    result.value = _result
    switch (result.value) {
      case GenerateResult.Cancel: {
        console.log('Cancelled')
        break
      }
      case GenerateResult.Error: {
        data.value = _data
        break
      }
      case GenerateResult.Empty: {
        data.value = i18n('labels.noNeedToComplete')
        break
      }
      case GenerateResult.Success: {
        data.value = singleParagraph.value ? (_data.split(NEW_LINE_REGEX)[0] ?? _data) : _data
        break
      }
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
