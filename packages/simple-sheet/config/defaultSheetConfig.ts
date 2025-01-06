const defaultConfig: SheetConfig  = {
    container: 'simple-box',
    rows: 100,
    cols: 100,
    scale: 0.1,
    defaultCellItem: {
        width: 80,
        height: 25,
    },
    lineSize: 0.3,
    lineColor: '#000',
    widths: new Map(),
    heights: new Map(),
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