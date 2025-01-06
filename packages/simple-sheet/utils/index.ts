// 将数字转换为Excel列名（A, B, C, ..., Z, AA, AB, ...）
export const numberToColumnName = (num: number): string => {
    let columnName = '';
    while (num >= 0) {
        const remainder = num % 26;
        columnName = String.fromCharCode(65 + remainder) + columnName;
        num = Math.floor(num / 26) - 1;
        if (num < 0) break;
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