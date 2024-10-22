export default function Footer() {
  return (
    <div className='mt-auto border-t border-t-primary bg-secondary px-4 py-3.5 lg:px-0'>
      <div className='mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-y-2 text-xs text-tertiary sm:justify-between'>
        <div>
          Copyright © <span className='text-secondary'>discord.place</span>, {new Date().getFullYear()}. GPL v3 Licensed.
        </div>

        <div>
          Thanks to{' '}
          <span className='cursor-pointer text-secondary underline-offset-2 hover:text-purple-400 hover:underline'>Nodesty</span>{' '}
          for supporting this project.
        </div>
      </div>
    </div>
  );
}