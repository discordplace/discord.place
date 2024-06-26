'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import Square from './components/Background/Square';
import { useEffect, useRef, useState } from 'react';
import TextTransition, { presets } from 'react-text-transition';
import Image from 'next/image';
import discordLogoBlue from '@/public/discord-logo-blue.svg';
import { FaLock } from 'react-icons/fa';
import Union from '@/public/safari/Union.svg';
import Shield from '@/public/safari/Shield.svg';
import Refresh from '@/public/safari/Refresh.svg';
import Pages from '@/public/safari/Pages.svg';
import Newtab from '@/public/safari/Newtab.svg';
import Download from '@/public/safari/Download.svg';
import { IoChevronBackOutline, IoChevronForwardOutline  } from 'react-icons/io5';
import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import BotCard from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import TemplateCard from '@/app/(templates)/templates/components/Hero/SearchResults/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import getHomeData from '@/lib/request/getHomeData';
import { useMedia } from 'react-use';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Page() {
  const texts = ['Profiles', 'Servers', 'Bots', 'Emojis', 'Templates'];

  const [index, setIndex] = useState(0);
  const [cachedData, setCachedData] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex(oldIndex => oldIndex >= texts.length - 1 ? 0 : oldIndex + 1);
    }, 2500);

    return () => {
      clearInterval(intervalRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [data, setData] = useState(null);

  useEffect(() => {
    if (cachedData[texts[index].toLowerCase()]) {
      setData(cachedData[texts[index].toLowerCase()]);
      return;
    }

    getHomeData(texts[index].toLowerCase())
      .then(data => {
        setData(data);
        setCachedData(oldCachedData => ({
          ...oldCachedData,
          [texts[index].toLowerCase()]: data
        }));
      })
      .catch(toast.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <div className="relative z-10 flex flex-col items-center w-full lg:h-[100dvh]">      
      <Square column='5' row='5' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-quaternary))' />
      
      <h1 className={cn(
        'px-3 mobile:px-0 font-bold leading-[2rem] sm:!leading-[5.5rem] cursor-default max-w-[400px] sm:max-w-[800px] text-center text-4xl sm:text-7xl select-none mt-[10rem]',
        BricolageGrotesque.className
      )}>
        A way to find best
        
        {' '}
            
        {isMobile ? (
          <>
            Discord
          </>
        ) : (
          <span className='text-[#5865F2] relative'>
            <Image
              src={discordLogoBlue}
              alt='Discord Logo'
              className='inline w-[350px]'
            />

            <div className='absolute top-0 w-full h-full rounded-[5rem] bg-[#5865F220] blur-[3rem] left-0' />
          </span>
        )}
        
        {' '}
        
        <div className='relative inline'>
          <TextTransition
            springConfig={presets.gentle}
            inline={true}
          >
            {texts[index % texts.length]}
          </TextTransition>
        </div>
      </h1>

      <div className='relative flex items-center justify-center flex-1 w-full px-6 mt-8 overflow-hidden lg:px-0'>
        <div className='mt-24 relative max-w-[1000px] min-h-[50dvh] max-h-[1200px] w-full overflow-hidden h-full z-[5] bg-secondary/50 border-x-2 border-t-2 border-primary rounded-t-3xl'>
          <div className='absolute left-0 w-full h-[900px] bg-black/5 dark:bg-white/5 blur-[3.5rem] rounded-full -top-[50rem]' />
        
          <div className='flex items-center justify-between px-6 pt-4'>
            <div className='flex items-center gap-x-2'>
              <div className='w-[10px] h-[10px] rounded-full bg-red-500' />
              <div className='w-[10px] h-[10px] rounded-full bg-yellow-500' />
              <div className='w-[10px] h-[10px] rounded-full bg-green-500' />

              <Image 
                src={Union}
                className='relative hidden lg:block left-6'
                width={20}
                height={20}
                alt='Union Icon'
              />

              <div className='relative hidden lg:flex text-[#575757] left-8 gap-x-0.5'>
                <IoChevronBackOutline size={20} />
                <IoChevronForwardOutline size={20} />
              </div>
            </div>

            <div className='items-center hidden lg:flex gap-x-2'>
              <Image
                src={Shield}
                width={15}
                height={15}
                alt='Shield Icon'
                className='w-[14px] h-[18px]'
              />
              
              <div className='rounded-lg text-secondary text-sm py-2 relative font-medium bg-quaternary select-none gap-x-2 flex items-center justify-center w-[450px]'>
                <FaLock size={12} className='text-tertiary' />
                discord.place

                <Image
                  src={Refresh}
                  width={13}
                  height={13}
                  alt='Refresh Icon'
                  className='absolute right-2'
                />
              </div>
            </div>

            <div className='hidden lg:flex gap-x-4'>
              <Image
                src={Download}
                width={15}
                height={15}
                alt='Download Icon'
              />

              <Image
                src={Newtab}
                width={15}
                height={15}
                alt='Newtab Icon'
              />

              <Image
                src={Pages}
                width={15}
                height={15}
                alt='Pages Icon'
              />
            </div>
          </div>

          <div className='flex items-center justify-center w-full px-4 mt-8 pointer-events-none select-none sm:px-0'>
            <AnimatePresence>
              {index === 0 && (
                <motion.div
                  className='grid grid-cols-1 sm:grid-cols-3 gap-8 [zoom:0.75]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {data?.profiles?.map?.(profile => (
                    <ProfileCard
                      key={profile.slug}
                      {...profile}
                    />
                  ))}
                </motion.div>
              )}

              {index === 1 && (
                <div className='w-full max-w-[700px]'>
                  <motion.div
                    className='grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-3 gap-8 [zoom:0.75] pointer-events-none'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {data?.servers?.map?.(server => (
                      <ServerCard
                        key={server.id}
                        overridedSort='Votes'
                        server={server}
                      />
                    ))}
                  </motion.div>
                </div>
              )}

              {index === 2 && (
                <div className='w-full max-w-[700px]'>
                  <motion.div
                    className='grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-3 gap-8 [zoom:0.75]'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {data?.bots?.map?.(bot => (
                      <BotCard
                        overridedSort='Votes'
                        key={bot.id}
                        data={bot}
                      />
                    ))}
                  </motion.div>
                </div>
              )}

              {index === 3 && (
                <div className='w-full max-w-[700px]'>
                  <motion.div
                    className='grid grid-cols-1 mobile:grid-cols-2 lg:grid-cols-3 gap-8 [zoom:0.75]'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {data?.emojis?.map?.(emoji => (
                      <div key={emoji.id}>
                        {(emoji.emoji_ids || []).length > 0 ? (
                          <EmojiPackageCard
                            id={emoji.id}
                            name={emoji.name}
                            categories={emoji.categories}
                            downloads={emoji.downloads}
                            emoji_ids={emoji.emoji_ids}
                          />
                        ) : (
                          <EmojiCard 
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
                </div>
              )}

              {index === 4 && (
                <div className='w-full max-w-[700px]'>
                  <motion.div
                    className='grid grid-cols-1 mobile:grid-cols-2 gap-8 [zoom:0.75]'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {data?.templates?.map?.(template => (
                      <TemplateCard
                        key={template.id}
                        data={template}
                      />
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className='absolute w-full bg-gradient-to-t from-[rgba(var(--bg-background))] via-[rgba(var(--bg-background))]/80 h-[200px] bottom-0 z-[5]' />
        </div>
      </div>

    </div>
  );
}