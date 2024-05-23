/* eslint-disable */

import { Link } from 'next-view-transitions';
import cn from './cn';
import Zoom from 'react-medium-image-zoom';

const Heading = ({ level, children }) => {
  const Tag = `h${level}`;
  
  return (
    <div className="relative">
      <Tag className={cn(
        'my-4 font-semibold',
        level === 1 && 'text-2xl',
        level === 2 && 'text-xl',
        level === 3 && 'text-lg',
        level === 4 && 'text-base',
        level === 5 && 'text-sm',
        level === 6 && 'text-xs',
      )}>
        {children}
      </Tag>
      <span className="absolute w-full bg-tertiary" style={{ bottom: '-8px', height: '2px' }}></span>
    </div>
  );
};

const markdownComponents = {
  h1: ({ children }) => <Heading level={1}>{children}</Heading>,
  h2: ({ children }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }) => <Heading level={4}>{children}</Heading>,
  h5: ({ children }) => <Heading level={5}>{children}</Heading>,
  h6: ({ children }) => <Heading level={6}>{children}</Heading>,
  blockquote: ({ children }) => <blockquote className="pl-4 my-4 text-sm font-medium text-tertiary" style={{ borderLeft: '4px solid rgba(var(--border-primary))' }}>{children}</blockquote>,
  code: ({ children }) => {
    const color = children.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)|hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)/g);
    if (!color) return <code className="mx-2 rounded-md bg-quaternary text-primary">{children}</code>;

    return (
      <>
        <div className='inline-flex items-center rounded-md gap-x-1 bg-quaternary text-tertiary' style={{ padding: '0 0.3rem'}}>
          <code>{children}</code>
          {color && <span className="inline-block rounded-full select-none bg-quaternary" style={{ width: '12px', height: '12px', backgroundColor: color }}>&thinsp;</span>}
        </div>
      </>
    );
  },
  a: ({ children, href }) => <Link href={href} className='hover:underline text-secondary'>
    {children}
  </Link>,
  img: ({ src, alt }) => {
    return (
      <Zoom>
        <img
          src={src}
          alt={alt}
          width={'100%'}
          height={'auto'}
          className="my-4 rounded-xl"
        />
      </Zoom>
    );
  },
  ul: ({ children }) => <ul className="my-4 text-tertiary" style={{ paddingLeft: '12px', listStyleType: 'disc', listStylePosition: 'inside' }}>{children}</ul>,
  ol: ({ children }) => <ol className="my-4 text-tertiary" style={{ paddingLeft: '12px', listStyleType: 'decimal', listStylePosition: 'inside' }}>{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  p: ({ children }) => <p className="my-4 text-tertiary">{children}</p>,
  hr: () => <hr className="my-4" style={{ borderTop: '1px solid rgba(var(--border-primary))' }} />
};

export default markdownComponents;