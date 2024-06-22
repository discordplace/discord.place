import { FiX } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { IoSearch } from 'react-icons/io5';
import { TbLoader } from 'react-icons/tb';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';

export default function SearchInput({ placeholder, loading, search, fetchData, setPage, animationDelay }) {
  const [value, setValue] = useState('');

  function validateValue(throwError = true) {
    function returnError(message) {
      if (throwError) toast.error(message);
      return false;
    }

    if (!value) return returnError('Please enter a valid search query.');

    const trimmedValue = value.trim();
    if (trimmedValue.length <= 0) return returnError('Please enter a valid search query to.');
    if (trimmedValue.length < 3) return returnError('The search query is too short. Please enter a minimum of 3 characters.');
    if (trimmedValue.length > 100) return returnError('The search query is too long. Please enter a maximum of 100 characters.');

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
      className='relative flex items-center mt-8 overflow-hidden'
      initial={{ opacity: 0, y: -25 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ ...sequenceTransition, delay: animationDelay }}
    >
      <button
        className={cn(
          '[transition-duration:_250ms] peer transition-all cursor-pointer text-lg absolute p-1.5 rounded-md hover:bg-quaternary right-3 text-tertiary hover:text-primary',
          (value || value !== '') && 'right-[2.7rem]'
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
          (value || value !== '') ? 'right-2' : '-right-[30px] opacity-0'
        )}
        onClick={() => {
          setValue('');
          fetchData('');
        }}
        disabled={loading}
      >
        <FiX className='text-xl' />
      </button>
      
      <div
        className={cn(
          'transition-all [transition-duration:_250ms] absolute',
          loading ? 'left-4' : '-left-[30px] opacity-0'
        )}
      >
        <TbLoader className='w-5 h-5 animate-spin text-secondary' />
      </div>
      
      <input
        placeholder={placeholder}
        className={cn(
          'caret-[rgba(var(--text-secondary))] [transition-duration:_250ms] flex w-full py-3 pl-4 pr-12 transition-all border-2 rounded-lg outline-none disabled:pl-10 disalbed:pointer-events-none bg-secondary peer-hover:bg-secondary border-primary hover:bg-tertiary placeholder-placeholder text-secondary focus-visible:bg-tertiary focus-visible:border-purple-500 active:bg-quaternary',
          (value || value !== '') && 'pr-[4.7rem]'
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