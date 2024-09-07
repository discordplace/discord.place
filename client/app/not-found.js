import Square from '@/app/components/Background/Square';

export default function Error() {
  return (
    <div className='z-0 relative flex flex-col items-center w-full h-[100dvh] justify-center px-8 sm:px-0'>
      <Square column='5' row='5' transparentEffectDirection='leftRightBottomTop' blockColor='rgba(var(--bg-tertiary))' />

      <span className='px-2 py-1 text-xs font-semibold text-red-400 uppercase rounded-lg bg-red-400/10'>
        error
      </span>

      <h1 className='mt-4 text-4xl font-medium text-primary'>
        We{'\''}re sorry, an error occurred.
      </h1>

      <p className='text-center mt-2 text-base text-tertiary max-w-[800px] w-full max-h-[200px]'>
        The page you are looking for does not exist.
      </p>
    </div>
  );
}