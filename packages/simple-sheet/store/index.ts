type Listener = () => void;
import type { State } from './type';

type WatchCallback<T> = (newValue: T, oldValue: T) => void;

interface WatchOptions {
    immediate?: boolean;
    once?: boolean;
}

interface Watch<T> {
    callbacks: Set<WatchCallback<T>>;
    options: WatchOptions;
}

class Store {
    private static instance: Store;
    private watches: Map<keyof State, Watch<any>> = new Map();
    
    public state: State = {
        isLoading: false,
        isCreate: false,
        isStartCreateSheet: false,
        scale: 1,
        isDraw: false,
        prefix: 'simple-sheet',
        containers: {
            canvasContainer: '',
        },
        drawCellData: new Map(),
        sheetTotalSize: {
            width: 0,
            height: 0,
        },
        scrollBarConfig: {
            color: '#000',
            backgroundColor: '#fff',
            borderRadius: 0,
            size: 10,
            horizontal: {
                show: false,
                width: 0,
                minWidth: 40,
                scrollBgWidth: 0,
            },
            vertical: {
                show: false,
                height: 0,
                minHeight: 40,
                scrollBgHeight: 0,
            },
        },
        sheetConfig: {
            container: '',
            widths: new Map(),
            heights: new Map(),
        },
        containerSize: {
            width: 0,
            height: 0,
        },
    }

    private listeners: Listener[] = [];

    private constructor() {}

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public subscribe(listener: Listener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify(): void {
        this.listeners.forEach(listener => listener());
    }

    // 监听状态变化
    public watch<K extends keyof State>(
        key: K,
        callback: WatchCallback<State[K]>,
        options: WatchOptions = { immediate: false, once: true }
    ): () => void {
        const existingWatch = this.watches.get(key);
        
        if (existingWatch) {
            existingWatch.callbacks.add(callback);
            if (options.immediate) {
                callback(this.state[key], this.state[key]);
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
            callback(this.state[key], this.state[key]);
        }

        return () => {
            watch.callbacks.delete(callback);
            if (watch.callbacks.size === 0) {
                this.watches.delete(key);
            }
        };
    }

    public async setState<K extends keyof typeof this.state>(
        key: K,
        value: typeof this.state[K]
    ): Promise<void> {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        const watch = this.watches.get(key);
        if (watch) {
            // 使用 Promise.all 等待所有回调执行完成
            await Promise.all(
                Array.from(watch.callbacks).map(callback =>
                    Promise.resolve(callback(value, oldValue))
                )
            );
            
            if (watch.options.once) {
                this.watches.delete(key);
            }
        }

        this.notify();
    }

    public getState<K extends keyof typeof this.state>(key: K): typeof this.state[K] {
        return this.state[key];
    }

    public clearWatch(key?: keyof State) {
        if (key) {
            this.watches.delete(key);
        } else {
            this.watches.clear();
        }
    }
}

export default Store.getInstance(); 