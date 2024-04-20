import Image from 'next/image';
import { MdOutlineMale, MdOutlineFemale, MdLocationPin } from 'react-icons/md';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { LuEye } from 'react-icons/lu';
import Link from 'next/link';
import { AiFillHeart } from 'react-icons/ai';
import Tooltip from '@/app/components/Tooltip';
import config from '@/config';
import CopyButton from '@/app/components/CopyButton';
import cn from '@/lib/cn';

export default function Card({ banner_url, avatar_url, username, occupation, gender, location, birthday, bio, views, likes, verified, preferredHost, slug, badges }) {
  return (
    <div className='bg-secondary w-[300px] h-[350px] rounded-md flex flex-col'>
      <div className='relative flex items-center px-4 pt-4 gap-x-4'>
        {banner_url && (
          <>
            <Image
              className='rounded-t-md w-full object-cover pointer-events-none h-[100px] z-0 absolute left-0 top-0'
              width={300}
              height={100}
              src={banner_url}
              alt='Banner'
            />

            <div className='bg-gradient-to-t from-secondary via-secondary/80 absolute left-0 top-0 w-full h-[100px]' />
          
            {banner_url.includes('.gif') && (
              <div className='absolute top-1.5 right-1.5 pointer-events-none text-white backdrop-blur-2xl shadow-xl shadow-black px-2 py-0.5 rounded-full font-bold text-xs'>
                GIF
              </div>
            )}
          </>
        )}

        <Image 
          className='rounded-full w-[64px] h-[64px] z-10'
          width={300}
          height={300}
          src={avatar_url || 'https://cdn.discordapp.com/embed/avatars/0.png'}
          alt='Avatar'
        />

        <div className='z-10 flex flex-col gap-y-1'>
          <div className='flex gap-x-2'>
            <h2 className='text-xl font-bold truncate max-w-[170px]'>@{username || 'unknown'}</h2>
            {verified && (
              <Tooltip content='Verified'>
                <Image src='/profile-badges/verified.svg' width={20} height={20} alt='Verified Badge' />
              </Tooltip>
            )}
            {badges.includes('Premium') && (
              <Tooltip content='Premium'>
                <Image src='/profile-badges/premium.svg' width={20} height={20} alt='Premium Badge' />
              </Tooltip>
            )}
          </div>
          <p className='max-w-[190px] text-sm truncate text-secondary/60'>{occupation || 'Unknown'}</p>
        </div>
      </div>
      
      <div className={cn(
        'block my-4',
        !banner_url && 'w-full h-[2px] bg-tertiary'
      )} />

      <div className='flex flex-wrap gap-2 px-4'>
        <span className='flex items-center px-2 py-2 text-sm font-medium rounded bg-tertiary gap-x-1 text-secondary'>
          {gender === 'Male' && (
            <>
              <MdOutlineMale color='#3b9cff' />
              Male
            </>
          )}

          {gender === 'Female' && (
            <>
              <MdOutlineFemale color='#ff97ec' />
              Female
            </>
          )}

          {gender === null && (
            <>
              <MdOutlineMale color='#3b9cff' />
              <MdOutlineFemale color='#ff97ec' />
              Unknown
            </>
          )}  
        </span>

        <span className='flex items-center max-w-full px-2 py-2 text-sm font-medium rounded bg-tertiary gap-x-1 text-secondary'>
          <MdLocationPin color='#ff4343' />
          <span className='truncate max-w-[90%]'>
            {location || 'Unknown'}
          </span>
        </span>

        <span className='flex items-center px-2 py-2 text-sm font-medium rounded bg-tertiary gap-x-1 text-secondary'>
          <LiaBirthdayCakeSolid color='#62ff67' /> {birthday || 'Unknown'}
        </span>
      </div>

      <div className='relative h-full mt-4'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-t from-secondary via-secondary/80 to-secondary/30' />

        <div className='absolute bottom-0 flex justify-between w-full p-4'>
          <div className='flex gap-x-2'>
            <div className='flex gap-x-1.5 items-center text-secondary text-sm font-medium'>
              <LuEye />
              {views.toLocaleString('en-US')}
            </div>

            <div className='flex gap-x-1.5 items-center text-secondary text-sm font-medium'>
              <AiFillHeart />
              {likes.toLocaleString('en-US')}
            </div>
          </div>

          <div className='flex items-center gap-x-2'>
            <Tooltip content='Copy Profile URL'>
              <CopyButton successText='Profile URL copied to clipboard!' copyText={config.getProfileURL(slug, preferredHost)} />
            </Tooltip>

            <Link className='px-3 py-1 text-sm font-semibold text-white bg-black rounded hover:bg-black/70 dark:text-black dark:bg-white dark:hover:bg-white/70' href={`/profile/${slug}`}>
              Visit
            </Link>
          </div>
        </div>

        <p className='px-4 text-sm whitespace-pre-wrap line-clamp-6 text-secondary/60'>
          {bio}
        </p>
      </div>
    </div>
  );
}