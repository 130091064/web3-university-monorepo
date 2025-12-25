# 🚀 快速开始指南

## 项目结构

```
packages/ui/
├── src/
│   ├── components/
│   │   └── Button/
│   │       ├── Button.tsx          # Button 组件实现
│   │       └── index.ts             # 导出文件
│   ├── index.ts                     # 主入口
│   └── styles.css                   # Tailwind 样式
├── package.json                     # 包配置
├── tsconfig.json                    # TypeScript 配置
├── tsup.config.ts                   # 构建配置
└── postcss.config.js                # PostCSS 配置
```

## 本地开发

### 1. 安装依赖
```bash
pnpm install
```

### 2. 构建 UI 库
```bash
# 一次性构建
pnpm build:ui

# 或者进入 ui 目录
cd packages/ui
pnpm build
```

### 3. 开发模式（监听文件变化）
```bash
cd packages/ui
pnpm dev
```

## 在 SPA 应用中使用

### Step 1: 添加依赖
在 `apps/spa/package.json` 中添加：
```json
{
  "dependencies": {
    "@lillianfish/ui": "workspace:*"
  }
}
```

### Step 2: 安装依赖
```bash
pnpm install
```

### Step 3: 导入样式
在 `apps/spa/src/main.tsx` 或 `App.tsx` 顶部添加：
```tsx
import '@lillianfish/ui/styles.css';
```

### Step 4: 使用组件
```tsx
import { Button } from '@lillianfish/ui';

function MyComponent() {
  return (
    <div>
      <Button variant="primary">点击我</Button>
      <Button variant="outline" size="lg">大按钮</Button>
    </div>
  );
}
```

## 添加新组件

### 1. 创建组件文件
```bash
mkdir -p packages/ui/src/components/NewComponent
touch packages/ui/src/components/NewComponent/NewComponent.tsx
touch packages/ui/src/components/NewComponent/index.ts
```

### 2. 实现组件
```tsx
// packages/ui/src/components/NewComponent/NewComponent.tsx
import * as React from 'react';
import { clsx } from 'clsx';

export interface NewComponentProps {
  // 你的 props
}

export const NewComponent = React.forwardRef<
  HTMLDivElement,
  NewComponentProps
>((props, ref) => {
  return <div ref={ref} className={clsx('...')} {...props} />;
});

NewComponent.displayName = 'NewComponent';
```

### 3. 导出组件
```tsx
// packages/ui/src/components/NewComponent/index.ts
export { NewComponent } from './NewComponent';
export type { NewComponentProps } from './NewComponent';
```

### 4. 在主入口导出
```tsx
// packages/ui/src/index.ts
export { NewComponent } from './components/NewComponent';
export type { NewComponentProps } from './components/NewComponent';
```

### 5. 重新构建
```bash
pnpm build:ui
```

## 常用命令

```bash
# 构建所有包
pnpm build

# 只构建 UI 库
pnpm build:ui

# 构建 libs
pnpm build:libs

# 构建 hooks
pnpm build:hooks

# 运行 SPA 开发服务器
pnpm dev

# 运行 Storybook
pnpm dev:storybook
```

## 🎨 Button 组件 API

### Variants (变体)
- `primary` (默认) - 主要操作按钮
- `secondary` - 次要操作按钮
- `accent` - 强调操作按钮
- `outline` - 轮廓按钮
- `ghost` - 幽灵按钮
- `link` - 链接样式按钮
- `destructive` - 危险操作按钮

### Sizes (尺寸)
- `sm` - 小尺寸 (h-8)
- `md` (默认) - 中等尺寸 (h-10)
- `lg` - 大尺寸 (h-12)
- `icon` - 图标按钮 (w-10 h-10)

### Props
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asChild?: boolean;  // 将样式应用到子元素
}
```

### 使用示例

```tsx
// 基础用法
<Button>默认按钮</Button>

// 不同变体
<Button variant="primary">主要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="destructive">删除</Button>

// 不同尺寸
<Button size="sm">小按钮</Button>
<Button size="lg">大按钮</Button>

// 禁用状态
<Button disabled>禁用按钮</Button>

// asChild 模式 - 作为链接
<Button asChild variant="primary">
  <a href="/home">返回首页</a>
</Button>

// 带图标
<Button size="icon">
  <IconComponent />
</Button>

// 自定义类名
<Button className="custom-class">自定义样式</Button>

// 原生 button 属性
<Button type="submit" onClick={() => console.log('clicked')}>
  提交
</Button>
```

## 故障排除

### 构建失败
1. 确保所有依赖已安装: `pnpm install`
2. 清除缓存: `rm -rf node_modules/.cache`
3. 检查 TypeScript 错误: `cd packages/ui && pnpm tsc --noEmit`

### 样式不生效
1. 确保已导入样式: `import '@lillianfish/ui/styles.css'`
2. 检查 Tailwind 配置是否正确
3. 确保应用中也安装了 `tailwindcss`

### TypeScript 错误
1. 重新构建 UI 库: `pnpm build:ui`
2. 检查 tsconfig.json 配置
3. 重启 TypeScript 服务器

## 📖 更多文档

- [SUMMARY.md](./SUMMARY.md) - 完整总结
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构设计
- [USAGE.md](./USAGE.md) - 详细使用文档
- [README.md](./README.md) - 项目介绍
