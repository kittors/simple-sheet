import { hook, reactive, watch, ref, store} from './common';

// import sheetStore from './store/sheet';
class SimpleSheet {
    private static instance: SimpleSheet | null = null;

    private constructor () {}

    public static getInstance (): SimpleSheet {
        if(!SimpleSheet.instance) {
            SimpleSheet.instance = new SimpleSheet();
        }
        return SimpleSheet.instance;
    }

    public async create (newSheetConfig: NewSheetConfig) {
         // 注册配置中的钩子
         if (newSheetConfig.hook) {
            for (const [hookName, callback] of Object.entries(newSheetConfig.hook)) {
                if (typeof callback === 'function') {
                    hook.on(hookName, callback);
                }
            }
        }

        await hook.emit('beforeCreate', {
            config: newSheetConfig,
            instance: this
        });


        // 定义一个简单的 Store
        store.defineStore('counter', {
            state: () => ({
                count: 0,
            }),
            getters: {
                doubleCount() {
                    return this.count * 2;
                },
            },
            actions: {
                increment() {
                    this.count++;
                },
                decrement() {
                    this.count--;
                },
            },
        });

        // 使用该 Store
        const counterStore = store.useStore('counter');

        watch(()=>counterStore.count,(newValue, oldValue)=>{
            console.log(`counterStore.count ${oldValue} to ${newValue}`)
        })

        console.log(counterStore.count); // 输出：0
        console.log(counterStore.doubleCount); // 输出：0

        counterStore.increment();
        console.log(counterStore.count); // 输出：1
        console.log(counterStore.doubleCount); // 输出：2

        counterStore.decrement();
        console.log(counterStore.count); // 输出：0
        console.log(counterStore.doubleCount); // 输出：0
        
    }

    public async destroy() {
        // 清理所有钩子
        hook.clear();

        // 清理滚动条
        // await ScrollBarManager.destroy();

        // // 清理控制器
        // await controlManager.destroy();

        // // 清理容器
        // await container.destroy();

        // // 重置 store 状态
        // store.reset();

        // 清理单例实例
        SimpleSheet.instance = null;
    }
}

const instance:SimpleSheet = SimpleSheet.getInstance();

export { instance }; 