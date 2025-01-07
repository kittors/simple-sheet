import store from '../../store';
import PreciseCalculator from '../../common/calculator';

export function generateLineData(): void {
    const sheetConfig = store.getState('sheetConfig');
    const { defaultCellItem, widths, heights, cols = 0, rows = 0, headerConfig, frozen = [0, 0] } = sheetConfig;
    const scale = store.getState('scale') || 1;
    const containerSize = store.getState('containerSize');
    const scrollConfig = store.getState('scrollBarConfig');
    
    if (!defaultCellItem || !headerConfig) return;

    // 计算表头尺寸
    const headerWidth = headerConfig.rowHeaderWidth * scale;
    const headerHeight = headerConfig.colHeaderHeight * scale;

    // 添加边距配置
    const marginRight = scrollConfig.vertical.show ? scrollConfig.size - scrollConfig.borderWidth : 0;
    const marginBottom = scrollConfig.horizontal.show ? scrollConfig.size - scrollConfig.borderWidth : 0;

    // 计算总宽度和总高度
    let totalWidth = 0;
    for (let i = 0; i < cols; i++) {
        totalWidth = PreciseCalculator.add(
            totalWidth, 
            PreciseCalculator.multiply((widths.get(i) || defaultCellItem.width), scale)
        );
    }

    let totalHeight = 0;
    for (let i = 0; i < rows; i++) {
        totalHeight = PreciseCalculator.add(
            totalHeight, 
            PreciseCalculator.multiply((heights.get(i) || defaultCellItem.height), scale)
        );
    }

    // 计算可见区域的最大范围（考虑滚动条和表头）
    const maxVisibleWidth = Math.min(
        PreciseCalculator.add(totalWidth, headerWidth),
        PreciseCalculator.subtract(containerSize.width, marginRight)
    );
    const maxVisibleHeight = Math.min(
        PreciseCalculator.add(totalHeight, headerHeight),
        PreciseCalculator.subtract(containerSize.height, marginBottom)
    );

    // 计算滚动相关参数
    const horizontalScrollRange = PreciseCalculator.subtract(scrollConfig.horizontal.scrollBgWidth, scrollConfig.horizontal.width);
    const verticalScrollRange = PreciseCalculator.subtract(scrollConfig.vertical.scrollBgHeight, scrollConfig.vertical.height);
    const maxHorizontalScroll = PreciseCalculator.subtract(
        totalWidth,
        PreciseCalculator.subtract(
            PreciseCalculator.subtract(containerSize.width, headerWidth),
            marginRight
        )
    );
    const maxVerticalScroll = PreciseCalculator.subtract(
        totalHeight,
        PreciseCalculator.subtract(
            PreciseCalculator.subtract(containerSize.height, headerHeight),
            marginBottom
        )
    );

    // 计算实际滚动位置
    const horizontalLeft = maxHorizontalScroll > 0 
        ? PreciseCalculator.divide(
            PreciseCalculator.multiply(scrollConfig.horizontal.left, maxHorizontalScroll),
            horizontalScrollRange || 1
          )
        : 0;
    const verticalTop = maxVerticalScroll > 0 
        ? PreciseCalculator.divide(
            PreciseCalculator.multiply(scrollConfig.vertical.top, maxVerticalScroll),
            verticalScrollRange || 1
          )
        : 0;

    // 生成水平线数据
    const horizontalLines = [];
    horizontalLines.push({
        x1: 0,
        y1: headerHeight,
        x2: maxVisibleWidth,
        y2: headerHeight
    });

    let accHeight = 0;
    for (let row = 0; row < rows; row++) {
        const height = PreciseCalculator.multiply((heights.get(row) || defaultCellItem.height), scale);
        accHeight = PreciseCalculator.add(accHeight, height);
        const y = PreciseCalculator.subtract(
            PreciseCalculator.add(headerHeight, accHeight),
            verticalTop
        );

        if (y >= headerHeight && y <= maxVisibleHeight) {
            horizontalLines.push({
                x1: 0,
                y1: y,
                x2: maxVisibleWidth,
                y2: y
            });
        }
    }

    // 生成垂直线数据
    const verticalLines = [];
    verticalLines.push({
        x1: headerWidth,
        y1: 0,
        x2: headerWidth,
        y2: maxVisibleHeight
    });

    let accWidth = 0;
    for (let col = 0; col < cols; col++) {
        const width = PreciseCalculator.multiply((widths.get(col) || defaultCellItem.width), scale);
        accWidth = PreciseCalculator.add(accWidth, width);
        const x = PreciseCalculator.subtract(
            PreciseCalculator.add(headerWidth, accWidth),
            horizontalLeft
        );

        if (x >= headerWidth && x <= maxVisibleWidth) {
            verticalLines.push({
                x1: x,
                y1: 0,
                x2: x,
                y2: maxVisibleHeight
            });
        }
    }

    // 计算冻结位置
    const [frozenCols, frozenRows] = frozen;
    let frozenWidth = headerWidth;
    let frozenHeight = headerHeight;

    // 计算冻结列的总宽度
    for (let i = 0; i < frozenCols; i++) {
        frozenWidth = PreciseCalculator.add(
            frozenWidth,
            PreciseCalculator.multiply((widths.get(i) || defaultCellItem.width), scale)
        );
    }

    // 计算冻结行的总高度
    for (let i = 0; i < frozenRows; i++) {
        frozenHeight = PreciseCalculator.add(
            frozenHeight,
            PreciseCalculator.multiply((heights.get(i) || defaultCellItem.height), scale)
        );
    }

    // 添加冻结线
    if (frozenCols > 0) {
        verticalLines.push({
            x1: frozenWidth,
            y1: 0,
            x2: frozenWidth,
            y2: maxVisibleHeight,
            isFrozenLine: true
        });
    }

    if (frozenRows > 0) {
        horizontalLines.push({
            x1: 0,
            y1: frozenHeight,
            x2: maxVisibleWidth,
            y2: frozenHeight,
            isFrozenLine: true
        });
    }

    // 存储线条数据到 store
    store.setState('lineData', {
        maxVisibleWidth,
        maxVisibleHeight,
        headerWidth,
        headerHeight,
        frozenWidth,
        frozenHeight,
        horizontalLines,
        verticalLines
    });
}
