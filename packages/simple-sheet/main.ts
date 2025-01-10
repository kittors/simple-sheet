import defaultConfig  from './config/defaultSheetConfig';
import store from './store';
import createSheet from './core/createSheet';
import ScrollBarManager from './components/scrollBar';
import Loading from './components/loading';
import controlManager from './core/control';
import container from './components/container';
import { hook } from './common';

class SimpleSheet {

    private static instance: SimpleSheet | null = null;


    private constructor () { }

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
        store.setState('isLoading', true);

        // 设置配置
        await Promise.resolve(this.setSheetConfig(newSheetConfig));

        // 初始化容器
        await Promise.resolve(container.init());

        // 加载Loaidng Loading是依赖于容器 所以需要等容器加载完成
        await Promise.resolve(Loading.init());

        // 加载控制器
        await Promise.resolve(controlManager.loadAllControllers());

        // 绘制表格
        await Promise.resolve(createSheet.startCreateSheet());

        // 绘制滚动条
        await Promise.resolve(ScrollBarManager.getHorizontalScrollBar());

        store.setState('isLoading', false);
        await hook.emit('afterCreate');

        // 清理配置中注册的钩子，避免重复调用
        if (newSheetConfig.hook) {
            Object.keys(newSheetConfig.hook).forEach(hookName => {
                hook.off(hookName);
            });
        }
    }
    

    private async setSheetConfig (newSheetConfig: NewSheetConfig) {
        const currentConfig:SheetConfig = { ...defaultConfig, ...newSheetConfig };
        await store.setState('sheetConfig', currentConfig);
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
