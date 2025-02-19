'use client';

import cn from '@/lib/cn';
import MarkdownComponents from '@/lib/markdownComponents';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import raw from 'rehype-raw';
import sanitize from 'rehype-sanitize';

export default function Markdown({ children, className, rawEnabled }) {
  const rehypePlugins = [raw, sanitize(rawEnabled ? { tagNames: ['iframe'] } : {})];

  return (
    <div
      className={cn(
        'markdown break-words prose max-w-5xl min-w-[0px] dark:prose-invert',
        /* blockquote Styles */
        'prose-blockquote:border-l-primary prose-blockquote:text-tertiary',
        /* list Styles */
        'prose-li:marker:text-tertiary',
        /* table Styles */
        'prose-thead:border-b-[rgba(var(--bg-quaternary))] prose-tr:border-b-[rgba(var(--bg-tertiary))]',
        /* paragraph Styles */
        'prose-p:whitespace-pre-wrap',
        /* pre Styles */
        'prose-pre:bg-[unset] prose-pre:p-0',
        /* iframe Styles */
        '[&_:is(:where(iframe):not(:where([class~="not-prose"],[class~="not-prose"]_*)))]:w-full [&_:is(:where(iframe):not(:where([class~="not-prose"],[class~="not-prose"]_*)))]:h-[800px]',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[gfm]}
        rehypePlugins={rehypePlugins}
        components={MarkdownComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}