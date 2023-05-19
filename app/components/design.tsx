import { cva } from 'class-variance-authority';

export const playfulButton = cva(
  ['dark:border-white', 'border-black', 'border-[3px]', 'border-form-playful'],
  {
    variants: {
      intent: {
        primary:
          'bg-transparent text-black hover:bg-slate-700 hover:text-white dark:text-white dark:hover:bg-slate-300 dark:hover:text-black',
        active: 'bg-black text-white dark:bg-white dark:text-black',
        disabled: 'opacity-25',
      },
      size: {
        small: 'text-sm py-1 px-2 border-[2px]',
        medium: 'text-base py-2 px-4',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
    },
  }
);
