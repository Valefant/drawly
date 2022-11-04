import { cva } from 'class-variance-authority';

export const playfulButton = cva(
  ['border-black', 'border-[3px]', 'border-form-playful'],
  {
    variants: {
      intent: {
        primary: 'bg-transparent text-black hover:bg-black hover:text-white',
        active: 'bg-black text-white',
        disabled: 'border-transparent opacity-50',
      },
      size: {
        small: 'text-sm py-1 px-2',
        medium: 'text-base py-2 px-4',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'medium',
    },
  }
);
