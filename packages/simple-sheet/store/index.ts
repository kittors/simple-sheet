type Listener = () => void;
import type { State } from './type';
import { Watcher } from '../common/watcher';

type WatchCallback<T> = (newValue: T, oldValue: T) => void;

interface WatchOptions {
    immediate?: boolean;
    once?: boolean;
    deep?: boolean;
}

class Store {
    private static instance: Store;
    private watcher: Watcher;
    
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
            color: 'rgb(222, 224, 227)',
            activeColor: 'rgb(180, 182, 185)',
            backgroundColor: '#fff',
            borderRadius: 5,
            size: 16,
            gap: 8,
            borderColor: '#E8E9E9',
            borderWidth: 1,
            scrollSpeed: 0.1,
            minSize: 20,
            horizontal: {
                show: false,
                width: 0,
                scrollBgWidth: 0,
                left: 0,
            },
            vertical: {
                show: false,
                height: 0,
                scrollBgHeight: 0,
                top: 0,
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

    private constructor() {
        this.watcher = new Watcher(this);
    }

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

export default Store.getInstance(); 