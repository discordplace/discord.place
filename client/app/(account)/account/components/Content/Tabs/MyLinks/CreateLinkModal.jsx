'use client';

import useGeneralStore from '@/stores/general';
import { t } from '@/stores/language';
import { useShallow } from 'zustand/react/shallow';

export default function CreateLinkModal() {
  const { destinationURL, name, setDestinationURL, setName } = useGeneralStore(useShallow(state => ({
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
          className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
          onChange={event => setName(event.target.value)}
          placeholder={t('accountPage.tabs.myLinks.createLinkModal.inputs.name.placeholder')}
          type='text'
          value={name}
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
          className='mt-3 w-full rounded-xl bg-secondary px-3 py-2 text-sm text-secondary outline-none ring-purple-500 transition-all placeholder:text-placeholder hover:bg-background hover:ring-2 focus-visible:bg-background'
          onChange={event => setDestinationURL(event.target.value)}
          placeholder={t('accountPage.tabs.myLinks.createLinkModal.inputs.destinationUrl.placeholder')}
          type='text'
          value={destinationURL}
        />
      </div>
    </div>
  );
}