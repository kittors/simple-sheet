interface CellBorderProps {
    borderColor?: string;
    borderSize?: number;
    isScrollBarIntersection?: boolean;
}

export class DrawCellBorder {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    // 绘制单元格边框
    public draw(
        cell: CellBorderProps, 
        x: number, 
        y: number, 
        width: number, 
        height: number,
        row: number,
        col: number,
        cells: Map<string, any>
    ): void {
        if (cell.isScrollBarIntersection) return;  // 如果是滚动条交叉区域，直接返回不绘制边框

        this.ctx.beginPath();
        this.ctx.strokeStyle = cell.borderColor || '#000';
        const borderWidth = Math.max(0.3, Math.round(cell.borderSize || 1));
        this.ctx.lineWidth = borderWidth;
        
        // 上边框
        if (row === 0 || !cells.has(`${row-1},${col}`)) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + width, y);
        }
        
        // 右边框
        this.ctx.moveTo(x + width, y);
        this.ctx.lineTo(x + width, y + height);
        
        // 下边框
        this.ctx.moveTo(x, y + height);
        this.ctx.lineTo(x + width, y + height);
        
        // 左边框
        if (col === 0 || !cells.has(`${row},${col-1}`)) {
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + height);
        }
        
        this.ctx.stroke();
        this.ctx.closePath();
    }
} 