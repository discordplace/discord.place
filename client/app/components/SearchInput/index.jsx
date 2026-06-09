import { FiX } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { t } from '@/stores/language';

export default function SearchInput({ placeholder, loading, search, fetchData, setPage, animationDelay }) {
  const [value, setValue] = useState('');

  function validateValue(throwError = true) {
    function returnError(message) {
      if (throwError) toast.error(message);

      return false;
    }

    if (!value) return returnError(t('errorMessages.validSearchQuery'));

    const trimmedValue = value.trim();
    if (trimmedValue.length <= 0) return returnError(t('errorMessages.validSearchQuery'));
    if (trimmedValue.length < 3) return returnError(t('errorMessages.searchQueryTooShort'));
    if (trimmedValue.length > 100) return returnError(t('errorMessages.searchQueryTooLong'));

    return trimmedValue;
  }

  useEffect(() => {
    setValue(search || '');
  }, [search]);

  const sequenceTransition = {
    damping: 20,
    duration: 0.25,
    stiffness: 260,
    type: 'spring'
  };

  return (
    <motion.div
      className='relative flex w-full items-center overflow-hidden'
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...sequenceTransition, delay: animationDelay }}
    >
      <button
        className={cn(
          'peer absolute right-3 cursor-pointer rounded-md p-1.5 text-lg text-tertiary transition-all [transition-duration:250ms] hover:bg-quaternary hover:text-primary',
          (value || (value !== undefined && value !== '')) && 'right-[2.7rem]'
        )}
        onClick={() => {
          const validatedValue = validateValue();
          if (validatedValue) {
            setPage(1);
            fetchData(validatedValue);
          }
        }}
      >
        <IoSearch />
      </button>

      <button
        className={cn(
          'peer absolute right-2 rounded-md p-1.5 text-lg text-tertiary transition-all [transition-duration:250ms] hover:bg-quaternary hover:text-primary',
          (value || (value !== undefined && value !== '')) ? 'right-2' : 'right-[-30px] opacity-0'
        )}
        onClick={() => {
          setValue('');
          fetchData('');
        }}
        disabled={loading}
      >
        <FiX className='text-xl' />
      </button>

      <input
        placeholder={placeholder}
        className={cn(
          'flex w-full rounded-lg border-2 border-primary bg-secondary py-3 pr-12 pl-4 text-secondary caret-[rgba(var(--text-secondary))] outline-hidden transition-all [transition-duration:250ms] peer-hover:bg-secondary placeholder:text-placeholder hover:bg-tertiary focus-visible:border-purple-500 focus-visible:bg-tertiary active:bg-quaternary disabled:pointer-events-none',
          (value || (value !== undefined && value !== '')) && 'pr-[4.7rem]'
        )}
        onChange={event => setValue(event.target.value)}
        value={value}
        disabled={loading}
        maxLength={100}
        spellCheck={false}
        autoComplete='off'
        onKeyUp={event => {
          if (event.key === 'Enter') {
            const validatedValue = validateValue();
            if (validatedValue) {
              setPage(1);
              fetchData(validatedValue);
            }
          }
        }}
      />
    </motion.div>
  );
}