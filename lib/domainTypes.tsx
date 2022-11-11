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
