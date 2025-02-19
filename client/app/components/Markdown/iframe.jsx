'use client';

import { useLocalStorage } from 'react-use';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { LuShieldAlert } from 'react-icons/lu';
import { PiFrameCornersBold } from 'react-icons/pi';

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
                You have blocked the iframe from loading from <span className='text-primary'>{domain}</span> source.
                <br />
                Do you want to trust this source?
              </p>

              <button
                className='flex items-center gap-x-1 rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white hover:opacity-80'
                onClick={() => {
                  setUntrustedFrames(oldUntrustedFrames => oldUntrustedFrames.filter(frame => frame !== src));
                  setTrustedFrames(oldTrustedFrames => oldTrustedFrames.concat(src));
                }}
              >
                <IoCheckmarkCircle />
                Trust
              </button>
            </div>
          </>
        ) : (
          <>
            <div className='absolute top-0 mt-4 hidden flex-wrap items-center justify-between gap-x-4 rounded-2xl bg-tertiary px-5 lg:flex'>
              <p className='text-sm font-medium text-tertiary'>
                A iframe is trying to load from <span className='text-primary'>{domain}</span> source. Do you trust this source?
              </p>

              <div className='flex items-center gap-x-2'>
                <button
                  className='flex items-center gap-x-1 rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white hover:opacity-80'
                  onClick={() => setTrustedFrames(oldTrustedFrames => oldTrustedFrames.concat(src))}
                >
                  <IoCheckmarkCircle />
                  Trust and Load
                </button>

                <button
                  className='flex items-center gap-x-1 rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white hover:opacity-80'
                  onClick={() => setUntrustedFrames(oldUntrustedFrames => oldUntrustedFrames.concat(src))}
                >
                  Don{'\''}t Trust
                </button>
              </div>
            </div>

            <div className='flex size-full flex-col items-center justify-center text-tertiary'>
              <PiFrameCornersBold size={64} />

              <div className='flex flex-col items-center gap-y-2 px-4 lg:hidden'>
                <p className='text-center text-sm font-medium'>
                  A iframe is trying to load from <span className='text-primary'>{domain}</span> source. Do you trust this source?
                </p>

                <div className='flex items-center gap-x-2'>
                  <button
                    className='flex items-center gap-x-1 rounded-full bg-purple-500 px-3 py-1 text-sm font-medium text-white hover:opacity-80'
                    onClick={() => setTrustedFrames(oldTrustedFrames => oldTrustedFrames.concat(src))}
                  >
                    <IoCheckmarkCircle />
                    Trust and Load
                  </button>

                  <button
                    className='flex items-center gap-x-1 rounded-full bg-red-600 px-3 py-1 text-sm font-medium text-white hover:opacity-80'
                    onClick={() => setUntrustedFrames(oldUntrustedFrames => oldUntrustedFrames.concat(src))}
                  >
                    Don{'\''}t Trust
                  </button>
                </div>
              </div>

              <p className='hidden text-sm font-medium lg:block'>
                The iframe will be loaded here once you trust the source.
              </p>
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