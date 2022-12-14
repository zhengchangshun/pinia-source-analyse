import { getCurrentScope, onScopeDispose } from 'vue-demi'
import { _Method } from './types'

export const noop = () => {}

// 发布订阅
export function addSubscription<T extends _Method>(
  subscriptions: T[],
  callback: T,
  detached?: boolean,
  onCleanup: () => void = noop
) {
  subscriptions.push(callback)

  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback)
    if (idx > -1) {
      subscriptions.splice(idx, 1)
      onCleanup()
    }
  }

  // detached 如果是 false，则当前 scope 销毁时，会清理掉监听
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription)
  }

  return removeSubscription
}

export function triggerSubscriptions<T extends _Method>(
  subscriptions: T[],
  ...args: Parameters<T>
) {
  subscriptions.slice().forEach((callback) => {
    callback(...args)
  })
}
