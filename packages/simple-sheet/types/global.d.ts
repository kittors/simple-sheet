declare interface BaseConfig {
    container:string;
    rows?: number;
    cols?: number;
}

declare interface CellItem {
    width: number;
    height: number;
    borderSize: number; 
    borderColor: string;
}

declare  interface SheetConfig extends BaseConfig {
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
  

declare interface DrawCellDataItem {
    /** 单元格x坐标 */
    x: number,
    /** 单元格y坐标 */
    y: number,
    /** 单元格宽度 */
    width: number,
    /** 单元格高度 */
    height: number,
    /** 边框大小 */
    borderSize?: number,
    /** 边框颜色 */
    borderColor?: string,
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
}



