import { Ref } from './ref';
import { Reactive } from './reactive';
import type { WatchCallback, WatchOptions } from './watcher';

let activeEffect: (() => void) | null = null;
const targetMap = new WeakMap();

function track(target: any, key: string | symbol) {
    if (!activeEffect) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }
    dep.add(activeEffect);
}

function trigger(target: any, key: string | symbol) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const dep = depsMap.get(key);
    if (dep) {
        dep.forEach((effect: () => void) => effect());
    }
}

export function watch<T>(
    source: T | (() => T),
    callback: WatchCallback<T>,
    options: WatchOptions = {}
): () => void {
    let getter: () => T;
    if (typeof source === 'function') {
        getter = source as () => T;
    } else {
        getter = () => source;
    }

    let oldValue = getter();
    
    const runner = () => {
        const newValue = getter();
        if (oldValue !== newValue) {
            callback(newValue, oldValue);
            oldValue = newValue;
        }
    };

    activeEffect = runner;
    getter();  // 初始收集依赖
    activeEffect = null;

    if (options.immediate) {
        callback(oldValue, oldValue);
    }

    return () => {
        // cleanup
    };
}

export { track, trigger }; 