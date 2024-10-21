'use client';

import cn from '@/utils/cn';
import { useState } from 'react';
import { BiSolidCopy } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa6';

export default function CopyCodeButton({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!navigator.clipboard || !code || copied) return;

    navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      className={cn(
        'flex items-center text-sm transition-colors',
        copied && 'select-none'
      )}
      onClick={handleCopy}
    >
      <BiSolidCopy
        className={cn(
          'transition-all text-tertiary hover:text-primary',
          copied && 'scale-50 opacity-0'
        )}
      />

      <FaCheck
        className={cn(
          'absolute transition-all pointer-events-none',
          copied ? 'text-green-500' : 'scale-50 opacity-0'
        )}
      />
    </button>
  );
}