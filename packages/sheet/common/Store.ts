import { reactive }from './Reactive';

type StateTree = Record<PropertyKey, any>;
type _Method = (...args: any[]) => any;
type Actions =  Record<PropertyKey, _Method>;
type _GettersTree = Record<PropertyKey, (() => any)>;
type StoreOptions<S extends StateTree, G extends _GettersTree, A extends Actions> = {
    state?: () => S;
    getters?: G & ThisType<S & G & A>;
    actions?: A & ThisType<S & G & A>;
};

export class Store {
    private static instance: Store | null = null;
    // 使用 Map 来存储所有 Store，并用通用类型定义
    private static stores = new Map<
        string,
        {
            state: StateTree;
            getters: _GettersTree;
            actions: Actions;
        }
    >();

    private constructor() { }

    public static getInstance(): Store {
        if (!this.instance) {
            this.instance = new Store();
        }
        return this.instance;
    }

    public defineStore<S extends StateTree , G extends _GettersTree, A extends Actions>(id: string, storeOptions: StoreOptions<S, G, A>) {
        // 检查是否已经存在
        if (Store.stores.has(id)) {
            throw new Error(`A store with id "${id}" already exists.`);
        }
    
        // 将 Store 的 state 转换为响应式对象
        const state = storeOptions.state ? reactive(storeOptions.state()) : {};
        const getters = storeOptions.getters || {};
        const actions = storeOptions.actions || {};
    
        // 保存到 Map
        Store.stores.set(id, { state, getters, actions });
    }

    private getStore(id: string) {
        const store = Store.stores.get(id);
        if (!store) {
            throw new Error(`Store with id "${id}" does not exist.`);
        }
        return store;
    }

    private setStore(id: string, newState: Partial<StateTree>) {
        const store = Store.stores.get(id);
        if (!store) {
            throw new Error(`Store with id "${id}" does not exist.`);
        }
        store.state = { ...store.state, ...newState };
        Store.stores.set(id, store);
    }

    public useStore(id: string) {
        const store = this.getStore(id);
        const reactiveState = reactive(store.state);
        return new Proxy(reactiveState, {
            get(target, key, receiver) {
                if (key in store.getters) {
                    return store.getters[key].call(receiver);
                }
                if (key in store.actions) {
                    return store.actions[key];
                }
                return Reflect.get(target, key, receiver);
            },
            set(target, key, value) {
                const result = Reflect.set(target, key, value);
                return result;
            },
        });
    }


    public static destroy() {
        this.instance = null;
    }
}

export default Store.getInstance();
