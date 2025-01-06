import store from '../store';

class GenerateData {
    private static instance: GenerateData;

    private constructor () {}

    private get scrollBarConfig() {
        return store.getState('scrollBarConfig');
    }

    private get containerSize() {
        return store.getState('containerSize');
    }

    // 获取水平滚动条向左的距离
    private get horizontalScrollBarLeft() {
        return store.getState('scrollBarConfig').horizontal.left;
    }

    // 获取垂直滚动条向上的距离
    private get verticalScrollBarTop() {
        return store.getState('scrollBarConfig').vertical.top;
    }

    public static getInstance (): GenerateData {
        if(!GenerateData.instance) {
            GenerateData.instance = new GenerateData();
        }
        return GenerateData.instance;
    }

    // 计算绘制需要的数据 计算的是热数据
    public generateData = async () => {
        await Promise.resolve(this.generateScrollBarConfig());
        await Promise.resolve(this.generateCellData());
    }

    // 生成滚动条配置数据
    private generateScrollBarConfig = () => {
        const scale = store.getState('scale') || 1;
        const sheetConfig = store.getState('sheetConfig');
        const { widths, heights, defaultCellItem, cols = 0, rows = 0 } = sheetConfig;
        // const scrollBarConfig = store.getState('scrollBarConfig');
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

        const { width, height } = this.containerSize;
        // 解构获取到滚动条的最小宽度和最小高度
        const { minSize } = store.getState('scrollBarConfig');

        const isShowHorizontalScrollBar = totalWidth > width;
        const isShowVerticalScrollBar = totalHeight > height;

        // 计算实际可用区域，需要考虑两个滚动条互相影响的情况
        const scrollBarSize = this.scrollBarConfig.size - this.scrollBarConfig.borderWidth;
        
        // 计算水平滚动条的宽度，需要考虑垂直滚动条占用的空间
        const horizontalScrollBarWidth = width - (isShowVerticalScrollBar ? scrollBarSize : 0);
        
        // 计算垂直滚动条的高度，需要考虑水平滚动条占用的空间
        const verticalScrollBarHeight = height - (isShowHorizontalScrollBar ? scrollBarSize : 0);

         // 计算水平滚动条
         const horizontalScrollBar = {
            ...this.scrollBarConfig.horizontal,
            show: isShowHorizontalScrollBar,
            width: Math.max((horizontalScrollBarWidth / totalWidth) * horizontalScrollBarWidth, minSize),
            scrollBgWidth: horizontalScrollBarWidth,
            left: this.scrollBarConfig.horizontal.left || 0,
        }
        // 计算垂直滚动条
        const verticalScrollBar = {
            ...this.scrollBarConfig.vertical,
            show: isShowVerticalScrollBar,
            height: Math.max((verticalScrollBarHeight / totalHeight) * verticalScrollBarHeight, minSize),
            scrollBgHeight: verticalScrollBarHeight,
            top: this.scrollBarConfig.vertical.top || 0,
        }
        store.setState('scrollBarConfig', {
            ...this.scrollBarConfig,
            horizontal: horizontalScrollBar,
            vertical: verticalScrollBar,
        });
    }

