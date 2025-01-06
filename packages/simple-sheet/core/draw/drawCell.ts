import store from '../../store';
import { DrawCellBackground } from './drawCellBackground';
import { DrawCellBorder } from './drawCellBorder';
import { DrawCellContent } from './drawCellContent';

export class DrawCell {
    private ctx: CanvasRenderingContext2D;
    private drawCellBackground: DrawCellBackground;
    private drawCellBorder: DrawCellBorder;
    private drawCellContent: DrawCellContent;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.drawCellBackground = new DrawCellBackground(ctx);
        this.drawCellBorder = new DrawCellBorder(ctx);
        this.drawCellContent = new DrawCellContent(ctx);
    }

    // 绘制单元格
    public drawCells(): void {
        const cells = store.getState('drawCellData');
        
        cells.forEach((cell: any, key: string) => {
            const [row, col] = key.split(',').map(Number);
            const x = Math.floor(cell.x);
            const y = Math.floor(cell.y);
            const width = Math.floor(cell.width);
            const height = Math.floor(cell.height);

            // 绘制背景色
            this.drawCellBackground.draw(cell, x, y, width, height);
            // 绘制边框
            this.drawCellBorder.draw(cell, x, y, width, height, row, col, cells);
            // 绘制内容
            if (cell.content) {
                this.drawCellContent.draw(cell, x, y, width, height);
            }
        });
    }
}
