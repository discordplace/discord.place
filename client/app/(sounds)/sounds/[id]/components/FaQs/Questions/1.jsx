import downloadSound from '@/lib/utils/sounds/downloadSound';
import { t } from '@/stores/language';

export default function Question1({ sound }) {
  return (
    <div className='flex flex-col mt-2'>
      <p>
        {t('soundPage.frequentlyAskedQuestions.answers.0', { span: <span className='text-primary'>{sound.name}</span> })}
      </p>
      
      <button
        className='px-3 py-1 mt-2 text-sm font-medium text-white bg-black rounded-lg w-max dark:bg-white/20 dark:hover:bg-white/30'
        onClick={() => downloadSound(sound)}
      >
        {t('buttons.download')}
      </button>
    </div>
  );
}