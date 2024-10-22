
import CodeBlock from '@/app/components/CodeBlock';
import Link from 'next/link';
import { BiCodeCurly } from 'react-icons/bi';
import { FaFileCode } from 'react-icons/fa6';
import { FiArrowUpRight } from 'react-icons/fi';
import { IoLogoJavascript, IoLogoPython } from 'react-icons/io5';
import { MdHttps } from 'react-icons/md';
import { SiPhp } from 'react-icons/si';
import { TbFileTypeXml } from 'react-icons/tb';
import Zoom from 'react-medium-image-zoom';

import cn from './cn';

const markdownComponents = {
  a: ({ children, href }) => (
    <Link className='inline-flex items-center gap-x-2 underline-offset-4 [text-decoration:unset] hover:underline' href={href}>
      {children}

      {!children.key?.startsWith('img-') && <FiArrowUpRight />}
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
      case 'html':
        fileName = 'index.html';
        FileIcon = <FaFileCode />;
        break;
      case 'http':
        fileName = 'request.http';
        FileIcon = <MdHttps />;
        break;
      case 'js':
        fileName = 'index.js';
        FileIcon = <IoLogoJavascript />;
        break;
      case 'json':
        fileName = 'data.json';
        FileIcon = <BiCodeCurly />;
        break;
      case 'php':
        fileName = 'index.php';
        FileIcon = <SiPhp />;
        break;
      case 'python':
        fileName = 'script.py';
        FileIcon = <IoLogoPython />;
        break;
      case 'xml':
        fileName = 'data.xml';
        FileIcon = <TbFileTypeXml />;
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
  },
  img: ({ alt, height, src, width }) => {
    return (
      <Zoom>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={alt}
          className='my-4 rounded-xl'
          height={height || 'auto'}
          src={src}
          width={width || '100%'}
        />
      </Zoom>
    );
  }
};

export default markdownComponents;