'use client';

import Tooltip from '@/app/components/Tooltip';
import { toast } from 'sonner';
import { FaDiscord } from 'react-icons/fa';
import cn from '@/lib/cn';
import { t } from '@/stores/language';

export default function Members({ template, isMobile, currentlyOpenedSection }) {
  function getRandomBrandColor() {
    const colors = ['#5865F2', '#757e8a', '#3ba55c', '#faa61a', '#ed4245', '#eb459f'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  return (
    <div className={cn(
      'px-4 pt-6 max-w-[250px] flex flex-col overflow-y-auto max-h-[calc(100dvh_-_49px)] pb-4 scrollbar-hide gap-y-6 h-full bg-[#2b2d31] w-full',
      isMobile && currentlyOpenedSection === 'members' && 'max-h-[100dvh] max-w-[unset]'
    )}>
      {template.data.roles.map((role, index) => (
        <div className='flex flex-col' key={index}>
          <h2 className='flex flex-wrap items-center gap-x-2 uppercase text-[#949ba4] font-semibold text-sm'>
            <span className='truncate max-w-[180px]'>{role.name}</span> — 1

            <span className='lg:hidden block text-[#949ba480] font-medium normal-case text-xs'>
              {t('templatePreviewPage.clickToCopyColor')}
            </span>
          </h2>

          <div className='flex flex-col mt-2 gap-y-0.5'>
            <Tooltip
              content={t('templatePreviewPage.tooltip.clickToCopyColor')}
              side={'left'}
              hide={isMobile}
            >
              <div
                className='select-none -ml-2 cursor-pointer flex items-center gap-x-2 group hover:bg-[#35373c] px-1.5 py-1 rounded-md'
                onClick={() => {
                  if ('clipboard' in navigator === false) return toast.error(t('errorMessages.clipboardNotSupported'));

                  navigator.clipboard.writeText(role.color);
                  toast.success(t('templatePreviewPage.toast.roleColorCopied'));
                }}
              >
                <div className='w-[32px] h-[32px] rounded-full flex items-center justify-center relative' style={{ backgroundColor: getRandomBrandColor() }}>
                  <FaDiscord className='text-white' size={20} />

                  <span className='absolute -bottom-0.5 border-4 border-[#2b2d31] -right-1 w-4 h-4 rounded-full bg-[#3ba55c]' />
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