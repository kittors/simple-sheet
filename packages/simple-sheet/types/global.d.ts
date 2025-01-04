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
    /** 列宽集合，key 为列索引，value 为宽度 */
    scale?: number;
}

declare interface NewSheetConfig extends SheetConfig {
       /** 列宽集合，key 为列索引，value 为宽度 */
       widths?: Map<number, number>;
       /** 行高集合，key 为行索引，value 为高度 */
       heights?: Map<number, number>;
}
  

declare interface DrawCellDataItem {
    x: number,
    y: number,
    width: number,
    height: number,
    borderSize: number,
    borderColor: string,
}


