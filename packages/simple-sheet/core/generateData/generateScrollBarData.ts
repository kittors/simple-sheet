import store from '../../store';

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
        totalWidth += (customWidth || defaultCellItem.width) * scale;
    }

    // 计算总高度
    let totalHeight = 0;
    for (let i = 0; i < rows; i++) {
        const customHeight = heights.get(i);
        totalHeight += (customHeight || defaultCellItem.height) * scale;
    }

    // 设置表格总尺寸
    store.setState('sheetTotalSize', {
        width: totalWidth,
        height: totalHeight,
    });

    // 解构获取到滚动条的最小宽度和最小高度
    const { minSize } = scrollBarConfig;

    const isShowHorizontalScrollBar = totalWidth > width;
    const isShowVerticalScrollBar = totalHeight > height;

    // 计算实际可用区域，需要考虑两个滚动条互相影响的情况
    const scrollBarSize = scrollBarConfig.size - scrollBarConfig.borderWidth;
    
    // 计算水平滚动条的宽度，需要考虑垂直滚动条占用的空间
    const horizontalScrollBarWidth = width - (isShowVerticalScrollBar ? scrollBarSize : 0);
    
    // 计算垂直滚动条的高度，需要考虑水平滚动条占用的空间
    const verticalScrollBarHeight = height - (isShowHorizontalScrollBar ? scrollBarSize : 0);

    // 计算水平滚动条
    const horizontalScrollBar = {
        ...scrollBarConfig.horizontal,
        show: isShowHorizontalScrollBar,
        width: Math.max((horizontalScrollBarWidth / totalWidth) * horizontalScrollBarWidth, minSize),
        scrollBgWidth: horizontalScrollBarWidth,
        left: scrollBarConfig.horizontal.left || 0,
    }

    // 计算垂直滚动条
    const verticalScrollBar = {
        ...scrollBarConfig.vertical,
        show: isShowVerticalScrollBar,
        height: Math.max((verticalScrollBarHeight / totalHeight) * verticalScrollBarHeight, minSize),
        scrollBgHeight: verticalScrollBarHeight,
        top: scrollBarConfig.vertical.top || 0,
    }

    store.setState('scrollBarConfig', {
        ...scrollBarConfig,
        horizontal: horizontalScrollBar,
        vertical: verticalScrollBar,
    });
}
