import store from '../../store';

interface ContentStyle {
    textAlign: string;
    fontSize: number;
    color: string;
}

interface CellContentProps {
    content?: string;
    contentStyle?: ContentStyle;
}

export class DrawCellContent {
    private ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    // 绘制单元格内容
    public draw(
        cell: CellContentProps,
        x: number,
        y: number,
        width: number,
        height: number
    ): void {
        const { content, contentStyle } = cell;
        if (!content || !contentStyle) return;

        // 从 Store 获取当前的 scale
        const scale = store.getState('scale');
        
        this.ctx.fillStyle = contentStyle.color || '#333';
        // 字体大小需要乘以 scale
        this.ctx.font = `${contentStyle.fontSize * scale}px Arial`;
        this.ctx.textAlign = contentStyle.textAlign as CanvasTextAlign || 'center';
        this.ctx.textBaseline = 'middle';

        // 计算文本位置
        const textX = x + (contentStyle.textAlign === 'center' ? width / 2 : 
                          contentStyle.textAlign === 'right' ? width - 5 : 5);
        const textY = y + height / 2;

        this.ctx.fillText(content, textX, textY);
    }
}
