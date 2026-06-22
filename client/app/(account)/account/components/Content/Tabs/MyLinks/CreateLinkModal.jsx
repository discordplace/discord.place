'use client';

import useGeneralStore from '@/stores/general';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';

export default function CreateLinkModal() {
  const { t } = useTranslation();

  const { name, setName, destinationURL, setDestinationURL } = useGeneralStore(useShallow(state => ({
    destinationURL: state.createLinkModal.destinationURL,
    name: state.createLinkModal.name,
    setDestinationURL: state.createLinkModal.setDestinationURL,
    setName: state.createLinkModal.setName
  })));

  return (
    <div className='flex flex-col gap-y-4'>
      <div className='flex flex-col'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('accountPage.tabs.myLinks.createLinkModal.inputs.name.label')}
        </h2>

        <p className='text-xs text-tertiary'>
          {t('accountPage.tabs.myLinks.createLinkModal.inputs.name.description')}
        </p>

        <input
          type='text'
          placeholder={t('accountPage.tabs.myLinks.createLinkModal.inputs.name.placeholder')}
          className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary ring-purple-500 outline-hidden transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
          value={name}
          onChange={event => setName(event.target.value)}
        />
      </div>

      <div className='flex flex-col'>
        <h2 className='text-sm font-semibold text-secondary'>
          {t('accountPage.tabs.myLinks.createLinkModal.inputs.destinationUrl.label')}
        </h2>

        <p className='text-xs text-tertiary'>
          {t('accountPage.tabs.myLinks.createLinkModal.inputs.destinationUrl.description')}
        </p>

        <input
          type='text'
          placeholder={t('accountPage.tabs.myLinks.createLinkModal.inputs.destinationUrl.placeholder')}
          className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary ring-purple-500 outline-hidden transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
          value={destinationURL}
          onChange={event => setDestinationURL(event.target.value)}
        />
      </div>
    </div>
  );
}