import Card from '@/app/(templates)/templates/components/Hero/SearchResults/Card';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';
import { t } from '@/stores/language';
import useSearchStore from '@/stores/templates/search';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { BsEmojiAngry } from 'react-icons/bs';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default function SearchResults() {
  const user = useAuthStore(state => state.user);

  const { fetchTemplates, limit, loading, page, search, setPage, templates, total: totalTemplates } = useSearchStore(useShallow(state => ({
    fetchTemplates: state.fetchTemplates,
    limit: state.limit,
    loading: state.loading,
    page: state.page,
    search: state.search,
    setPage: state.setPage,
    templates: state.templates,
    total: state.total
  })));

  useEffect(() => {
    fetchTemplates()
      .catch(toast.error);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPagination = !loading && totalTemplates > limit;

  const stateVariants = {
    exit: {
      opacity: 0
    },
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    }
  };

  return (
    !loading && templates.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          animate='visible'
          className='flex flex-col gap-y-2 px-4 sm:px-0'
          exit='hidden'
          initial='hidden'
          variants={stateVariants}
        >
          <ErrorState
            message={t('templatesPage.emptyErrorState.message')}
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('templatesPage.emptyErrorState.title')}
              </div>
            }
          />

          <button className='text-tertiary hover:text-primary hover:underline' onClick={() => {
            fetchTemplates('', 1, limit, 'All', 'Popular');
          }}>
            {t('buttons.resetSearch')}
          </button>
        </motion.div>
      </AnimatePresence>
    ) : (
      <>
        <motion.div
          animate={{ opacity: 1 }}
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 xl:grid-cols-3 xl:px-0'
          initial={{ opacity: 0 }}
        >
          {loading ? (
            new Array(9).fill(0).map((_, index) => (
              <div className='h-[164px] w-full animate-pulse rounded-3xl bg-secondary' key={index} />
            ))
          ) : (
            templates.map(template => (
              <ReportableArea
                active={user?.id !== template.user.id}
                identifier={`template-${template.id}`}
                key={template.id}
                metadata={{
                  description: template.description,
                  id: template.id,
                  name: template.name
                }}
                type='template'
              >
                <Card data={template} />
              </ReportableArea>
            ))
          )}
        </motion.div>

        <div className='flex w-full items-center justify-center' key='pagination'>
          {showPagination && (
            <Pagination
              limit={limit}
              loading={loading}
              page={page}
              setPage={newPage => {
                setPage(newPage);
                fetchTemplates(search);
              }}
              total={totalTemplates}
            />
          )}
        </div>
      </>
    )
  );
}