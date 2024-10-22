'use client';

import { t } from '@/stores/language';

export default function Question2() {
  return (
    <div className='mt-2 flex flex-col gap-y-1'>
      <p>
        {t('themePage.frequentlyAskedQuestions.answers.1.title')}
      </p>

      <div className='mt-2'>
        {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructionsBefore')}

        <div className='mt-2 flex flex-col gap-y-1'>
          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>1.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.0')}
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>2.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.1')}
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>3.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.2')}
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>4.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.3')}
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>5.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.4')}
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>6.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.5')}
            </span>
          </div>

          <div className='flex gap-x-2'>
            <span className='select-none font-bold text-primary'>7.</span>
            <span>
              {t('themePage.frequentlyAskedQuestions.answers.1.methods.0.instructions.6')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}