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
        const sheetConfig = store.getState('sheetConfig');
        const { defaultCellItem, widths, heights, cols = 0, rows = 0, headerConfig } = sheetConfig;
        const scale = store.getState('scale') || 1;
        const containerSize = store.getState('containerSize');
        const scrollConfig = store.getState('scrollBarConfig');
        
        if (!defaultCellItem || !headerConfig) return;
        
        this.setupContext();

        // 计算表头尺寸
        const headerWidth = headerConfig.rowHeaderWidth * scale;
        const headerHeight = headerConfig.colHeaderHeight * scale;

        // 添加边距配置
        const marginRight = scrollConfig.vertical.show ? scrollConfig.size - scrollConfig.borderWidth : 0;
        const marginBottom = scrollConfig.horizontal.show ? scrollConfig.size - scrollConfig.borderWidth : 0;

        // 计算总宽度和总高度
        const totalWidth = this.calculateTotalWidth(cols, widths, defaultCellItem.width, scale);
        const totalHeight = this.calculateTotalHeight(rows, heights, defaultCellItem.height, scale);

        // 计算可见区域的最大范围（考虑滚动条和表头）
        const maxVisibleWidth = Math.min(totalWidth + headerWidth, containerSize.width - marginRight);
        const maxVisibleHeight = Math.min(totalHeight + headerHeight, containerSize.height - marginBottom);

        // 计算滚动范围
        const horizontalScrollRange = scrollConfig.horizontal.scrollBgWidth - scrollConfig.horizontal.width;
        const verticalScrollRange = scrollConfig.vertical.scrollBgHeight - scrollConfig.vertical.height;

        // 计算最大滚动范围
        const maxHorizontalScroll = totalWidth - (containerSize.width - headerWidth - marginRight);
        const maxVerticalScroll = totalHeight - (containerSize.height - headerHeight - marginBottom);

        // 计算实际滚动位置
        const horizontalLeft = maxHorizontalScroll > 0 
            ? (scrollConfig.horizontal.left * maxHorizontalScroll / horizontalScrollRange)
            : 0;
        const verticalTop = maxVerticalScroll > 0 
            ? (scrollConfig.vertical.top * maxVerticalScroll / verticalScrollRange)
            : 0;

        this.ctx.beginPath();

        // 绘制水平线
        let y = headerHeight;
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(maxVisibleWidth, y);

        let accHeight = 0;
        for (let row = 0; row < rows; row++) {
            const height = (heights.get(row) || defaultCellItem.height) * scale;
            accHeight += height;
            const y = headerHeight + accHeight - verticalTop;

            if (y >= headerHeight && y <= maxVisibleHeight) {
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(maxVisibleWidth, y);
            }
        }

        // 绘制垂直线
        let x = headerWidth;
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, maxVisibleHeight);

        let accWidth = 0;
        for (let col = 0; col < cols; col++) {
            const width = (widths.get(col) || defaultCellItem.width) * scale;
            accWidth += width;
            x = headerWidth + accWidth - horizontalLeft;

            if (x >= headerWidth && x <= maxVisibleWidth) {
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, maxVisibleHeight);
            }
        }

        this.ctx.stroke();
    }

    private calculateTotalWidth(cols: number, widths: Map<number, number>, defaultWidth: number, scale: number): number {
        let total = 0;
        for (let i = 0; i < cols; i++) {
            total += (widths.get(i) || defaultWidth) * scale;
        }
        return total;
    }

    private calculateTotalHeight(rows: number, heights: Map<number, number>, defaultHeight: number, scale: number): number {
        let total = 0;
        for (let i = 0; i < rows; i++) {
            total += (heights.get(i) || defaultHeight) * scale;
        }
        return total;
    }
}
