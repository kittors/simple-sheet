import store from '../../store';
import { formatNumber } from '../../utils';

// 添加精度控制方法
const formatWithPrecision = (num: number): number => {
    return formatNumber(num, 3);
};

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
        totalWidth = formatWithPrecision(totalWidth + (customWidth || defaultCellItem.width) * scale);
    }

    // 计算总高度
    let totalHeight = 0;
    for (let i = 0; i < rows; i++) {
        const customHeight = heights.get(i);
        totalHeight = formatWithPrecision(totalHeight + (customHeight || defaultCellItem.height) * scale);
    }

    // 设置表格总尺寸
    store.setState('sheetTotalSize', {
        width: formatWithPrecision(totalWidth),
        height: formatWithPrecision(totalHeight),
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
        width: formatWithPrecision(Math.max((horizontalScrollBarWidth / totalWidth) * horizontalScrollBarWidth, minSize)),
        scrollBgWidth: formatWithPrecision(horizontalScrollBarWidth),
        left: formatWithPrecision(scrollBarConfig.horizontal.left || 0),
    }

    // 计算垂直滚动条
    const verticalScrollBar = {
        ...scrollBarConfig.vertical,
        show: isShowVerticalScrollBar,
        height: formatWithPrecision(Math.max((verticalScrollBarHeight / totalHeight) * verticalScrollBarHeight, minSize)),
        scrollBgHeight: formatWithPrecision(verticalScrollBarHeight),
        top: formatWithPrecision(scrollBarConfig.vertical.top || 0),
    }

    store.setState('scrollBarConfig', {
        ...scrollBarConfig,
        horizontal: horizontalScrollBar,
        vertical: verticalScrollBar,
    });
}
