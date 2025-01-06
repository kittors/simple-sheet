import Store from '../../store';

class HorizontalScrollBar {
    private store = Store;
    // 滚动条
    private scrollBarElement: HTMLDivElement | null = null;
    // 滚动条滑块
    private scrollBarSliderElement: HTMLDivElement | null = null;
    private isDragging = false;
    private startX = 0;
    private scrollLeft = 0;
    private get scrollConfig() {
        return this.store.getState('scrollBarConfig');
    }
    constructor() {
        this.init();
    }

    private init(): void {
        const {show} = this.scrollConfig.horizontal;
        if(!show) return;
        const horizontalConfig = this.scrollConfig.horizontal;
        const prefix = this.store.getState('prefix');

        // 创建滚动条容器
        const scrollBar = document.createElement('div');
        scrollBar.className = `${prefix}-horizontal-scrollbar`;
        
        // 修改这里：当垂直滚动条不显示时，水平滚动条宽度应该等于容器宽度
        const width = this.scrollConfig.vertical.show 
            ? horizontalConfig.scrollBgWidth 
            : this.store.getState('containerSize').width;

        scrollBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: ${this.scrollConfig.size}px;
            width: ${width}px;
            background-color: ${this.scrollConfig.backgroundColor};
            z-index: 100;
            border-top: ${this.scrollConfig.borderWidth}px solid ${this.scrollConfig.borderColor};
            border-right: ${this.scrollConfig.borderWidth}px solid ${this.scrollConfig.borderColor};
        `;

        // 创建滚动条滑块
        const slider = document.createElement('div');
        slider.style.cssText = `
            position: absolute;
            left: ${horizontalConfig.left}px;
            top: 50%;
            transform: translateY(-50%);
            height: ${this.scrollConfig.size - this.scrollConfig.gap}px;
            width: ${horizontalConfig.width}px;
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
        this.activeSlider();
        this.startX = e.clientX;
        this.scrollLeft = parseFloat(this.scrollBarSliderElement?.style.left || '0');
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isDragging) return;

        // 滚动条配置
        const config = this.scrollConfig.horizontal;
        // 计算光标滑动的X轴距离
        const dx = e.clientX - this.startX;
        
        // 更新滚动滑块的位置，加入初始位置 scrollLeft
        if (this.scrollBarSliderElement) {
            const newLeft = Math.max(0, Math.min(this.scrollLeft + dx, config.scrollBgWidth - config.width));
            // 更新到Store中
            this.store.setState('scrollBarConfig', {
                ...this.scrollConfig,
                horizontal: {
                    ...this.scrollConfig.horizontal,
                    left: newLeft,
                },
            });
            this.scrollBarSliderElement.style.left = `${newLeft}px`;
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

            const config = this.scrollConfig.horizontal;
            const currentLeft = parseFloat(this.scrollBarSliderElement.style.left || '0');

            // 根据滚轮deltaX的值计算更小的滚动距离
            const scrollDistance = wheelEvent.deltaX * this.scrollConfig.scrollSpeed;
            
            const newLeft = Math.max(0, Math.min(currentLeft + scrollDistance, config.scrollBgWidth - config.width));

            // 一样的newTop 数据 就不需要再更新了
            if (newLeft === currentLeft) return;
            // 直接更新位置，不使用过渡动画
            this.store.setState('scrollBarConfig', {
                ...this.scrollConfig,
                horizontal: {
                    ...this.scrollConfig.horizontal,
                    left: newLeft,
                },
            });
            this.scrollBarSliderElement.style.left = `${newLeft}px`;
        }) as EventListener, { passive: false });
    }

    // 添加新方法来监听配置变化
    private watchScrollBarConfig(): void {
        this.store.watch('scrollBarConfig', 
            (newConfig) => {
                if (!this.scrollBarElement || !this.scrollBarSliderElement) return;
                const horizontalConfig = this.scrollConfig.horizontal;
                const { horizontal, size, color, borderRadius } = newConfig;

                // 修改这里：当垂直滚动条不显示时，水平滚动条宽度应该等于容器宽度
                const width = this.scrollConfig.vertical.show 
                    ? horizontalConfig.scrollBgWidth 
                    : this.store.getState('containerSize').width;

                // 更新滚动条宽度
                if(parseInt(this.scrollBarElement.style.width) !== width) {
                    this.scrollBarElement.style.width = `${width}px`;
                }
                // 更新滑块样式
                this.scrollBarSliderElement.style.left = `${horizontal.left}px`;
                this.scrollBarSliderElement.style.height = `${size - newConfig.gap}px`;
                this.scrollBarSliderElement.style.width = `${horizontal.width}px`;
                this.scrollBarSliderElement.style.borderRadius = `${borderRadius}px`;

                // 更新显示/隐藏状态
                this.scrollBarElement.style.display = horizontal.show ? 'block' : 'none';

                // 修改这里：只在非拖动状态下更新背景色
                if (!this.isDragging) {
                    this.scrollBarSliderElement.style.backgroundColor = color;
                }
            },
            {
                immediate: true,
                once: false,
                deep: true
            }
        );
    }
}

export default HorizontalScrollBar;
