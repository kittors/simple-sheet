import defaultConfig  from './config/defaultSheetConfig';
import store from './store';
import createSheet from './core/createSheet';
import ScrollBarManager from './components/scrollBar';
import Loading from './components/loading';

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
        if ( !store.getState('isCreate') ) {
            store.setState('isCreate', true);
        }

        // 等待 setSheetConfig 完成
        await Promise.resolve(this.setSheetConfig(newSheetConfig));

        // 绘制表格
        await Promise.resolve(createSheet.startCreateSheet());

        // 绘制滚动条
        await Promise.resolve(ScrollBarManager.getInstance().getHorizontalScrollBar());

        // 绘制表格完成
        setTimeout(() => {
            store.setState('isLoading', false);
        }, 5000);
    }

    private async setSheetConfig (newSheetConfig: NewSheetConfig) {
        const currentConfig:SheetConfig = { ...defaultConfig, ...newSheetConfig };
        await store.setState('sheetConfig', currentConfig);
    }
}


const instance:SimpleSheet = SimpleSheet.getInstance();

export { instance }; 
