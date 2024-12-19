import type { PromptElements } from './types'
import { LRUCache } from './types'
import { generate } from './utils'

export class CompletionManager {
  private _abortController?: AbortController
  private _cache = new LRUCache<string>(100)

  async generate(promptElements: PromptElements) {
    const cacheKey = promptElements.contentContext.prefix.trimEnd()
    const completionCached = this._cache.get(cacheKey)
    if (completionCached) {
      return completionCached
    }

    this._abortController?.abort()
    this._abortController = new AbortController()

    try {
      const result = (
        await generate(await promptElements.stringify(), this._abortController.signal)
      ).split('<|fim_pad|>')[0]
      if (result?.length) {
        this._cache.put(cacheKey, result)
        return result
      }
    } catch (e) {
      console.error(e)
    }
    return
  }
}
