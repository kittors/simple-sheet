import store from '../store';
import draw from './draw';
import controlManager from './control';

class CreateSheet {

    private static instance: CreateSheet;

    private constructor () {}

    public static getInstance (): CreateSheet {
        if(!CreateSheet.instance) {
            CreateSheet.instance = new CreateSheet();
        }

        return CreateSheet.instance
    }
    public startCreateSheet () {
        if (!store.getState('isStartCreateSheet')) {
            console.log('开始创建表格...');
            store.setState('isStartCreateSheet', true);
        }
        this.createSheetContainer();

        // 监听缩放变化
        store.watch('scale', () => {
            draw.startDraw();
        }, {
            immediate: false,
            once: false
        });

        // 监听容器尺寸变化
        store.watch('containerSize', async (newValue, oldValue) => {
            const {height,width} = newValue;
            if(height !== 0 && width !== 0) {
                // 开始绘制
                draw.startDraw();
            }
        },{
            immediate: true,
            once: false
        });

        // 监听滚动条的变化
        store.watch('scrollBarConfig', (newValue, oldValue) => {
           // 检查垂直滚动条 top 和 水平滚动条的 left 是否变化
           if(newValue.vertical.top !== oldValue.vertical.top || newValue.horizontal.left !== oldValue.horizontal.left) {
            console.log('垂直滚动条 top 或 水平滚动条的 left 发生变化');
           }
        }, {
            immediate: false,
            deep: true,
            once: false
        });
    }

    private async createSheetContainer () {
       
        // 初始化容器
        this.initSheetContainer();
        // 使用 window 的 resize 事件
        this.resizeSheetContainer();
        // 加载缩放控制器
        controlManager.getScaleController();
       
    }

    private resizeSheetContainer () {
        const handleResize = () => {
            if (this.containerDom && this.sheetContainer) {
                const newWidth = this.containerDom.clientWidth;
                const newHeight = this.containerDom.clientHeight;
                // 直接获取当前的容器尺寸
                const currentWidth = this.sheetContainer.style.width;
                const currentHeight = this.sheetContainer.style.height;
                
                // 转换新尺寸为像素字符串，方便比较
                const newWidthPx = `${newWidth}px`;
                const newHeightPx = `${newHeight}px`;
                
                // 比较实际尺寸
                if (currentWidth === newWidthPx && currentHeight === newHeightPx) {
                    return;
                }
                this.sheetContainer.style.width = newWidth + 'px';
                this.sheetContainer.style.height = newHeight + 'px';
                store.setState('containerSize', {
                    width: newWidth,
                    height: newHeight
                });
            }
        };

        // 清理事件
        this.cleanup();
    
        // 同时使用 ResizeObserver 和 window.resize 事件
        const resizeObserver = new ResizeObserver(handleResize);
        if (this.containerDom) {
            resizeObserver.observe(this.containerDom);
        }

        // 添加窗口 resize 事件监听
        window.addEventListener('resize', handleResize);

        // 存储清理函数供后续使用
        store.setState('cleanupResize', () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        });
    }

    private containerDom: HTMLElement | null = null;
    private sheetContainer: HTMLElement | null = null;

    private initSheetContainer () {
        const container = store.getState('sheetConfig').container;
        this.containerDom = document.getElementById(container);
        this.sheetContainer = document.createElement('div');
        this.sheetContainer.className = `${store.getState('prefix')}-container`;
        
        // 初始设置容器尺寸
        if (this.containerDom) {
            this.sheetContainer.style.width = this.containerDom.clientWidth + 'px';
            this.sheetContainer.style.height = this.containerDom.clientHeight + 'px';
            this.containerDom.appendChild(this.sheetContainer);
            store.setState('containerSize', {
                width: this.containerDom.clientWidth,
                height: this.containerDom.clientHeight
            });
        }
    }

    private cleanup () {
        const cleanupResize = store.getState('cleanupResize');
        if (cleanupResize) {
            cleanupResize();
        }
    }

    // 获取控制器管理器的公共方法
    public getControlManager() {
        return controlManager;
    }
}

const instance: CreateSheet =  CreateSheet.getInstance();

export default instance;
