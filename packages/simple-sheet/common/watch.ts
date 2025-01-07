import { Ref } from './ref';
import { Reactive } from './reactive';
import type { WatchCallback, WatchOptions } from './watcher';

export function watch<T>(
    source: Ref<T>,
    callback: WatchCallback<T>,
    options?: WatchOptions
): () => void;
export function watch<T extends object, K extends keyof T>(
    source: Reactive<T>,
    key: K,
    callback: WatchCallback<T[K]>,
    options?: WatchOptions
): () => void;
export function watch<T extends object, K extends keyof T>(
    source: Ref<T> | Reactive<T>,
    keyOrCallback: K | WatchCallback<T>,
    callbackOrOptions?: WatchCallback<T[K]> | WatchOptions,
    options?: WatchOptions
): () => void {
    if (source instanceof Ref) {
        return source.watch(keyOrCallback as WatchCallback<T>, callbackOrOptions as WatchOptions);
    }
    return source.watch(keyOrCallback as K, callbackOrOptions as WatchCallback<T[K]>, options);
} 