interface State {
    /** 容器 */
    containers: Containers;
    /** 是否加载中 */
    isLoading: boolean;
    /** 是否创建表格 */
    isCreate: boolean;
    /** 是否开始创建制表格 */
    isStartCreateSheet: boolean;
    /** 是否开始绘制表格 */
    isDraw: boolean;
    /** 缩放比例 */
    scale: number;
    /** 表格配置 */
    sheetConfig: SheetConfig;
    /** 表格前缀 */
    prefix: string;
    /** 表格渲染数据 */
    drawCellData: Map<string, DrawCellDataItem>;
    /** 表格总尺寸 */
    sheetTotalSize: {
        width: number;
        height: number;
    };
    /** 滚动条配置 */
    scrollBarConfig: {
        /** 滚动条颜色 */
        color: string;
        /** 滚动条背景颜色 */
        backgroundColor: string;
        /** 滚动条圆角 */
        borderRadius: number;
        /** 滚动条尺寸  水平滚动条的高度 垂直滚动条的宽度 */
        size: number;
        /** 水平滚动条配置 */
        horizontal: {
            /** 是否显示 */
            show: boolean;
            /** 滚动条宽度 */
            width: number;
            /** 最小滚动条宽度 */
            minWidth: number;
            /** 滚动条背景宽度 */
            scrollBgWidth: number;
        };
        /** 垂直滚动条配置 */
        vertical: {
            /** 是否显示 */
            show: boolean;
            /** 滚动条高度 */
            height: number;
            /** 最小滚动条高度 */
            minHeight: number;
            /** 滚动条背景宽度 */
            scrollBgHeight: number;
        };
    };
    /** 清理 resize 事件 */
    cleanupResize?: () => void;
    /** 容器尺寸 */
    containerSize: {
        width: number;
        height: number;
    };
}

interface Containers {
    canvasContainer: string;
}


export type { State };