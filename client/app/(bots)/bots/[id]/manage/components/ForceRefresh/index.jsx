'use client';

import { MdSync } from '@/icons';
import { toast } from 'sonner';
import { useState } from 'react';
import refreshBot from '@/lib/request/bots/refreshBot';
import revalidateBot from '@/lib/revalidate/bot';
import { TbLoader } from '@/icons';
import { t } from '@/stores/language';

export default function ForceRefresh({ botId }) {
  const [refreshingData, setRefreshingData] = useState(false);

  async function refreshData() {
    setRefreshingData(true);

    toast.promise(refreshBot(botId), {
      loading: t('botManagePage.forceRefresh.toast.refreshingData'),
      success: () => {
        setRefreshingData(false);
        revalidateBot(botId);

        return t('botManagePage.forceRefresh.toast.dataRefreshed');
      },
      error: error => {
        setRefreshingData(false);

        return error;
      }
    });
  }

  return (
    <div className='flex w-full flex-col gap-y-4'>
      <h3 className='flex items-center gap-x-4 text-xl font-semibold'>
        <MdSync size={24} className='text-purple-500' />
        {t('botManagePage.forceRefresh.title')}
      </h3>

      <p className='text-sm text-tertiary sm:text-base'>
        {t('botManagePage.forceRefresh.subtitle')}
      </p>

      <button
        className='flex w-max items-center gap-x-1 rounded-xl border border-purple-600 bg-gradient-to-r from-purple-600 via-purple-600 to-purple-900 px-4 py-1.5 text-sm font-semibold text-white hover:opacity-80 disabled:pointer-events-none disabled:opacity-70'
        disabled={refreshingData}
        onClick={refreshData}
      >
        {refreshingData && <MdSync size={18} />}
        {t('buttons.forceRefresh')}
      </button>
    </div>
  );
}