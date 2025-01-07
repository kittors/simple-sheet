class PreciseCalculator {
    static add(num1: number, num2: number): number {
        const str1 = num1.toString();
        const str2 = num2.toString();
        const decimal1 = str1.includes('.') ? str1.split('.')[1].length : 0;
        const decimal2 = str2.includes('.') ? str2.split('.')[1].length : 0;
        const multiplier = Math.pow(10, Math.max(decimal1, decimal2));
        return (num1 * multiplier + num2 * multiplier) / multiplier;
    }

    static multiply(num1: number, num2: number): number {
        const str1 = num1.toString();
        const str2 = num2.toString();
        const decimal1 = str1.includes('.') ? str1.split('.')[1].length : 0;
        const decimal2 = str2.includes('.') ? str2.split('.')[1].length : 0;
        return Number(((num1 * num2).toFixed(decimal1 + decimal2)));
    }

    static divide(num1: number, num2: number): number {
        if (num2 === 0) {
            throw new Error('除数不能为0');
        }
        // 设置一个较大的固定精度（比如15位），以确保大多数场景下的计算准确性
        const PRECISION = 15;
        // 使用字符串操作和大数乘法来提高精度
        const multiplier = Math.pow(10, PRECISION);
        const result = (num1 * multiplier) / num2;
        // 去除可能的舍入误差
        return Number(result.toFixed(PRECISION)) / multiplier;
    }

    
    static subtract(num1: number, num2: number): number {
        const str1 = num1.toString();
        const str2 = num2.toString();
        const decimal1 = str1.includes('.') ? str1.split('.')[1].length : 0;
        const decimal2 = str2.includes('.') ? str2.split('.')[1].length : 0;
        const multiplier = Math.pow(10, Math.max(decimal1, decimal2));
        return (num1 * multiplier - num2 * multiplier) / multiplier;
    }

    static max(...numbers: number[]): number {
        if (numbers.length === 0) {
            throw new Error('至少需要一个数字');
        }
        return Math.max(...numbers);
    }

    static min(...numbers: number[]): number {
        if (numbers.length === 0) {
            throw new Error('至少需要一个数字');
        }
        return Math.min(...numbers);
    }
}

export default PreciseCalculator;