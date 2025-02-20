'use client';

import { useLocalStorage } from 'react-use';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { LuShieldAlert } from 'react-icons/lu';
import { PiFrameCornersBold } from 'react-icons/pi';
import { t } from '@/stores/language';

export default function CustomIFrame({ src, title }) {
  const url = new URL(src);
  const domain = url.hostname;

  const [trustedFrames, setTrustedFrames] = useLocalStorage('trustedFrames', []);
  const [untrustedFrames, setUntrustedFrames] = useLocalStorage('untrustedFrames', []);

  if (!trustedFrames.includes(src) || untrustedFrames.includes(src)) {
    return (
      <div
        className='relative my-4 flex w-full items-center justify-center rounded-xl bg-background'
        style={{
          height: '800px',
          border: '2px dashed rgba(var(--bg-quaternary))'
        }}
      >
        {untrustedFrames.includes(src) ? (
          <>
            <div className='flex size-full flex-col items-center justify-center text-tertiary'>
              <LuShieldAlert size={64} />

              <p className='text-center text-sm font-medium'>
                {t('components.markdown.iframe.blockedSource', {
                  span: <span className='text-primary'>{domain}</span>,
                  br: <br />
                })}
              </p>

              <button
                className='flex items-center gap-x-1 rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white hover:bg-purple-600'
                onClick={() => {
                  setUntrustedFrames(oldUntrustedFrames => oldUntrustedFrames.filter(frame => frame !== src));
                  setTrustedFrames(oldTrustedFrames => oldTrustedFrames.concat(src));
                }}
              >
                <IoCheckmarkCircle />
                {t('buttons.trust')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='size-full'>
              <div className='absolute top-0 flex w-full flex-wrap items-center justify-between gap-4 rounded-t-xl bg-tertiary px-5 py-4' id='trustConsentContainer'>
                <span className='text-sm font-medium text-tertiary'>
                  {t('components.markdown.iframe.sourceConsent', {
                    span: <span className='text-primary'>{domain}</span>,
                    br: <br />
                  })}
                </span>

                <div className='flex flex-wrap items-center gap-2'>
                  <button
                    className='flex items-center gap-x-1 rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white hover:bg-purple-600'
                    onClick={() => setTrustedFrames(oldTrustedFrames => oldTrustedFrames.concat(src))}
                  >
                    <IoCheckmarkCircle />
                    {t('buttons.trustAndLoad')}
                  </button>

                  <button
                    className='flex items-center gap-x-1 rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700'
                    onClick={() => setUntrustedFrames(oldUntrustedFrames => oldUntrustedFrames.concat(src))}
                  >
                    {t('buttons.dontTrust')}
                  </button>
                </div>
              </div>

              <div className='flex size-full flex-col items-center justify-center gap-y-2 px-4 text-tertiary'>
                <PiFrameCornersBold size={64} />

                <span className='text-center text-sm font-medium'>
                  {t('components.markdown.iframe.contentBeHere')}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      sandbox='allow-scripts allow-same-origin'
      className='size-full rounded-md'
    />
  );
}