import { Watcher, type WatchCallback, type WatchOptions } from './watcher';

export class Reactive<T extends object> {
    private state: T;
    private watcher: Watcher<T>;

    constructor(initialState: T) {
        this.state = initialState;
        this.watcher = new Watcher(initialState);
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.state[key];
    }

    public set<K extends keyof T>(key: K, value: T[K]): void {
        const oldValue = this.state[key];
        this.state[key] = value;
        this.watcher.notify(key, value, oldValue);
    }

    public watch<K extends keyof T>(
        key: K,
        callback: WatchCallback<T[K]>,
        options?: WatchOptions
    ): () => void {
        return this.watcher.watch(key, callback, options);
    }

    public getWatcher(): Watcher<T> {
        return this.watcher;
    }
}

// 创建reactive的工厂函数
export function reactive<T extends object>(state: T): T {
    const reactiveObj = new Reactive(state);
    const proxy = new Proxy(state, {
        get(target, key) {
            return reactiveObj.get(key as keyof T);
        },
        set(target, key, value) {
            reactiveObj.set(key as keyof T, value);
            return true;
        }
    });
    
    (proxy as any).__watcher = reactiveObj.getWatcher();
    return proxy;
} 