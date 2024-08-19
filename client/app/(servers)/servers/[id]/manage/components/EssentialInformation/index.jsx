'use client';

import { FaDisplay } from 'react-icons/fa6';
import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import { t } from '@/stores/language';

export default function EssentialInformation({ description, setDescription, inviteURL, setInviteURL }) {
  return (
    <div className='flex flex-col w-full gap-y-4'>
      <h3 className='flex items-center text-xl font-semibold gap-x-4'>
        <FaDisplay size={24} className='text-purple-500' />
        {t('serverManagePage.essentialInformation.title')}
      </h3>

      <p className='text-sm sm:text-base text-tertiary'>
        {t('serverManagePage.essentialInformation.description')}
      </p>

      <div className='flex flex-col w-full gap-8 mt-4'>
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