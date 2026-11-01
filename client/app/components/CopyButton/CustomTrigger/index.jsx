import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import cn from '@/lib/cn';

export default function CopyButton({ timeout = 2000, successText, copyText, className = '', children }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef(null);

  function handleCopy() {
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