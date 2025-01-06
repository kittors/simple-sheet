import store from '../../store';
import { getHeaderContent, formatNumber } from '../../utils';

// 添加精度控制方法
const formatWithPrecision = (num: number): number => {
    return formatNumber(num, 6);
};

export function generateCellData(): void {
    const { width, height } = store.getState('containerSize');
    const sheetConfig = store.getState('sheetConfig');    
    const scale = store.getState('scale') || 1;
    const scrollBarConfig = store.getState('scrollBarConfig');
    const { defaultCellItem, widths, heights, cols = 0, rows = 0, rowHeaderContent, colHeaderContent } = sheetConfig;
    
    if (!defaultCellItem) {
        console.warn('defaultCellItem 未设置，请检查 sheetConfig 的初始化');
        return;
    }

    const { width: cellWidth, height: cellHeight} = defaultCellItem;
    
    // 预先计算并缓存每个位置的累积宽度和高度
    const accumulatedWidths: number[] = new Array(cols);
    const accumulatedHeights: number[] = new Array(rows);
    
    let currentWidth = 0;
    for (let i = 0; i < cols; i++) {
        const cellW = Math.round((widths.get(i) || cellWidth) * scale);
        currentWidth += cellW;
        accumulatedWidths[i] = currentWidth;
    }
    
    let currentHeight = 0;
    for (let i = 0; i < rows; i++) {
        const cellH = Math.round((heights.get(i) || cellHeight) * scale);
        currentHeight += cellH;
        accumulatedHeights[i] = currentHeight;
    }

    // 添加边距配置
    const marginRight = scrollBarConfig.vertical.show ? scrollBarConfig.size - scrollBarConfig.borderWidth : 0;
    const marginBottom = scrollBarConfig.horizontal.show ? scrollBarConfig.size - scrollBarConfig.borderWidth : 0;

    // 添加表头配置
    const headerConfig = sheetConfig.headerConfig || {
        rowHeaderWidth: 40,
        colHeaderHeight: 25
    };

    // 应用缩放到表头尺寸
    const scaledRowHeaderWidth = Math.round(headerConfig.rowHeaderWidth * scale);
    const scaledColHeaderHeight = Math.round(headerConfig.colHeaderHeight * scale);

    // 计算可视区域（不包括表头）
    const viewportWidth = width - scaledRowHeaderWidth;
    const viewportHeight = height - scaledColHeaderHeight;

    // 计算最大滚动范围
    const maxHorizontalScroll = currentWidth - viewportWidth + marginRight;
    const maxVerticalScroll = currentHeight - viewportHeight + marginBottom;
    const horizontalScrollRange = scrollBarConfig.horizontal.scrollBgWidth - scrollBarConfig.horizontal.width;
    const verticalScrollRange = scrollBarConfig.vertical.scrollBgHeight - scrollBarConfig.vertical.height;
    
    const horizontalLeft = maxHorizontalScroll > 0 
        ? (scrollBarConfig.horizontal.left * maxHorizontalScroll / horizontalScrollRange)
        : 0;
    const verticalTop = maxVerticalScroll > 0 
        ? (scrollBarConfig.vertical.top * maxVerticalScroll / verticalScrollRange)
        : 0;

    // 计算起始行和列
    let startX = 0;
    let startY = 0;
    let startRow = 0;
    let startCol = 0;

    for (let i = 0; i < rows; i++) {
        const customHeight = heights.get(i) || cellHeight;
        if (startY + customHeight * scale > verticalTop) {
            startRow = i;
            break;
        }
        startY += customHeight * scale;
    }

    for (let j = 0; j < cols; j++) {
        const customWidth = widths.get(j) || cellWidth;
        if (startX + customWidth * scale > horizontalLeft) {
            startCol = j;
            break;
        }
        startX += customWidth * scale;
    }
        
    const currentRows = Math.min(Math.ceil((height + verticalTop - startY) / (cellHeight * scale)), rows - startRow);
    const currentCols = Math.min(Math.ceil((width + horizontalLeft - startX) / (cellWidth * scale)), cols - startCol);
        
    const drawCellData = new Map();

    // 生成内容区域的单元格
    for(let i = 0; i < currentRows; i++) {
        for(let j = 0; j < currentCols; j++) {
            const rowIndex = startRow + i;
            const colIndex = startCol + j;
            const key = `${rowIndex},${colIndex}`;

            const x = Math.round(scaledRowHeaderWidth - horizontalLeft + 
                (colIndex > 0 ? accumulatedWidths[colIndex - 1] : 0));
            const y = Math.round(scaledColHeaderHeight - verticalTop + 
                (rowIndex > 0 ? accumulatedHeights[rowIndex - 1] : 0));

            drawCellData.set(key, { 
                x,
                y,
                width: Math.round((widths.get(colIndex) || cellWidth) * scale),
                height: Math.round((heights.get(rowIndex) || cellHeight) * scale),
                isCell: true
            });
        }
    }

    // 生成行表头单元格
    for(let i = 0; i < currentRows; i++) {
        const rowIndex = startRow + i;
        const key = `${rowIndex},header`;
        const y = scaledColHeaderHeight - verticalTop + 
            (rowIndex > 0 ? accumulatedHeights[rowIndex - 1] : 0);
        console.log(Math.round(y));
        drawCellData.set(key, {
            x: 0,
            y: Math.round(y),
            width: scaledRowHeaderWidth,
            height: Math.round((heights.get(rowIndex) || cellHeight) * scale),
            isHeader: true,
            backgroundColor: '#f5f5f5',
            content: getHeaderContent('row', rowIndex, rowHeaderContent, colHeaderContent),
            contentStyle: {
                textAlign: 'center',
                fontSize: 12,
                color: '#333'
            }
        });
    }

    // 生成列表头单元格
    for(let j = 0; j < currentCols; j++) {
        const colIndex = startCol + j;
        const key = `header,${colIndex}`;
        const x = scaledRowHeaderWidth - horizontalLeft +
            (colIndex > 0 ? accumulatedWidths[colIndex - 1] : 0);

        drawCellData.set(key, {
            x: Math.round(x),
            y: 0,
            width: Math.round((widths.get(colIndex) || cellWidth) * scale),
            height: scaledColHeaderHeight,
            isHeader: true,
            backgroundColor: '#f5f5f5',
            content: getHeaderContent('col', colIndex, rowHeaderContent, colHeaderContent),
            contentStyle: {
                textAlign: 'center',
                fontSize: 12,
                color: '#333'
            }
        });
    }

    // 生成左上角单元格
    drawCellData.set('header,header', {
        x: 0,
        y: 0,
        width: scaledRowHeaderWidth,
        height: scaledColHeaderHeight,
        isHeader: true,
        backgroundColor: '#f5f5f5'
    });

    // 生成滚动条交叉区域单元格
    if (scrollBarConfig.horizontal.show && scrollBarConfig.vertical.show) {
        drawCellData.set('scrollbar-intersection', {
            x: width - scrollBarConfig.size + scrollBarConfig.borderWidth,
            y: height - scrollBarConfig.size + scrollBarConfig.borderWidth,
            width: scrollBarConfig.size - scrollBarConfig.borderWidth,
            height: scrollBarConfig.size - scrollBarConfig.borderWidth,
            isScrollBarIntersection: true,
            backgroundColor: '#fff'
        });
    }

    store.setState('drawCellData', drawCellData);
}