'use client';

import CopyButton from '@/app/components/CopyButton';
import useThemeStore from '@/stores/theme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ children, FileIcon, fileName, language }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='rounded-xl border border-primary'>
      {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
      <div className='font-geist -mb-2 flex w-full justify-between rounded-t-xl border-b border-b-primary bg-secondary px-4 py-2'>
        <div className='flex items-center gap-x-1.5 text-xs text-tertiary'>
          {FileIcon}

          {fileName}
        </div>

        <div>
          <CopyButton
            className='p-0'
            copyText={String(children).replace(/\n$/, '')}
            successText='Copied!'
          />
        </div>
      </div>

      <SyntaxHighlighter
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, '')}
        className='!mb-0 max-w-[calc(100vw_-_4rem)] !bg-[unset] [&>code]:!bg-[unset]'
        language={language}
        PreTag={'div'}
        style={theme === 'dark' ? oneDark : oneLight}
        wrapLongLines={false}
      />
    </div>
  );
}