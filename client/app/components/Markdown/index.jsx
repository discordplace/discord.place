'use client';

import cn from '@/lib/cn';
import MarkdownComponents from '@/lib/markdown-components';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import raw from 'rehype-raw';
import sanitize, { defaultSchema } from 'rehype-sanitize';

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    iframe: ['src', 'title']
  },
  strip: [...defaultSchema.strip, 'style'],
  tagNames: [...defaultSchema.tagNames, 'iframe']
};

export default function Markdown({ children, className, rawEnabled }) {
  const rehypePlugins = rawEnabled ? [raw, [sanitize, schema]] : [];

  return (
    <div
      className={cn(
        // oxlint-disable-next-line tailwindcss/no-unknown-classes
        'markdown prose max-w-5xl min-w-0 wrap-break-word dark:prose-invert',
        /* blockquote Styles */
        'prose-blockquote:border-l-primary prose-blockquote:text-tertiary',
        /* list Styles */
        'prose-ol:my-2! prose-ul:my-2! prose-li:my-1! prose-li:marker:text-tertiary',
        '[&_li>p]:my-1!',
        /* paragraph Styles */
        'prose-p:my-2!',
        /* heading Styles */
        'prose-headings:mt-6! prose-headings:mb-2!',
        /* table Styles */
        'prose-thead:border-b-[rgba(var(--bg-quaternary))] prose-tr:border-b-[rgba(var(--bg-tertiary))]',
        /* pre Styles */
        'prose-pre:bg-[unset] prose-pre:p-0',
        /* iframe Styles */
        '[&_:is(:where(iframe):not(:where([class~="not-prose"],[class~="not-prose"]_*)))]:h-[800px] [&_:is(:where(iframe):not(:where([class~="not-prose"],[class~="not-prose"]_*)))]:w-full',
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