    // 生成当前的canvas画布能绘制的单元格数据
    private generateCellData(): void {
        const { width, height } = this.containerSize;
        const sheetConfig = store.getState('sheetConfig');    
        const scale = store.getState('scale') || 1;
        const { defaultCellItem, widths, heights, cols = 0, rows = 0 } = sheetConfig;
        
        if (!defaultCellItem) {
            console.warn('defaultCellItem 未设置，请检查 sheetConfig 的初始化');
            return;
        }

        const { width: cellWidth, height: cellHeight, borderSize, borderColor } = defaultCellItem;
        
        // 预先计算并缓存每个位置的累积宽度和高度
        const accumulatedWidths: number[] = new Array(cols);
        const accumulatedHeights: number[] = new Array(rows);
        
        let currentWidth = 0;
        for (let i = 0; i < cols; i++) {
            currentWidth += (widths.get(i) || cellWidth) * scale;
            accumulatedWidths[i] = currentWidth;
        }
        
        let currentHeight = 0;
        for (let i = 0; i < rows; i++) {
            currentHeight += (heights.get(i) || cellHeight) * scale;
            accumulatedHeights[i] = currentHeight;
        }

        // 添加边距配置（可以根据需要调整）
        const marginRight = this.scrollBarConfig.vertical.show ? this.scrollBarConfig.size - this.scrollBarConfig.borderWidth : 0;
        const marginBottom = this.scrollBarConfig.horizontal.show ? this.scrollBarConfig.size - this.scrollBarConfig.borderWidth : 0;

        // 添加表头配置
        const headerConfig = store.getState('sheetConfig').headerConfig || {
            rowHeaderWidth: 40,  // 行表头宽度
            colHeaderHeight: 25  // 列表头高度
        };

        // 应用缩放到表头尺寸
        const scaledRowHeaderWidth = headerConfig.rowHeaderWidth * scale;
        const scaledColHeaderHeight = headerConfig.colHeaderHeight * scale;

        // 计算可视区域（不包括表头）
        const viewportWidth = width - scaledRowHeaderWidth;  // 使用缩放后的宽度
        const viewportHeight = height - scaledColHeaderHeight;  // 使用缩放后的高度

        // 修改最大滚动范围的计算，需要考虑表头占用的空间
        const maxHorizontalScroll = currentWidth - viewportWidth + marginRight;
        const maxVerticalScroll = currentHeight - viewportHeight + marginBottom;
        const horizontalScrollRange = this.scrollBarConfig.horizontal.scrollBgWidth - this.scrollBarConfig.horizontal.width;
        const verticalScrollRange = this.scrollBarConfig.vertical.scrollBgHeight - this.scrollBarConfig.vertical.height;
        
        const horizontalLeft = maxHorizontalScroll > 0 
            ? (this.horizontalScrollBarLeft * maxHorizontalScroll / horizontalScrollRange)
            : 0;
        const verticalTop = maxVerticalScroll > 0 
            ? (this.verticalScrollBarTop * maxVerticalScroll / verticalScrollRange)
            : 0;

        // 计算起始行和列
        let startX = 0;
        let startY = 0;
        let startRow = 0;
        let startCol = 0;

        // 计算起始行和列
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
            
        const drawCellData = new Map<string, DrawCellDataItem>();
        for(let i = 0; i < currentRows; i++) {
            for(let j = 0; j < currentCols; j++) {
                const rowIndex = startRow + i;
                const colIndex = startCol + j;
                const key = `${rowIndex},${colIndex}`;

                // 内容区域的单元格位置计算
                const x = scaledRowHeaderWidth - horizontalLeft +  // 使用缩放后的表头宽度
                    (colIndex > 0 ? accumulatedWidths[colIndex - 1] : 0);
                const y = scaledColHeaderHeight - verticalTop +  // 使用缩放后的表头高度
                    (rowIndex > 0 ? accumulatedHeights[rowIndex - 1] : 0);

                drawCellData.set(key, { 
                    x, 
                    y, 
                    width: (widths.get(colIndex) || cellWidth) * scale, 
                    height: (heights.get(rowIndex) || cellHeight) * scale, 
                    borderSize, 
                    borderColor 
                });
            }
        }

        // 添加固定的行头单元格
        for(let i = 0; i < currentRows; i++) {
            const rowIndex = startRow + i;
            const key = `${rowIndex},header`;
            const y = scaledColHeaderHeight - verticalTop +  // 使用缩放后的表头高度
                (rowIndex > 0 ? accumulatedHeights[rowIndex - 1] : 0);
            
            drawCellData.set(key, {
                x: 0,
                y,
                width: scaledRowHeaderWidth,  // 使用缩放后的宽度
                height: (heights.get(rowIndex) || cellHeight) * scale,
                borderSize,
                borderColor,
                isHeader: true,
                backgroundColor: '#f5f5f5'
            });
        }

        // 添加固定的列头单元格
        for(let j = 0; j < currentCols; j++) {
            const colIndex = startCol + j;
            const key = `header,${colIndex}`;
            const x = scaledRowHeaderWidth - horizontalLeft +  // 使用缩放后的表头宽度
                (colIndex > 0 ? accumulatedWidths[colIndex - 1] : 0);

            drawCellData.set(key, {
                x,
                y: 0,
                width: (widths.get(colIndex) || cellWidth) * scale,
                height: scaledColHeaderHeight,  // 使用缩放后的高度
                borderSize,
                borderColor,
                isHeader: true,
                backgroundColor: '#f5f5f5'
            });
        }

        // 添加左上角的交叉单元格
        drawCellData.set('header,header', {
            x: 0,
            y: 0,
            width: scaledRowHeaderWidth,  // 使用缩放后的宽度
            height: scaledColHeaderHeight,  // 使用缩放后的高度
            borderSize,
            borderColor,
            isHeader: true,
            backgroundColor: '#f5f5f5'
        });

        store.setState('drawCellData', drawCellData);
    }
}

const instance  = GenerateData.getInstance();

const generateData = instance.generateData;

export default generateData;