'use client';

import cn from '@/lib/cn';
import MarkdownComponents from '@/lib/markdownComponents';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import raw from 'rehype-raw';

export default function Markdown({ children, className }) {
  return (
    <div className={cn(
      'markdown prose max-w-5xl dark:prose-invert',
      'prose-blockquote:border-l-primary prose-blockquote:text-tertiary',
      'prose-li:marker:text-tertiary',
      'prose-thead:border-b-[rgba(var(--bg-quaternary))] prose-tr:border-b-[rgba(var(--bg-tertiary))]',
      className
    )}>
      <ReactMarkdown
        remarkPlugins={[gfm]}
        rehypePlugins={[raw]}
        components={MarkdownComponents}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}