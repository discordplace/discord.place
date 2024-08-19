'use client';

import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';
import { t } from '@/stores/language';

export default function Question1({ emoji }) {
  return (
    <div className='flex flex-col mt-2'>
      <p>
        {t('emojiPackagePage.frequentlyAskedQuestions.answers.0', { span: <span className='text-primary'>{emoji.name}.{emoji.animated ? 'gif' : 'png'}</span> })}
      </p>

      <button className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30' onClick={() => downloadEmoji(emoji)}>
        {t('buttons.download')}
      </button>
    </div>
  );
}