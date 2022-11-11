import { Author } from '../lib/domainTypes';

export default function Attribution({
  className = '',
  imageUrl,
  author,
  platform,
}: {
  className: string;
  imageUrl: string;
  author: Author;
  platform: string;
}) {
  return (
    <div className={className}>
      <a className="underline" href={imageUrl}>
        Photo
      </a>
      <span>&nbsp;by&nbsp;</span>
      <a className="underline" href={author.profileUrl}>
        {author.name}
      </a>
      <span>&nbsp;on {platform}</span>
    </div>
  );
}
