import { boot } from 'quasar/wrappers'

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

  onParagraphChanged(callback: (event: Office.EventType) => void) {
    if (!this._initialized) {
      console.warn('OfficeHelper is not initialized')
      return
    }

    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, callback)
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

export const officeHelper = new OfficeHelper()

export default boot(async () => {
  await officeHelper.init()
})
