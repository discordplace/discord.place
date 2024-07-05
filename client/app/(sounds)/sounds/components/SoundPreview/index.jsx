import { useState } from 'react';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import Waveform from '@/app/(sounds)/sounds/components/SoundPreview/Waveform';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import { PiWaveformBold } from 'react-icons/pi';
import { MdAccountCircle } from 'react-icons/md';
import { IoMdCalendar } from 'react-icons/io';
import { toast } from 'sonner';
import useAuthStore from '@/stores/auth';
import likeSound from '@/lib/request/sounds/likeSound';
import revalidateSound from '@/lib/revalidate/sound';
import { TbLoader } from 'react-icons/tb';

export default function SoundPreview({ sound }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [liked, setLiked] = useState(sound.isLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = () => {
    if (!loggedIn) return toast.error('You must be logged in to like profiles!');

    setLoading(true);

    toast.promise(likeSound(sound.id), {
      loading: liked ? `Unliking sound ${sound.name}...` : `Liking sound ${sound.name}...`,
      success: isLiked => {
        setLiked(isLiked);
        setLoading(false);
        revalidateSound(sound.id);

        return isLiked ? `Liked sound ${sound.name}!` : `Unliked sound ${sound.name}!`;
      },
      error: error => {
        setLoading(false);

        return error;
      }
    });
  };

  const currentlyPlaying = useGeneralStore(state => state.sounds.currentlyPlaying);

  return (
    <div className={cn(
      'flex flex-col gap-y-4 rounded-3xl overflow-hidden w-full h-full bg-secondary border-2 transition-all p-6',
      currentlyPlaying.includes(sound.id) ? 'border-purple-500' : 'border-primary'
    )}>
      <div className="flex items-start justify-between">
        <div className="flex flex-col max-w-[90%]">
          <h2 className="text-base font-semibold truncate text-primary">
            <PiWaveformBold className='inline mr-2' />
            {sound.name}
          </h2>
          
          <div className="flex items-center gap-2 text-base font-medium text-tertiary">
            <div className='flex items-center gap-x-2'>
              <MdAccountCircle />
            
              <span className='text-xs'>
                @{sound.publisher.username}
              </span>
            </div>

            <div className='flex items-center gap-x-2'>
              <IoMdCalendar />
            
              <span className='text-xs'>
                {new Date(sound.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
            
          </div>
        </div>

        <button
          className='text-lg hover:opacity-60 disabled:pointer-events-none disabled:opacity-60'
          onClick={handleLike}
          disabled={loading}
        >
          {loading ? (
            <TbLoader className='animate-spin' />
          ) : liked ? (
            <PiHeartFill />
          ) : (
            <PiHeart />
          )}
        </button>
      </div>

      <Waveform id={sound.id} />
    </div>
  );
}