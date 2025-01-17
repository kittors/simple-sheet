type Listener = () => void;
import type { State } from './type';
import { Watcher } from '../common/watcher';
import state from './state';
type WatchCallback<T> = (newValue: T, oldValue: T) => void;

interface WatchOptions {
    immediate?: boolean;
    once?: boolean;
    deep?: boolean;
}

interface IWatcher {
    watch<K extends keyof State>(
        key: K,
        callback: WatchCallback<State[K]>,
        options: WatchOptions
    ): () => void;
    notify<K extends keyof State>(key: K, newValue: State[K], oldValue: State[K]): Promise<void>;
    clearWatch(key?: keyof State): void;
}

class Store {
    private static instance: Store;
    private watcher: IWatcher;
    
    public state: State = state;
    private listeners: Listener[] = [];

    private constructor(watcher: IWatcher) {
        this.watcher = watcher;
        if (this.watcher instanceof Watcher) {
            this.watcher.setTarget(this.state);
        }
    }

    public static getInstance(watcher?: IWatcher): Store {
        if (!Store.instance) {
            if (!watcher) {
                watcher = new Watcher<State>();
            }
            Store.instance = new Store(watcher);
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
        options: WatchOptions = { immediate: false, once: true, deep: false }
    ): () => void {
        return this.watcher.watch(key, callback, options);
    }

    public async setState<K extends keyof typeof this.state>(
        key: K,
        value: typeof this.state[K]
    ): Promise<void> {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        await this.watcher.notify(key, value, oldValue);
        this.notify();
    }

    public getState<K extends keyof typeof this.state>(key: K): typeof this.state[K] {
        return this.state[key];
    }

    public clearWatch(key?: keyof State) {
        this.watcher.clearWatch(key);
    }
}

export default Store.getInstance(new Watcher<State>()); 