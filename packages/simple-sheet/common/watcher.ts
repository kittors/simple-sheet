import type { State } from '../store/type';

export type WatchCallback<T> = (newValue: T, oldValue: T) => void;

export interface WatchOptions {
    immediate?: boolean;
    once?: boolean;
    deep?: boolean;
}

interface Watch<T> {
    callbacks: Set<WatchCallback<T>>;
    options: WatchOptions;
}

export class Watcher {
    private store: { state: State };
    private watches: Map<keyof State, Watch<any>> = new Map();

    constructor(store: { state: State }) {
        this.store = store;
    }

    public watch<K extends keyof State>(
        key: K,
        callback: WatchCallback<State[K]>,
        options: WatchOptions = { immediate: false, once: true, deep: false }
    ): () => void {
        const existingWatch = this.watches.get(key);
        
        if (existingWatch) {
            existingWatch.callbacks.add(callback);
            if (options.immediate) {
                const currentValue = this.getCurrentValue(key);
                const value = options.deep ? JSON.parse(JSON.stringify(currentValue)) : currentValue;
                callback(value, value);
            }
            return () => {
                existingWatch.callbacks.delete(callback);
            };
        }

        const watch: Watch<State[K]> = {
            callbacks: new Set([callback]),
            options
        };
        this.watches.set(key, watch);

        if (options.immediate) {
            const currentValue = this.getCurrentValue(key);
            const value = options.deep ? JSON.parse(JSON.stringify(currentValue)) : currentValue;
            callback(value, value);
        }

        return () => {
            watch.callbacks.delete(callback);
            if (watch.callbacks.size === 0) {
                this.watches.delete(key);
            }
        };
    }

    public async notify<K extends keyof State>(
        key: K, 
        newValue: State[K], 
        oldValue: State[K]
    ): Promise<void> {
        const watch = this.watches.get(key);
        if (watch) {
            await Promise.all(
                Array.from(watch.callbacks).map(callback => {
                    const newVal = watch.options.deep ? JSON.parse(JSON.stringify(newValue)) : newValue;
                    const oldVal = watch.options.deep ? JSON.parse(JSON.stringify(oldValue)) : oldValue;
                    return Promise.resolve(callback(newVal, oldVal));
                })
            );
            
            if (watch.options.once) {
                this.watches.delete(key);
            }
        }
    }

    public clearWatch(key?: keyof State) {
        if (key) {
            this.watches.delete(key);
        } else {
            this.watches.clear();
        }
    }

    private getCurrentValue<K extends keyof State>(key: K): State[K] {
        return this.store.state[key];
    }
}
