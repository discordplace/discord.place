'use client';

import ColumnRenderer from '@/app/(dashboard)/components/Table/ColumnRenderer';
import { FaCheck } from 'react-icons/fa';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import useDashboardStore from '@/stores/dashboard';
import { useEffect, useState } from 'react';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { HiCursorClick } from 'react-icons/hi';
import Pagination from '@/app/components/Pagination';
import { PiSortAscendingBold, PiSortDescendingBold } from 'react-icons/pi';
import sortColumns from '@/app/(dashboard)/components/Table/sortColumns';
import { FiX } from 'react-icons/fi';

export default function Table({ tabs }) {
  const selectedIndexes = useDashboardStore(state => state.selectedIndexes);
  const setSelectedIndexes = useDashboardStore(state => state.setSelectedIndexes);
  
  function handleSelect(index) {
    if (selectedIndexes.includes(index)) setSelectedIndexes(selectedIndexes.filter(selectedRow => selectedRow !== index));
    else setSelectedIndexes([...selectedIndexes, index]);
  }

  const [currentTab, setCurrentTab] = useState(tabs[0].label);
  const currentTabData = tabs.find(tab => tab.label === currentTab);

  useEffect(() => {
    setSelectedIndexes([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  const [page, setPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({ name: '', key: '', order: '' });

  if (!currentTabData || !currentTabData.columns) return null;

  const sortedColumns = currentTabData.columns
    .sort((a, b) => sortColumns(currentSort.key, currentSort.order, [a, b]));

  // Paginate columns
  const displayedColumns = sortedColumns.slice((page - 1) * 10, page * 10);

  const showPagination = currentTabData.columns.length > 10;

  const CurrentSortIcon = currentTabData.rows[currentSort.key]?.icon;

  return (
    <>
      <div
        className={cn(
          'transition-all duration-300 flex items-center gap-x-2',
          (currentTabData.columns.length > 0 && currentSort.name) ? 'opacity-100 mb-0' : 'opacity-0 -mb-14'
        )}
      >
        <span className='text-xs font-medium text-tertiary'>
          Sort by
        </span>

        <button
          className='flex hover:bg-quaternary items-center pl-1.5 pr-2 text-xs rounded-full gap-x-1.5 py-0.5 text-secondary border bg-secondary border-primary'
          onClick={() => setCurrentSort({ name: '', key: '', order: '' })}
        >
          {CurrentSortIcon && <CurrentSortIcon size={14} />}

          {currentSort.name || 'None'}

          <FiX size={14} />
        </button>
      </div>
      
      <div className='flex flex-wrap pb-5 gap-x-4 gap-y-2 sm:flex-nowrap sm:border-b sm:overflow-hidden border-b-primary'>
        {tabs?.map(tab => (
          <div
            key={tab.label}
            className={cn(
              'flex w-full justify-center sm:w-max bg-secondary sm:bg-[unset] items-center gap-x-2 sm:py-0 py-2 px-4 sm:px-2 relative text-sm hover:text-primary cursor-pointer text-tertiary transition-colors rounded-lg',
              currentTab === tab.label && 'text-primary pointer-events-none'
            )}
            onClick={() => setCurrentTab(tab.label)}
          >
            {tab.label}

            <span className='text-xs rounded-full bg-quaternary sm:bg-quaternary text-primary px-1.5 py-0.5'>
              {tab.count}
            </span>

            {currentTab === tab.label && (
              <motion.div
                layoutId='emojisQueueCurrentTabIndicator'
                className='sm:block hidden absolute w-full rounded-lg left-0 h-[35px] bg-black dark:bg-white -bottom-[52.5px]'
              />
            )}
          </div>
        ))}
      </div>

      <div className='relative -mt-8 min-w-[1000px] w-full overflow-scroll'>
        {currentTabData.columns.length === 0 && (
          <div className='flex items-center max-w-[calc(100vw_-_65px)] sm:max-w-[unset] justify-center min-h-[calc(100dvh_-_400px)]'>
            <ErrorState
              title={
                <div className='flex items-center gap-x-2'>
                  <BsEmojiAngry />
                  It{'\''}s quiet in here..
                </div>
              }
              message={`There are no ${currentTabData.label.toLowerCase()} data to display.`}
            />
          </div>
        )}

        <table className='w-full table-auto'>
          {currentTabData.columns.length > 0 && (
            <thead className='relative text-left select-none'>
              <tr>
                {currentTabData.rows?.map((row, index) => (
                  <th
                    key={`row-${row.name}`}
                    scope='col'
                    className={cn(
                      'px-2 py-6 text-sm font-medium text-tertiary min-w-[150px]',
                      row.sortable && 'cursor-pointer hover:text-primary transition-colors'
                    )}
                    onClick={() => {
                      if (!row.sortable) return;
                     
                      setCurrentSort({
                        name: row.name,
                        key: index,
                        order: currentSort.key === index ? (currentSort.order === 'asc' ? 'desc' : 'asc') : 'asc'
                      });
                    }}
                  >
                    <div className="flex items-center text-xs font-bold uppercase gap-x-2">
                      {row.icon && <row.icon size={18} />}
                
                      {row.name}

                      {(currentSort.name === row.name && currentSort.key === index) && (
                        currentSort.order === 'asc' ? (
                          <PiSortAscendingBold size={18} />
                        ) : (
                          <PiSortDescendingBold size={18} />
                        )
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {displayedColumns.map((column, columnIndex) => (
              <tr
                className='text-sm text-secondary group'
                key={`column-${columnIndex}`}
              >
                {currentTabData.rows?.map((_, rowIndex) => (
                  <td
                    key={`row-${rowIndex}`}
                    className={cn(
                      'p-2 h-[60px] border-y border-[rgba(var(--bg-tertiary))] transition-colors group-hover:cursor-pointer',
                      selectedIndexes.includes(columnIndex) ? 'bg-tertiary border-[rgba(var(--bg-quaternary))] select-none' : 'group-hover:bg-secondary'
                    )}
                    onClick={() => handleSelect(currentTabData.columns.indexOf(column))}
                  >
                    <div
                      className='flex items-center gap-x-2'
                    >
                      {rowIndex === 0 && (
                        <div 
                          className='flex items-center cursor-pointer gap-x-2 group'
                          onClick={() => handleSelect(currentTabData.columns.indexOf(column))}
                        >
                          <button className={cn(
                            'w-[18px] h-[18px] flex justify-center items-center border-2 outline-none hover:bg-[rgba(var(--border-primary))] transition-colors border-primary rounded-md',
                            selectedIndexes.includes(columnIndex) && 'bg-purple-500 hover:bg-purple-500 text-white'
                          )}>
                            <FaCheck
                              size={10} 
                              className={cn(
                                'transition-opacity opacity-0',
                                selectedIndexes.includes(columnIndex) && 'opacity-100'
                              )}
                            />
                          </button>
                        </div>
                      )}

                      <ColumnRenderer data={column[rowIndex]} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className='flex justify-center w-full'>
          <Pagination
            page={page}
            totalPages={Math.ceil(currentTabData.columns?.length / 10)}
            setPage={setPage}
            loading={false}
            total={currentTabData.columns?.length}
            limit={10}
            disableAnimation
          />
        </div>
      )}
      
      <div className='flex items-center justify-center'>
        <AnimatePresence>
          {selectedIndexes.length > 0 && (
            <motion.div
              className='left-8 px-2 py-2 sm:p-[unset] sm:left-[unset] z-[10] font-medium text-sm gap-x-2 fixed bottom-4 rounded-2xl flex items-center border-2 border-primary w-full max-w-[calc(100%_-_40px)] sm:min-w-[500px] sm:w-max h-max sm:h-[50px] bg-secondary'
              initial={{
                opacity: 0,
                y: 60,
                scale: 0.8,
                filter: 'blur(10px)'
              }}
              animate={{ 
                opacity: 1,
                y: 0,
                scale: 1,
                filter: 'blur(0px)'
              }}
              exit={{
                opacity: 0,
                y: 60,
                scale: 0.85,
                filter: 'blur(10px)'
              }}
              transition={{
                type: 'easeInOut',
                duration: 0.2
              }}
            >
              <div className='items-center hidden sm:flex gap-x-2'>
                <div className='ml-4 w-max gap-x-1 px-1.5 py-0.5 min-w-[18px] min-h-[18px] font-medium flex items-center justify-center text-white bg-purple-600 rounded-lg'>
                  <HiCursorClick size={16} />            
                  {selectedIndexes.length} Selected
                </div>

                <button
                  className='flex items-center text-sm hover:bg-purple-600 hover:text-white transition-all gap-x-2 hover:ring-purple-500 text-primary px-2.5 py-0.5 rounded-lg'
                  onClick={() => setSelectedIndexes([])}
                >
                  Clear
                </button>
              </div>

              <div className='sm:mr-2 w-full grid grid-cols-1 mobile:grid-cols-2 sm:flex items-center sm:justify-end justify-center text-tertiary gap-1.5'>                
                {(currentTabData.actions && currentTabData.actions.length > 0) && (
                  currentTabData.actions?.map((action, index) => {
                    const Trigger = action.trigger || 'div';

                    return (
                      <Trigger
                        key={`action-${index}`}
                        {...action.triggerProps}
                        className='flex w-full sm:w-[unset]'
                      >
                        <button
                          className={cn(
                            'flex w-full flex-1 sm:flex-[unset] justify-center sm:w-max items-center text-sm hover:bg-tertiary transition-all gap-x-2 hover:ring-purple-500 ring-2 ring-[rgba(var(--bg-secondary))] text-primary bg-quaternary px-2.5 py-1.5 rounded-xl',
                            typeof action.hide === 'function' ? action.hide?.(selectedIndexes) : action.hide === true && 'hidden'
                          )}
                          onClick={() => action.action?.(selectedIndexes)}
                        >
                          {action.icon && <action.icon size={16} className='text-tertiary' />}
                          {action.name}
                        </button>
                      </Trigger>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}