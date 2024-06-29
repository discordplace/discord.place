'use client';

import config from '@/config';
import cn from '@/lib/cn';
import { FaCirclePlus } from 'react-icons/fa6';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import getData from '@/lib/request/auth/getData';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';
import Input from '@/app/(bots)/bots/[id]/manage/components/Input';
import Link from 'next/link';

export default function Other({ categories, setCategories, canEditSupportServer, supportServerId, setSupportServerId, webhookURL, setWebhookURL, webhookToken, setWebhookToken }) {
  const [ownedServers, setOwnedServers] = useState([]);
  const [ownedServersLoading, setOwnedServersLoading] = useState(true);

  useEffect(() => {
    if (!canEditSupportServer) return;

    setOwnedServersLoading(true);

    getData(['servers'])
      .then(data => setOwnedServers(data.servers))
      .catch(toast.error)
      .finally(() => setOwnedServersLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <FaCirclePlus size={24} className='text-purple-500' />
        Other
      </h3>

      <p className='text-tertiary'>
        Settings that you should not worry about too much.
      </p>

      <div className='flex flex-col w-full gap-8 mt-4'>
        <div className='flex flex-col flex-1 gap-y-2'>
          <label
            className='font-medium text-secondary'
          >
            Categories
          </label>

          <p className='text-sm text-tertiary'>
            Select the categories that your bot belongs to. This will help users find your bot.
          </p>

          <div className='flex flex-wrap items-center gap-2 mt-2'>
            {config.botCategories.map(category => (
              <button 
                key={category} 
                className={cn(
                  'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-tertiary',
                  categories.includes(category) && 'bg-quaternary'
                )}
                onClick={() => {
                  if (categories.includes(category)) setCategories(oldCategories => oldCategories.filter(oldCategory => oldCategory !== category));
                  else setCategories(oldCategories => [...oldCategories, category]);
                }}
              >
                {categories.includes(category) ? <IoMdCheckmarkCircle /> : config.botCategoriesIcons[category]}
                {category}
              </button>
            ))}
          </div>
        </div>

        {canEditSupportServer && (
          <div className='flex flex-col flex-1 gap-y-2'>
            <label
              className='font-medium text-secondary'
            >
              Support Server

              <span className='ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
                Optional
              </span>
            </label>
        
            <p className='text-sm text-tertiary'>
              If you added your server to discord.place then you can use it as a support server of your bot.
            </p>

            <div className='flex flex-wrap w-full gap-4 mt-2'>
              {ownedServersLoading ? (
                new Array(9).fill().map((_, index) => (
                  <div key={index} className='w-24 h-24 rounded-xl bg-secondary animate-pulse' />
                ))
              ) : (
                ownedServers.length === 0 ? (
                  <p className='text-xs text-tertiary'>
                    You don{'\''}t have any servers added to discord.place.
                  </p>
                ) : (
                  ownedServers.map(server => (
                    <div
                      className='relative'
                      key={server.id}
                      onClick={() => supportServerId === server.id ? setSupportServerId('0') : setSupportServerId(server.id)}
                    >
                      <ServerIcon
                        width={96}
                        height={96}
                        name={server.name}
                        icon_url={server.icon_url}
                        className='cursor-pointer hover:opacity-70 rounded-xl'
                      />

                      {supportServerId === server.id && (
                        <div className='absolute p-1 text-2xl rounded-full pointer-events-none -right-1 -bottom-1 bg-background'>
                          <IoMdCheckmarkCircle />
                        </div>
                      )}
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}

        <div className='flex flex-col flex-1 gap-y-2'>
          <label
            className='font-medium text-secondary'
          >
            Webhook

            <span className='ml-2 text-xs text-white dark:text-white px-2 py-0.5 dark:bg-white/30 bg-black/30 rounded-full'>
              Optional
            </span>
          </label>
        
          <p className='text-sm text-tertiary'>
            You can use webhooks to get notified when someone votes for your bot.
            Documentation can be found{' '}
            <Link
              href={config.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline hover:text-primary"
            >
              here
            </Link>.
          </p>

          <div className='flex gap-8 mt-4'>
            <Input
              label='URL'
              description='Enter the URL of your webhook.'
              placeholder='https://example.com/webhook'
              value={webhookURL}
              onChange={event => setWebhookURL(event.target.value)}
            />

            <Input
              label='Secret'
              description='Enter the secret of your webhook.'
              placeholder='ed5d38a4-a3b3-4cf0-adc6-da128973b865'
              value={webhookToken}
              onChange={event => setWebhookToken(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}