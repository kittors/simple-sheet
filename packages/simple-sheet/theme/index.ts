interface Button {
    render(): void;
}

interface Input {
    render(): void;
}

class DarkButton implements Button {
    render(): void {
        console.log('渲染深色主题按钮');
    }
}

class LightButton implements Button {
    render(): void {
        console.log('渲染浅色主题按钮');
    }
}

class DarkInput implements Input {
    render(): void {
        console.log('渲染深色主题输入框');
    }
}

class LightInput implements Input {
    render(): void {
        console.log('渲染浅色主题输入框');
    }
}

interface ThemeFactory {
    createButton(): Button;
    createInput(): Input;
}

class DarkThemeFactory implements ThemeFactory {
    createButton(): Button {
        return new DarkButton();
    }
    
    createInput(): Input {
        return new DarkInput();
    }
}

class LightThemeFactory implements ThemeFactory {
    createButton(): Button {
        return new LightButton();
    }
    
    createInput(): Input {
        return new LightInput();
    }
}