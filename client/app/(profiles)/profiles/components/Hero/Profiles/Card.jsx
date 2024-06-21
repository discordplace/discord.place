'use client';

import Image from 'next/image';
import { FiArrowUpRight } from 'react-icons/fi';
import { TbWorldShare } from 'react-icons/tb';
import CopyButtonCustomTrigger from '@/app/components/CopyButton/CustomTrigger';
import config from '@/config';
import { useState } from 'react';
import forceFetchProfile from '@/lib/request/profiles/forceFetchProfile';
import cn from '@/lib/cn';
import useThemeStore from '@/stores/theme';
import Tooltip from '@/app/components/Tooltip';
import Link from 'next/link';

export default function Card(props) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    notation: 'compact',
    maximumFractionDigits: 2
  });

  const [isBannerFailed, setIsBannerFailed] = useState(false);

  const theme = useThemeStore(state => state.theme);

  return (
    <div className='w-[300px] p-0.5 h-[461px] rounded-3xl relative overflow-hidden group z-[1]'>
      {props.premium === true && (
        <div class="animate-rotate absolute inset-0 z-[20] h-full w-full rounded-full bg-[conic-gradient(#a855f7_20deg,transparent_120deg)] pointer-events-none"></div>
      )}
      
      <div className="z-[20] relative flex flex-col w-full h-full p-3 bg-tertiary rounded-3xl">
        {!isBannerFailed && props.banner_url ? (
          <div className='relative w-full h-full'>
            <Image
              className='object-cover w-full h-full rounded-3xl'
              width={512}
              height={512}
              src={props.banner_url}
              alt='Banner'
              onError={async () => {
                console.error(`Failed to load banner for ${props.slug}`);

                const newBanner = await forceFetchProfile(props.slug);
                if (newBanner) document.querySelector(`img[src="${props.banner_url}"]`).src = newBanner;
                else setIsBannerFailed(true);
              }}
            />

            {props.banner_url.includes('.gif') && (
              <div className='absolute top-3 right-3 pointer-events-none text-white backdrop-blur-2xl px-2 py-0.5 rounded-full font-bold text-xs'>
                GIF
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-[140px] bg-secondary rounded-2xl" />
        )}
        
        <div className='-mt-[4.5rem] relative left-[10px]'>
          <Image
            src={props.avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}
            alt={`${props.username}'s avatar`}
            width={64}
            height={64}
            className={cn(
              'border-2 rounded-full border-transparent',
              !isBannerFailed && props.banner_url && 'shadow-lg shadow-black/70'
            )}
          />
        </div>

        <div className='flex flex-col flex-1 w-full mt-6 bg-secondary rounded-2xl'>
          <div className='px-5 pt-5 mb-auto'>
            <div className='flex gap-x-1'>
              <h2 className='text-lg font-medium truncate max-w-[170px] mr-1'>{props.global_name}</h2>

              {props.badges.map(({ name, tooltip }) => (
                <Tooltip key={name} content={tooltip}>
                  <Image
                    src={`/profile-badges/${theme === 'dark' ? 'white' : 'black'}_${name.toLowerCase()}.svg`}
                    width={16}
                    height={16}
                    alt={`${name} Badge`}
                  />
                </Tooltip>
              ))}
            </div>
            <h3 className='-mt-1 text-sm font-medium text-tertiary'>@{props.username}</h3>

            <div className='flex flex-col mt-4 gap-y-1'>
              <h3 className='text-sm font-medium text-tertiary'>
                About me
              </h3>

              <p className='text-sm font-medium whitespace-pre-wrap text-secondary line-clamp-2'>
                {props.bio === 'No bio provided.' ?
                  'This user has not provided a bio yet but we are sure it\'s awesome!'
                  : props.bio
                }
              </p>
            </div>
          </div>

          <div className='w-full my-4 h-[1px] bg-quaternary' />

          <div className='flex flex-col px-5 pb-3 gap-y-4'>
            <div className='flex gap-x-4'>
              <div className='flex flex-col gap-y-1'>
                <h3 className='text-sm font-medium text-tertiary'>
                  Likes
                </h3>
                
                <p className='text-sm font-medium text-primary'>
                  {formatter.format(props.likes)}
                </p>
              </div>

              <div className='flex flex-col gap-y-1'>
                <h3 className='text-sm font-medium text-tertiary'>
                  Views
                </h3>
                
                <p className='text-sm font-medium text-primary'>
                  {formatter.format(props.views)}
                </p>
              </div>

              <div className='flex flex-col gap-y-1'>
                <h3 className='text-sm font-medium text-tertiary'>
                  Created
                </h3>
                
                <p className='text-sm font-medium truncate text-primary w-[130px]'>
                  {new Date(props.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className='flex gap-x-2.5'>
              <Link
                className='flex text-white items-center px-2 py-1.5 font-semibold text-sm hover:bg-purple-700 bg-purple-600 gap-x-0.5 rounded-lg'
                href={`/profile/${props.slug}`}
              >
                <FiArrowUpRight size={18} />
                Visit
              </Link>

              <CopyButtonCustomTrigger
                successText='Profile URL copied to clipboard!'
                copyText={config.getProfileURL(props.slug, props.preferredHost)}
              >
                <button className='flex items-center px-2 py-1.5 font-semibold text-sm bg-quaternary hover:bg-purple-600 text-tertiary hover:text-white gap-x-1 rounded-lg'>
                  <TbWorldShare size={16} />
                  Share
                </button>
              </CopyButtonCustomTrigger>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}