// 将数字转换为Excel列名（A, B, C, ..., Z, AA, AB, ...）
export const numberToColumnName = (num: number): string => {
    let columnName = '';
    num = num + 1; // 因为传入的 index 是从0开始，所以需要加1

    while (num > 0) {
        const remainder = (num - 1) % 26;
        columnName = String.fromCharCode(65 + remainder) + columnName;
        num = Math.floor((num - 1) / 26);
    }
    return columnName;
}

// 获取表头内容
export const getHeaderContent = (
    type: 'row' | 'col', 
    index: number, 
    rowHeaderContent?: Map<number, string>, 
    colHeaderContent?: Map<number, string>
): string => {
    if (type === 'row') {
        // 如果有自定义的行头内容，优先使用
        if (rowHeaderContent?.has(index)) {
            return String(rowHeaderContent.get(index));
        }
        // 默认行头从1开始
        return String(index + 1);
    } else {
        // 如果有自定义的列头内容，优先使用
        if (colHeaderContent?.has(index)) {
            return String(colHeaderContent.get(index));
        }
        // 默认列头从A开始
        return numberToColumnName(index);
    }
}

/**
 * 统一处理数值精度，默认保留一位小数
 * @param value 需要处理的数值
 * @param precision 精度，默认为1
 * @returns 处理后的数值
 */
export const formatNumber = (value: number, precision: number = 1): number => {
    return Number(value.toFixed(precision));
}; 