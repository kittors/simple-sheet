import store from '../store';

class GenerateData {
    private static instance: GenerateData;

    private constructor () {}

    public static getInstance (): GenerateData {
        if(!GenerateData.instance) {
            GenerateData.instance = new GenerateData();
        }
        return GenerateData.instance;
    }

    // 计算绘制需要的数据 计算的是热数据
    public generateData = async () => {
        await Promise.resolve(this.generateCellData());
        await Promise.resolve(this.generateScrollBarConfig());
    }

    // 生成滚动条配置数据
    private generateScrollBarConfig = () => {
        const scale = store.getState('scale') || 1;
        const sheetConfig = store.getState('sheetConfig');
        const { widths, heights, defaultCellItem, cols = 0, rows = 0 } = sheetConfig;

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

        const { width, height } = store.getState('containerSize');
        // 解构获取到滚动条的最小宽度和最小高度
        const { minWidth } = store.getState('scrollBarConfig').horizontal;
        const { minHeight } = store.getState('scrollBarConfig').vertical;

         // 计算水平滚动条
         const horizontalScrollBar = {
            show: totalWidth > width,
            width: Math.max((width / totalWidth) * width, minWidth),
            scrollBgWidth: width,
            minWidth,
        }

        // 计算垂直滚动条
        const verticalScrollBar = {
            show: totalHeight > height,
            height: Math.max((height / totalHeight) * height, minHeight),
            scrollBgHeight: height,
            minHeight,
        }
        store.setState('scrollBarConfig', {
            ...store.getState('scrollBarConfig'),
            horizontal: horizontalScrollBar,
            vertical: verticalScrollBar,
        });
    }

    // 生成当前的canvas画布能绘制的单元格数据
    private generateCellData(): void {
        const { width, height } = store.getState('containerSize');
        const sheetConfig = store.getState('sheetConfig');    
        const scale = store.getState('scale') || 1;
        const { defaultCellItem, cols = 0, rows = 0 } = sheetConfig;
        
        if (!defaultCellItem) {
            console.warn('defaultCellItem 未设置，请检查 sheetConfig 的初始化');
            return;
        }

        const { width: cellWidth, height: cellHeight, borderSize, borderColor } = defaultCellItem;
                
        const scaledCellWidth = cellWidth * scale;
        const scaledCellHeight = cellHeight * scale;
                
        const currentRows = Math.min(Math.ceil(height / scaledCellHeight), rows);
        const currentCols = Math.min(Math.ceil(width / scaledCellWidth), cols);
                
        const drawCellData = new Map<string, DrawCellDataItem>();
        for(let i = 0; i < currentRows; i++) {
            for(let j = 0; j < currentCols; j++) {
                const key = `${i},${j}`;
                drawCellData.set(key, { 
                    x: j * scaledCellWidth, 
                    y: i * scaledCellHeight, 
                    width: scaledCellWidth, 
                    height: scaledCellHeight, 
                    borderSize, 
                    borderColor 
                });
            }
        }

        store.setState('drawCellData', drawCellData);
    }
}

const instance  = GenerateData.getInstance();

const generateData = instance.generateData;

export default generateData;