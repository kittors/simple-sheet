import defaultConfig  from './config/defaultSheetConfig';
import store from './store';
import createSheet from './core/createSheet';
import ScrollBarManager from './components/scrollBar';
import Loading from './components/loading';
import controlManager from './core/control';
import container from './components/container';

class SimpleSheet {

    private static instance: SimpleSheet;
    private constructor () {
    }

    public static getInstance (): SimpleSheet {
        if(!SimpleSheet.instance) {
            SimpleSheet.instance = new SimpleSheet();
        }
        return SimpleSheet.instance;
    }
    public async create (newSheetConfig: NewSheetConfig) {
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
        await Promise.resolve(ScrollBarManager.getInstance().getHorizontalScrollBar());

        store.setState('isLoading', false);
    }

    private async setSheetConfig (newSheetConfig: NewSheetConfig) {
        const currentConfig:SheetConfig = { ...defaultConfig, ...newSheetConfig };
        await store.setState('sheetConfig', currentConfig);
    }
}


const instance:SimpleSheet = SimpleSheet.getInstance();

export { instance }; 
