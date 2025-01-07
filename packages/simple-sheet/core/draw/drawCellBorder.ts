export class DrawCellBorder {
    private ctx: CanvasRenderingContext2D;

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
        if (cell.isScrollBarIntersection || !cell.borderInfo) return;

        const { borderInfo } = cell;
        
        // 分别绘制四个边
        if (borderInfo.top) this.drawBorder(x, y, width, 0, borderInfo.top);
        if (borderInfo.right) this.drawBorder(x + width, y, 0, height, borderInfo.right);
        if (borderInfo.bottom) this.drawBorder(x, y + height, width, 0, borderInfo.bottom);
        if (borderInfo.left) this.drawBorder(x, y, 0, height, borderInfo.left);
    }

    private drawBorder(x: number, y: number, width: number, height: number, style: BorderStyle): void {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style.borderColor;
        this.ctx.lineWidth = style.borderSize;
        
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + width, y + height);
        this.ctx.stroke();
    }
} 