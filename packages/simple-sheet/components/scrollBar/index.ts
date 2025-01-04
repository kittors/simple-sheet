import HorizontalScrollBar from './horizontalScrollBar';
import VerticalScrollBar from './verticalScrollBar';

class ScrollBarManager {
    private static instance: ScrollBarManager;
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

    public getHorizontalScrollBar(): HorizontalScrollBar {
        return this.horizontalScrollBar;
    }

    public getVerticalScrollBar(): VerticalScrollBar {
        return this.verticalScrollBar;
    }
}

export default ScrollBarManager;
