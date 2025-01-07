import { Watcher, type WatchCallback, type WatchOptions } from './watcher';

export class Ref<T> {
    private value: T;
    private watcher: Watcher<{value: T}>;

    constructor(initialValue: T) {
        this.value = initialValue;
        this.watcher = new Watcher({value: initialValue});
    }

    public get(): T {
        return this.value;
    }

    public set(newValue: T): void {
        const oldValue = this.value;
        this.value = newValue;
        this.watcher.notify('value', newValue, oldValue);
    }

    public watch(
        callback: WatchCallback<{value: T}['value']>,
        options?: WatchOptions
    ): () => void {
        return this.watcher.watch('value', callback, options);
    }
}

// 创建ref的工厂函数
export function ref<T>(value: T): Ref<T> {
    return new Ref(value);
} 