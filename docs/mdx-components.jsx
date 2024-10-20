import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import cn from '@/utils/cn';
import Link from 'next/link';
import { RiLinkM } from 'react-icons/ri';

export function useMDXComponents(components) {
  const H = ({ level, children }) => {
    const Tag = `h${level}`;
  
    return (
      <Tag
        className='relative flex items-center group scroll-mt-8'
        id={children.toLowerCase().replace(/\s/g, '-')}
        data-name={children}
      >
        <Link
          className='absolute pr-3 transition-opacity opacity-0 -left-8 group-hover:opacity-100'
          href={`#${children.toLowerCase().replace(/\s/g, '-')}`}
        >
          <RiLinkM size={20} className='text-purple-400' />
        </Link>

        {children}
      </Tag>
    );
  };

  return {
    ...components,
    h1: props => <H level={1} {...props} />,
    h2: props => <H level={2} {...props} />,
    h3: props => <H level={3} {...props} />,
    h4: props => <H level={4} {...props} />,
    h5: props => <H level={5} {...props} />,
    h6: props => <H level={6} {...props} />,
    a: ({ children, href }) => (
      <Link href={href} className='[text-decoration:unset] hover:underline underline-offset-4'>
        {children}
      </Link>
    ),
    code: ({ children, className }) => {
      const languageMatch = /language-(\w+)/.exec(className || '');
  
      return languageMatch ? (
        <SyntaxHighlighter
          PreTag={'div'}
          // eslint-disable-next-line react/no-children-prop
          children={String(children).replace(/\n$/, '')}
          language={languageMatch[1]}
          style={vscDarkPlus}
          wrapLongLines={false}
          className='rounded-lg'
        />
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
}