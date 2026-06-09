import cn from '@/lib/cn';

export default function Layout({ children }) {
  return (
    <div className='mt-48 mb-16 flex w-full justify-center px-8 lg:px-0'>
      <div
        className={cn(
          // oxlint-disable-next-line tailwindcss/no-unknown-classes
          'markdown flex w-full max-w-[800px] flex-col',
          'prose prose-sm lg:prose-base',
          'prose-h1:text-primary',
          'prose-h2:text-primary',
          'prose-h3:text-secondary',
          'prose-h4:text-secondary',
          'prose-p:my-1 prose-p:text-tertiary',
          'prose-a:text-secondary prose-a:hover:text-primary',
          'prose-strong:text-secondary',
          'prose-li:my-0 prose-li:text-tertiary',
          '[&>ol>li]:marker:text-tertiary',
          'prose-strong:text-primary'
        )}
      >
        {children}
      </div>
    </div>
  );
}