import Table from '@/app/(dashboard)/components/Table';

export default function Queue({ actionButton, subtitle, tableData, title, totalCount }) {
  return (
    <div className='my-8 flex flex-col gap-y-8 sm:mr-6'>
      <div className='flex flex-col justify-between gap-y-4 sm:flex-row sm:items-center'>
        <div className='flex flex-col gap-y-1.5'>
          <h1 className='flex items-center gap-x-2 text-2xl font-semibold'>
            {title}

            <span className='text-base font-normal text-tertiary'>
              {totalCount}
            </span>
          </h1>

          <p className='text-sm text-tertiary'>
            {subtitle}
          </p>
        </div>

        {typeof actionButton === 'object' && !actionButton.hide && (
          <button
            className='flex items-center gap-x-2 rounded-lg bg-quaternary px-4 py-2 text-sm font-semibold hover:bg-tertiary'
            onClick={actionButton.action}
          >
            {actionButton.name}

            <actionButton.icon size={16} />
          </button>
        )}
      </div>

      <Table {...tableData} />
    </div>
  );
}