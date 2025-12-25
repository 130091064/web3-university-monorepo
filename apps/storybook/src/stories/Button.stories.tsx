import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@lillianfish/ui";
import "@lillianfish/ui/styles.css";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "accent",
        "outline",
        "ghost",
        "link",
        "destructive",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    asChild: { control: "boolean" },

    // 常用按钮属性
    children: { control: "text" },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["button", "submit", "reset"],
    },
    onClick: { action: "clicked" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    type: "button",
    disabled: false,
    asChild: false,
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

/**
 * Variants
 */
export const Variants: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="flex flex-wrap gap-3">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="accent">
        Accent
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="link">
        Link
      </Button>
      <Button {...args} variant="destructive">
        Destructive
      </Button>
    </div>
  ),
};

/**
 * Sizes
 */
export const Sizes: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
      <Button {...args} size="icon" aria-label="Icon button">
        {/* 用字符做占位，避免额外引入 icon 包 */}⌘
      </Button>
    </div>
  ),
};

/**
 * States
 */
export const Disabled: Story = {
  render: (args) => (
    <Button {...args} disabled>
      Disabled
    </Button>
  ),
};

export const LoadingLike: Story = {
  name: "Loading (example)",
  parameters: {
    docs: {
      description: {
        story:
          "你的 Button 当前没有内置 loading prop，这里演示一种“用 disabled + 文案变化”实现 loading 的方式（仅示例）。",
      },
    },
  },
  render: (args) => (
    <Button {...args} disabled aria-busy="true">
      Loading…
    </Button>
  ),
};

/**
 * asChild (Radix Slot)
 * 注意：你的 Button forwardRef 类型是 HTMLButtonElement；
 * 当 asChild=true 且 child 是 <a> 时，ref 实际会落在 <a> 上。
 * 这在 TS 上可能会有轻微类型不匹配，但运行是 ok 的。
 */
export const AsChildLink: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "asChild=true 时，Button 不会渲染 <button>，而是把样式与 props 合并到子元素（Radix Slot）。适合做“看起来像按钮的链接”。",
      },
    },
  },
  render: (args) => (
    <Button {...args} asChild variant="link">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Link as Button
      </a>
    </Button>
  ),
};

/**
 * In a form (submit/reset)
 */
export const FormButtons: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <form
      className="flex items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        // 仅用于 story 演示
        alert("submitted");
      }}
    >
      <Button type="submit">Submit</Button>
      <Button type="reset" variant="secondary">
        Reset
      </Button>
    </form>
  ),
};
