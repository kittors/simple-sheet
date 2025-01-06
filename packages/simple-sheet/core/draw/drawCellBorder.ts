export class DrawCellBorder {
    private ctx: CanvasRenderingContext2D;
    private readonly DEFAULT_BORDER_COLOR = '#000';
    private readonly MIN_BORDER_WIDTH = 0.3;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public draw(
        cell: DrawCellDataItem, 
        x: number, 
        y: number, 
        width: number, 
        height: number,
        row: number,
        col: number,
        cells: Map<string, any>
    ): void {
        // 如果单元格是滚动条交叉区域，或者没有设置边框，则直接返回
        if (cell.isScrollBarIntersection || !cell.borderSize) return;

        this.setupContext(cell);
        this.drawBorders(x, y, width, height, row, col, cells);
    }

    private setupContext(cell: DrawCellDataItem): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = cell.borderColor || this.DEFAULT_BORDER_COLOR;
        this.ctx.lineWidth = Math.max(this.MIN_BORDER_WIDTH, Math.round(cell.borderSize || 1));
    }

    private drawBorders(
        x: number, 
        y: number, 
        width: number, 
        height: number,
        row: number,
        col: number,
        cells: Map<string, any>
    ): void {
        // 直接绘制完整边框
        this.ctx.strokeRect(x, y, width, height);
    }
} 