import CodeBlock from '@/components/code-block';
import cn from '@/utils/cn';
import Link from 'next/link';
import { BiCodeCurly } from 'react-icons/bi';
import { FaFileCode } from 'react-icons/fa6';
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5';
import { RiLinkM } from 'react-icons/ri';

export function useMDXComponents(components) {
  const H = ({ children, level }) => {
    const Tag = `h${level}`;

    return (
      <Tag
        className='group relative flex scroll-mt-8 items-center'
        data-name={children}
        id={children.toLowerCase().replace(/\s/g, '-')}
      >
        <Link
          className='absolute -left-8 pr-3 opacity-0 transition-opacity group-hover:opacity-100'
          href={`#${children.toLowerCase().replace(/\s/g, '-')}`}
        >
          <RiLinkM className='text-purple-400' size={20} />
        </Link>

        {children}
      </Tag>
    );
  };

  return {
    ...components,
    a: ({ children, href }) => (
      <Link className='underline-offset-4 [text-decoration:unset] hover:underline' href={href}>
        {children}
      </Link>
    ),
    code: ({ children, className }) => {
      const languageMatch = /language-(\w+)/.exec(className || '');

      let fileName = languageMatch?.[1];
      let FileIcon = <FaFileCode />;

      switch (languageMatch?.[1]) {
        case 'cURL':
          fileName = 'request.sh';
          FileIcon = <BiCodeCurly />;
          break;
        case 'js':
          fileName = 'index.js';
          FileIcon = <IoLogoJavascript />;
          break;
        case 'json':
          fileName = 'data.json';
          FileIcon = <BiCodeCurly />;
          break;
        case 'python':
          fileName = 'script.py';
          FileIcon = <IoLogoPython />;
          break;
      }

      return languageMatch ? (
        <CodeBlock
          dimmed={false}
          FileIcon={FileIcon}
          fileName={fileName}
          language={languageMatch[1]}
        >
          {children}
        </CodeBlock>
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
    },
    h1: props => <H level={1} {...props} />,
    h2: props => <H level={2} {...props} />,
    h3: props => <H level={3} {...props} />,
    h4: props => <H level={4} {...props} />,
    h5: props => <H level={5} {...props} />,
    h6: props => <H level={6} {...props} />
  };
}