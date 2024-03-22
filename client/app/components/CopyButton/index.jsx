import cn from '@/lib/cn';
import { useState, useRef } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { toast } from 'sonner';
import { BiCopy, BiSolidCopy } from 'react-icons/bi';

export default function CopyButton({ timeout = 2000, successText, copyText, className, DefaultIcon = BiCopy, HoverIcon = BiSolidCopy, children }) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  const handleCopy = () => {
    if ('clipboard' in navigator === false) return toast.error('Your browser does not support the clipboard API.');

    navigator.clipboard.writeText(copyText);
    toast.success(successText);
    setCopied(true);

    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, timeout);
  };

  return (
    <div 
      className={cn(
        'flex items-center cursor-pointer justify-between w-full px-3 py-2 text-sm font-semibold rounded-lg group hover:text-primary gap-x-2 text-secondary',
        className,
        copied && 'pointer-events-none opacity-70'
      )}
      onClick={handleCopy}
    >
      {children}
      <div className='relative'>
        <DefaultIcon className={cn(
          'absolute transition-[transform]',
          copied ? 'scale-0 opacity-0' : 'opacity-100 group-hover:opacity-0 group-hover:scale-[1.2]'
        )} />
        <HoverIcon className={cn(
          'absolute transition-[transform] duration-300 group-hover:scale-[1.2]',
          copied ? 'scale-0 opacity-0' : 'opacity-0 group-hover:opacity-100'
        )} />
        <IoCheckmarkCircle className={cn(
          'text-green-800 dark:text-green-400 transition-[transform] duration-300',
          copied ? 'opacity-100' : 'scale-0 opacity-0'
        )} />
      </div>
    </div>
  );
}