import Store from '../../store';

class HorizontalScrollBar {
    private store = Store;
    private scrollBarElement: HTMLDivElement | null = null;
    private isDragging = false;
    private startX = 0;
    private scrollLeft = 0;

    constructor() {
        this.init();
    }

    private init(): void {
        const config = this.store.getState('scrollBarConfig');
        const prefix = this.store.getState('prefix');

        // 创建滚动条容器
        const scrollBar = document.createElement('div');
        scrollBar.className = `${prefix}-horizontal-scrollbar`;
        scrollBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: ${config.size}px;
            background-color: ${config.backgroundColor};
            z-index: 100;
        `;

        // 创建滚动条滑块
        const slider = document.createElement('div');
        slider.style.cssText = `
            position: absolute;
            height: 100%;
            background-color: ${config.color};
            border-radius: ${config.borderRadius}px;
            cursor: pointer;
        `;

        scrollBar.appendChild(slider);
        this.scrollBarElement = scrollBar;

        // 绑定事件
        this.bindEvents(slider);

        // 监听配置变化
        this.store.watch('scrollBarConfig', this.updateScrollBar.bind(this), { immediate: true });
    }

    private bindEvents(slider: HTMLDivElement): void {
        slider.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onMouseDown(e: MouseEvent): void {
        this.isDragging = true;
        this.startX = e.clientX;
        this.scrollLeft = this.scrollBarElement?.scrollLeft || 0;
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isDragging) return;

        const config = this.store.getState('scrollBarConfig').horizontal;
        const dx = e.clientX - this.startX;
        const scrollRatio = dx / (config.scrollBgWidth - config.width);
        const totalWidth = this.store.getState('sheetTotalSize').width;
        const containerWidth = this.store.getState('containerSize').width;

        // 计算新的滚动位置
        const newScrollLeft = this.scrollLeft + scrollRatio * (totalWidth - containerWidth);
        
        // 更新滚动位置
        if (this.scrollBarElement) {
            this.scrollBarElement.scrollLeft = Math.max(0, Math.min(newScrollLeft, totalWidth - containerWidth));
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
        this.scrollBarElement.style.height = `${newConfig.size}px`;
        this.scrollBarElement.style.backgroundColor = newConfig.backgroundColor;
        
        slider.style.backgroundColor = newConfig.color;
        slider.style.borderRadius = `${newConfig.borderRadius}px`;
        slider.style.width = `${newConfig.horizontal.width}px`;

        // 显示/隐藏滚动条
        this.scrollBarElement.style.display = newConfig.horizontal.show ? 'block' : 'none';
    }

    public getElement(): HTMLDivElement | null {
        return this.scrollBarElement;
    }

    public destroy(): void {
        this.scrollBarElement?.remove();
        this.store.clearWatch('scrollBarConfig');
    }
}

export default HorizontalScrollBar;
