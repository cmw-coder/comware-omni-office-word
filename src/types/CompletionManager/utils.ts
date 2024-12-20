import { rawModelApi } from 'boot/axios'

export const digestMessage = async (message: string) => {
  const msgUint8 = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

interface GenerateBody {
  generated_text: string
  details: {
    finish_reason: string
    generated_tokens: number
    seed: number
    prefill: string[]
    tokens: {
      id: number
      text: string
      logprob: number
      special: boolean
    }[]
  }
}

export const generate = async (inputs: string, signal: AbortSignal) => {
  const { data } = await rawModelApi.post<GenerateBody>(
    '/generate',
    {
      inputs,
      parameters: {
        best_of: 1,
        decoder_input_details: false,
        details: true,
        do_sample: true,
        frequency_penalty: 0.01,
        max_new_tokens: 96,
        repetition_penalty: 1.05,
        return_full_text: false,
        seed: null,
        stop: ['/\n', '<|fim_pad|>'],
        temperature: 0.5,
        top_p: 0.95,
        truncate: null,
      },
    },
    { signal },
  )
  return data.generated_text
}
