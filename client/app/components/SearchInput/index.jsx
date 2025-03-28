import { IoSearch, FiX } from '@/icons';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';import cn from '@/lib/cn';
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
    setValue(search);
  }, [search]);

  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
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
          '[transition-duration:_250ms] peer transition-all cursor-pointer text-lg absolute p-1.5 rounded-md hover:bg-quaternary right-3 text-tertiary hover:text-primary',
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
          'absolute right-2 transition-all peer [transition-duration:_250ms] p-1.5 rounded-md hover:bg-quaternary text-lg text-tertiary hover:text-primary',
          (value || (value !== undefined && value !== '')) ? 'right-2' : '-right-[30px] opacity-0'
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
          'caret-[rgba(var(--text-secondary))] [transition-duration:_250ms] flex w-full py-3 pl-4 pr-12 transition-all border-2 rounded-lg outline-none disalbed:pointer-events-none bg-secondary peer-hover:bg-secondary border-primary hover:bg-tertiary placeholder-placeholder text-secondary focus-visible:bg-tertiary focus-visible:border-purple-500 active:bg-quaternary',
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