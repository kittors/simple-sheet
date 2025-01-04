import store from '../../store';
import type { Controller } from './index';
import { isMac } from '../../utils/validation';

export class Scale implements Controller {
    private minScale = 0.1;
    private maxScale = 3;
    private scaleStep = 0.1;

    constructor() {
        this.init();
    }

    private zoomIn(): void {
        const currentScale = store.getState('scale') || 1;
        const newScale = Math.min(this.maxScale, currentScale + this.scaleStep);
        this.updateScale(newScale);
    }

    private zoomOut(): void {
        const currentScale = store.getState('scale') || 1;
        const newScale = Math.max(this.minScale, currentScale - this.scaleStep);
        this.updateScale(newScale);
    }

    private updateScale(scale: number): void {
        store.setState('scale', scale);
    }

    // 公共方法：设置缩放比例
    public setScale(scale: number): void {
        const validScale = Math.max(this.minScale, Math.min(this.maxScale, scale));
        this.updateScale(validScale);
    }

    // 公共方法：获取当前缩放比例
    public getScale(): number {
        return store.getState('scale') || 1;
    }

    init(): void {
        document.addEventListener('keydown', (event: KeyboardEvent) => {
            // macOS 使用 Command 键，其他系统使用 Alt 键
            const modifierKey = isMac() ? event.metaKey : event.altKey;
            
            if (modifierKey && (event.key === '+' || event.key === '=')) {
                event.preventDefault();
                this.zoomIn();
            }
            
            if (modifierKey && event.key === '-') {
                event.preventDefault();
                this.zoomOut();
            }
        });
    }
}
