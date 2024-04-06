import config from '@/config';
import cn from '@/lib/cn';
import useThemeStore from '@/stores/theme';
import Image from 'next/image';
import Link from 'next/link';
import { useLockBodyScroll } from 'react-use';
import UserSide from '@/app/components/Header/UserSide';
import { IoMdMenu } from 'react-icons/io';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import LogoWithText from '@/app/components/Logo/WithText';
import { nanoid } from 'nanoid';
import { usePathname } from 'next/navigation';
import { useNewspaperStore } from '@/stores/newspaper';

export default function CollapsedHeader() {
  const theme = useThemeStore(state => state.theme);
  const newspaperIsOpen = useNewspaperStore(state => state.isOpen);

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useLockBodyScroll(open);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [open]);

  return (
    <header className={cn(
      'fixed top-0 flex justify-between w-full px-4 mobile:px-16 lg:px-28 2xl:px-48 z-[9999] pb-6 [transition-duration:750ms]',
      newspaperIsOpen && 'opacity-0'
    )}>
      <div className='mt-6'>
        <Link href='/'>
          <Image src={theme === 'dark' ? '/symbol_white.png' : '/symbol_black.png'} width={64} height={64} className='w-[48px] h-[48px]' alt='discord.place Logo' />
        </Link>
      </div>

      <div className='flex items-center mt-6 gap-x-4'>
        <UserSide />

        <button className={cn(
          'relative z-[9999] transition-all left-0 duration-500 flex items-center px-2 py-2 text-lg font-medium rounded outline-none text-secondary bg-tertiary gap-x-2',
          open && 'left-0 mobile:left-8'
        )} onClick={() => setOpen(!open)}>
          {open ? <FiX /> : <IoMdMenu />}
        </button>

        <AnimatePresence>
          {open && (
            <div className='w-full h-full z-[999] fixed left-0 top-0 flex justify-end'>
              <motion.div 
                className='bg-[rgba(var(--bg-background),0.8)] backdrop-blur-sm w-full h-[100dvh] absolute' 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
              />

              <motion.div
                className='w-[80%] mobile:w-[60%] h-[100dvh] bg-secondary z-[999] p-8 flex flex-col gap-y-4'
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
              >
                <LogoWithText />

                <div className='flex flex-col'>
                  {config.headerLinks.map((link, index) => (
                    <Link 
                      key={nanoid()}
                      href={link.href}
                      className={cn(
                        'flex items-center py-4 text-base border-t font-medium border-y-[rgb(var(--bg-quaternary))] gap-x-2 text-tertiary',
                        index === config.headerLinks.length - 1 && 'border-b',
                        pathname === link.href && 'text-primary pointer-events-none'
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                      {pathname === link.href && <span className='px-2 py-1 ml-auto text-xs font-medium border rounded-full border-primary text-secondary bg-tertiary'>Current</span>}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}