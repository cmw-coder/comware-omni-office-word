import { defineStore, acceptHMRUpdate } from 'pinia'
import { Dark } from 'quasar'
import { computed, ref } from 'vue'

const darkModes: Dark['mode'][] = [false, 'auto', true] as const

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const darkMode = ref<Dark['mode']>(Dark.mode)
    const singleParagraph = ref(false)

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
