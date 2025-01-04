const defaultConfig: SheetConfig  = {
    container: 'simple-box',
    rows: 50,
    cols: 50,
    scale: 1,
    defaultCellItem: {
        width: 80,
        height: 25,
        borderSize: 0.3,
        borderColor: '#eee',
    },
    widths: new Map(),
    heights: new Map(),
}

export default defaultConfig;