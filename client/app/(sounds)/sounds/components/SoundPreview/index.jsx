import { useState } from 'react';
import { PiHeart, PiHeartFill } from 'react-icons/pi';
import Waveform from '@/app/(sounds)/sounds/components/SoundPreview/Waveform';
import cn from '@/lib/cn';
import useGeneralStore from '@/stores/general';
import { PiWaveformBold } from 'react-icons/pi';
import { MdAccountCircle, MdDownload } from 'react-icons/md';
import { IoMdCalendar } from 'react-icons/io';
import { toast } from 'sonner';
import useAuthStore from '@/stores/auth';
import likeSound from '@/lib/request/sounds/likeSound';
import revalidateSound from '@/lib/revalidate/sound';
import { TbLoader } from 'react-icons/tb';
import useSearchStore from '@/stores/sounds/search';

export default function SoundPreview({ sound, overridedSort }) {
  const loggedIn = useAuthStore(state => state.loggedIn);
  const [liked, setLiked] = useState(sound.isLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = () => {
    if (!loggedIn) return toast.error('You must be logged in to like sounds!');

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

  const storedSort = useSearchStore(state => state.sort);
  const sort = overridedSort || storedSort;

  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });

  const info = [
    {
      icon: MdDownload,
      value: formatter.format(sound.downloadsCount),
      condition: sort === 'Downloads'
    },
    {
      icon: PiHeartFill,
      value: formatter.format(sound.likesCount),
      condition: sort === 'Likes'
    },
    {
      icon: IoMdCalendar,
      value: new Date(sound.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      condition: sort === 'Newest' || sort === 'Oldest'
    }
  ];

  return (
    <div className={cn(
      'flex flex-col gap-y-4 rounded-3xl overflow-hidden w-full h-max bg-secondary border-2 transition-all p-6',
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

            {info.filter(({ condition }) => condition === true).map(({ icon: Icon, value }) => (
              <div
                className='flex items-center gap-x-2'
                key={`sound-${sound.id}-info`}
              >
                <Icon />
                
                <span className='text-xs'>
                  {value}
                </span>
              </div>
            ))}            
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