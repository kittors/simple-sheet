declare interface BaseConfig {
    container:string;
    rows?: number;
    cols?: number;
}

declare interface CellItem {
    width: number;
    height: number;
}

declare  interface SheetConfig extends BaseConfig {
    /** 表格前缀 */
    prefix?: string;
    /** 默认单元格尺寸 */
    defaultCellItem?: CellItem;
    /** 列宽集合，key 为列索引，value 为宽度 */
    widths: Map<number, number>;
    /** 行高集合，key 为行索引，value 为高度 */
    heights: Map<number, number>;
    /** 行头内容 */
    rowHeaderContent?: Map<number, string>;
    /** 列头内容 */
    colHeaderContent?: Map<number, string>;
    /** 列宽集合，key 为列索引，value 为宽度 */
    scale?: number;
    /** 线宽 */
    lineSize?: number;
    /** 线颜色 */
    lineColor?: string;
    /** 表头配置 */
    headerConfig?: {
        /** 行头宽度 */
        rowHeaderWidth: number;
        /** 列头高度 */
        colHeaderHeight: number;
        /** 背景颜色 */
        backgroundColor: string;
        /** 字体颜色 */
        fontColor: string;
        /** 字体大小 */
        fontSize: number;
        /** 字体 */
        fontFamily: string;
    };
    /** 冻结行列 0: 列 1: 行 */
    frozen?: [number, number];
}

declare interface NewSheetConfig extends SheetConfig {
       /** 列宽集合，key 为列索引，value 为宽度 */
       widths?: Map<number, number>;
       /** 行高集合，key 为行索引，value 为高度 */
       heights?: Map<number, number>;
}

interface ContentStyle {
    /** 字体颜色 */
    color?: string;
    /** 字体大小 */
    fontSize?: number;
    /** 字体粗细 */
    fontWeight?: string;
    /** 字体对齐方式 */
    textAlign?: string;
    /** 字体 */
    fontFamily?: string;
    /** 字体换行 */
    whiteSpace?: string;
    /** 字体行高 */
    lineHeight?: number;
}

declare interface BorderStyle {
    /** 边框大小 */
    borderSize: number,
    /** 边框颜色 */
    borderColor: string,
}

declare interface DrawCellDataItem {
    /** 单元格x坐标 */
    x: number,
    /** 单元格y坐标 */
    y: number,
    /** 单元格宽度 */
    width: number,
    /** 单元格高度 */
    height: number,
    borderInfo?: {
        /** 上边框 */
        top?: BorderStyle,
        /** 下边框 */
        bottom?: BorderStyle,
        /** 左边框 */
        left?: BorderStyle,
        /** 右边框 */
        right?: BorderStyle,
    },
    /** 是否是表头 */
    isHeader?: boolean;
    /** 是否是固定 */
    isFixed?: boolean;
    /** 背景颜色 */
    backgroundColor?: string;
    /** 单元格内容 */
    content?: string;
    /** 单元格内容样式 */
    contentStyle?: ContentStyle;
    /** 是否是滚动条交叉区域 */
    isScrollBarIntersection?: boolean;
    /** 是否是单元格 */
    isCell?: boolean;
    /** 是否是冻结单元格 */
    isFrozen?: boolean;
}




