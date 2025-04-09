'use client';

import { PiSortAscendingBold, PiSortDescendingBold, IoSearch, FiX, FaBookBookmark, FaXmark, FaCheck, BsEmojiAngry } from '@/icons';
import ColumnRenderer from '@/app/(dashboard)/components/Table/ColumnRenderer';
import cn from '@/lib/cn';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import useDashboardStore from '@/stores/dashboard';
import { useEffect, useRef, useState } from 'react';
import ErrorState from '@/app/components/ErrorState';
import Pagination from '@/app/components/Pagination';
import sortColumns from '@/app/(dashboard)/components/Table/sortColumns';
import isEqual from 'lodash/isEqual';
import * as chrono from 'chrono-node';
import { useMedia } from 'react-use';
import Drawer from '@/app/components/Drawer';
import { useShallow } from 'zustand/react/shallow';

export default function Table({ tabs }) {
  const { selectedItems, setSelectedItems, page, setPage, currentSort, setCurrentSort } = useDashboardStore(useShallow(state => ({
    selectedItems: state.selectedItems,
    setSelectedItems: state.setSelectedItems,
    page: state.page,
    setPage: state.setPage,
    currentSort: state.currentSort,
    setCurrentSort: state.setCurrentSort
  })));

  function handleSelect(item) {
    if (selectedItems.find(column => isEqual(column, item))) setSelectedItems(selectedItems.filter(selectedRow => !isEqual(selectedRow, item)));
    else setSelectedItems([...selectedItems, item]);
  }

  const [currentTab, setCurrentTab] = useState(tabs[0].label);
  const currentTabData = tabs.find(tab => tab.label === currentTab);

  useEffect(() => {
    setSelectedItems([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab, currentSort]);

  const [currentlySearching, setCurrentlySearching] = useState(false);
  const searchQuery = useDashboardStore(state => state.searchQuery);
  const setSearchQuery = useDashboardStore(state => state.setSearchQuery);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchQuery) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const isMobile = useMedia('(max-width: 640px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSelectedAction] = useState(null);

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

  const deepCopiedColumns = JSON.parse(JSON.stringify(filteredColumns));

  const sortedColumns = deepCopiedColumns
    .sort((a, b) => sortColumns(currentSort.key, currentSort.order, [a, b]));

  // Paginate columns
  const displayedColumns = sortedColumns.slice((page - 1) * 10, page * 10);

  const showPagination = deepCopiedColumns.length > 10;

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
          className='flex items-center gap-x-1.5 rounded-full border border-primary bg-secondary py-0.5 pl-1.5 pr-2 text-xs text-secondary hover:bg-quaternary'
          onClick={() => setCurrentSort({ name: '', key: '', order: '' })}
        >
          {CurrentSortIcon && <CurrentSortIcon size={14} />}

          {currentSort.name || 'None'}

          <FiX size={14} />
        </button>
      </div>

      <div className='flex flex-wrap gap-x-4 gap-y-2 border-b-primary pb-5 sm:flex-nowrap sm:overflow-hidden sm:border-b'>
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

            <span className='flex h-4 w-max items-center justify-center rounded-full bg-quaternary px-1.5 text-xs text-primary sm:bg-quaternary'>
              {currentTab === tab.label ? deepCopiedColumns.length : tab.columns.length}
            </span>

            {currentTab === tab.label && (
              <motion.div
                layoutId='emojisQueueCurrentTabIndicator'
                className='absolute bottom-[-52.5px] left-0 hidden h-[35px] w-full rounded-lg bg-black dark:bg-white sm:block'
              />
            )}
          </div>
        ))}

        {hasSearchableColumns && (
          <div
            className={cn(
              'select-none relative z-10 w-full sm:w-max justify-center flex-row flex items-center font-medium text-sm sm:text-xs text-tertiary gap-x-1.5 bg-secondary sm:bg-tertiary hover:text-primary transition-colors sm:transition-none sm:hover:bg-quaternary rounded-lg sm:rounded-full py-1.5 sm:py-1 px-2.5',
              currentlySearching ? 'cursor-text' : 'cursor-pointer',
              isMobile && currentlySearching && 'transition-none bg-transparent ring-2 ring-[rgba(var(--border-primary))] [&:has(input:is(:focus-visible))]:ring-purple-500'
            )}
            onClick={() => {
              if (currentlySearching) {
                searchInputRef.current.focus();
              } else setCurrentlySearching(true);
            }}
          >
            {isMobile ? (
              currentlySearching ? (
                <div className='relative flex w-full items-center'>
                  <input
                    type='text'
                    className='peer w-full bg-transparent pl-5 text-secondary outline-none placeholder:text-[rgba(var(--text-tertiary))] focus-visible:text-primary sm:w-36'
                    placeholder='Search anything...'
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    autoFocus
                    ref={searchInputRef}
                  />

                  <IoSearch className='absolute left-0 text-tertiary' />

                  <button
                    className='flex items-center text-lg text-tertiary hover:text-primary'
                    onClick={() => {
                      setSearchQuery(null);
                      setCurrentlySearching(false);
                    }}
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <>
                  Search

                  <IoSearch />
                </>
              )
            ) : (
              <>
                <IoSearch />

                {currentlySearching ? (
                  <input
                    type='text'
                    className='w-24 bg-transparent text-secondary outline-none sm:w-36'
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
                    className='flex items-center text-xs text-tertiary transition-colors hover:text-primary'
                    onClick={() => {
                      setSearchQuery(null);
                      setCurrentlySearching(false);
                    }}
                  >
                    <FiX />
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className='relative -mt-8 w-full max-w-[230px] overflow-auto mobile:max-w-[360px] sm:max-w-[430px] lg:max-w-[unset]'>
        {(currentTabData.columns.length === 0 || displayedColumns.length === 0) && (
          <div className='flex min-h-[calc(100svh_-_420px)] max-w-[calc(100vw_-_65px)] items-center justify-center sm:max-w-[unset]'>
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
            <thead className='relative select-none text-left'>
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
                    <div className='flex items-center gap-x-2 text-xs font-bold uppercase'>
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
                className='group text-sm text-secondary'
                key={`column-${columnIndex}`}
              >
                {currentTabData.rows?.map((_, rowIndex) => (
                  <td
                    key={`row-${rowIndex}`}
                    className={cn(
                      'p-2 min-w-[300px] sm:min-w-[unset] h-[60px] border-y border-[rgba(var(--bg-tertiary))] transition-colors group-hover:cursor-pointer',
                      selectedItems.find(col => isEqual(col, column)) ? 'bg-tertiary border-[rgba(var(--bg-quaternary))] select-none' : 'group-hover:bg-secondary'
                    )}
                    onClick={() => handleSelect(column)}
                  >
                    <div
                      className='flex items-center gap-x-2'
                    >
                      {rowIndex === 0 && (
                        <div
                          className='group flex cursor-pointer items-center gap-x-2'
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
        <div className='flex w-full justify-center'>
          <Pagination
            page={page}
            totalPages={Math.ceil(deepCopiedColumns?.length / 10)}
            setPage={setPage}
            loading={false}
            total={deepCopiedColumns?.length}
            limit={10}
            disableAnimation
          />
        </div>
      )}

      <div className='flex items-center justify-center'>
        <AnimatePresence>
          {(isMobile && selectedItems.length > 0) && (
            <>
              <motion.button
                className='fixed bottom-8 right-6 flex items-center gap-x-2 rounded-full bg-tertiary px-4 py-2 text-sm font-medium text-secondary transition-colors'
                onClick={() => setDrawerOpen(true)}
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
              >
                <FaBookBookmark size={14} />
                Actions
              </motion.button>

              <Drawer
                openState={drawerOpen}
                setOpenState={setDrawerOpen}
                state={mobileSelectedAction}
                preventDefault={true}
                setState={value => {
                  if (value.trigger) return;

                  value.action(selectedItems);

                  setDrawerOpen(false);
                }}
                items={currentTabData.actions.map(action => {
                  const Trigger = action.trigger || 'div';

                  return (
                    {
                      label: (
                        <Trigger {...action.triggerProps}>
                          <div className='flex w-full items-center gap-x-2'>
                            {action.icon && <action.icon size={16} />}
                            {action.name}
                          </div>
                        </Trigger>
                      ),
                      value: action
                    }
                  );
                })}
              />
            </>
          )}

          {(!isMobile && selectedItems.length > 0) && (
            <motion.div
              className='fixed bottom-8 z-10 flex h-[50px] w-max items-center gap-x-4 rounded-2xl border-2 border-primary bg-secondary p-3 text-sm font-medium shadow-[rgba(var(--bg-secondary))]'
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
              <div className='rounded-lg border border-purple-500 p-1 text-purple-500 shadow-lg shadow-purple-500/30'>
                <FaCheck size={12} />
              </div>

              <span className='gap-x-1 border-r border-primary py-1 pr-4'>
                {selectedItems.length} Items
              </span>

              {currentTabData.actions?.map((action, index) => {
                const Trigger = action.trigger || 'div';

                return (
                  <Trigger
                    key={`action-${index}`}
                    {...action.triggerProps}
                    className={cn(
                      'flex items-center gap-x-2',
                      index !== currentTabData.actions.length - 1 && 'border-r border-primary pr-4'
                    )}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-x-2 text-sm text-tertiary hover:text-primary hover:bg-quaternary transition-all px-3 py-1.5 rounded-xl',
                        typeof action.hide === 'function' ? action.hide?.(selectedItems) : action.hide === true && 'hidden'
                      )}
                      onClick={() => action.action?.(selectedItems)}
                    >
                      {action.icon && <action.icon size={16} />}
                      {action.name}
                    </button>
                  </Trigger>
                );
              })}

              <button
                className='rounded-lg border border-[rgba(var(--bg-quaternary))] bg-quaternary p-1 hover:bg-tertiary'
                onClick={() => setSelectedItems([])}
              >
                <FaXmark size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}