# UI 库使用示例

## 在 monorepo 内部使用

### 1. 在应用的 package.json 中添加依赖

```json
{
  "dependencies": {
    "@lillianfish/ui": "workspace:*"
  }
}
```

### 2. 导入组件和样式

```tsx
// 在你的入口文件（如 main.tsx 或 App.tsx）中导入样式
import '@lillianfish/ui/styles.css';

// 在组件中使用
import { Button } from '@lillianfish/ui';

function App() {
  return (
    <div>
      {/* 基础用法 */}
      <Button>默认按钮</Button>
      
      {/* 不同变体 */}
      <Button variant="primary">主要按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="accent">强调按钮</Button>
      <Button variant="outline">轮廓按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
      <Button variant="link">链接按钮</Button>
      <Button variant="destructive">危险按钮</Button>
      
      {/* 不同尺寸 */}
      <Button size="sm">小按钮</Button>
      <Button size="md">中按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button size="icon">🔥</Button>
      
      {/* 禁用状态 */}
      <Button disabled>禁用按钮</Button>
      
      {/* asChild 模式 - 将样式应用到子元素 */}
      <Button asChild>
        <a href="/docs">链接按钮</a>
      </Button>
    </div>
  );
}
```

## TypeScript 支持

组件完全支持 TypeScript，包含完整的类型定义：

```tsx
import type { ButtonProps } from '@lillianfish/ui';

const MyButton: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  return <Button variant={variant} {...props} />;
};
```

## 样式定制

如果需要自定义样式，可以：

1. **使用 className 覆盖**：
```tsx
<Button className="your-custom-class">自定义按钮</Button>
```

2. **使用 buttonVariants 创建自定义按钮**：
```tsx
import { buttonVariants } from '@lillianfish/ui';
import { clsx } from 'clsx';

function CustomButton() {
  return (
    <a 
      href="/link" 
      className={clsx(buttonVariants({ variant: 'primary', size: 'lg' }))}
    >
      自定义链接按钮
    </a>
  );
}
```

## 开发模式

在开发 UI 库时，可以使用 watch 模式：

```bash
cd packages/ui
pnpm dev  # 监听文件变化并自动重新构建
```
