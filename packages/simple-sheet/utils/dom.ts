export interface CreateElementOptions {
    tag?: keyof HTMLElementTagNameMap;
    className?: string;
    style?: Partial<CSSStyleDeclaration>;
    parent?: HTMLElement;
    children?: (HTMLElement | string)[];
}

export function createElement<T extends HTMLElement>(options: CreateElementOptions): T {
    const { tag = 'div', className, style, parent, children } = options;
    const element = document.createElement(tag) as T;
    
    if (className) {
        element.className = className;
    }
    
    if (style) {
        Object.assign(element.style, style);
    }
    
    if (children) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
    }
    
    if (parent) {
        parent.appendChild(element);
    }
    
    return element;
}

export function getElement<T extends HTMLElement = HTMLElement, A extends boolean = false>(
    selector: string,
    parent: Document | HTMLElement = document,
    all: A = false as A
): A extends true ? T[] : T | null {
    try {
        if (all) {
            const elements = Array.from(parent.querySelectorAll<T>(selector));
            if (elements.length === 0) {
                console.warn(`未找到匹配的元素: ${selector}`);
            }
            return elements as any;
        }
        const element = parent.querySelector<T>(selector);
        if (!element) {
            console.warn(`未找到匹配的元素: ${selector}`);
        }
        return element as any;
    } catch (error) {
        console.error(`获取元素失败: ${selector}`, error);
        return (all ? [] : null) as any;
    }
}

// 使用示例：
/*
// 获取单个元素
const element = getElement<HTMLDivElement>('#app');
const element = getElement('.container');

// 获取多个元素
const elements = getElement<HTMLDivElement>('.item', document, true);

// 在特定父元素下查找
const parent = document.querySelector('.parent');
if (parent) {
    const children = getElement('.child', parent, true);
}
*/ 