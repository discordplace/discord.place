'use client';

import Input from '@/app/(bots)/bots/[id]/manage/components/Input';
import Markdown from '@/app/components/Markdown';
import { t } from '@/stores/language';
import { FaDisplay } from 'react-icons/fa6';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';

export default function EssentialInformation({ description, inviteURL, markdownPreviewing, setDescription, setInviteURL, setMarkdownPreviewing, setShortDescription, shortDescription }) {
  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <FaDisplay className='text-purple-500' size={24} />
        {t('botManagePage.essentialInformation.title')}
      </h3>

      <p className='text-sm text-tertiary sm:text-base'>
        {t('botManagePage.essentialInformation.subtitle')}
      </p>

      <div className='mt-4 flex w-full flex-col gap-8'>
        <Input
          description={t('botManagePage.essentialInformation.inputs.shortDescription.description')}
          label={t('botManagePage.essentialInformation.inputs.shortDescription.label')}
          onChange={event => setShortDescription(event.target.value)}
          placeholder={t('botManagePage.essentialInformation.inputs.shortDescription.placeholder')}
          value={shortDescription}
        />

        <Input
          CustomInput={markdownPreviewing && (
            <Markdown className='mt-2 h-[250px] w-full overflow-y-auto rounded-xl bg-secondary px-4 py-2 text-tertiary focus-visible:text-primary'>
              {description}
            </Markdown>
          )}
          customLabelPeer={
            <button
              className='flex size-max items-center gap-x-1.5 rounded-lg bg-black px-2 py-0.5 text-sm font-semibold text-white hover:bg-black/70 disabled:pointer-events-none disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-white/70'
              onClick={() => setMarkdownPreviewing(!markdownPreviewing)}
            >
              {markdownPreviewing ? (
                <>
                  <RiEyeOffFill />
                  <span className='hidden sm:block'>
                    {t('buttons.backToEditing')}
                  </span>
                </>
              ) : (
                <>
                  <RiEyeFill />
                  <span className='hidden sm:block'>
                    {t('buttons.showMarkdownPreview')}
                  </span>
                </>
              )}
            </button>
          }
          description={t('botManagePage.essentialInformation.inputs.longDescription.description')}
          label={
            <div className='flex w-max items-center gap-x-2'>
              <span>
                {t('botManagePage.essentialInformation.inputs.longDescription.label')}
              </span>
            </div>
          }
          onChange={event => setDescription(event.target.value)}
          placeholder={t('botManagePage.essentialInformation.inputs.longDescription.placeholder')}
          type='paragraph'
          value={description}
        />

        <Input
          description={t('botManagePage.essentialInformation.inputs.inviteUrl.description')}
          label={t('botManagePage.essentialInformation.inputs.inviteUrl.label')}
          onChange={event => setInviteURL(event.target.value)}
          placeholder={t('botManagePage.essentialInformation.inputs.inviteUrl.placeholder')}
          value={inviteURL}
        />
      </div>
    </div>
  );
}