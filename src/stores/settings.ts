import { defineStore, acceptHMRUpdate } from 'pinia'
import { Dark } from 'quasar'
import { computed, ref } from 'vue'

import { globalI18n } from 'boot/i18n'
import type messages from 'src/i18n'

const darkModes: Dark['mode'][] = [false, 'auto', true] as const

type Locales = keyof typeof messages

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const darkMode = ref<Dark['mode']>(Dark.mode)
    const developerMode = ref(false)
    const locale = computed({
      get: () => globalI18n.locale.value,
      set: (value: Locales) => {
        globalI18n.locale.value = value
      },
    })
    const singleParagraph = ref(true)

    const darkModeColorAndIcon = computed(() => {
      switch (darkMode.value) {
        case false:
          return { color: 'orange', icon: 'light_mode' }
        case 'auto':
          return { color: 'teal', icon: 'hdr_auto' }
        default:
          return { color: 'yellow', icon: 'dark_mode' }
      }
    })

    const applyDarkMode = () => {
      Dark.set(darkMode.value)
    }

    const toggleDarkMode = () => {
      const index = darkModes.indexOf(darkMode.value)
      darkMode.value = darkModes[(index + 1) % darkModes.length] ?? 'auto'
      applyDarkMode()
    }

    return {
      darkMode,
      developerMode,
      locale,
      singleParagraph,
      darkModeColorAndIcon,
      applyDarkMode,
      toggleDarkMode,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
