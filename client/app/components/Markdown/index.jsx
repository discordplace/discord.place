'use client';

import cn from '@/lib/cn';
import MarkdownComponents from '@/lib/markdownComponents';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import raw from 'rehype-raw';

export default function Markdown({ children, className, rawEnabled }) {
  return (
    <div
      className={cn(
        'markdown break-words prose max-w-5xl min-w-[0px] dark:prose-invert',
        'prose-blockquote:border-l-primary prose-blockquote:text-tertiary',
        'prose-li:marker:text-tertiary',
        'prose-thead:border-b-[rgba(var(--bg-quaternary))] prose-tr:border-b-[rgba(var(--bg-tertiary))]',
        'prose-p:whitespace-pre-wrap',
        'prose-pre:bg-[unset] prose-pre:p-0',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[gfm]}
        rehypePlugins={rawEnabled ? [raw] : []}
        components={MarkdownComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}