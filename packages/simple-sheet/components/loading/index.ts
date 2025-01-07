import Store from '../../store';

class Loading {
    private static instance: Loading;
    private store = Store;
    private loadingElement: HTMLDivElement | null = null;

    private constructor() {}

    public static getInstance(): Loading {
        if (!Loading.instance) {
            Loading.instance = new Loading();
        }
        return Loading.instance;
    }

    public init(): void {
        // 监听 isLoading 状态变化
        this.store.watch('isLoading', 
            (isLoading) => {
                if (isLoading) {
                    this.show();
                } else {
                    this.hide();
                }
            },
            {
                immediate: true,
                once: false
            }
        );
    }

    private createLoadingElement(): void {
        if (this.loadingElement) return;
        const prefix = this.store.getState('prefix');
        const className = this.store.getState('containers').canvasContainer;
        const container = document.querySelector(`.${className}`);
        if (!container) return;

        // 创建loading容器
        const loadingElement = document.createElement('div');
        loadingElement.className = `${prefix}-loading`;
        loadingElement.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        // 创建loading动画元素
        const spinnerElement = document.createElement('div');
        spinnerElement.className = `${prefix}-loading-spinner`;
        spinnerElement.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

        // 添加动画样式
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styleElement);

        loadingElement.appendChild(spinnerElement);
        container.appendChild(loadingElement);
        this.loadingElement = loadingElement;
    }

    private show(): void {
        console.log('show');
        this.createLoadingElement();
        if (this.loadingElement) {
            this.loadingElement.style.display = 'flex';
        }
    }

    private hide(): void {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    public destroy(): void {
        this.loadingElement?.remove();
        this.store.clearWatch('isLoading');
    }
}

export default Loading.getInstance(); 