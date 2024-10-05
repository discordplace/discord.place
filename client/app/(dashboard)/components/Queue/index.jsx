import Table from '@/app/(dashboard)/components/Table';

export default function Queue({ title, subtitle, totalCount, actionButton, tableData }) {
  return (
    <div className="flex flex-col my-8 sm:mr-6 gap-y-8">
      <div className="flex flex-col justify-between gap-y-4 sm:items-center sm:flex-row">
        <div className="flex flex-col gap-y-1.5">
          <h1 className="flex items-center text-2xl font-semibold gap-x-2">
            {title}
          
            <span className="text-base font-normal text-tertiary">
              {totalCount}
            </span>
          </h1>

          <p className="text-sm text-tertiary">
            {subtitle}
          </p>
        </div>

        {typeof actionButton === 'object' && !actionButton.hide && (
          <button
            className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg hover:bg-tertiary bg-quaternary gap-x-2"
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