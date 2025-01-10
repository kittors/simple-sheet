type Subscriber = () => void; // 订阅者类型

class ReactiveCore {
    // 静态变量：全局依赖存储
    private static subscribers = new WeakMap<object, Map<string | symbol, Set<Subscriber>>>();

    // 当前活动的副作用函数
    public static activeEffect: Subscriber | null = null;

    /**
     * 依赖追踪：记录属性访问时的依赖
     */
    static track(target: object, key: string | symbol) {
        if (!ReactiveCore.subscribers.has(target)) {
            ReactiveCore.subscribers.set(target, new Map());
        }
        const targetMap = ReactiveCore.subscribers.get(target)!;
        if (!targetMap.has(key)) {
            targetMap.set(key, new Set());
        }
        const dep = targetMap.get(key)!;
        if (ReactiveCore.activeEffect) {
            dep.add(ReactiveCore.activeEffect);
        }
    }

    /**
     * 触发依赖：通知依赖该属性的订阅者
     */
    static trigger(target: object, key: string | symbol) {
        const targetMap = ReactiveCore.subscribers.get(target);
        if (!targetMap) return;
        const dep = targetMap.get(key);
        if (dep) {
            dep.forEach((effect) => effect());
        }
    }
}

export function reactive<T extends Record<PropertyKey, any>>(target: T ): T {
    // 检查是否为对象
    if (typeof target !== 'object' || target === null) {
        console.warn("reactive 只能用于对象类型");
        return target;
    }

    // 创建并返回代理对象
    return new Proxy(target, {
        // 拦截属性访问
        get(target, key, receiver) {
            // 依赖追踪
            ReactiveCore.track(target, key);

            // 获取属性值
            const value = Reflect.get(target, key, receiver);

            // 如果属性值是对象，递归转化为响应式对象
            if (typeof value === 'object' && value !== null) {
                return reactive(value); // 嵌套响应式
            }

            return value;
        },

        // 拦截属性设置
        set(target, key, value, receiver) {
            const oldValue = target[key];
            const result = Reflect.set(target, key, value, receiver);

            // 如果值发生了变化，触发依赖
            if (oldValue !== value) {
                ReactiveCore.trigger(target, key);
            }

            return result;
        },

        // 拦截属性删除
        deleteProperty(target, key) {
            const result = Reflect.deleteProperty(target, key);

            // 触发依赖（通知删除事件）
            ReactiveCore.trigger(target, key);

            return result;
        },
    });
}

export default ReactiveCore