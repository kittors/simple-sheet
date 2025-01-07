import store from '../../store';
import { getHeaderContent } from '../../utils';
import PreciseCalculator from '../../common/calculator';

export function generateCellData(): void {
    const { width, height } = store.getState('containerSize');
    const sheetConfig = store.getState('sheetConfig');    
    const scale = store.getState('scale') || 1;
    const scrollBarConfig = store.getState('scrollBarConfig');
    const { defaultCellItem, widths, heights, cols = 0, rows = 0, rowHeaderContent, colHeaderContent, frozen = [0, 0] } = sheetConfig;
    
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
        const cellW = PreciseCalculator.multiply((widths.get(i) || cellWidth), scale);
        currentWidth = PreciseCalculator.add(currentWidth, cellW);
        accumulatedWidths[i] = currentWidth;
    }
    
    let currentHeight = 0;
    for (let i = 0; i < rows; i++) {
        const cellH = PreciseCalculator.multiply((heights.get(i) || cellHeight), scale);
        currentHeight = PreciseCalculator.add(currentHeight, cellH);
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
    const scaledRowHeaderWidth = PreciseCalculator.multiply(headerConfig.rowHeaderWidth, scale);
    const scaledColHeaderHeight = PreciseCalculator.multiply(headerConfig.colHeaderHeight, scale);

    // 计算可视区域（不包括表头）
    const viewportWidth = width - scaledRowHeaderWidth;
    const viewportHeight = height - scaledColHeaderHeight;

    // 计算最大滚动范围
    const maxHorizontalScroll = currentWidth - viewportWidth + marginRight;
    const maxVerticalScroll = currentHeight - viewportHeight + marginBottom;
    const horizontalScrollRange = scrollBarConfig.horizontal.scrollBgWidth - scrollBarConfig.horizontal.width;
    const verticalScrollRange = scrollBarConfig.vertical.scrollBgHeight - scrollBarConfig.vertical.height;
    
    const horizontalLeft = maxHorizontalScroll > 0 
        ? PreciseCalculator.multiply(scrollBarConfig.horizontal.left, 
            PreciseCalculator.divide(maxHorizontalScroll, horizontalScrollRange || 1))
        : 0;
    const verticalTop = maxVerticalScroll > 0 
        ? PreciseCalculator.multiply(scrollBarConfig.vertical.top, 
            PreciseCalculator.divide(maxVerticalScroll, verticalScrollRange || 1))
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
        
    const currentRows = PreciseCalculator.min(
      
            PreciseCalculator.divide(
                PreciseCalculator.add(height, verticalTop),
                PreciseCalculator.multiply(cellHeight, scale)
            )
        ,
        PreciseCalculator.subtract(rows, startRow)
    );
    const currentCols = PreciseCalculator.min(
       
            PreciseCalculator.divide(
                PreciseCalculator.add(width, horizontalLeft),
                PreciseCalculator.multiply(cellWidth, scale)
            )
        ,
        PreciseCalculator.subtract(cols, startCol)
    );
        
    const drawCellData = new Map<string, DrawCellDataItem>();

    const [frozenCols, frozenRows] = frozen;

    // 生成冻结区域的单元格
    for (let i = 0; i < frozenRows; i++) {
        for (let j = 0; j < cols; j++) {
            if (j < startCol && j >= frozenCols) continue;
            
            const key = `${i},${j}`;
            const x = j < frozenCols 
                ? scaledRowHeaderWidth + (j > 0 ? accumulatedWidths[j - 1] : 0)
                : scaledRowHeaderWidth + accumulatedWidths[j - 1] - horizontalLeft;
            const y = scaledColHeaderHeight + (i > 0 ? accumulatedHeights[i - 1] : 0);

            drawCellData.set(key, {
                x,
                y,
                width: PreciseCalculator.multiply((widths.get(j) || cellWidth), scale),
                height: PreciseCalculator.multiply((heights.get(i) || cellHeight), scale),
                isCell: true,
                isFrozen: true
            });
        }
    }

    // 生成冻结列的单元格
    for (let i = frozenRows; i < rows; i++) {
        for (let j = 0; j < frozenCols; j++) {
            const key = `${i},${j}`;
            const x = scaledRowHeaderWidth + (j > 0 ? accumulatedWidths[j - 1] : 0);
            const y = scaledColHeaderHeight + accumulatedHeights[i - 1] - verticalTop;

            drawCellData.set(key, {
                x,
                y,
                width: PreciseCalculator.multiply((widths.get(j) || cellWidth), scale),
                height: PreciseCalculator.multiply((heights.get(i) || cellHeight), scale),
                isCell: true,
                isFrozen: true
            });
        }
    }

    // 生成内容区域的单元格
    for(let i = 0; i < currentRows; i++) {
        for(let j = 0; j < currentCols; j++) {
            const rowIndex = startRow + i;
            const colIndex = startCol + j;
            const key = `${rowIndex},${colIndex}`;

            const x = PreciseCalculator.add(
                scaledRowHeaderWidth - horizontalLeft,
                colIndex > 0 ? accumulatedWidths[colIndex - 1] : 0
            );
            const y = PreciseCalculator.add(
                scaledColHeaderHeight - verticalTop,
                rowIndex > 0 ? accumulatedHeights[rowIndex - 1] : 0
            );

            drawCellData.set(key, { 
                x,
                y,
                width: PreciseCalculator.multiply((widths.get(colIndex) || cellWidth), scale),
                height: PreciseCalculator.multiply((heights.get(rowIndex) || cellHeight), scale),
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
        
        drawCellData.set(key, {
            x: 0,
            y: y,
            width: scaledRowHeaderWidth,
            height: PreciseCalculator.multiply((heights.get(rowIndex) || cellHeight), scale),
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
            x: x,
            y: 0,
            width: PreciseCalculator.multiply((widths.get(colIndex) || cellWidth), scale),
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