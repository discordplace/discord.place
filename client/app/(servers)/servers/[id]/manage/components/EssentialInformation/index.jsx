'use client';

import { FaDisplay } from 'react-icons/fa6';
import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import { t } from '@/stores/language';

export default function EssentialInformation({ description, setDescription, inviteURL, setInviteURL }) {
  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <FaDisplay size={24} className='text-purple-500' />
        {t('serverManagePage.essentialInformation.title')}
      </h3>

      <p className='text-sm text-tertiary sm:text-base'>
        {t('serverManagePage.essentialInformation.subtitle')}
      </p>

      <div className='mt-4 flex w-full flex-col gap-8'>
        <Input
          label={t('serverManagePage.essentialInformation.inputs.description.label')}
          description={t('serverManagePage.essentialInformation.inputs.description.description')}
          placeholder={t('serverManagePage.essentialInformation.inputs.description.placeholder')}
          type='paragraph'
          onChange={event => setDescription(event.target.value)}
          value={description}
          className='h-[150px]'
        />

        <Input
          label={t('serverManagePage.essentialInformation.inputs.inviteUrl.label')}
          description={t('serverManagePage.essentialInformation.inputs.inviteUrl.description')}
          placeholder={t('serverManagePage.essentialInformation.inputs.inviteUrl.placeholder')}
          onChange={event => setInviteURL(event.target.value)}
          value={inviteURL}
        />
      </div>
    </div>
  );
}