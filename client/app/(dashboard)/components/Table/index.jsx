'use client';

import ColumnRenderer from '@/app/(dashboard)/components/Table/ColumnRenderer';
import { FaCheck } from 'react-icons/fa';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import useDashboardStore from '@/stores/dashboard';
import { useEffect, useRef, useState } from 'react';
import ErrorState from '@/app/components/ErrorState';
import { BsEmojiAngry } from 'react-icons/bs';
import { HiCursorClick } from 'react-icons/hi';
import Pagination from '@/app/components/Pagination';
import { PiSortAscendingBold, PiSortDescendingBold } from 'react-icons/pi';
import sortColumns from '@/app/(dashboard)/components/Table/sortColumns';
import { FiX } from 'react-icons/fi';
import { isEqual } from 'lodash';
import { IoSearch } from 'react-icons/io5';
import * as chrono from 'chrono-node';

export default function Table({ tabs }) {
  const selectedItems = useDashboardStore(state => state.selectedItems);
  const setSelectedItems = useDashboardStore(state => state.setSelectedItems);
  
  function handleSelect(item) {
    if (selectedItems.find(column => isEqual(column, item))) setSelectedItems(selectedItems.filter(selectedRow => !isEqual(selectedRow, item)));
    else setSelectedItems([...selectedItems, item]);
  }

  const [currentTab, setCurrentTab] = useState(tabs[0].label);
  const currentTabData = tabs.find(tab => tab.label === currentTab);

  const [page, setPage] = useState(1);
  const [currentSort, setCurrentSort] = useState({ name: '', key: '', order: '' });

  useEffect(() => {
    setSelectedItems([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, currentSort]);
  
  const [currentlySearching, setCurrentlySearching] = useState(false);
  const searchQuery = useDashboardStore(state => state.searchQuery);
  const setSearchQuery = useDashboardStore(state => state.setSearchQuery);
  const searchInputRef = useRef(null);

  if (!currentTabData || !currentTabData.columns) return null;

  const hasSearchableColumns = currentTabData.columns.some(column => column.some(({ searchValues, type }) => type === 'date' || Array.isArray(searchValues)));

  const filteredColumns = currentTabData.columns
    .filter(column => {
      if (!searchQuery) return true;
      return column.filter(({ searchValues, type }) => type === 'date' || Array.isArray(searchValues)).some(({ searchValues, type, value }) => {
        if (type === 'date') {
          const parsedDate = chrono.parseDate(searchQuery);
          if (!parsedDate) return false;

          return new Date(value).getTime() >= parsedDate.getTime();
        }

        return searchValues.some(value => String(value).toLowerCase().includes(searchQuery.toLowerCase()));
      });
    });

  const sortedColumns = filteredColumns
    .toSorted((a, b) => sortColumns(currentSort.key, currentSort.order, [a, b]));

  // Paginate columns
  const displayedColumns = sortedColumns.slice((page - 1) * 10, page * 10);

  const showPagination = filteredColumns.length > 10;

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

            <span className='flex items-center justify-center w-max px-1.5 h-4 text-xs rounded-full bg-quaternary sm:bg-quaternary text-primary'>
              {currentTab === tab.label ? filteredColumns.length : tab.columns.length}
            </span>

            {currentTab === tab.label && (
              <motion.div
                layoutId='emojisQueueCurrentTabIndicator'
                className='sm:block hidden absolute w-full rounded-lg left-0 h-[35px] bg-black dark:bg-white -bottom-[52.5px]'
              />
            )}
          </div>
        ))}

        {hasSearchableColumns && (
          <div
            className={cn(
              'select-none relative z-10 flex items-center font-medium text-xs text-tertiary gap-x-1.5 bg-tertiary hover:text-primary hover:bg-quaternary rounded-full py-1 px-2.5',
              currentlySearching ? 'cursor-text' : 'cursor-pointer'
            )}
            onClick={() => {
              if (currentlySearching) {
                searchInputRef.current.focus();
              } else setCurrentlySearching(true);
            }}
          >
            <IoSearch />
            
            {currentlySearching ? (
              <input
                type='text'
                className='w-24 bg-transparent outline-none sm:w-36 text-secondary'
                placeholder='Search anything...'
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                autoFocus
                ref={searchInputRef}
              />
            ) : (
              'Search'
            )}

            {currentlySearching && (
              <button
                className='flex items-center text-xs transition-colors text-tertiary hover:text-primary'
                onClick={() => {
                  setSearchQuery(null);
                  setCurrentlySearching(false);
                }}
              >
                <FiX />
              </button>
            )}
          </div>
        )}
      </div>

      <div className='relative w-full -mt-8 overflow-auto lg:max-w-[unset] max-w-[230px] mobile:max-w-[360px] sm:max-w-[430px]'>
        {(currentTabData.columns.length === 0 || displayedColumns.length === 0) && (
          <div className='flex items-center max-w-[calc(100vw_-_65px)] sm:max-w-[unset] justify-center min-h-[calc(100dvh_-_420px)]'>
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
          {displayedColumns.length > 0 && (
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
                      selectedItems.find(col => isEqual(col, column)) ? 'bg-tertiary border-[rgba(var(--bg-quaternary))] select-none' : 'group-hover:bg-secondary'
                    )}
                    onClick={() => handleSelect(column)}
                  >
                    <div
                      className='flex items-center gap-x-2'
                    >
                      {rowIndex === 0 && (
                        <div 
                          className='flex items-center cursor-pointer gap-x-2 group'
                          onClick={() => handleSelect(column)}
                        >
                          <button
                            className={cn(
                              'w-[18px] h-[18px] flex justify-center items-center border-2 outline-none hover:bg-[rgba(var(--border-primary))] transition-colors border-primary rounded-md',
                              selectedItems.find(col => isEqual(col, column)) && 'bg-purple-500 hover:bg-purple-500 text-white'
                            )}
                          >
                            <FaCheck
                              size={10} 
                              className={cn(
                                'transition-opacity opacity-0',
                                selectedItems.find(col => isEqual(col, column)) && 'opacity-100'
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
            totalPages={Math.ceil(filteredColumns?.length / 10)}
            setPage={setPage}
            loading={false}
            total={filteredColumns?.length}
            limit={10}
            disableAnimation
          />
        </div>
      )}
      
      <div className='flex items-center justify-center'>
        <AnimatePresence>
          {selectedItems.length > 0 && (
            <motion.div
              className='left-8 px-2 py-2 sm:p-[unset] sm:left-[unset] z-[10] font-medium text-sm gap-x-2 fixed bottom-8 rounded-2xl flex items-center border-2 border-primary w-full max-w-[calc(100%_-_40px)] sm:min-w-[500px] sm:w-max h-max sm:h-[50px] bg-secondary'
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
                  {selectedItems.length} Selected
                </div>

                <button
                  className='flex items-center text-sm hover:bg-purple-600 hover:text-white transition-all gap-x-2 hover:ring-purple-500 text-primary px-2.5 py-0.5 rounded-lg'
                  onClick={() => setSelectedItems([])}
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
                            typeof action.hide === 'function' ? action.hide?.(selectedItems) : action.hide === true && 'hidden'
                          )}
                          onClick={() => action.action?.(selectedItems)}
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