'use client';

import { FaDiscord } from '@/icons';
import Tooltip from '@/app/components/Tooltip';
import { toast } from 'sonner';import cn from '@/lib/cn';
import { t } from '@/stores/language';
import { useMemo } from 'react';

export default function Members({ template, isMobile, currentlyOpenedSection }) {
  const colors = ['#5865F2', '#757e8a', '#3ba55c', '#faa61a', '#ed4245', '#eb459f'];

  const brandColors = useMemo(() => {
    return template.data.roles.map(() => colors[Math.floor(Math.random() * colors.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.data.roles]);

  return (
    <div
      className={cn(
        'px-4 pt-6 max-w-[250px] flex flex-col overflow-y-auto max-h-[calc(100svh_-_49px)] pb-4 scrollbar-hide gap-y-6 h-full bg-[#2b2d31] w-full',
        isMobile && currentlyOpenedSection === 'members' && 'max-h-[100svh] max-w-[unset]'
      )}
    >
      {template.data.roles.map((role, index) => (
        <div className='flex flex-col' key={index}>
          <h2 className='flex flex-wrap items-center gap-x-2 text-sm font-semibold uppercase text-[#949ba4]'>
            <span className='max-w-[180px] truncate'>{role.name}</span> — 1

            <span className='block text-xs font-medium normal-case text-[#949ba480] lg:hidden'>
              {t('templatePreviewPage.clickToCopyColor')}
            </span>
          </h2>

          <div className='mt-2 flex flex-col gap-y-0.5'>
            <Tooltip
              content={t('templatePreviewPage.tooltip.clickToCopyColor')}
              side={'left'}
              hide={isMobile}
            >
              <div
                className='group -ml-2 flex cursor-pointer select-none items-center gap-x-2 rounded-md px-1.5 py-1 hover:bg-[#35373c]'
                onClick={() => {
                  if ('clipboard' in navigator === false) return toast.error(t('errorMessages.clipboardNotSupported'));

                  navigator.clipboard.writeText(role.color);
                  toast.success(t('templatePreviewPage.toast.roleColorCopied'));
                }}
              >
                <div className='relative flex size-[32px] items-center justify-center rounded-full' style={{ backgroundColor: brandColors[index] }}>
                  <FaDiscord className='text-white' size={20} />

                  <span className='absolute -bottom-0.5 -right-1 size-4 rounded-full border-4 border-[#2b2d31] bg-[#3ba55c]' />
                </div>

                <div className='text-sm font-medium' style={{ color: role.color }}>
                  {role.color}
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  );
}