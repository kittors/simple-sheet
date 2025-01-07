import { generateScrollBarConfig } from './generateScrollBarData';
import { generateCellData } from './generateCellData';
import { generateLineData } from './generateLineData';

class GenerateData {
    private static instance: GenerateData;

    private constructor() {}

    public static getInstance(): GenerateData {
        if (!GenerateData.instance) {
            GenerateData.instance = new GenerateData();
        }
        return GenerateData.instance;
    }

    public generateData = async () => {
        // 计算滚动条配置
        await Promise.resolve(generateScrollBarConfig());
        // 计算线条数据
        await Promise.resolve(generateLineData());
        // 计算单元格数据
        await Promise.resolve(generateCellData());
    }
}

const instance = GenerateData.getInstance();
const generateData = instance.generateData;

export default generateData;