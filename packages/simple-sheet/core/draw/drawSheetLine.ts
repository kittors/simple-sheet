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
        
        // 绘制普通线条
        this.ctx.beginPath();
        lineData.horizontalLines.forEach(line => {
            if (line.isFrozenLine) return;
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
        });
        lineData.verticalLines.forEach(line => {
            if (line.isFrozenLine) return;
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
        });
        this.ctx.stroke();

        // 绘制冻结线条
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#999';  // 冻结线使用更深的颜色
        this.ctx.lineWidth = 2;  // 冻结线更粗
        
        lineData.horizontalLines.forEach(line => {
            if (!line.isFrozenLine) return;
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
        });
        lineData.verticalLines.forEach(line => {
            if (!line.isFrozenLine) return;
            this.ctx.moveTo(line.x1, line.y1);
            this.ctx.lineTo(line.x2, line.y2);
        });
        this.ctx.stroke();
    }
}
