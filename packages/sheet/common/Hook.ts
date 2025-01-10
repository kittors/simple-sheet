class Hook {
    private static instance: Hook | null = null;
    private hooks: Map<string, Function[]> = new Map();

    private constructor() { }

    public static getInstance(): Hook {
        if (!Hook.instance) {
            Hook.instance = new Hook();
        }
        return Hook.instance;
    }

    /**
     * 注册钩子函数
     * @param hookName 钩子名称
     * @param callback 回调函数
     */
    public on(hookName: string, callback: Function) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }
        this.hooks.get(hookName)?.push(callback);
    }

    /**
     * 触发钩子函数 每一个钩子都将等待上一个钩子执行完成后执行
     * @param hookName 钩子名称
     * @param args 传递给钩子函数的参数
     */
    public async emit(hookName: string, ...args: any[]) {
        const callbacks = this.hooks.get(hookName) || [];
        for (const callback of callbacks) {
            await Promise.resolve(callback(...args));
        }
    }

    /**
     * 移除钩子函数
     * @param hookName 钩子名称
     * @param callback 要移除的回调函数（可选，如果不传则移除该钩子的所有回调）
     */
    public off(hookName: string, callback?: Function) {
        if (!callback) {
            this.hooks.delete(hookName);
            return;
        }
        
        const callbacks = this.hooks.get(hookName);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
            if (callbacks.length === 0) {
                this.hooks.delete(hookName);
            }
        }
    }

    /**
     * 清理所有钩子并重置单例
     */
    public clear() {
        this.hooks.clear();
        Hook.instance = null;
    }
}

// 导出单例实例
const hookInstance = Hook.getInstance();
export default hookInstance;