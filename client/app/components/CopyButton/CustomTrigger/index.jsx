import cn from '@/lib/cn';
import { t } from '@/stores/language';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function CopyButton({ timeout = 2000, successText, copyText, className = '', children }) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  const handleCopy = () => {
    if ('clipboard' in navigator === false) return toast.error(t('errorMessages.clipboardNotSupported'));

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
      onClick={handleCopy}
      className={cn(
        'transition-all',
        copied && 'pointer-events-none opacity-50',
        className
      )}
    >
      {children}
    </div>
  );
}