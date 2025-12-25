import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600',
        secondary:
          'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500',
        accent:
          'bg-accent-600 text-white hover:bg-accent-700 focus-visible:ring-accent-600',
        outline:
          'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500',
        ghost:
          'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-500',
        link:
          'bg-transparent text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-600',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * 是否使用 Slot 来合并属性到子元素
   * 当为 true 时，Button 会将所有属性传递给子元素，而不是渲染一个 button 元素
   */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
