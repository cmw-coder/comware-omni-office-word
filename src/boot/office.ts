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
    return this._officeInfo
  }

  async insertText(text: string) {
    if (!this._isAvailable()) {
      return false
    }

    await Word.run(async (context) => {
      const range = context.document.getSelection()
      range.insertText(text, 'End')
      await context.sync()
    })
  }

  async registerParagraphChangeEvent(
    callback: (data: { prefix: string; infix: string; suffix: string }) => Promise<void>,
  ) {
    if (!this._isAvailable()) {
      return false
    }

    await Word.run(async (context) => {
      context.document.onParagraphChanged.add(async () => {
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
        await context.sync()
      })
      await context.sync()

      console.log('Added event handler for when content is changed in paragraphs.')
    })
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
    if (!this._officeInfo.host) {
      console.warn('Office host is not available')
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
