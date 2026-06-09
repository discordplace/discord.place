import { MdOpenInNew } from 'react-icons/md';
import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import Link from 'next/link';
export default function BlockItem({ id, name, icon, href, onClick, badge, disabled, condition, visited = true }) {
  const isCollapsed = useAccountStore(state => state.isCollapsed);
  const activeTab = useAccountStore(state => state.activeTab);
  const setActiveTab = useAccountStore(state => state.setActiveTab);
  const loading = useAccountStore(state => state.loading);

  const IconComponent = icon;
  const ContainerComponent = href ? Link : (onClick ? 'button' : 'div');
  const TooltipContainer = isCollapsed ? Tooltip : 'div';

  if (condition && !condition()) {
    return null;
  }

  if (id.startsWith('divider-')) {
    return (
      <div className='my-2 h-px w-full bg-quaternary' />
    );
  }

  return (
    <TooltipContainer
      content={`${name}${badge ? ` (${badge})` : ''}`}
      side='right'
    >
      <ContainerComponent
        className={cn(
          'flex w-full items-center gap-x-3 rounded-lg py-2 select-none',
          activeTab === id ? 'pointer-events-none bg-quaternary text-primary' : 'cursor-pointer text-secondary hover:bg-quaternary hover:text-primary',
          badge > 0 && 'hover:bg-tertiary hover:bg-linear-to-l hover:from-purple-600/20',
          activeTab === id && badge > 0 && 'bg-tertiary bg-linear-to-l from-purple-600/20',
          isCollapsed ? 'justify-center' : 'pl-4',
          disabled && 'pointer-events-none opacity-50',
          loading && 'pointer-events-none'
        )}
        key={id}
        onClick={() => (onClick ? onClick() : !href && setActiveTab(id))}
        href={href}
        target='_blank'
      >
        <IconComponent className='size-4' />

        <span
          className={cn(
            'truncate font-medium',
            isCollapsed ? 'hidden' : 'block'
          )}
        >
          {name}
        </span>

        {!isCollapsed && href ? (
          <MdOpenInNew className='mr-4 ml-auto size-4 text-tertiary' />
        ) : ''}

        {visited && !isCollapsed && badge ? (
          <span className='mr-4 ml-auto rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white'>
            {badge}
          </span>
        ) : ''}

        {!visited && !isCollapsed && (
          <span className='mr-4 ml-auto rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white'>
            {t('accountPage.sidebar.newBadge')}
          </span>
        )}
      </ContainerComponent>
    </TooltipContainer>
  );
}