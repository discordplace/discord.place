'use client';

import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';
import { useTranslation } from 'react-i18next';

export default function Question1({ emoji }) {
  const { t } = useTranslation();

  return (
    <div className='mt-2 flex flex-col'>
      <p>
        {t('emojiPackagePage.frequentlyAskedQuestions.answers.0', { span: <span className='text-primary'>{emoji.name}</span> })}
      </p>

      <button className='mt-2 w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white dark:bg-white/20 dark:hover:bg-white/30' onClick={() => downloadEmoji(emoji)}>
        {t('buttons.download')}
      </button>
    </div>
  );
}