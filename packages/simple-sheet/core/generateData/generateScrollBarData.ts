import store from '../../store';
import PreciseCalculator from '../../common/calculator';

export function generateScrollBarConfig() {
    const scale = store.getState('scale') || 1;
    const sheetConfig = store.getState('sheetConfig');
    const { widths, heights, defaultCellItem, cols = 0, rows = 0 } = sheetConfig;
    const scrollBarConfig = store.getState('scrollBarConfig');
    const containerSize = store.getState('containerSize');
    const { width, height } = containerSize;

    if (!defaultCellItem) {
        console.warn('defaultCellItem 未设置，请检查 sheetConfig 的初始化');
        return;
    }

    // 计算总宽度
    let totalWidth = 0;
    for (let i = 0; i < cols; i++) {
        const customWidth = widths.get(i);
        totalWidth = totalWidth + PreciseCalculator.multiply(customWidth || defaultCellItem.width , scale);
    }

    // 计算总高度
    let totalHeight = 0;
    for (let i = 0; i < rows; i++) {
        const customHeight = heights.get(i);
        totalHeight = totalHeight + PreciseCalculator.multiply(customHeight || defaultCellItem.height, scale);
    }

    // 设置表格总尺寸
    store.setState('sheetTotalSize', {
        width: totalWidth,
        height: totalHeight,
    });

    // 解构获取到滚动条的最小宽度和最小高度
    const { minSize } = scrollBarConfig;

    const scrollBarSize = scrollBarConfig.size - scrollBarConfig.borderWidth;
    
    // 初步判断是否需要显示滚动条
    let isShowHorizontalScrollBar = totalWidth > width;
    let isShowVerticalScrollBar = totalHeight > height;
    
    // 重新判断,考虑滚动条互相影响
    if (isShowHorizontalScrollBar) {
        // 如果显示水平滚动条,则需要用减去滚动条高度后的空间重新判断是否需要垂直滚动条
        isShowVerticalScrollBar = totalHeight > (height - scrollBarSize);
    }
    
    if (isShowVerticalScrollBar) {
        // 如果显示垂直滚动条,则需要用减去滚动条宽度后的空间重新判断是否需要水平滚动条
        isShowHorizontalScrollBar = totalWidth > (width - scrollBarSize);
    }

    // 计算水平滚动条的宽度，需要考虑垂直滚动条占用的空间
    const horizontalScrollBarWidth = width - (isShowVerticalScrollBar ? scrollBarSize : 0);
    
    // 计算垂直滚动条的高度，需要考虑水平滚动条占用的空间
    const verticalScrollBarHeight = height - (isShowHorizontalScrollBar ? scrollBarSize : 0);

    // 计算水平滚动条
    const horizontalScrollBar = {
        ...scrollBarConfig.horizontal,
        show: isShowHorizontalScrollBar,
        width: PreciseCalculator.max(
            PreciseCalculator.multiply(
                PreciseCalculator.divide(horizontalScrollBarWidth, totalWidth),
                horizontalScrollBarWidth
            ),
            minSize
        ),
        scrollBgWidth: horizontalScrollBarWidth,
        left: isShowHorizontalScrollBar
            ? Math.min(
                scrollBarConfig.horizontal.left || 0,
                PreciseCalculator.subtract(
                    horizontalScrollBarWidth,
                    PreciseCalculator.max(
                        PreciseCalculator.multiply(
                            PreciseCalculator.divide(horizontalScrollBarWidth, totalWidth),
                            horizontalScrollBarWidth
                        ),
                        minSize
                    )
                )
            )
            : 0,
    }

    // 计算垂直滚动条
    const verticalScrollBar = {
        ...scrollBarConfig.vertical,
        show: isShowVerticalScrollBar,
        height: PreciseCalculator.max(
            PreciseCalculator.multiply(
                PreciseCalculator.divide(verticalScrollBarHeight, totalHeight),
                verticalScrollBarHeight
            ), 
            minSize
        ),
        scrollBgHeight: verticalScrollBarHeight,
        top: isShowVerticalScrollBar 
            ? Math.min(
                scrollBarConfig.vertical.top || 0,
                PreciseCalculator.subtract(
                    verticalScrollBarHeight,
                    PreciseCalculator.max(
                        PreciseCalculator.multiply(
                            PreciseCalculator.divide(verticalScrollBarHeight, totalHeight),
                            verticalScrollBarHeight
                        ),
                        minSize
                    )
                )
            )
            : 0,
    }

    store.setState('scrollBarConfig', {
        ...scrollBarConfig,
        horizontal: horizontalScrollBar,
        vertical: verticalScrollBar,
    });
}
