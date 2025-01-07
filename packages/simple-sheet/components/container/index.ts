import store from '../../store';
import { createElement, getElement } from '../../utils/dom';

class Container {
    private static instance: Container;
    private containerDom: HTMLElement | null = null;
    private sheetContainer: HTMLElement | null = null;

    private constructor() {}

    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    public init(): void {
        this.initContainer();
        this.resizeContainer();
    }

    private initContainer(): void {
        const { container } = store.getState('sheetConfig');
        if (!container) throw new Error('容器ID未设置');

        this.containerDom = getElement(`#${container}`);
        if (!this.containerDom) throw new Error(`未找到ID为 "${container}" 的容器元素`);

        this.sheetContainer = createElement({
            className: `${store.getState('prefix')}-container`,
            style: {
                position: 'relative',
                overflow: 'hidden',
                width: `${this.containerDom.clientWidth}px`,
                height: `${this.containerDom.clientHeight}px`
            },
            parent: this.containerDom
        });

        store.setState('containerSize', {
            width: this.containerDom.clientWidth,
            height: this.containerDom.clientHeight
        });
    }

    private resizeContainer(): void {
        const handleResize = () => {
            if (!this.containerDom || !this.sheetContainer) return;

            const { clientWidth: newWidth, clientHeight: newHeight } = this.containerDom;
            const { width: currentWidth, height: currentHeight } = this.sheetContainer.style;

            if (currentWidth === `${newWidth}px` && currentHeight === `${newHeight}px`) return;

            Object.assign(this.sheetContainer.style, {
                width: `${newWidth}px`,
                height: `${newHeight}px`
            });

            store.setState('containerSize', { width: newWidth, height: newHeight });
        };

        this.cleanup();
        
        const resizeObserver = new ResizeObserver(handleResize);
        if (this.containerDom) resizeObserver.observe(this.containerDom);
        window.addEventListener('resize', handleResize);

        store.setState('cleanupResize', () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', handleResize);
        });
    }

    private cleanup(): void {
        const cleanupResize = store.getState('cleanupResize');
        if (cleanupResize) cleanupResize();
    }

    public getContainerDom(): HTMLElement | null {
        return this.containerDom;
    }

    public getSheetContainer(): HTMLElement | null {
        return this.sheetContainer;
    }
}

export default Container.getInstance(); 