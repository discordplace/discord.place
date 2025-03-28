/* eslint react/display-name: 0 */
/* eslint no-unused-vars: 0 */

import { TbFileTypeXml, SiPhp, MdHttps, IoLogoJavascript, IoLogoPython, FiArrowUpRight, FaFileCode, BiCodeCurly } from '@/icons';
import Link from 'next/link';
import cn from './cn';
import Zoom from 'react-medium-image-zoom';import CodeBlock from '@/app/components/CodeBlock';import CustomIFrame from '@/app/components/Markdown/iframe';
import Image from 'next/image';
import Tooltip from '@/app/components/Tooltip';

function DiscordEmoji({ children }) {
  // Regular expressions to match both static and animated emoji formats
  const staticEmojiRegex = /<:([^:]+):(\d+)>/;
  const animatedEmojiRegex = /<a:([^:]+):(\d+)>/;

  if (typeof children !== 'string') return children;

  const staticMatch = children.match(staticEmojiRegex);
  const animatedMatch = children.match(animatedEmojiRegex);

  if (staticMatch) {
    const [, name, id] = staticMatch;

    return (
      <Tooltip content={`:${name}:`}>
        <Image
          src={`https://cdn.discordapp.com/emojis/${id}.png`}
          alt={`Emoji ${name}`}
          className='my-0 inline-block h-[20px] w-auto align-middle'
          width={20}
          height={20}
        />
      </Tooltip>
    );
  }

  if (animatedMatch) {
    const [, name, id] = animatedMatch;

    return (
      <Tooltip content={`:${name}:`}>
        <Image
          src={`https://cdn.discordapp.com/emojis/${id}.gif`}
          alt={`Emoji ${name}`}
          className='my-0 inline-block h-[20px] w-auto align-middle'
          width={20}
          height={20}
        />
      </Tooltip>
    );
  }

  // Handle Twemoji
  // Split text into emoji and non-emoji parts
  const parts = children.split(emojiRegex);
  if (parts.length === 1) return children;

  return parts.map((part, index) => {
    if (!part) return null;
    if (!emojiRegex.test(part)) return part;

    const codePoint = toCodePoint(part);

    return (
      <Image
        key={index}
        src={`https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg/${codePoint}.svg`}
        alt={part}
        width={20}
        height={20}
        className='my-0 inline-block h-[20px] w-auto align-middle'
      />
    );
  });
}

function processContent(content, index) {
  if (typeof content === 'string') {
    const parts = content.split(/(<:[^:]+:\d+>|<a:[^:]+:\d+>)/);

    return parts.map((part, partIndex) => (
      <DiscordEmoji key={`${index}-${partIndex}`}>{part}</DiscordEmoji>
    ));
  }

  return content;
}

function withEmojiSupport(Component) {
  return ({ children, node, ...props }) => {
    if (!children) return <Component {...props} />;

    const content = Array.isArray(children) ? children.map((child, index) => processContent(child, index)) : processContent(children, 0);

    return (
      <Component {...props}>
        {content}
      </Component>
    );
  };
}

function toCodePoint(emoji) {
  if (emoji.length === 1) return emoji.charCodeAt(0).toString(16);

  const pairs = [];
  for (let i = 0; i < emoji.length; i++) {
    const code = emoji.charCodeAt(i);

    if (code >= 0xD800 && code <= 0xDBFF) {
      const next = emoji.charCodeAt(i + 1);
      if (next >= 0xDC00 && next <= 0xDFFF) {
        const comp = ((code - 0xD800) * 0x400) + (next - 0xDC00) + 0x10000;
        pairs.push(comp.toString(16));
        i++;
      }
    } else pairs.push(code.toString(16));
  }

  return pairs.join('-');
}

// Regular expression for matching emoji characters
const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;

const markdownComponents = {
  iframe: ({ src, title }) => {
    try {
      new URL(src);

      return <CustomIFrame src={src} title={title} />;
    } catch {
      return null;
    }
  },
  img: ({ src, alt, width, height }) => {
    return (
      <Zoom>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width || '100%'}
          height={height || 'auto'}
          className='my-4 rounded-xl'
        />
      </Zoom>
    );
  },
  p: withEmojiSupport('p'),
  h1: withEmojiSupport('h1'),
  h2: withEmojiSupport('h2'),
  h3: withEmojiSupport('h3'),
  h4: withEmojiSupport('h4'),
  h5: withEmojiSupport('h5'),
  h6: withEmojiSupport('h6'),
  li: withEmojiSupport('li'),
  a: withEmojiSupport(({ children, href }) => {
    return (
      <Link
        href={href}
        className='inline-flex items-center gap-x-2 underline-offset-4 [text-decoration:unset] hover:underline'
      >
        {children}

        {!children.key?.startsWith('img-') && <FiArrowUpRight />}
      </Link>
    );
  }),
  strong: withEmojiSupport('strong'),
  em: withEmojiSupport('em'),
  blockquote: withEmojiSupport('blockquote'),
  td: withEmojiSupport('td'),
  th: withEmojiSupport('th'),
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