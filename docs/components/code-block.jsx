'use client';

import CopyCodeButton from '@/components/copy-code-button';
import cn from '@/utils/cn';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useMedia } from 'react-use';

export default function CodeBlock({ children, dimmed, FileIcon, fileName, language }) {
  const prefersDark = useMedia('(prefers-color-scheme: dark)', false);

  return (
    <div className='rounded-xl border border-primary'>
      <div
        className={cn(
          'flex justify-between w-full px-4 py-2 -mb-2 border-b font-geist border-b-primary bg-secondary rounded-t-xl',
          dimmed && 'bg-[rgba(var(--bg-quaternary))]'
        )}
      >
        <div className='flex items-center gap-x-1.5 text-xs text-tertiary'>
          {FileIcon}

          {fileName}
        </div>

        <CopyCodeButton code={children} />
      </div>

      <SyntaxHighlighter
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, '')}
        className={cn(
          '!bg-[unset] !mb-0 max-w-[calc(100vw_-_4rem)] [&>code]:!bg-[unset]',
          dimmed && '!bg-[rgba(var(--bg-tertiary))] [&>code]:!bg-[rgba(var(--bg-tertiary))]'
        )}
        language={language}
        PreTag={'div'}
        style={prefersDark ? oneDark : oneLight}
        wrapLongLines={false}
      />
    </div>
  );
}