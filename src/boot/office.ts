import { defineBoot } from '#q-app/wrappers'

interface OfficeInfo {
  host: Office.HostType | null
  platform: Office.PlatformType | null
}

class OfficeHelper {
  private _initialized = false
  private _officeInfo?: OfficeInfo

  constructor() {}

  async init() {
    if (this._initialized) {
      console.warn('OfficeHelper is already initialized')
      return
    }

    if (Office) {
      this._officeInfo = await Office.onReady()
    } else {
      console.warn(
        'Office.js is not loaded.\n' +
          'Please make sure it is loaded before calling OfficeHelper.init()\n' +
          'By insert <script src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office.js"></script> in your HTML head tag',
      )
    }
    this._initialized = true
  }

  get info(): OfficeInfo | undefined {
    if (!this._isAvailable()) {
      return
    }

    return this._officeInfo
  }

  onSelectionChanged(
    callback: (data: { prefix: string; infix: string; suffix: string }) => Promise<void>,
  ) {
    if (!this._isAvailable()) {
      return false
    }

    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, async () => {
      await Word.run(async (context) => {
        const selection = context.document.getSelection()
        selection.load()
        await context.sync()

        const prefixRange = selection.expandTo(context.document.body.getRange('Start'))
        prefixRange.load()
        await context.sync()

        const suffixRange = selection.expandTo(context.document.body.getRange('End'))
        suffixRange.load()
        await context.sync()

        await callback({
          prefix: prefixRange.text.split(NEW_LINE_REGEX).join('\n'),
          infix: selection.text.split(NEW_LINE_REGEX).join('\n'),
          suffix: suffixRange.text.split(NEW_LINE_REGEX).join('\n'),
        })
      })
    })
    return true
  }

  private _isAvailable() {
    if (!this._initialized) {
      console.warn('OfficeHelper is not initialized')
      return false
    }
    if (!this._officeInfo) {
      console.warn('Office.js is not loaded')
      return false
    }
    return true
  }
}

declare module 'vue' {
  // noinspection JSUnusedGlobalSymbols
  interface ComponentCustomProperties {
    $officeHelper: OfficeHelper
  }
}

export const NEW_LINE_REGEX = /\r\n|\r|\n/g

export const officeHelper = new OfficeHelper()

export default defineBoot(async ({ app }) => {
  await officeHelper.init()
  app.config.globalProperties.$officeHelper = officeHelper
})
