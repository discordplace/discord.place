'use client';

import cn from '@/utils/cn';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWindowScroll } from 'react-use';
import { useParams, usePathname } from 'next/navigation';
import { useGeneralStore } from '@/stores/general';
import Footer from '@/components/footer';
import EmptyHeadings from '@/components/empty-headings';
import { FaGithub } from 'react-icons/fa6';

export default function LayoutContent({ children}) {
  const params = useParams();
  const pathname = usePathname();
  
  const headings = useGeneralStore(state => state.headings);
  const setHeadings = useGeneralStore(state => state.setHeadings);
  const setActiveEndpoint = useGeneralStore(state => state.setActiveEndpoint);
  const [visibleHeading, setVisibleHeading] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  
    const headings = Array.from(document.querySelectorAll('h1, h2, h3')).filter(h => h.dataset.name);
    setHeadings(headings.map(h => ({ id: h.id, name: h.dataset.name, level: h.tagName })));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const { y } = useWindowScroll();

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .filter(({ level }) => level !== 'H1')
        .map(({ id }) => document.getElementById(id));
      
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setVisibleHeading(entry.target.id);
        });
      }, { rootMargin: '0px 0px -80% 0px' });
      
      headingElements.forEach(heading => observer.observe(heading));
      
      return () => headingElements.forEach(heading => observer.unobserve(heading));
    };
  
    handleScroll();
  }, [headings, y]);
  
  return (
    <div className='h-[100dvh] flex flex-col'>
      <div className='flex mx-auto my-8 space-x-8 sm:px-4 lg:px-0 lg:max-w-3xl'>
        <div className='hidden sm:flex flex-col space-y-3 w-full h-[85svh] max-w-[150px] mt-2.5 sticky top-8'>
          {headings.length === 0 && <EmptyHeadings />}
          
          {headings.map(({ id, name, level }) => {
            const Tag = id.startsWith('endpoint-') ? 'div' : Link;

            return (
              level === 'H1' ? (
                <span
                  className={cn(
                    'select-none py-2 first:pt-0 last:pb-0 tracking-wider uppercase text-xs font-semibold text-primary'
                  )}
                  key={id}
                >
                  {name}
                </span>
              ) : (
                <Tag
                  className={cn(
                    'relative select-none cursor-pointer group transition-all text-sm first:pt-0 last:pb-0 text-primary/60',
                    visibleHeading === id ? 'pointer-events-none text-purple-400' : 'hover:text-primary/80'
                  )}
                  href={`#${id}`}
                  key={id}
                  onClick={() => {
                    if (id.startsWith('endpoint-')) {
                      const element = document.getElementById(id);
                      if (element) element.scrollIntoView({ behavior: 'smooth' });

                      return setActiveEndpoint(id.split('endpoint-')[1]);
                    }
                  }}
                >
                  <div
                    className={cn(
                      'absolute top-0 transition-colors left-0 w-[calc(100%_+_20px)] h-[calc(100%_+_10px)] -z-10 rounded-lg translate-x-[-10px] translate-y-[-5px]',
                      visibleHeading === id ? 'bg-purple-400/5' : 'group-hover:bg-tertiary'
                    )}
                  />

                  {name}
                </Tag>
              )
            );
          })}

          <div className='w-full h-[1px] bg-quaternary' />

          <Link
            href={`https://github.com/discordplace/discord.place/edit/main/docs/app${pathname}/page.mdx`}
            className='flex items-center text-xs font-semibold transition-colors hover:text-primary text-tertiary gap-x-2'
          >
            <FaGithub />

            Edit this page
          </Link>
        </div>

        <div
          className={cn(
            'w-full pr-4 sm:pr-0 max-w-full lg:max-w-3xl markdown prose min-w-[0px] dark:prose-invert',
            'prose-blockquote:border-l-primary prose-blockquote:text-tertiary',
            'prose-li:marker:text-tertiary',
            'prose-thead:border-b-[rgba(var(--bg-quaternary))] prose-tr:border-b-[rgba(var(--bg-tertiary))]',
            'prose-p:whitespace-pre-wrap',
            'prose-pre:bg-[unset] prose-pre:p-0',
            'prose-a:text-purple-400'
          )}
        >
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
  