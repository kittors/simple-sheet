const defaultConfig: SheetConfig  = {
    container: 'simple-box',
    rows: 50,
    cols: 100,
    scale: 0.1,
    defaultCellItem: {
        width: 80,
        height: 25,
    },
    lineSize: 0.3,
    lineColor: '#000',
    widths: new Map([[1, 300],[2, 300]]),
    heights: new Map([[1, 300],[2, 300]]),
    frozen: [1,1],
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