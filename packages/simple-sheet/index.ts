import defaultConfig  from './config/defaultSheetConfig';
import store from './store';
import createSheet from './core/createSheet';
import { MemoryMonitor } from './utils/memoryMonitor';
import ScrollBarManager from './components/scrollBar';
class SimpleSheet {

    private static instance: SimpleSheet;
    private constructor () {
    }

    public static getInstance (): SimpleSheet {
        if(!SimpleSheet.instance) {
            SimpleSheet.instance = new SimpleSheet();
             // 开发环境下启用内存监控
            //  if (process.env.NODE_ENV === 'development') {
            //     MemoryMonitor.monitorStore();
            // }
        }
        return SimpleSheet.instance;
    }
    public async create (newSheetConfig: NewSheetConfig) {
        store.setState('isLoading', true);
        if ( !store.getState('isCreate') ) {
            store.setState('isCreate', true);
        }

        // 等待 setSheetConfig 完成
        await this.setSheetConfig(newSheetConfig);

        // 绘制表格
        await Promise.resolve(createSheet.startCreateSheet());

        // 绘制滚动条
        await Promise.resolve(ScrollBarManager.getInstance().getHorizontalScrollBar());

        // 绘制表格完成
        store.setState('isLoading', false);
    }

    public async setSheetConfig (newSheetConfig: NewSheetConfig) {
        const currentConfig:SheetConfig = { ...defaultConfig, ...newSheetConfig };
        await store.setState('sheetConfig', currentConfig);
    }
}


const instance:SimpleSheet = SimpleSheet.getInstance();

export default instance 
