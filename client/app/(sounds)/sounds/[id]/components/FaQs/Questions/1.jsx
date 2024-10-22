import downloadSound from '@/lib/utils/sounds/downloadSound';
import { t } from '@/stores/language';

export default function Question1({ sound }) {
  return (
    <div className='mt-2 flex flex-col'>
      <p>
        {t('soundPage.frequentlyAskedQuestions.answers.0', { span: <span className='text-primary'>{sound.name}</span> })}
      </p>

      <button
        className='mt-2 w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white dark:bg-white/20 dark:hover:bg-white/30'
        onClick={() => downloadSound(sound)}
      >
        {t('buttons.download')}
      </button>
    </div>
  );
}