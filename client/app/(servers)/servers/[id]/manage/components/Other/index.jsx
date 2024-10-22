'use client';

import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import config from '@/config';
import cn from '@/lib/cn';
import { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { LuHash } from 'react-icons/lu';
import { toast } from 'sonner';
import { t } from '@/stores/language';

export default function Other({ category, setCategory, keywords, setKeywords }) {
  const [value, setValue] = useState('');

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <FaCirclePlus size={24} className='text-purple-500' />
        {t('serverManagePage.other.title')}
      </h3>

      <p className='text-sm text-tertiary sm:text-base'>
        {t('serverManagePage.other.subtitle')}
      </p>

      <div className='mt-4 flex w-full flex-col gap-8'>
        <div className='flex flex-1 flex-col gap-y-2'>
          <label
            className='font-medium text-secondary'
          >
            {t('serverManagePage.other.inputs.category.label')}
          </label>

          <p className='text-sm text-tertiary'>
            {t('serverManagePage.other.inputs.category.description')}
          </p>

          <div className='mt-2 flex flex-wrap items-center gap-2'>
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

                {t(`categories.${serverCategory}`)}
              </button>
            ))}
          </div>
        </div>

        <Input
          label={t('serverManagePage.other.inputs.keywords.label')}
          description={t('serverManagePage.other.inputs.keywords.description')}
          placeholder={t('serverManagePage.other.inputs.keywords.placeholder')}
          value={value}
          onChange={event => {
            if (event.target.value.includes(',')) {
              const validatedValue = value.replace(',', '').trim();
              if (validatedValue.length === 0) return toast.error(t('serverManagePage.other.toast.notValidKeyword'));
              if (keywords.includes(validatedValue)) return toast.error(t('serverManagePage.other.toast.keywordExists'));

              const regexp = new RegExp(/[^a-zA-Z0-9-]/g);
              if (regexp.test(validatedValue)) return toast.error(t('serverManagePage.other.toast.keywordHasInvalidCharacters'));

              setKeywords([...keywords, validatedValue]);
              setValue('');
            } else {
              if (event.target.value.trim().length > config.serverKeywordsMaxCharacters) return toast.error(t('serverManagePage.other.toast.keywordTooLong', { maxLength: config.serverKeywordsMaxCharacters }));

              setValue(event.target.value);
            }
          }}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              event.preventDefault();

              const trimmedValue = event.target.value.trim();

              if (trimmedValue.length === 0) return toast.error(t('serverManagePage.other.toast.notValidKeyword'));
              if (keywords.includes(trimmedValue)) return toast.error(t('serverManagePage.other.toast.keywordExists'));

              const regexp = new RegExp(/[^a-zA-Z0-9-]/g);
              if (regexp.test(trimmedValue)) return toast.error(t('serverManagePage.other.toast.keywordHasInvalidCharacters'));

              setKeywords([...keywords, trimmedValue]);
              setValue('');
            }
          }}
          disabled={keywords.length >= config.serverKeywordsMaxLength}
        />

        {keywords.length > 0 && (
          <Input
            label={t('serverManagePage.other.addedKeywords.label')}
            customLabelPeer={
              <span className='text-xs font-semibold text-tertiary'>
                {keywords.length} {keywords.length >= config.serverKeywordsMaxLength && t('serverManagePage.other.addedKeywords.max')}
              </span>
            }
            description={t('serverManagePage.other.addedKeywords.description')}
            value={keywords.join(', ')}
            disabled
            CustomInput={
              <div className='mt-2 flex flex-wrap gap-2'>
                {keywords.map(keyword => (
                  <button
                    key={keyword}
                    className='flex size-max items-center gap-x-1 rounded-lg bg-secondary px-3 py-1.5 text-sm font-semibold hover:bg-tertiary'
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
      </div>
    </div>
  );
}