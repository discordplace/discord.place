'use client';

import Input from '@/app/(servers)/servers/[id]/manage/components/Input';
import { t } from '@/stores/language';
import { FaDisplay } from 'react-icons/fa6';

export default function EssentialInformation({ description, inviteURL, setDescription, setInviteURL }) {
  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <FaDisplay className='text-purple-500' size={24} />
        {t('serverManagePage.essentialInformation.title')}
      </h3>

      <p className='text-sm text-tertiary sm:text-base'>
        {t('serverManagePage.essentialInformation.subtitle')}
      </p>

      <div className='mt-4 flex w-full flex-col gap-8'>
        <Input
          className='h-[150px]'
          description={t('serverManagePage.essentialInformation.inputs.description.description')}
          label={t('serverManagePage.essentialInformation.inputs.description.label')}
          onChange={event => setDescription(event.target.value)}
          placeholder={t('serverManagePage.essentialInformation.inputs.description.placeholder')}
          type='paragraph'
          value={description}
        />

        <Input
          description={t('serverManagePage.essentialInformation.inputs.inviteUrl.description')}
          label={t('serverManagePage.essentialInformation.inputs.inviteUrl.label')}
          onChange={event => setInviteURL(event.target.value)}
          placeholder={t('serverManagePage.essentialInformation.inputs.inviteUrl.placeholder')}
          value={inviteURL}
        />
      </div>
    </div>
  );
}