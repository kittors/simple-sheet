import Store from '../../store';

class VerticalScrollBar {
    private store = Store;
    private scrollBarElement: HTMLDivElement | null = null;
    private isDragging = false;
    private startY = 0;
    private scrollTop = 0;

    constructor() {
        this.init();
    }

    private init(): void {
        const config = this.store.getState('scrollBarConfig');
        const verticalConfig = config.vertical;
        const prefix = this.store.getState('prefix');

        // 创建滚动条容器
        const scrollBar = document.createElement('div');
        scrollBar.className = `${prefix}-vertical-scrollbar`;
        scrollBar.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: ${config.size}px;
            height: ${verticalConfig.scrollBgHeight}px;
            background-color: ${config.backgroundColor};
            z-index: 100;
        `;

        // 创建滚动条滑块
        const slider = document.createElement('div');
        slider.style.cssText = `
            position: absolute;
            width: 100%;
            height: ${verticalConfig.height}px;
            background-color: ${config.color};
            border-radius: ${config.borderRadius}px;
            cursor: pointer;
        `;

        scrollBar.appendChild(slider);
        const container = document.querySelector(`.${this.store.getState('containers').canvasContainer}`);
        if (container) {
            container.appendChild(scrollBar);
        }
        this.scrollBarElement = scrollBar;

        // 绑定事件
        this.bindEvents(slider);

        // 监听配置变化
        this.store.watch('scrollBarConfig', this.updateScrollBar.bind(this));
    }

    private bindEvents(slider: HTMLDivElement): void {
        slider.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onMouseDown(e: MouseEvent): void {
        this.isDragging = true;
        this.startY = e.clientY;
        this.scrollTop = this.scrollBarElement?.scrollTop || 0;
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isDragging) return;

        const config = this.store.getState('scrollBarConfig').vertical;
        const dy = e.clientY - this.startY;
        const scrollRatio = dy / (config.scrollBgHeight - config.height);
        const totalHeight = this.store.getState('sheetTotalSize').height;
        const containerHeight = this.store.getState('containerSize').height;

        // 计算新的滚动位置
        const newScrollTop = this.scrollTop + scrollRatio * (totalHeight - containerHeight);
        
        // 更新滚动位置
        if (this.scrollBarElement) {
            this.scrollBarElement.scrollTop = Math.max(0, Math.min(newScrollTop, totalHeight - containerHeight));
        }
    }

    private onMouseUp(): void {
        this.isDragging = false;
    }

    private updateScrollBar(newConfig: typeof Store.state.scrollBarConfig): void {
        if (!this.scrollBarElement) return;
        const slider = this.scrollBarElement.firstElementChild as HTMLDivElement;
        if (!slider) return;

        // 更新滚动条样式
        this.scrollBarElement.style.width = `${newConfig.size}px`;
        this.scrollBarElement.style.backgroundColor = newConfig.backgroundColor;
        
        slider.style.backgroundColor = newConfig.color;
        slider.style.borderRadius = `${newConfig.borderRadius}px`;
        slider.style.height = `${newConfig.vertical.height}px`;

   

        // 显示/隐藏滚动条
        this.scrollBarElement.style.display = newConfig.vertical.show ? 'block' : 'none';
    }

    public getElement(): HTMLDivElement | null {
        return this.scrollBarElement;
    }

    public destroy(): void {
        this.scrollBarElement?.remove();
        this.store.clearWatch('scrollBarConfig');
    }
}

export default VerticalScrollBar;
