import { FiSearch, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useSearchStore from '@/stores/profiles/search';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function SearchInput() {
  const [value, setValue] = useState('');
  const { loading, search, fetchProfiles } = useSearchStore(useShallow(state => ({ 
    loading: state.loading, 
    search: state.search, 
    fetchProfiles: state.fetchProfiles 
  })));

  function validateValue(throwError = true) {
    function returnError(message) {
      if (throwError) toast.error(message);
      return false;
    }

    if (!value) return returnError('Please enter a valid search query to find profiles.');

    const trimmedValue = value.trim();
    if (trimmedValue.length <= 0) return returnError('Please enter a valid search query to find profiles.');
    if (trimmedValue.length < 3) return returnError('The search query is too short. Please enter a minimum of 3 characters.');
    if (trimmedValue.length > 100) return returnError('The search query is too long. Please enter a maximum of 100 characters.');

    return trimmedValue;
  }
  
  const sequenceTransition = {
    duration: 0.25,
    type: 'spring',
    stiffness: 260,
    damping: 20
  };

  useEffect(() => {
    setValue(search);
  }, [search]);

  return (
    <div className='flex mt-8 gap-x-2'>
      <div className='relative flex items-center w-full'>
        <motion.input
          type="text"
          placeholder="Search for a profile by slug, occupation, location, etc."
          value={value}
          disabled={loading}
          className='w-full p-3 font-medium rounded-md outline-none disabled:pointer-events-none disabled:opacity-70 text-secondary placeholder-placeholder bg-secondary hover:bg-tertiary focus-visible:bg-tertiary'
          onChange={event => setValue(event.target.value)}
          autoComplete='off'
          maxLength={100}
          spellCheck='false'
          onKeyUp={event => {
            if (event.key === 'Enter') {
              const validatedValue = validateValue();
              if (validatedValue) fetchProfiles(validatedValue);
            }
          }}
          initial={{ opacity: 0, y: -25 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ...sequenceTransition, delay: 0.3 }}
        />

        {search && (
          <motion.button  className='absolute right-2 p-1.5 rounded-md text-secondary hover:bg-tertiary'  onClick={() => {
            setValue('');
            fetchProfiles('');
          }}  disabled={loading}>
            <FiX className='text-xl' />
          </motion.button>
        )}
      </div>
            
      <motion.button className='p-3 rounded-md bg-secondary text-secondary hover:bg-tertiary disabled:pointer-events-none disabled:opacity-70' 
        onClick={() => {
          const validatedValue = validateValue();
          if (validatedValue) fetchProfiles(validatedValue);
        }} 
        disabled={loading || validateValue(false) === false}
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sequenceTransition, delay: 0.3 }}
      >
        <FiSearch className='text-xl' />
      </motion.button>
    </div>
  );
}