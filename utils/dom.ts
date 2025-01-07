export interface CreateElementOptions {
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
    attributes?: Record<string, string>;
    children?: (HTMLElement | string)[];
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    options: CreateElementOptions = {}
): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    
    // 设置 class
    if (options.className) {
        element.className = options.className;
    }
    
    // 设置 style
    if (options.style) {
        Object.assign(element.style, options.style);
    }
    
    // 设置属性
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }
    
    // 添加子元素
    if (options.children) {
        options.children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    }
    
    return element;
} 