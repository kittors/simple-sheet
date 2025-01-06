const defaultConfig: SheetConfig  = {
    container: 'simple-box',
    rows: 100,
    cols: 100,
    scale: 0.1,
    defaultCellItem: {
        width: 80,
        height: 25,
        borderSize: 0.3,
        borderColor: '#000',
    },
    widths: new Map(),
    heights: new Map(),
    headerConfig: {
        rowHeaderWidth: 40,
        colHeaderHeight: 25,
    },
}

export default defaultConfig;