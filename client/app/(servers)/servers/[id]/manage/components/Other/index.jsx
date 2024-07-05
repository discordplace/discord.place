'use client';

import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import config from '@/config';
import cn from '@/lib/cn';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { LuHash } from 'react-icons/lu';
import { toast } from 'sonner';

export default function Other({ category, setCategory, keywords, setKeywords, voiceActivityEnabled, setVoiceActivityEnabled }) {
  const [value, setValue] = useState('');

  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <FaCirclePlus size={24} className='text-purple-500' />
        Other
      </h3>

      <p className='text-sm sm:text-base text-tertiary'>
        Settings that you should not worry about too much.
      </p>

      <div className='flex flex-col w-full gap-8 mt-4'>
        <div className='flex flex-col flex-1 gap-y-2'>
          <label
            className='font-medium text-secondary'
          >
            Category
          </label>

          <p className='text-sm text-tertiary'>
            Select the category that your server belongs to. This will help users find your bot.
          </p>

          <div className='flex flex-wrap items-center gap-2 mt-2'>
            {config.serverCategories.map(serverCategory => (
              <button 
                key={serverCategory} 
                className={cn(
                  'rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-tertiary',
                  category === serverCategory && 'bg-quaternary'
                )}
                disabled={category === serverCategory}
                onClick={() => setCategory(serverCategory)}
              >
                {category === serverCategory ? <IoMdCheckmarkCircle /> : config.serverCategoriesIcons[serverCategory]}
                {serverCategory}
              </button>
            ))}
          </div>
        </div>

        <Input
          label='Keywords'
          description='Add keywords to your server. This will help people find your server on discord.place. Separate each keyword with a comma.'
          placeholder='e.g. fun, gaming, community'
          value={value}
          onChange={event => {
            if (event.target.value.includes(',')) {
              const validatedValue = value.replace(',', '').trim();
              if (validatedValue.length === 0) return toast.error('Please enter a valid keyword.');
              if (keywords.includes(validatedValue)) return toast.error('This keyword already exists.');
              
              const regexp = new RegExp(/[^a-zA-Z0-9-]/g);
              if (regexp.test(validatedValue)) return toast.error('Keywords can only contain letters, numbers, and hyphens.');

              setKeywords([...keywords, validatedValue]);
              setValue('');
            } else {
              if (event.target.value.trim().length > config.serverKeywordsMaxCharacters) return toast.error(`Keywords can only be ${config.serverKeywordsMaxCharacters} characters long.`);

              setValue(event.target.value);
            }
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              
              const trimmedValue = event.target.value.trim();

              if (trimmedValue.length === 0) return toast.error('Please enter a valid keyword.');
              if (keywords.includes(trimmedValue)) return toast.error('This keyword already exists.');

              const regexp = new RegExp(/[^a-zA-Z0-9-]/g);
              if (regexp.test(trimmedValue)) return toast.error('Keywords can only contain letters, numbers, and hyphens.');

              setKeywords([...keywords, trimmedValue]);
              setValue('');
            }
          }}
          disabled={keywords.length >= config.serverKeywordsMaxLength}
        />

        {keywords.length > 0 && (
          <Input
            label='Added Keywords'
            customLabelPeer={
              <span className='text-xs font-semibold text-tertiary'>
                {keywords.length} {keywords.length >= config.serverKeywordsMaxLength && ' (max)'}
              </span>
            }
            description='Keywords that you have added so far. Click on a keyword to remove it.'
            value={keywords.join(', ')}
            disabled
            CustomInput={
              <div className='flex flex-wrap gap-2 mt-2'>
                {keywords.map(keyword => (
                  <button 
                    key={keyword} 
                    className='rounded-lg flex items-center gap-x-1 font-semibold w-max h-max text-sm px-3 py-1.5 bg-secondary hover:bg-tertiary'
                    onClick={() => setKeywords(keywords.filter(k => k !== keyword))}
                  >
                    <LuHash />
                    {keyword}
                  </button>
                ))}
              </div>
            }
          />
        )}

        <Input
          label='Voice Activity'
          description='Check this box if you want to enable voice activity tracking for your server. This will help people see how voice active your server is.'
          CustomInput={
            <div 
              className='flex items-center mt-4 cursor-pointer w-max gap-x-2 group'
              onClick={() => setVoiceActivityEnabled(!voiceActivityEnabled)}
            >
              <button className='p-1 bg-quaternary rounded-md group-hover:bg-white group-hover:text-black min-w-[18px] min-h-[18px]'>
                {voiceActivityEnabled ? <FaCheck size={10} /> : null}
              </button>

              <span className='text-sm font-medium select-none text-tertiary'>
                Enable Tracking
              </span>
            </div>
          }
        />
      </div>
    </div>
  );
}