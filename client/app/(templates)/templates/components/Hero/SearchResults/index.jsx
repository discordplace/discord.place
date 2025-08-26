import { BsEmojiAngry } from '@/icons';
import useSearchStore from '@/stores/templates/search';
import { useShallow } from 'zustand/react/shallow';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Card from '@/app/(templates)/templates/components/Hero/SearchResults/Card';
import ErrorState from '@/app/components/ErrorState';
import { toast } from 'sonner';
import Pagination from '@/app/components/Pagination';
import { AnimatePresence } from 'framer-motion';
import { t } from '@/stores/language';
import ReportableArea from '@/app/components/ReportableArea';
import useAuthStore from '@/stores/auth';

export default function SearchResults() {
  const user = useAuthStore(state => state.user);

  const { loading, templates, fetchTemplates, total: totalTemplates, limit, page, setPage, search } = useSearchStore(useShallow(state => ({
    loading: state.loading,
    templates: state.templates,
    fetchTemplates: state.fetchTemplates,
    total: state.total,
    limit: state.limit,
    page: state.page,
    setPage: state.setPage,
    search: state.search
  })));

  useEffect(() => {
    fetchTemplates()
      .catch(toast.error);
  }, []);

  const showPagination = !loading && totalTemplates > limit;

  const stateVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1
    },
    exit: {
      opacity: 0
    }
  };

  return (
    !loading && templates.length <= 0 ? (
      <AnimatePresence>
        <motion.div
          className='flex flex-col gap-y-2 px-4 sm:px-0'
          variants={stateVariants}
          initial='hidden'
          animate='visible'
          exit='hidden'
        >
          <ErrorState
            title={
              <div className='flex items-center gap-x-2'>
                <BsEmojiAngry />
                {t('templatesPage.emptyErrorState.title')}
              </div>
            }
            message={t('templatesPage.emptyErrorState.message')}
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
          className='grid grid-cols-1 gap-4 sm:grid-cols-2 sm:px-4 xl:grid-cols-3 xl:px-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            new Array(9).fill(0).map((_, index) => (
              <div key={index} className='h-[164px] w-full animate-pulse rounded-3xl bg-secondary' />
            ))
          ) : (
            templates.map(template => (
              <ReportableArea
                key={template.id}
                active={user?.id !== template.user.id}
                type='template'
                metadata={{
                  id: template.id,
                  name: template.name,
                  description: template.description
                }}
                identifier={`template-${template.id}`}
              >
                <Card data={template} />
              </ReportableArea>
            ))
          )}
        </motion.div>

        <div className='flex w-full items-center justify-center' key='pagination'>
          {showPagination && (
            <Pagination
              page={page}
              setPage={newPage => {
                setPage(newPage);
                fetchTemplates(search);
              }}
              loading={loading}
              total={totalTemplates}
              limit={limit}
            />
          )}
        </div>
      </>
    )
  );
}