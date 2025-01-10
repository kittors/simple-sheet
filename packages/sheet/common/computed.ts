import ReactiveCore from "./Reactive";

function computed<T>(getter: () => T): { value: T } {
    let value: T;
    let dirty = true; // 是否需要重新计算
    const effect = () => {
        dirty = true;
    };

    // 创建计算属性的代理
    const proxy = {
        get value() {
            if (dirty) {
                value = getter();
                dirty = false;
            }
            return value;
        },
    };

    // 订阅依赖变化
    ReactiveCore.activeEffect = effect;
    getter(); // 触发依赖收集
    ReactiveCore.activeEffect = null;

    return proxy;
}


export default computed;