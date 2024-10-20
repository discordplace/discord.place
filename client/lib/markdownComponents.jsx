
import Link from 'next/link';
import cn from './cn';
import Zoom from 'react-medium-image-zoom';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5';
import { BiCodeCurly } from 'react-icons/bi';
import { FaFileCode } from 'react-icons/fa6';
import CodeBlock from '@/app/components/CodeBlock';
import { TbFileTypeXml } from 'react-icons/tb';
import { MdHttps } from 'react-icons/md';
import { SiPhp } from 'react-icons/si';

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
      
    let fileName = languageMatch?.[1];
    let FileIcon = <FaFileCode />;

    switch (languageMatch?.[1]) {
      case 'js':
        fileName = 'index.js';
        FileIcon = <IoLogoJavascript />;
        break;
      case 'python':
        fileName = 'script.py';
        FileIcon = <IoLogoPython />;
        break;
      case 'json':
        fileName = 'data.json';
        FileIcon = <BiCodeCurly />;
        break;
      case 'cURL':
        fileName = 'request.sh';
        FileIcon = <BiCodeCurly />;
        break;
      case 'html':
        fileName = 'index.html';
        FileIcon = <FaFileCode />;
        break;
      case 'xml':
        fileName = 'data.xml';
        FileIcon = <TbFileTypeXml />;
        break;
      case 'http':
        fileName = 'request.http';
        FileIcon = <MdHttps />;
        break;
      case 'php':
        fileName = 'index.php';
        FileIcon = <SiPhp />;
        break;
    }

    return languageMatch ? (
      <CodeBlock
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
  }
};

export default markdownComponents;