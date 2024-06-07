'use client';

import ErrorState from '@/app/components/ErrorState';
import useAccountStore from '@/stores/account';
import Link from 'next/link';
import { BsEmojiAngry, BsQuestionCircleFill } from 'react-icons/bs';
import NewBot from '@/app/(account)/account/components/Content/Tabs/MyBots/NewBot';
import Image from 'next/image';
import { LuPlus } from 'react-icons/lu';
import config from '@/config';
import Countdown from '@/app/components/Countdown';
import cn from '@/lib/cn';
import { FaCircleExclamation } from 'react-icons/fa6';

export default function MyBots() {
  const data = useAccountStore(state => state.data);
  
  const currentlyAddingBot = useAccountStore(state => state.currentlyAddingBot);
  const setCurrentlyAddingBot = useAccountStore(state => state.setCurrentlyAddingBot);

  return (
    currentlyAddingBot ? (
      <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6'>
        <NewBot />
      </div>
    ) : (
      <div className='flex flex-col px-6 my-16 lg:px-16 gap-y-6'>
        <div className='flex flex-col gap-y-2'>
          <h1 className='text-xl font-bold text-primary'>
            My Bots
          </h1>

          <p className='text-sm text-secondary'>
            View or manage the bot that you have listed on discord.place. You can also submit a new bot to discord.place.
          </p>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            Listed Bots

            <span className='ml-2 text-xs font-medium text-tertiary'>
              {data.bots?.length || 0}
            </span>
          </h2>

          <p className='text-sm text-tertiary'>
            Here, you can see the bots that you have listed on discord.place.
          </p>

          {(data.bots || []).length === 0 ? (
            <div className='max-w-[800px] mt-20'>
              <ErrorState 
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    It{'\''}s quiet in here...
                  </div>
                }
                message={'You have not listed any bots on discord.place.'}
              />
            </div>
          ) : (
            <div className='flex gap-4 flex-wrap max-w-[800px] mt-2'>
              {data.bots.map(bot => (
                <Link
                  key={bot.id}
                  className='flex items-center gap-4 p-4 transition-opacity bg-secondary rounded-xl hover:opacity-70'
                  href={`/bots/${bot.id}`}
                >
                  <div className='relative w-12 h-12'>
                    <Image
                      src={bot.avatar_url}
                      alt={`${bot.username}'s avatar`}
                      width={48}
                      height={48}
                      className='rounded-lg'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <h3 className='text-sm font-bold text-primary'>
                      {bot.username}
                    </h3>

                    <p className='text-xs text-tertiary'>
                      {bot.id}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            New Bot
          </h2>

          <p className='text-sm text-tertiary'>
            Submit a new bot to discord.place.
          </p>

          <div className='mt-2 relative flex flex-col gap-y-2 w-full max-w-[800px] bg-blue-500/10 border border-blue-500 p-4 rounded-xl transition-[margin,opacity] duration-1000 ease-in-out'>
            <h2 className='flex items-center text-lg font-semibold gap-x-2'>
              <BsQuestionCircleFill /> Note
            </h2>

            <p className='text-sm font-medium text-tertiary'>
              Your submitted bot will be reviewed by our team before it is listed on discord.place. Please make sure that your bot is not violating our bot submission guidelines. Our bot submission guidelines can be found in our <Link className='text-secondary hover:text-primary' href={config.supportInviteUrl} target='_blank'>Discord server</Link>.
            </p>
          </div>

          <div className='flex flex-col mt-4 text-sm text-tertiary gap-y-4'>
            <button
              className='px-4 py-1.5 flex items-center gap-x-1 font-semibold text-white bg-black w-max rounded-xl dark:text-black dark:bg-white dark:hover:bg-white/70 hover:bg-black/70'
              onClick={() => setCurrentlyAddingBot(true)}
            >
              Let{'\''}s go!
              <LuPlus />
            </button>
          </div>
        </div>

        <div className='flex flex-col mt-8 gap-y-2'>
          <h2 className='text-sm font-bold text-secondary'>
            Past Denials
          </h2>

          <p className='text-sm text-tertiary'>
            View the bots that you have submitted to discord.place but were denied. (last 7 days)
          </p>
        
          <div className={cn(
            'flex flex-col items-center w-full max-w-[800px] gap-y-4',
            (data.denies || []).length === 0 && 'mt-20'
          )}>
            {(data.denies || []).length === 0 ? (
              <ErrorState
                title={
                  <div className='flex items-center gap-x-2'>
                    <BsEmojiAngry />
                    It{'\''}s quiet in here...
                  </div>
                }
                message={'You have not submitted any bots to discord.place that were denied.'}
              />
            ) : (
              data.denies.map(deny => (
                <div 
                  className='relative flex flex-col gap-y-2 w-full max-w-[1000px] bg-red-500/10 border border-red-500 p-4 rounded-xl mt-4 transition-[margin,opacity] duration-1000 ease-in-out' 
                  key={deny.bot.id}
                >
                  <h2 className='flex flex-wrap items-center text-lg font-semibold gap-x-2'>
                    <FaCircleExclamation />
                    <Image
                      src={deny.bot.avatar_url}
                      alt={`${deny.bot.username}'s avatar`}
                      width={24}
                      height={24}
                      className='rounded-full'
                    />
                    {deny.bot.username}#{deny.bot.discriminator}
                  </h2>
  
                  <p className='flex flex-wrap text-sm font-medium text-tertiary gap-x-1'>
                    The bot was denied by
                    <Image
                      src={deny.reviewer.avatar_url}
                      alt={`${deny.reviewer.username}'s avatar`}
                      width={20}
                      height={20}
                      className='rounded-full'
                    />
                    <span className='text-secondary'>
                      @{deny.reviewer.username}
                    </span>
                  </p>

                  <div className='flex flex-col gap-y-1'>
                    <h3 className='text-lg font-semibold text-secondary'>
                      {deny.reason.title}
                    </h3>

                    <p className='text-sm text-tertiary'>
                      {deny.reason.description}
                    </p>
                  </div>

                  <div className='mt-2 text-xs text-tertiary'>
                    {new Date(deny.createdAt).getTime() + 21600000 > Date.now() ? (
                      <span>
                        This denial will expire in <Countdown date={new Date(deny.createdAt).getTime() + 21600000} renderer={({ hours, minutes, seconds, completed }) => {
                          if (completed) return 'now';
                          return `${hours} hours ${minutes} minutes ${seconds} seconds.`;
                        }} /> You can{'\''}t add the bot again until then.
                      </span>
                    ) : (
                      <>
                        You can add the bot again now.
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );
}