import Store from '../../store';

class VerticalScrollBar {
    private store = Store;
    // 滚动条
    private scrollBarElement: HTMLDivElement | null = null;
    // 滚动条滑块
    private scrollBarSliderElement: HTMLDivElement | null = null;
    private isDragging = false;
    private startY = 0;
    private scrollTop = 0;
    private get scrollConfig() {
        return this.store.getState('scrollBarConfig');
    }
    
    constructor() {
        this.init();
    }

    private init(): void {          
        const verticalConfig = this.scrollConfig.vertical;
        const prefix = this.store.getState('prefix');

        // 创建滚动条容器
        const scrollBar = document.createElement('div');
        scrollBar.className = `${prefix}-vertical-scrollbar`;
        scrollBar.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: ${this.scrollConfig.size}px;
            height: ${verticalConfig.scrollBgHeight}px;
            background-color: ${this.scrollConfig.backgroundColor};
            z-index: 100;
            border-left: ${this.scrollConfig.borderWidth}px solid ${this.scrollConfig.borderColor};
            border-bottom: ${this.scrollConfig.borderWidth}px solid ${this.scrollConfig.borderColor};
        `;

        // 创建滚动条滑块
        const slider = document.createElement('div');
        slider.style.cssText = `
            position: absolute;
            top: ${verticalConfig.top}px;
            left: 50%;
            transform: translateX(-50%);
            width: ${this.scrollConfig.size - this.scrollConfig.gap}px;
            height: ${verticalConfig.height}px;
            background-color: ${this.scrollConfig.color};
            border-radius: ${this.scrollConfig.borderRadius}px;
            cursor: pointer;
        `;

        scrollBar.appendChild(slider);
        const container = document.querySelector(`.${this.store.getState('containers').canvasContainer}`);
        if (container) {
            container.appendChild(scrollBar);
        }

        this.scrollBarSliderElement = slider;
        this.scrollBarElement = scrollBar;
        // 绑定事件
        this.bindEvents(slider);
        
        // 添加滚轮事件监听
        this.bindWheelEvent();

    }

    private bindEvents(slider: HTMLDivElement): void {
        slider.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }

    private onMouseDown(e: MouseEvent): void {
        this.isDragging = true;
        this.startY = e.clientY;
        this.scrollTop = parseFloat(this.scrollBarSliderElement?.style.top || '0');
        this.activeSlider();
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isDragging) return;

        const config = this.store.getState('scrollBarConfig').vertical;
        const dy = e.clientY - this.startY;
        
        if (this.scrollBarSliderElement) {
            const newTop = Math.max(0, Math.min(this.scrollTop + dy, config.scrollBgHeight - config.height));
            this.store.setState('scrollBarConfig', {
                ...this.store.getState('scrollBarConfig'),
                vertical: {
                    ...this.scrollConfig.vertical,
                    top: newTop,
                },
            });
            this.scrollBarSliderElement.style.top = `${newTop}px`;
        }
    }

    private onMouseUp(): void {
        this.isDragging = false;
        this.cancelActiveSlider();
    }

    public getElement(): HTMLDivElement | null {
        return this.scrollBarElement;
    }

    public destroy(): void {
        this.scrollBarElement?.remove();
        this.store.clearWatch('scrollBarConfig');
    }

    // 激活滑块
    private activeSlider(): void {
        if (this.scrollBarSliderElement) {
            this.scrollBarSliderElement.style.backgroundColor = this.scrollConfig.activeColor;
        }
    }

    // 取消激活滑块
    private cancelActiveSlider(): void {
        if (this.scrollBarSliderElement) {
            this.scrollBarSliderElement.style.backgroundColor = this.scrollConfig.color;
        }
    }   

    private bindWheelEvent(): void {
        const container = document.querySelector(`.${this.store.getState('containers').canvasContainer}`);
        if (!container) return;

        container.addEventListener('wheel', ((e: Event) => {
            const wheelEvent = e as WheelEvent;
            wheelEvent.preventDefault();
            
            if (!this.scrollBarSliderElement) return;
            
            const config = this.scrollConfig.vertical;
            const currentTop = parseFloat(this.scrollBarSliderElement.style.top || '0');
            
            // 根据滚轮deltaY的值计算更小的滚动距离
            const scrollDistance = wheelEvent.deltaY * this.scrollConfig.scrollSpeed;
            
            const newTop = Math.max(0, Math.min(currentTop + scrollDistance, config.scrollBgHeight - config.height));
            
            // 直接更新位置，不使用过渡动画
            this.store.setState('scrollBarConfig', {
                ...this.scrollConfig,
                vertical: {
                    ...this.scrollConfig.vertical,
                    top: newTop,
                },
            });
            
            this.scrollBarSliderElement.style.top = `${newTop}px`;
        }) as EventListener, { passive: false });
    }
}

export default VerticalScrollBar;
