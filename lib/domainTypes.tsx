export type Author = {
  name: string;
  profileUrl: string;
};

export type ImageInfo = {
  src: {
    large: string;
    original: string;
  };
  alt: string;
  author: Author;
};

export type DrawingMode = 'reference' | 'memory';

export type TimerMode = 'memorize' | 'drawing';
