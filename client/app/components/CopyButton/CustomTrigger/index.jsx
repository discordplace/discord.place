import cn from '@/lib/cn';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function CopyButton({ timeout = 2000, successText, copyText, children }) {
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
      onClick={handleCopy}
      className={cn(
        'transition-all',
        copied && 'pointer-events-none opacity-50'
      )}
    >
      {children}
    </div>
  );
}