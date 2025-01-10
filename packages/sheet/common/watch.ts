import ReactiveCore from "./Reactive";

function watch(getter: () => any, callback: (newValue: any, oldValue: any) => void) {
    let oldValue: any;
    const effect = () => {
        const newValue = getter(); // 获取当前值
        if (newValue !== oldValue) {
            callback(newValue, oldValue); // 调用回调
            oldValue = newValue;
        }
    };

    // 初始化时触发依赖收集
    ReactiveCore.activeEffect = effect;
    oldValue = getter(); // 初始化时获取旧值
    ReactiveCore.activeEffect = null;
}


export default watch;