'use client';

import cn from '@/lib/cn';
import { Bricolage_Grotesque } from 'next/font/google';
import Square from './components/Background/Square';
import { useEffect, useRef, useState } from 'react';
import TextTransition, { presets } from 'react-text-transition';
import Image from 'next/image';
import discordLogoBlue from '@/public/discord-logo-blue.svg';
import { FaLock } from 'react-icons/fa';
import ProfileCard from '@/app/(profiles)/profiles/components/Hero/Profiles/Card';
import ServerCard from '@/app/(servers)/servers/components/ServerCard';
import BotCard from '@/app/(bots)/bots/components/Hero/SearchResults/Card';
import EmojiCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard';
import EmojiPackageCard from '@/app/(emojis)/emojis/components/Hero/EmojiCard/Package';
import TemplateCard from '@/app/(templates)/templates/components/Hero/SearchResults/Card';
import { AnimatePresence, motion } from 'framer-motion';
import { useMedia } from 'react-use';
import SafariDarkNav from '@/public/safari/dark_nav.svg';
import SafariLightNav from '@/public/safari/light_nav.svg';
import useThemeStore from '@/stores/theme';

const BricolageGrotesque = Bricolage_Grotesque({ subsets: ['latin'] });

export default function Page() {
  const texts = ['Profiles', 'Servers', 'Bots', 'Emojis', 'Templates'];
  const theme = useThemeStore(state => state.theme);

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex(oldIndex => oldIndex >= texts.length - 1 ? 0 : oldIndex + 1);
    }, 3500);

    return () => {
      clearInterval(intervalRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const baseProfileData = {
    colors: {
      primary: null,
      secondary: null
    },
    badges: [],
    views: 100000,
    likes: 100000
  };

  const baseServerData = {
    data: {
      members: 100000,
      votes: 100000
    }
  };

  const baseBotData = {
    owner: {},
    votes: 100000
  };

  const baseEmojiData = {
    user: {},
    downloads: 100000,
    created_at: new Date().toISOString()
  };

  const baseTemplateData = {
    uses: 100000,
    created_at: new Date().toISOString()
  };

  const [data] = useState({
    profiles: [
      {
        ...baseProfileData,
        slug: 'discord',
        username: 'Discord',
        global_name: 'Discord',
        bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        badges: [],
        createdAt: '2015-05-14T00:00:00.000Z'
      },
      {
        ...baseProfileData,
        colors: {
          primary: '#616ffd35',
          secondary: '#616ffd35'
        },
        slug: 'discord.place',
        username: 'discord.place',
        avatar_url: '/templates/square_logo.png',
        global_name: 'discord.place',
        bio: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
        createdAt: '2024-02-16T00:00:00.000Z',
        premium: true
      },
      {
        ...baseProfileData,
        slug: 'disbot',
        username: 'Disbot',
        avatar_url: '/templates/disbot_logo.png',
        global_name: 'Disbot',
        bio: 'All discord bots specially designed for you are here!',
        createdAt: '2024-04-28T00:00:00.000Z'
      },
      {
        ...baseProfileData,
        slug: 'discord',
        username: 'Discord',
        global_name: 'Discord',
        bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        views: 100000,
        likes: 100000,
        badges: [],
        createdAt: '2015-05-14T00:00:00.000Z'
      },
      {
        ...baseProfileData,
        slug: 'discord',
        username: 'Discord',
        global_name: 'Discord',
        bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        views: 100000,
        likes: 100000,
        badges: [],
        createdAt: '2015-05-14T00:00:00.000Z'
      },
      {
        ...baseProfileData,
        slug: 'discord',
        username: 'Discord',
        global_name: 'Discord',
        bio: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        views: 100000,
        likes: 100000,
        badges: [],
        createdAt: '2015-05-14T00:00:00.000Z'
      }
    ],
    servers: [
      {
        ...baseServerData,
        id: '1',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '2',
        name: 'discord.place',
        description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
        icon_url: '/templates/square_logo.png',
        banner_url: '/templates/discord_banner.png',
        premium: true,
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '3',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '4',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '5',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/3.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '6',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/4.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '7',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/5.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '8',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        category: 'Community'
      },
      {
        ...baseServerData,
        id: '9',
        name: 'Discord',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
        category: 'Community'
      }
    ],
    bots: [
      {
        ...baseBotData,
        id: '1',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        owner: {
          premium: true
        },
        id: '2',
        username: 'discord.place',
        discriminator: '#3175',
        short_description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
        avatar_url: '/templates/square_logo.png',
        banner_url: '/templates/discord_banner.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '3',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '4',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '5',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/3.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '6',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/4.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '7',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/5.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '8',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        categories: ['Utility']
      },
      {
        ...baseBotData,
        id: '9',
        username: 'Discord',
        discriminator: '0000',
        short_description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png',
        categories: ['Utility']
      }
    ],
    emojis: [
      {
        ...baseEmojiData,
        id: '1',
        name: 'discord_logo',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      {
        ...baseEmojiData,
        id: '2',
        name: 'discord_place_logo',
        categories: ['Other'],
        overridedImage: '/templates/square_logo.png'
      },
      {
        ...baseEmojiData,
        id: '3',
        name: 'discord_logo_gray',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/1.png'
      },
      {
        ...baseEmojiData,
        id: '4',
        name: 'discord_logo_green',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/2.png'
      },
      {
        ...baseEmojiData,
        id: '5',
        name: 'discord_logo_pack',
        categories: ['Other'],
        emoji_ids: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' }
        ],
        overridedImages: [
          {
            id: '1',
            image: 'https://cdn.discordapp.com/embed/avatars/0.png'
          },
          {
            id: '2',
            image: 'https://cdn.discordapp.com/embed/avatars/1.png'
          },
          {
            id: '3',
            image: 'https://cdn.discordapp.com/embed/avatars/2.png'
          },
          {
            id: '4',
            image: 'https://cdn.discordapp.com/embed/avatars/3.png'
          }
        ]
      },
      {
        ...baseEmojiData,
        id: '6',
        name: 'discord_logo_red',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/4.png'
      },
      {
        ...baseEmojiData,
        id: '7',
        name: 'discord_logo_pink',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/5.png'
      },
      {
        ...baseEmojiData,
        id: '8',
        name: 'discord_logo_blue',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/0.png'
      },
      {
        ...baseEmojiData,
        id: '9',
        name: 'discord_logo_gray',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/1.png'
      },
      {
        ...baseEmojiData,
        id: '10',
        name: 'discord_logo_green',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/2.png'
      },
      {
        ...baseEmojiData,
        id: '11',
        name: 'discord_logo_yellow',
        categories: ['Other'],
        overridedImage: 'https://cdn.discordapp.com/embed/avatars/3.png'
      }
    ],
    templates: [
      {
        ...baseTemplateData,
        id: '1',
        name: 'Discord Template',
        description: 'Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.',
        user: {
          id: '1',
          username: 'Discord',
          avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
        },
        categories: ['Other']
      },
      {
        ...baseTemplateData,
        id: '2',
        name: 'discord.place Template',
        description: 'A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.',
        user: {
          id: '2',
          username: 'discord.place',
          avatar_url: '/templates/square_logo.png'
        },
        categories: ['Other']
      },
      {
        ...baseTemplateData,
        id: '3',
        name: 'Community Template',
        description: 'A Discord server template for communities.',
        user: {
          id: '3',
          username: 'Discord',
          avatar_url: 'https://cdn.discordapp.com/embed/avatars/1.png'
        },
        categories: ['Chat']
      },
      {
        ...baseTemplateData,
        id: '4',
        name: 'Music Template',
        description: 'A Discord server template for music servers.',
        user: {
          id: '4',
          username: 'Discord',
          avatar_url: 'https://cdn.discordapp.com/embed/avatars/2.png'
        },
        categories: ['Music']
      },
      {
        ...baseTemplateData,
        id: '5',
        name: 'Design Template',
        description: 'A Discord server template for design servers.',
        user: {
          id: '5',
          username: 'Discord',
          avatar_url: 'https://cdn.discordapp.com/embed/avatars/3.png'
        },
        categories: ['Design']
      },
      {
        ...baseTemplateData,
        id: '6',
        name: 'Gaming Template',
        description: 'A Discord server template for gaming servers.',
        user: {
          id: '7',
          username: 'Discord',
          avatar_url: 'https://cdn.discordapp.com/embed/avatars/4.png'
        },
        categories: ['Gaming']
      }
    ]
  });
  
  const isMobile = useMedia('(max-width: 640px)', false);

  return (
    <div className="relative z-10 flex flex-col items-center w-full">      
      <Square column='4' row='4' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-quaternary))' />
      
      <h1 className={cn(
        'px-3 mobile:px-0 font-bold leading-[2rem] sm:!leading-[5.5rem] cursor-default max-w-[400px] sm:max-w-[800px] text-center text-4xl sm:text-7xl select-none mt-[14rem]',
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

      <div className='relative flex items-center justify-center flex-1 w-full px-6 mt-24 overflow-hidden lg:px-0'>
        <div className='mt-auto relative max-w-[1000px] max-h-[550px] w-full overflow-hidden h-full z-[5] bg-secondary/50 border-x-2 border-t-2 border-primary rounded-t-3xl'>
          <div className='absolute left-0 w-full h-[900px] bg-black/5 dark:bg-white/5 blur-[3.5rem] rounded-full -top-[50rem]' />
        
          <div className='relative items-center justify-center hidden xl:flex'>
            <Image
              src={theme === 'dark' ? SafariDarkNav : SafariLightNav}
              alt='Safari Navigation'
              className='absolute top-0 left-0 z-[10]'
            />

            <div className='absolute text-secondary select-none text-[10px] flex gap-x-1.5 z-[20] top-2 justify-center'>
              <FaLock className='relative text-tertiary top-1' size={8} />

              <div>
                discord.place/
                <TextTransition
                  springConfig={presets.stiff}
                  inline={true}
                >
                  {texts[index % texts.length].toLowerCase()}
                </TextTransition>
              </div>
            </div>
          </div>

          <div className='flex items-center justify-center w-full px-4 mt-8 pointer-events-none select-none xl:mt-16 sm:px-0'>
            <AnimatePresence>
              {index === 0 && (
                <motion.div
                  className='grid grid-cols-1 sm:grid-cols-3 gap-8 [zoom:0.75]'
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
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
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                    key='servers'
                  >
                    {data?.servers?.map?.(server => (
                      <ServerCard
                        key={`server-${server.id}`}
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
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                    key='bots'
                  >
                    {data?.bots?.map?.(bot => (
                      <BotCard
                        overridedSort='Votes'
                        key={`bot-${bot.id}`}
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
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                    key='emojis'
                  >
                    {data?.emojis?.map?.(emoji => (
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
                </div>
              )}

              {index === 4 && (
                <div className='w-full max-w-[700px]'>
                  <motion.div
                    className='grid grid-cols-1 mobile:grid-cols-2 gap-8 [zoom:0.75]'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 20 }}
                    key='templates'
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