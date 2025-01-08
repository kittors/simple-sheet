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

export class Watcher<T extends object = any> {
    private target: T;
    private watches: Map<keyof T, Watch<any>> = new Map();

    constructor(target?: T) {
        this.target = target || {} as T;
    }

    public watch<K extends keyof T>(
        key: K,
        callback: WatchCallback<T[K]>,
        options: WatchOptions = { immediate: false, once: true, deep: false }
    ): () => void {
        const existingWatch = this.watches.get(key);
        
        if (existingWatch) {
            existingWatch.callbacks.add(callback);
            if (options.immediate) {
                const currentValue = this.getCurrentValue(key);
                const value = options.deep ? this.deepClone(currentValue) : currentValue;
                callback(value, value);
            }
            return () => {
                existingWatch.callbacks.delete(callback);
            };
        }

        const watch: Watch<T[K]> = {
            callbacks: new Set([callback]),
            options
        };
        this.watches.set(key, watch);

        if (options.immediate) {
            const currentValue = this.getCurrentValue(key);
            const value = options.deep ? this.deepClone(currentValue) : currentValue;
            callback(value, value);
        }

        return () => {
            watch.callbacks.delete(callback);
            if (watch.callbacks.size === 0) {
                this.watches.delete(key);
            }
        };
    }

    private deepClone<V>(value: V): V {
        if (value === null || typeof value !== 'object') {
            return value;
        }

        if (Array.isArray(value)) {
            return value.map(item => this.deepClone(item)) as any;
        }

        const result = {} as V;
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                if (key === '__watcher') continue;
                result[key] = this.deepClone(value[key]);
            }
        }
        return result;
    }

    public async notify<K extends keyof T>(
        key: K, 
        newValue: T[K], 
        oldValue: T[K]
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

    public clearWatch(key?: keyof T) {
        if (key) {
            this.watches.delete(key);
        } else {
            this.watches.clear();
        }
    }

    private getCurrentValue<K extends keyof T>(key: K): T[K] {
        return this.target[key];
    }

    public setTarget(target: T): void {
        this.target = target;
    }
}

export const watch = () => new Watcher().watch;