<template>
  <q-page class="column q-gutter-y-md q-pa-md">
    <q-card>
      <q-card-section
        class="q-gutter-y-sm"
        :class="{
          'text-accent': generateResult === GenerateResult.Empty,
          'text-negative': generateResult === GenerateResult.Error,
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
          {{ generateData }}
        </div>
        <q-btn
          class="full-width"
          color="primary"
          :disable="
            generateResult !== GenerateResult.Cancel && generateResult !== GenerateResult.Success
          "
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

const loading = ref(false)
const generateData = ref('')
const generateResult = ref<GenerateResult>()

const i18n = i18nSubPath('pages.taskpane.DashboardPage')

const insertCompletion = () => {
  officeHelper.insertText(generateData.value)
}

const manualCompletion = async () => {
  loading.value = true
  await triggerCompletion(await officeHelper.retrieveContext())
  loading.value = false
}

const triggerCompletion = async (context: ContentContext) => {
  const promptElements = new PromptElements(context)
  if (!promptElements.contentContext.infix.length) {
    const { result, data } = await completionManager.generate(promptElements)
    console.log({ result, data })
    switch (result) {
      case GenerateResult.Cancel: {
        generateResult.value = result
        break
      }
      case GenerateResult.Error: {
        generateData.value = data
        generateResult.value = result
        break
      }
      case GenerateResult.Empty: {
        generateData.value = i18n('labels.noNeedToComplete')
        generateResult.value = result
        break
      }
      case GenerateResult.Success: {
        const processed = singleParagraph.value ? (data.split(NEW_LINE_REGEX)[0] ?? data) : data
        if (processed.length) {
          generateData.value = processed
          generateResult.value = result
        } else {
          generateData.value = i18n('labels.noNeedToComplete')
          generateResult.value = GenerateResult.Empty
        }
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
