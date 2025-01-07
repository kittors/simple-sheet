import store from '../store';
import draw from './draw';
class CreateSheet {
    private static instance: CreateSheet;

    private constructor() {}

    public static getInstance(): CreateSheet {
        if(!CreateSheet.instance) {
            CreateSheet.instance = new CreateSheet();
        }
        return CreateSheet.instance;
    }

    public startCreateSheet() {
        this.watchStoreChanges();
    }

    private watchStoreChanges() {
        // 监听缩放变化
        store.watch('scale', () => draw.startDraw(), {
            immediate: false,
            once: false
        });

        // 监听容器尺寸变化
        store.watch('containerSize', ({height, width}) => {
            if(height && width) draw.startDraw();
        }, {
            immediate: true,
            once: false
        });

        // 监听滚动条变化
        store.watch('scrollBarConfig', (newValue, oldValue) => {
            const {vertical, horizontal} = newValue;
            if(vertical.top !== oldValue.vertical.top || 
               horizontal.left !== oldValue.horizontal.left) {
                draw.startDraw();
            }
        }, {
            immediate: false,
            deep: true,
            once: false
        });
    }
}

const instance = CreateSheet.getInstance();
export default instance;
