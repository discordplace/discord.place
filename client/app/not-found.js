import Square from '@/app/components/Background/Square';

export default function Error() {
  return (
    <div className='relative z-0 flex h-svh w-full flex-col items-center justify-center px-8 sm:px-0'>
      <Square column='5' row='5' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-tertiary))' />

      <span className='rounded-lg bg-red-400/10 px-2 py-1 text-xs font-semibold uppercase text-red-400'>
        error
      </span>

      <h1 className='mt-4 text-4xl font-medium text-primary'>
        We{'\''}re sorry, an error occurred.
      </h1>

      <p className='mt-2 max-h-[200px] w-full max-w-[800px] text-center text-base text-tertiary'>
        The page you are looking for does not exist.
      </p>
    </div>
  );
}