import { generateScrollBarConfig } from './generateScrollBarData';
import { generateCellData } from './generateCellData';

class GenerateData {
    private static instance: GenerateData;

    private constructor() {}

    public static getInstance(): GenerateData {
        if (!GenerateData.instance) {
            GenerateData.instance = new GenerateData();
        }
        return GenerateData.instance;
    }

    // 计算绘制需要的数据 计算的是热数据
    public generateData = async () => {
        // 计算滚动条配置
        await Promise.resolve(generateScrollBarConfig());
        // 计算单元格数据
        await Promise.resolve(generateCellData());
    }
}

const instance = GenerateData.getInstance();
const generateData = instance.generateData;

export default generateData;