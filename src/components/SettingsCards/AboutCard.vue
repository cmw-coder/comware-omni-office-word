<script setup lang="ts">
import { officeHelper } from 'boot/office'
import { i18nSubPath } from 'src/utils/common'
import PackageJson from 'app/package.json'

const i18n = i18nSubPath('components.SettingsCards.AboutCard')
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-bold">
        {{ i18n('labels.title') }}
      </div>
    </q-card-section>
    <q-separator />
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>
            {{ i18n('labels.addInsInfo') }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="row">
            <q-chip icon="mdi-tag-outline">
              {{ PackageJson.version }}
            </q-chip>
            <q-chip icon="mdi-microsoft-office">
              {{ officeHelper.info?.host }}
            </q-chip>
            <q-chip icon="mdi-laptop">
              {{ officeHelper.info?.platform }}
            </q-chip>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<style scoped></style>
