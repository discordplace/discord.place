'use client';

import useThemeStore from '@/stores/theme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyButton from '@/app/components/CopyButton';

export default function CodeBlock({ children, FileIcon, fileName, language }) {
  const theme = useThemeStore(state => state.theme);

  return (
    <div className='border border-primary rounded-xl'>
      <div className='flex justify-between w-full px-4 py-2 -mb-2 border-b font-geist border-b-primary bg-secondary rounded-t-xl'>
        <div className='text-xs flex items-center gap-x-1.5 text-tertiary'>
          {FileIcon}

          {fileName}
        </div>

        <div>
          <CopyButton
            copyText={String(children).replace(/\n$/, '')}
            successText='Copied!'
            className='p-0'
          />
        </div>
      </div>
    
      <SyntaxHighlighter
        PreTag={'div'}
        // eslint-disable-next-line react/no-children-prop
        children={String(children).replace(/\n$/, '')}
        language={language}
        style={theme === 'dark' ? oneDark : oneLight}
        wrapLongLines={false}
        className='!bg-[unset] !mb-0 max-w-[calc(100vw_-_4rem)] [&>code]:!bg-[unset]'
      />
    </div>
  );
}