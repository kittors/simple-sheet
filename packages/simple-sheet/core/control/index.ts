import { Scale } from './scale';

// 控制器接口
export interface Controller {
    init(): void;
}

// 控制器管理类
export class ControlManager {
    private static instance: ControlManager;
    private controllers: Map<string, Controller> = new Map();

    private constructor() {
        this.initControllers();
    }

    public static getInstance(): ControlManager {
        if (!ControlManager.instance) {
            ControlManager.instance = new ControlManager();
        }
        return ControlManager.instance;
    }

    private initControllers(): void {
        // 初始化缩放控制器
        this.registerController('scale', new Scale());
        
    }

    private registerController(name: string, controller: Controller): void {
        controller.init();
        this.controllers.set(name, controller);
    }

    // 获取指定控制器
    public getController<T extends Controller>(name: string): T | undefined {
        return this.controllers.get(name) as T;
    }

    // 获取缩放控制器的快捷方法
    public getScaleController(): Scale {
        return this.getController<Scale>('scale')!;
    }
    
    // 加载所有的控制器
    public loadAllControllers(): void {
        for (const controller of this.controllers.values()) {
            controller.init();
        }
    }
}

// 导出单例实例
export default ControlManager.getInstance();
