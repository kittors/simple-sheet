import store from '../../store';
import { DrawCellBackground } from './drawCellBackground';
import { DrawCellContent } from './drawCellContent';

export class DrawCell {
    private drawCellBackground: DrawCellBackground;
    private drawCellContent: DrawCellContent;

    constructor(ctx: CanvasRenderingContext2D) {
        this.drawCellBackground = new DrawCellBackground(ctx);
        this.drawCellContent = new DrawCellContent(ctx);
    }

    // 绘制单元格
    public drawCells(): void {
        const cells = store.getState('drawCellData');
        
        cells.forEach((cell: DrawCellDataItem) => {
            
            // 确保所有坐标和尺寸都是整数
            const x = cell.x;
            const y =  cell.y;
            const width = cell.width;
            const height = cell.height;

            // 绘制背景色
            this.drawCellBackground.draw(cell, x, y, width, height);

            // 绘制内容
            if (cell.content) {
                this.drawCellContent.draw(cell, x, y, width, height);
            }
        });
    }
}
