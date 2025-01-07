const defaultConfig: SheetConfig  = {
    // 表格前缀
    prefix: 'simple-sheet',
    // 容器
    container: 'simple-box',
    // 行数
    rows: 50,
    // 列数
    cols: 50,
    // 缩放
    scale: 1,
    // 默认单元格尺寸
    defaultCellItem: {
        width: 80,
        height: 25,
    },
    // 线条尺寸
    lineSize: 0.3,
    // 线条颜色
    lineColor: '#000',
    // 宽度
    widths: new Map([[1, 300],[2, 300]]),
    // 高度
    heights: new Map([[1, 300],[2, 300]]),
    // 冻结行
    frozen: [1,1],
    // 表头配置
    headerConfig: {
        rowHeaderWidth: 40,
        colHeaderHeight: 25,
        backgroundColor: '#575757',
        fontColor: '#fff',
        fontSize: 12,
        fontFamily: 'Arial',
    },
}

export default defaultConfig;