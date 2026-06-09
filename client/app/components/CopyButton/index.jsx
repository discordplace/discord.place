import { BiCopy, BiSolidCopy } from 'react-icons/bi';
import { MdCheckCircle } from 'react-icons/md';
import cn from '@/lib/cn';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { t } from '@/stores/language';

export default function CopyButton({ timeout = 2000, successText, copyText, className, DefaultIcon = BiCopy, HoverIcon = BiSolidCopy, children }) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  function handleCopy() {
    if ('clipboard' in navigator === false) return toast.error(t('errorMessages.clipboardNotSupported'));

    navigator.clipboard.writeText(copyText);
    if (successText) toast.success(successText);
    setCopied(true);

    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, timeout);
  };

  return (
    <div
      className={cn(
        'group flex w-full cursor-pointer items-center justify-between gap-x-2 rounded-lg px-3 py-2 text-sm font-semibold text-secondary hover:text-primary',
        className,
        copied && 'pointer-events-none opacity-70'
      )}
      onClick={handleCopy}
    >
      {children}
      <div className='relative'>
        <DefaultIcon className={cn(
          'absolute transition-[transform]',
          copied ? 'scale-0 opacity-0' : 'opacity-100 group-hover:scale-[1.2] group-hover:opacity-0'
        )} />
        <HoverIcon className={cn(
          'absolute transition-[transform] duration-300 group-hover:scale-[1.2]',
          copied ? 'scale-0 opacity-0' : 'opacity-0 group-hover:opacity-100'
        )} />
        <MdCheckCircle className={cn(
          'text-green-800 transition-[transform] duration-300 dark:text-green-400',
          copied ? 'opacity-100' : 'scale-0 opacity-0'
        )} />
      </div>
    </div>
  );
}