import { NEW_LINE_REGEX } from 'src/constants/common'
import type { ContentContext } from 'src/types/common'
import type { OfficeInfo } from 'src/types/OfficeHelper/types'

export class OfficeHelper {
  private _initialized = false
  private _officeInfo?: OfficeInfo

  async init() {
    if (this._initialized) {
      console.warn('OfficeHelper is already initialized')
      return
    }

    if (Office) {
      this._officeInfo = await Office.onReady()

      Office.actions.associate('ComwareOmniHideTaskpane', async () => {
        try {
          await Office.addin.hide()
        } catch (error) {
          console.log(error)
        }
      })
      Office.actions.associate('ComwareOmniShowTaskpane', async () => {
        try {
          await Office.addin.showAsTaskpane()
        } catch (error) {
          console.log(error)
        }
      })
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

  async registerParagraphChangedEvent(callback: (contentContext: ContentContext) => Promise<void>) {
    if (!this._isAvailable()) {
      return false
    }

    await Word.run(async (context) => {
      context.document.onParagraphChanged.add(async () => {
        await callback(await this.retrieveContext())
      })
      await context.sync()

      console.log('Added event handler for when content is changed in paragraphs.')
    })
  }

  registerSelectionChangedEvent(callback: (contentContext: ContentContext) => Promise<void>) {
    if (!this._isAvailable()) {
      return false
    }

    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, async () => {
      await callback(await this.retrieveContext())
    })
    return true
  }

  async retrieveContext(): Promise<ContentContext> {
    return new Promise((resolve) => {
      Word.run(async (context) => {
        const selection = context.document.getSelection()
        selection.load()
        await context.sync()

        const prefixRange = selection.expandTo(context.document.body.getRange('Start'))
        prefixRange.load()
        await context.sync()

        const suffixRange = selection.expandTo(context.document.body.getRange('End'))
        suffixRange.load()
        await context.sync()

        resolve({
          prefix: prefixRange.text.split(NEW_LINE_REGEX).join('\n'),
          infix: selection.text.split(NEW_LINE_REGEX).join('\n'),
          suffix: suffixRange.text.split(NEW_LINE_REGEX).join('\n'),
        })
      })
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
