import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyCodeButton from '@/components/copy-code-button';
import cn from '@/utils/cn';
import { useMedia } from 'react-use';

export default function CodeBlock({ children, FileIcon, fileName, language, dimmed }) {
  const prefersDark = useMedia('(prefers-color-scheme: dark)', false);

  return (
    <div className='border border-primary rounded-xl'>
      <div
        className={cn(
          'flex justify-between w-full px-4 py-2 -mb-2 border-b font-geist border-b-primary bg-secondary rounded-t-xl',
          dimmed && 'bg-[rgba(var(--bg-quaternary))]'
        )}
      >
        <div className='text-xs flex items-center gap-x-1.5 text-tertiary'>
          <FileIcon />

          {fileName}
        </div>

        <CopyCodeButton code={children} />
      </div>
      
      <SyntaxHighlighter
        PreTag={'div'}
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, '')}
        language={language}
        style={prefersDark ? oneDark : oneLight}
        wrapLongLines={false}
        className={cn(
          '!bg-[unset] !mb-0 max-w-[calc(100vw_-_4rem)] [&>code]:!bg-[unset]',
          dimmed && '!bg-[rgba(var(--bg-tertiary))] [&>code]:!bg-[rgba(var(--bg-tertiary))]'
        )}
      />
    </div>
  );
}