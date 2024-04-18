'use client';

import Image from 'next/image';
import { useThemeStore } from '@/stores/theme';
import cn from '@/lib/cn';

export default function ThemePreviewButton({ theme: _theme, imagePath }) {
  const toggleTheme = useThemeStore(state => state.toggleTheme);
  const theme = useThemeStore(state => state.theme);

  return (
    <Image
      src={imagePath}
      width={1920}
      height={910}
      alt={`discord.place ${_theme === 'light' ? 'Light' : 'Dark'} Theme Preview`}
      className={cn(
        'cursor-pointer w-[85%] lg:w-[30%] rounded-xl',
        theme === _theme ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-[rgba(var(--bg-secondary))] pointer-events-none' : 'hover:ring-2 ring-violet-500 ring-offset-2 ring-offset-[rgba(var(--bg-secondary))]'
      )}
      onClick={() => toggleTheme(_theme)}
    />
  );
}