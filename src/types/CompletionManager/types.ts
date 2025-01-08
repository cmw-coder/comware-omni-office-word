import type { ContentContext } from 'src/types/common'

class ListNode<T> {
  public prev: ListNode<T> | null = null
  public next: ListNode<T> | null = null

  constructor(
    public key: string,
    public value: T,
  ) {}
}

export class LRUCache<T> {
  private readonly _capacity: number
  private _cache: Map<string, ListNode<T>> = new Map()
  private _head: ListNode<T> | null = null
  private _tail: ListNode<T> | null = null

  constructor(capacity: number) {
    this._capacity = capacity
  }

  public get(key: string): T | undefined {
    const node = this._cache.get(key)
    if (!node) {
      return undefined
    }
    this._removeNode(node)
    this._addToHead(node)
    return node.value
  }

  public put(key: string, value: T) {
    const node = this._cache.get(key)
    if (node) {
      node.value = value
      this._removeNode(node)
      this._addToHead(node)
    } else {
      const newNode = new ListNode(key, value)
      this._cache.set(key, newNode)
      this._addToHead(newNode)
      if (this._cache.size > this._capacity) {
        const tail = this._tail
        if (!tail) {
          return
        }
        this._cache.delete(tail.key)
        this._removeNode(tail)
      }
    }
  }

  private _removeNode(node: ListNode<T>) {
    if (node.prev) {
      node.prev.next = node.next
    } else {
      this._head = node.next
    }

    if (node.next) {
      node.next.prev = node.prev
    } else {
      this._tail = node.prev
    }
  }

  private _addToHead(node: ListNode<T>) {
    if (this._head) {
      this._head.prev = node
      node.next = this._head
      this._head = node
    } else {
      this._head = node
      this._tail = node
    }
  }
}

export enum GenerateResult {
  Cancel = 'Cancel',
  Empty = 'Empty',
  Error = 'Error',
  Success = 'Success',
}

export interface GenerateResponse {
  result: GenerateResult
  data: string[]
}

export class PromptElements {
  contentContext: ContentContext

  constructor(context: ContentContext) {
    context.prefix = context.prefix.substring(context.prefix.length - 4000)
    context.suffix = context.suffix.substring(0, 4000)
    this.contentContext = context
  }

  async stringify() {
    const list: string[] = []
    list.push('<|fim_prefix|>')
    list.push(this.contentContext.prefix)
    list.push('<|fim_suffix|>')
    list.push(this.contentContext.suffix)
    list.push('<|fim_middle|>')
    return list.join('')
  }
}
