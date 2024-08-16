'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import Square from './components/Background/Square';
import { useState } from 'react';
import Image from 'next/image';
import { FaLock } from 'react-icons/fa';
import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import BotCard from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import TemplateCard from '@/app/(templates)/templates/components/Hero/SearchResults/Card';
import SoundPreview from '@/app/(sounds)/sounds/components/SoundPreview';
import { AnimatePresence, motion } from 'framer-motion';
import SafariDarkNav from '@/public/safari/dark_nav.svg';
import SafariLightNav from '@/public/safari/light_nav.svg';
import useThemeStore from '@/stores/theme';
import FlipWords from '@/app/components/FlipWords';
import homePageMockData from '@/lib/homePageMockData';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Page() {
  const texts = ['Discord  Profiles', 'Discord  Servers', 'Discord  Bots', 'Discord  Emojis', 'Discord  Templates', 'Discord  Sounds'];
  const theme = useThemeStore(state => state.theme);

  const [index, setIndex] = useState(0);

  return (
    <div className="relative z-10 flex flex-col items-center w-full">      
      <Square column='4' row='4' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-quaternary))' />
      
      <h1 className={cn(
        'px-3 mobile:px-0 font-bold leading-[2rem] sm:!leading-[5.5rem] cursor-default max-w-[400px] sm:max-w-[800px] text-center text-4xl sm:text-7xl select-none mt-[14rem]',
        BricolageGrotesque.className
      )}>
        A way to find best {' '}
        
        <div className='relative inline'>
          <FlipWords
            words={texts}
            onStartAnimation={() => setIndex(oldIndex => oldIndex >= texts.length - 1 ? 0 : oldIndex + 1)}
          />
        </div>
      </h1>

      <div className='relative flex items-center justify-center flex-1 w-full px-6 mt-24 overflow-hidden lg:px-0'>
        <div className='mt-auto relative max-w-[1000px] max-h-[550px] w-full overflow-hidden h-full z-[5] bg-secondary/50 border-x-2 border-t-2 border-primary rounded-t-3xl'>
          <div className='absolute left-0 w-full h-[900px] bg-black/5 dark:bg-white/5 blur-[3.5rem] rounded-full -top-[50rem]' />
        
          <div className='z-[20] relative items-center justify-center hidden xl:flex'>
            <Image
              src={theme === 'dark' ? SafariDarkNav : SafariLightNav}
              alt='Safari Navigation'
              className='absolute top-0 left-0 z-[10]'
            />

            <div className='absolute text-secondary select-none gap-x-1.5 text-[10px] flex z-[20] top-2 justify-center'>
              <FaLock className='relative text-tertiary top-1' size={8} />

              <div>
                discord.place/
                <FlipWords
                  className='relative inline -ml-2'
                  words={texts.map(text => text.split('Discord  ')[1].toLowerCase())}
                />
              </div>
            </div>
          </div>

          <div className='flex items-center relative justify-center w-full z-[10] px-4 mt-8 pointer-events-none select-none xl:mt-16 sm:px-0'>
            <AnimatePresence mode='wait'>
              {index === 0 && (
                <motion.div
                  className='grid grid-cols-1 sm:grid-cols-3 gap-8 sm:[zoom:0.75]'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                  key='profiles'
                >
                  {homePageMockData?.profiles?.map?.(profile => (
                    <ProfileCard
                      key={profile.slug}
                      {...profile}
                    />
                  ))}
                </motion.div>
              )}

              {index === 1 && (
                <motion.div
                  className='w-full max-w-[1000px] grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-3 gap-8 [zoom:0.75] pointer-events-none'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                  key='servers'
                >
                  {homePageMockData?.servers?.map?.(server => (
                    <ServerCard
                      key={`server-${server.id}`}
                      overridedSort='Votes'
                      server={server}
                    />
                  ))}
                </motion.div>
              )}

              {index === 2 && (
                <motion.div
                  className='w-full max-w-[1000px] grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-3 gap-8 [zoom:0.75]'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                  key='bots'
                >
                  {homePageMockData?.bots?.map?.(bot => (
                    <BotCard
                      overridedSort='Votes'
                      key={`bot-${bot.id}`}
                      data={bot}
                    />
                  ))}
                </motion.div>
              )}

              {index === 3 && (
                <motion.div
                  className='w-full max-w-[1000px] grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-3 gap-8 [zoom:0.75]'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                  key='emojis'
                >
                  {homePageMockData?.emojis?.map?.(emoji => (
                    <div key={`emoji-${emoji.id}`}>
                      {(emoji.emoji_ids || []).length > 0 ? (
                        <EmojiPackageCard
                          overridedImages={emoji.overridedImages}
                          alwaysHovered={emoji.alwaysHovered}
                          name={emoji.name}
                          categories={emoji.categories}
                          downloads={emoji.downloads}
                          emoji_ids={emoji.emoji_ids}
                        />
                      ) : (
                        <EmojiCard 
                          overridedImage={emoji.overridedImage}
                          id={emoji.id}
                          name={emoji.name}
                          animated={emoji.animated}
                          categories={emoji.categories}
                          downloads={emoji.downloads}
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {index === 4 && (
                <motion.div
                  className='w-full max-w-[1000px] grid grid-cols-1 mobile:grid-cols-2 gap-8 [zoom:0.75]'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                  key='templates'
                >
                  {homePageMockData?.templates?.map?.(template => (
                    <TemplateCard
                      key={template.id}
                      data={template}
                    />
                  ))}
                </motion.div>
              )}

              {index === 5 && (
                <motion.div
                  className='w-full max-w-[1000px] grid grid-cols-1 mobile:grid-cols-3 gap-x-8 gap-y-14 [zoom:0.75]'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                  key='sounds'
                >
                  {homePageMockData?.sounds?.map?.(sound => (
                    <SoundPreview
                      key={sound.id}
                      sound={sound}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className='absolute w-full bg-gradient-to-t from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/80 h-[200px] bottom-0 z-[5]' />
        </div>
      </div>

    </div>
  );
}