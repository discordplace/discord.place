import { motion } from 'framer-motion';
import Image from 'next/image';
import { BiSolidCategory } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { HiOutlineStatusOnline } from 'react-icons/hi';
import { TbSquareRoundedChevronUp } from 'react-icons/tb';
import MotionLink from '@/app/components/Motion/Link';
import ServerIcon from '@/app/(servers)/servers/components/ServerIcon';

export default function Servers({ data }) {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });

  return (
    <div className="px-8 mt-8 lg:px-0">
      <motion.h2 
        className='text-xl font-semibold' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.6 }}
      >
        Servers
      </motion.h2>

      <motion.p className='mt-2 whitespace-pre-wrap text-tertiary' 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.615 }}
      >
        The owner of this profile is also the owner of the following servers. If you like the profile, maybe you like the servers also?
      </motion.p>

      <motion.div 
        className='grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 lg:grid-cols-3'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.685 }}
      >
        {data.map((server, index) => (
          <MotionLink 
            className='w-full lg:w-[320px] h-[240px] relative overflow-y-clip group cursor-pointer border border-primary rounded-3xl' 
            key={server.id}
            href={`/servers/${server.id}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 100, damping: 10, delay: 0.69 + (index * 0.1) }}
          >
            {server.banner_url ? (
              <Image
                className='absolute top-0 left-0 z-[1] w-full h-[calc(100%_-_1px)] rounded-3xl'
                src={server.banner_url}
                alt={`${server.name}'s banner`}
                width={350}
                height={200}
              />
            ) : (
              <div className='absolute top-0 left-0 z-[1] bg-quaternary w-full h-[calc(100%_-_1px)] rounded-3xl' />
            )}
            <div className='bg-secondary group-hover:bg-tertiary transition-colors w-full h-[calc(100%_-_30px)] z-[2] relative top-[30px] rounded-b-3xl rounded-t-[1.5rem]'>
              <ServerIcon
                icon_url={server.icon_url}
                name={server.name}
                width={64}
                height={64}
                className='absolute top-[-25px] left-4 bg-secondary group-hover:bg-tertiary border-[4px] border-[rgba(var(--bg-secondary))] group-hover:border-[rgba(var(--bg-tertiary))] transition-colors rounded-3xl'
              />

              <div className='flex flex-col px-4 pt-12'>
                <h3 className='text-lg font-semibold truncate'>{server.name}</h3>
                <p 
                  className='mt-1 overflow-hidden text-sm text-tertiary min-h-[40px]' 
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {server.description || 'This server does not have a description. We can only imagine how beautiful it is inside.'}
                </p>

                <div className='flex items-center mt-3 gap-x-3'>
                  <div className='flex gap-x-1.5 items-center text-sm'>
                    <FaUsers className='text-tertiary' />
                    <span className='text-secondary'>{formatter.format(server.total_members)}</span>
                  </div>

                  <div className='flex gap-x-1.5 items-center text-sm'>
                    <TbSquareRoundedChevronUp className='text-tertiary' />
                    <span className='text-secondary'>{formatter.format(server.votes)}</span>
                  </div>

                  <div className='flex gap-x-1.5 items-center text-sm'>
                    <HiOutlineStatusOnline className='text-tertiary' />
                    <span className='text-secondary'>{formatter.format(server.online_members)}</span>
                  </div>
                </div>

                <div className='flex items-center px-2.5 py-1 mt-3 text-sm font-medium rounded-full gap-x-1 w-max text-secondary bg-quaternary'>
                  <BiSolidCategory />
                  {server.category}
                </div>
              </div>
            </div>
          </MotionLink>
        ))}
      </motion.div>
    </div>
  );
}