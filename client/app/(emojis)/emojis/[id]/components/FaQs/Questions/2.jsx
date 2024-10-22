'use client';

import config from '@/config';
import downloadEmoji from '@/lib/utils/emojis/downloadEmoji';
import { t } from '@/stores/language';
import Link from 'next/link';
import { useState } from 'react';

export default function Question2({ emoji }) {
  const [activeMethod, setActiveMethod] = useState(0);

  return (
    <div className='mt-2 flex flex-col gap-y-1'>
      <p>
        {t('emojiPage.frequentlyAskedQuestions.answers.1.title')}
      </p>

      <div className='flex gap-x-2'>
        <button
          className='mt-2 w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-70 dark:bg-white/20 dark:hover:bg-white/30'
          disabled={activeMethod === 0}
          onClick={() => setActiveMethod(0)}
        >
          {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.buttonText')}
        </button>

        <button
          className='mt-2 w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-70 dark:bg-white/20 dark:hover:bg-white/30'
          disabled={activeMethod === 1}
          onClick={() => setActiveMethod(1)}
        >
          {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.1.buttonText')}
        </button>

        <button
          className='mt-2 w-max rounded-lg bg-black px-3 py-1 text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-70 dark:bg-white/20 dark:hover:bg-white/30'
          disabled={activeMethod === 2}
          onClick={() => setActiveMethod(2)}
        >
          {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.buttonText')}
        </button>
      </div>

      <div className='mt-2'>
        {activeMethod === 0 && (
          <>
            {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.instructionsBefore')}

            <div className='mt-2 flex flex-col gap-y-1'>
              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>1.</span>

                <span>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.instructions.0.text', { link: <Link className='underline hover:text-primary' href={config.botInviteURL} target='_blank'>{t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.instructions.0.linkText')}</Link> })}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>2.</span>

                <span>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.instructions.1')}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>4.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.instructions.2')}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>5.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.0.instructions.3')}
                </span>
              </div>
            </div>
          </>
        )}

        {activeMethod === 1 && (
          <>
            {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.1.instructionsBefore')}
            <div className='mt-2 flex flex-col gap-y-1'>
              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>1.</span>

                <span>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.1.instructions.0', { link: <Link className='underline hover:text-primary' href={config.botInviteURL} target='_blank'>{t('emojiPage.frequentlyAskedQuestions.answers.1.methods.1.instructions.0.linkText')}</Link> })}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>2.</span>

                <span>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.1.instructions.1', { pre: <pre>/emoji upload emoji:{emoji.id}</pre> })}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>3.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.1.instructions.2')}
                </span>
              </div>
            </div>
          </>
        )}

        {activeMethod === 2 && (
          <>
            {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructionsBefore')}

            <div className='mt-2 flex flex-col gap-y-1'>
              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>1.</span>

                <span>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructions.0')} <button className='w-max rounded-lg bg-black px-3 py-0 text-sm font-medium text-white dark:bg-white/20 dark:hover:bg-white/30' onClick={() => downloadEmoji(emoji)}>Download</button>
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>2.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructions.1')}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>3.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructions.2')}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>4.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructions.3')}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>5.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructions.4')}
                </span>
              </div>

              <div className='flex gap-x-2'>
                <span className='select-none font-bold text-primary'>6.</span>

                <span className='flex gap-x-2'>
                  {t('emojiPage.frequentlyAskedQuestions.answers.1.methods.2.instructions.5')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}