
import Link from 'next/link';
import cn from './cn';
import Zoom from 'react-medium-image-zoom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from '@/app/components/CopyButton';
import { t } from '@/stores/language';
import { FiArrowUpRight } from 'react-icons/fi';

const markdownComponents = {
  img: ({ src, alt, width, height }) => {
    return (
      <Zoom>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width || '100%'}
          height={height || 'auto'}
          className="my-4 rounded-xl"
        />
      </Zoom>
    );
  },
  a: ({ children, href }) => (
    <Link href={href} className='inline-flex items-center gap-x-2 [text-decoration:unset] hover:underline underline-offset-4'>
      {children}

      {!children.key?.startsWith('img-') && <FiArrowUpRight />}
    </Link>
  ),
  code: ({ children, className }) => {
    const languageMatch = /language-(\w+)/.exec(className || '');

    return languageMatch ? (
      <div className='relative max-w-5xl'>
        <SyntaxHighlighter
          PreTag={'div'}
          // eslint-disable-next-line react/no-children-prop
          children={String(children).replace(/\n$/, '')}
          language={languageMatch[1]}
          style={darcula}
          wrapLongLines={false}
          className='!pr-12 rounded-lg overflow-auto'
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
        className={cn(
          className,
          'px-1.5 py-1 text-sm bg-quaternary text-primary rounded-lg before:content-[""] after:content-[""]'
        )}
      >
        {children}
      </code>
    );
  }
};

export default markdownComponents;