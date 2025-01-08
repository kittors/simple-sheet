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
        const {show} = this.scrollConfig.vertical;
        if(!show) return;
        const verticalConfig = this.scrollConfig.vertical;
        const prefix = this.store.getState('prefix');

        // 创建滚动条容器
        const scrollBar = document.createElement('div');
        scrollBar.className = `${prefix}-vertical-scrollbar`;
        
        // 修改这里：当水平滚动条不显示时，垂直滚动条高度应该等于容器高度
        const height = this.scrollConfig.horizontal.show 
            ? verticalConfig.scrollBgHeight 
            : this.store.getState('containerSize').height;

        scrollBar.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: ${this.scrollConfig.size}px;
            height: ${height}px;
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

        // 添加配置监听
        this.watchScrollBarConfig();
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
            const newTop = Math.ceil(Math.max(0, Math.min(this.scrollTop + dy, config.scrollBgHeight - config.height)));
            this.store.setState('scrollBarConfig', {
                ...this.scrollConfig,
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

    public async destroy(): Promise<void> {
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
            
            const scrollDistance = wheelEvent.deltaY * this.scrollConfig.scrollSpeed;
            
            const newTop = Math.ceil(Math.max(0, Math.min(currentTop + scrollDistance, config.scrollBgHeight - config.height)));
            
            if (newTop === currentTop) return;
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

    // 添加新方法来监听配置变化
    private watchScrollBarConfig(): void {
        this.store.watch('scrollBarConfig', 
            (newConfig) => {
                if (!this.scrollBarElement || !this.scrollBarSliderElement) return;

                const verticalConfig = this.scrollConfig.vertical;
                const { vertical, size, color, borderRadius } = newConfig;

                // 修改这里：当水平滚动条不显示时，垂直滚动条高度应该等于容器高度
                const height = this.scrollConfig.horizontal.show 
                    ? verticalConfig.scrollBgHeight 
                    : this.store.getState('containerSize').height;

                // 更新滚动条高度
                if(height !== parseFloat(this.scrollBarElement.style.height)) {
                    this.scrollBarElement.style.height = `${height}px`;
                }
                                
                // 更新滑块样式
                this.scrollBarSliderElement.style.top = `${vertical.top}px`;
                this.scrollBarSliderElement.style.width = `${size - newConfig.gap}px`;
                this.scrollBarSliderElement.style.height = `${vertical.height}px`;
                this.scrollBarSliderElement.style.borderRadius = `${borderRadius}px`;
                
                // 更新显示/隐藏状态
                this.scrollBarElement.style.display = vertical.show ? 'block' : 'none';

                // 修改这里：只在非拖动状态下更新背景色
                if (!this.isDragging) {
                    this.scrollBarSliderElement.style.backgroundColor = color;
                }
            },
            {
                immediate: true,
                once: false,
                deep: true // 启用深度监听以捕获 vertical 对象的变化
            }
        );
    }
}

export default VerticalScrollBar;
