import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export default function DenyDropdown({ description, reasons, onDeny, children }) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className='z-10 flex flex-col p-2 mt-2 border outline-none min-w-[200px] bg-secondary rounded-xl border-primary gap-y-1'>
          <div className='flex flex-col m-2 gap-y-1'>
            <h2 className='text-lg font-semibold text-primary'>
              Reason
            </h2>
            <p className='text-sm text-tertiary'>
              {description}
            </p>
          </div>

          <div className='w-full h-[1px] bg-quaternary' />

          {Object.entries(reasons).map(([key, value]) => (
            <DropdownMenu.Item 
              key={key}
              className='flex text-secondary items-center justify-between px-2 py-1.5 font-medium rounded-lg outline-none cursor-pointer hover:bg-quaternary text-sm gap-x-2'
              onSelect={() => onDeny(key)}
            >
              {value.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}