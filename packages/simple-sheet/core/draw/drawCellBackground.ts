interface CellBackgroundProps {
    backgroundColor?: string;
}

export class DrawCellBackground {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    // 绘制单元格背景
    public draw(
        cell: CellBackgroundProps, 
        x: number, 
        y: number, 
        width: number, 
        height: number
    ): void {
        if (!cell.backgroundColor) return;
        this.ctx.fillStyle = cell.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
    }
}
