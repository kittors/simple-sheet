import type { State } from './type';
import defaultConfig from './../config/defaultSheetConfig';

const { prefix, scale } = defaultConfig;

const state: State = {   
    isLoading: false,
    scale: scale || 1,
    prefix : prefix || 'simple-sheet',
    containers: {
        canvasContainer: '',
        loadingContainer: '',
        toolContainer: '',
    },
    drawCellData: new Map(),
    sheetTotalSize: {
        width: 0,
        height: 0,
    },
    scrollBarConfig: {
        color: 'rgb(222, 224, 227)',
        activeColor: 'rgb(180, 182, 185)',
        backgroundColor: '#fff',
        borderRadius: 5,
        size: 16,
        gap: 8,
        borderColor: '#E8E9E9',
        borderWidth: 1,
        scrollSpeed: 0.1,
        minSize: 20,
        horizontal: {
            show: false,
            width: 0,
            scrollBgWidth: 0,
            left: 0,
        },
        vertical: {
            show: false,
            height: 0,
            scrollBgHeight: 0,
            top: 0,
        },
    },
    sheetConfig: {
        container: '',
        widths: new Map(),
        heights: new Map(),
    },
    containerSize: {
        width: 0,
        height: 0,
    },
} as State

export default state;