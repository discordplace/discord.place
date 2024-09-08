/* eslint-disable */

import Link from 'next/link';
import cn from './cn';
import Zoom from 'react-medium-image-zoom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import CopyButton from '@/app/components/CopyButton';
import { t } from '@/stores/language';

const Heading = ({ level, children }) => {
  const Tag = `h${level}`;
  
  return (
    <div className="relative">
      <Tag
        className={cn(
          'my-4 font-semibold',
          level === 1 && 'text-2xl',
          level === 2 && 'text-xl',
          level === 3 && 'text-lg',
          level === 4 && 'text-base',
          level === 5 && 'text-sm',
          level === 6 && 'text-xs',
        )}
      >
        {children}
      </Tag>
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
  strong: ({ children }) => <strong className="font-bold text-secondary">{children}</strong>,
  blockquote: ({ children }) => <blockquote className="pl-4 my-4 text-sm font-medium text-tertiary" style={{ borderLeft: '4px solid rgba(var(--border-primary))' }}>{children}</blockquote>,
  code: ({ children, className, node, ...rest }) => {
    const languageMatch = /language-(\w+)/.exec(className || '');

    return languageMatch ? (
      <div className='relative'>
        <SyntaxHighlighter
          {...rest}
          PreTag={'div'}
          children={String(children).replace(/\n$/, '')}
          language={languageMatch[1]}
          style={darcula}
          wrapLongLines={false}
          className='!pr-12 rounded-lg overflow-auto max-w-5xl'
        />

        <div className='absolute flex items-center p-1 top-2 right-2 gap-x-4'>
          <span className='text-xs font-bold text-tertiary'>{languageMatch[1]}</span>

          <CopyButton
            className='hidden p-0 text-xs mobile:flex'
            copyText={String(children).replace(/\n$/, '')}
          >
            {t('buttons.copy')}
          </CopyButton>
        </div>
      </div>
    ) : (
      <code
        {...rest}
        className={cn(
          className,
          'px-1.5 py-1 text-sm bg-quaternary text-primary rounded-lg',
        )}
      >
        {children}
      </code>
    );
  },
  a: ({ children, href }) => (
    <Link href={href} className='hover:underline text-secondary'>
      {children}
    </Link>
  ),
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
  li: ({ children }) => <li className='my-2'>{children}</li>,
  p: ({ children }) => <p className="my-4 break-words text-secondary">{children}</p>,
  hr: () => <hr className="my-4" style={{ borderTop: '1px solid rgba(var(--border-primary))' }} />
};

export default markdownComponents;