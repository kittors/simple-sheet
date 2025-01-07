import store from '../../store';

export class DrawSheetLine {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    private setupContext() {
        const sheetConfig = store.getState('sheetConfig');
        this.ctx.strokeStyle = sheetConfig.lineColor || '#e6e6e6';
        this.ctx.lineWidth = sheetConfig.lineSize || 1;
    }

    public drawLines() {
        const lineData = store.getState('lineData');
        if (!lineData) return;
        
        this.setupContext();
        this.ctx.beginPath();

        // 绘制水平线
        lineData.horizontalLines.forEach(line => {
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
        });

        // 绘制垂直线
        lineData.verticalLines.forEach(line => {
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
        });

        this.ctx.stroke();
    }
}
