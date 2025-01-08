import HorizontalScrollBar from './horizontalScrollBar';
import VerticalScrollBar from './verticalScrollBar';

class ScrollBarManager {
    private static instance: ScrollBarManager | null = null;
    private horizontalScrollBar: HorizontalScrollBar;
    private verticalScrollBar: VerticalScrollBar;

    private constructor() {
        this.horizontalScrollBar = new HorizontalScrollBar();
        this.verticalScrollBar = new VerticalScrollBar();
    }

    public static getInstance(): ScrollBarManager {
        if (!ScrollBarManager.instance) {
            ScrollBarManager.instance = new ScrollBarManager();
        }
        return ScrollBarManager.instance;
    }

    public static async destroy(): Promise<void> {
        if (ScrollBarManager.instance) {
            // 清理滚动条相关资源
            await ScrollBarManager.instance.horizontalScrollBar.destroy();
            await ScrollBarManager.instance.verticalScrollBar.destroy();
            ScrollBarManager.instance = null;
        }
    }

    public getHorizontalScrollBar(): HorizontalScrollBar {
        return this.horizontalScrollBar;
    }

    public getVerticalScrollBar(): VerticalScrollBar {
        return this.verticalScrollBar;
    }
}

export default ScrollBarManager.getInstance();