import store from '../store';

export class MemoryMonitor {
    private static formatSize(bytes: number): string {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    private static getMapSize(map: Map<any, any>): number {
        let bytes = 0;
        for (const [key, value] of map.entries()) {
            // 计算key的大小
            bytes += key.length * 2; // 假设每个字符占2字节
            
            // 计算value的大小
            bytes += JSON.stringify(value).length * 2;
        }
        return bytes;
    }

    public static monitorStore(): void {        
        setInterval(() => {
            const memoryInfo = {
                drawCellData: this.formatSize(this.getMapSize(store.getState('drawCellData'))),
                widths: this.formatSize(this.getMapSize(store.getState('sheetConfig').widths)),
                heights: this.formatSize(this.getMapSize(store.getState('sheetConfig').heights)),
            };

            console.table({
                '数据类型': Object.keys(memoryInfo),
                '占用内存': Object.values(memoryInfo)
            });

            // 如果支持 performance.memory（仅Chrome支持）
            if (performance && (performance as any).memory) {
                console.log('总体内存使用情况：', {
                    总堆内存: this.formatSize((performance as any).memory.totalJSHeapSize),
                    已使用堆内存: this.formatSize((performance as any).memory.usedJSHeapSize),
                    堆内存限制: this.formatSize((performance as any).memory.jsHeapSizeLimit),
                });
            }
        }, 5000); // 每5秒监控一次
    }
}