# @lillianfish/ui 项目结构

```
packages/ui/
├── dist/                      # 构建产物（自动生成）
│   ├── index.js              # CommonJS 格式
│   ├── index.mjs             # ES Module 格式
│   ├── index.d.ts            # TypeScript 类型定义 (CommonJS)
│   ├── index.d.mts           # TypeScript 类型定义 (ESM)
│   └── index.css             # 编译后的样式文件
├── src/
│   ├── components/           # 组件目录
│   │   └── Button/
│   │       ├── Button.tsx    # Button 组件实现
│   │       └── index.ts      # Button 导出
│   ├── styles.css            # 样式入口（Tailwind CSS）
│   └── index.ts              # 主入口文件
├── .gitignore
├── package.json              # 包配置
├── postcss.config.js         # PostCSS 配置（Tailwind CSS 处理）
├── README.md                 # 项目说明
├── tsconfig.json             # TypeScript 配置
├── tsup.config.ts            # tsup 打包配置
└── USAGE.md                  # 使用文档

## 依赖分类说明

### peerDependencies（对等依赖）
由使用方（consumer）提供的依赖，UI 库不会打包这些依赖：
- `react` & `react-dom`: 框架核心，避免多实例问题
- `tailwindcss`: 样式系统，用户项目已安装

### dependencies（生产依赖）
会被打包到最终产物中的依赖：
- `@radix-ui/react-slot`: 实现 asChild 功能的核心库
- `class-variance-authority`: 管理组件 variants 的工具
- `clsx`: 条件类名合并工具

### devDependencies（开发依赖）
仅在开发和构建时使用：
- `tsup`: 打包工具
- `typescript`: TypeScript 编译器
- `@tailwindcss/postcss`: Tailwind CSS v4 的 PostCSS 插件
- `postcss`: CSS 处理器
- `@types/react` & `@types/react-dom`: TypeScript 类型定义

## 技术栈

- **React 19.2.1**: UI 框架
- **TypeScript 5.7.3**: 类型系统
- **Tailwind CSS v4**: 样式系统
- **Radix UI**: 无样式组件库（提供 Slot 等工具）
- **tsup**: 基于 esbuild 的打包工具
- **class-variance-authority**: Variant 管理

## 打包配置特点

1. **多格式输出**: 同时生成 CJS 和 ESM 格式
2. **类型定义**: 自动生成 .d.ts 文件
3. **CSS 分离**: 样式文件独立输出为 index.css
4. **Tree-shaking**: 支持按需引入
5. **"use client" 标记**: 为 Next.js App Router 做好准备

## 组件设计原则

1. **基于 Radix UI Slot**: 支持 asChild 模式，灵活应用到任何元素
2. **Variants 管理**: 使用 CVA 统一管理变体样式
3. **TypeScript 优先**: 完整的类型支持和提示
4. **Tailwind 集成**: 使用 Tailwind utility classes
5. **可定制**: 支持 className 覆盖和组合
```
