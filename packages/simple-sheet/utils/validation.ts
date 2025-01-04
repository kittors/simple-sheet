/**
 * 检查当前设备是否为 Mac 设备
 * @returns {boolean} 如果是 Mac 设备返回 true，否则返回 false
 */
export const isMac = (): boolean => {
    return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
};

// 这里可以继续添加其他验证函数... 