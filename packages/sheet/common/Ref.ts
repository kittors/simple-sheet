type Subscriber = () => void; // 订阅者类型
import ReactiveCore from "./Reactive";
class Ref<T> {
    private _value: T; // 存储的值
    private subscribers: Set<Subscriber> = new Set(); // 存储依赖的副作用函数

    constructor(value: T) {
        this._value = value;
    }

    // getter: 访问值时收集依赖
    get value(): T {
        if (ReactiveCore.activeEffect) {
            this.subscribers.add(ReactiveCore.activeEffect); // 添加当前活动副作用到订阅者集合
        }
        return this._value;
    }

    // setter: 修改值时触发依赖更新
    set value(newValue: T) {
        if (this._value !== newValue) {
            this._value = newValue;
            this.trigger(); // 通知所有订阅者
        }
    }

    // 手动触发更新
    private trigger() {
        this.subscribers.forEach((effect) => effect()); // 遍历并执行所有依赖
    }
}

export function ref<T>(value: T): Ref<T> {
    return new Ref(value);
}
