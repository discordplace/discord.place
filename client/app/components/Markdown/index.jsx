'use client';

import cn from '@/lib/cn';
import MarkdownComponents from '@/lib/markdownComponents';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

export default function Markdown({ children, className }) {
  return (
    <div className={cn(
      'markdown',
      className
    )}>
      <ReactMarkdown remarkPlugins={[gfm]} components={MarkdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}