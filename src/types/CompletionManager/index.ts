import { isCancel } from 'axios'

import { GenerateResult, LRUCache } from './types'
import type { GenerateResponse, PromptElements } from './types'
import { generate, pseudoGenerate } from './utils'

export class CompletionManager {
  private _abortController?: AbortController
  private _cache = new LRUCache<string[]>(100)

  async generate(promptElements: PromptElements): Promise<GenerateResponse> {
    const cacheKey = promptElements.contentContext.prefix.trimEnd()
    const completionCached = this._cache.get(cacheKey)
    if (completionCached) {
      return {
        result: GenerateResult.Success,
        data: completionCached,
      }
    }

    this._abortController?.abort()
    this._abortController = new AbortController()

    const inputs = promptElements.stringify()
    try {
      const result = (
        process.env.DEV
          ? await pseudoGenerate(inputs, this._abortController.signal)
          : await generate(inputs, this._abortController.signal)
      ).split('<|fim_pad|>')[0]
      if (result?.length) {
        this._cache.put(cacheKey, [result])
        return {
          result: GenerateResult.Success,
          data: [result],
        }
      }
      return {
        result: GenerateResult.Empty,
        data: [],
      }
    } catch (e) {
      if (isCancel(e)) {
        return {
          result: GenerateResult.Cancel,
          data: [],
        }
      }
      console.error(e)
      return {
        result: GenerateResult.Error,
        data: [(<Error>e).message],
      }
    }
  }
}
