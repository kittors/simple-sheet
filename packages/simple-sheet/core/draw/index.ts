import store from '../../store';
import generateData from '../generateData';
import { DrawCell } from './drawCell';
import { DrawSheetLine } from './drawSheetLine';

class Draw {
    private static instance: Draw;
    private ctx: CanvasRenderingContext2D | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private dpr: number = window.devicePixelRatio || 1;
    private drawCell: DrawCell | null = null;
    private drawSheetLine: DrawSheetLine | null = null;

    private constructor() {}

    public static getInstance(): Draw {
        if (!Draw.instance) {
            Draw.instance = new Draw();
        }
        return Draw.instance;
    }

    // 开始绘制
    public async startDraw() {
        const className = store.getState('prefix') + '-container';
        const container = document.querySelector(`.${className}`);
        store.setState('containers', {
            ...store.getState('containers'),
            canvasContainer: className
        });
        if (!container) return;

        this.initCanvas(container as HTMLElement);
        await generateData();
        
        if (this.ctx) {

            // 先绘制单元格
            this.drawCell = new DrawCell(this.ctx);
            this.drawCell.drawCells();
        
            // 后绘制表格线
            this.drawSheetLine = new DrawSheetLine(this.ctx);
            this.drawSheetLine.drawLines();

        }
    }

    // 初始化画布
    private initCanvas(container: HTMLElement) {
        const { width, height } = store.getState('containerSize');
        
        if (!this.canvas || !this.canvas.parentElement) {
            this.canvas = document.createElement('canvas');
            container.appendChild(this.canvas);
        }
        
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = Math.ceil(width * this.dpr);
        this.canvas.height = Math.ceil(height * this.dpr);
        
        this.ctx = this.canvas.getContext('2d');
        if (this.ctx) {
            this.ctx.scale(this.dpr, this.dpr);
            this.ctx.imageSmoothingEnabled = false;
        }
    }

    // 清除画布
    public clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        }
    }
}

const instance = Draw.getInstance();
export default instance;
