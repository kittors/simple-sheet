import store from '../store';
import generateData from './generateData';

class Draw {
    private static instance: Draw;
    private ctx: CanvasRenderingContext2D | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private dpr: number = window.devicePixelRatio || 1; // 获取设备像素比

    private constructor() {}

    public static getInstance(): Draw {
        if (!Draw.instance) {
            Draw.instance = new Draw();
        }
        return Draw.instance;
    }

    // 开始绘制
    public startDraw() {
        const className = store.getState('prefix') + '-container';
        const container = document.querySelector(`.${className}`);
        store.setState('containers', {
            ...store.getState('containers'),
            canvasContainer: className
        });
        if (!container) return;

        this.initCanvas(container as HTMLElement);
        this.drawCells();
    }

    // 初始化画布
    private initCanvas(container: HTMLElement) {
        const { width, height } = store.getState('containerSize');
        
        // 检查是否需要重新创建 canvas
        if (!this.canvas || !this.canvas.parentElement) {
            this.canvas = document.createElement('canvas');
            container.appendChild(this.canvas);
        }
        
        // 更新 canvas 尺寸
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = Math.floor(width * this.dpr);
        this.canvas.height = Math.floor(height * this.dpr);
        
        // 重新获取上下文并设置
        this.ctx = this.canvas.getContext('2d');
        if (this.ctx) {
            this.ctx.scale(this.dpr, this.dpr);
            this.ctx.imageSmoothingEnabled = false;
        }
    }

    // 绘制单元格
    private async drawCells() {
        if (!this.ctx) return;

         await generateData();
         const cells = store.getState('drawCellData');
        
        // 遍历所有单元格
        cells.forEach((cell, key) => {
            const [row, col] = key.split(',').map(Number);
            
            this.ctx!.beginPath();
            this.ctx!.strokeStyle = cell.borderColor;
            const borderWidth = Math.max(0.3, Math.round(cell.borderSize));
            this.ctx!.lineWidth = borderWidth;
            
            const x = Math.floor(cell.x);
            const y = Math.floor(cell.y);
            const width = Math.floor(cell.width);
            const height = Math.floor(cell.height);
            
            // 分别绘制四条边，避免重复绘制
            // 上边框 - 只在第一行或者上一行的单元格不存在时绘制
            if (row === 0 || !cells.has(`${row-1},${col}`)) {
                this.ctx!.moveTo(x, y);
                this.ctx!.lineTo(x + width, y);
            }
            
            // 右边框 - 总是绘制
            this.ctx!.moveTo(x + width, y);
            this.ctx!.lineTo(x + width, y + height);
            
            // 下边框 - 总是绘制
            this.ctx!.moveTo(x, y + height);
            this.ctx!.lineTo(x + width, y + height);
            
            // 左边框 - 只在第一列或者左边的单元格不存在时绘制
            if (col === 0 || !cells.has(`${row},${col-1}`)) {
                this.ctx!.moveTo(x, y);
                this.ctx!.lineTo(x, y + height);
            }
            
            this.ctx!.stroke();
            this.ctx!.closePath();
        });
    }

    // 清除画布
    public clear() {
        if (this.ctx && this.canvas) {
            // 使用实际的 canvas 尺寸来清除
            this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        }
    }
}

const instance = Draw.getInstance();

export default instance;
