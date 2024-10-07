import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import useAccountStore from '@/stores/account';
import { t } from '@/stores/language';
import Link from 'next/link';
import { MdOpenInNew } from 'react-icons/md';

export default function BlockItem({ id, name, icon, href, onClick, badge, disabled, condition, visited = true }) {
  const isCollapsed = useAccountStore(state => state.isCollapsed);
  const activeTab = useAccountStore(state => state.activeTab);
  const setActiveTab = useAccountStore(state => state.setActiveTab);
  const loading = useAccountStore(state => state.loading);
 
  const IconComponent = icon;
  const ContainerComponent = href ? Link : onClick ? 'button' : 'div';
  const TooltipContainer = isCollapsed ? Tooltip : 'div';

  if (condition && !condition()) {
    return null;
  }

  if (id.startsWith('divider-')) {
    return (
      <div className='w-full h-px my-2 bg-quaternary' />
    );
  }

  return (
    <TooltipContainer
      content={`${name}${badge ? ` (${badge})` : ''}`}
      side='right'
    >
      <ContainerComponent
        className={cn(
          'flex items-center w-full py-2 rounded-lg gap-x-3 select-none',
          activeTab === id ? 'bg-quaternary text-primary pointer-events-none' : 'cursor-pointer hover:bg-quaternary text-secondary hover:text-primary',
          badge > 0 && 'hover:bg-tertiary hover:bg-gradient-to-l hover:from-purple-600/20',
          activeTab === id && badge > 0 && 'bg-tertiary bg-gradient-to-l from-purple-600/20',
          isCollapsed ? 'justify-center' : 'pl-4',
          disabled && 'opacity-50 pointer-events-none',
          loading && 'pointer-events-none'
        )}
        key={id}
        onClick={() => onClick ? onClick() : !href && setActiveTab(id)}
        href={href}
        target='_blank'
      >
        <IconComponent className='w-4 h-4' />

        <span
          className={cn(
            'font-medium truncate',
            isCollapsed ? 'hidden' : 'block'
          )}
        >
          {name}
        </span>

        {!isCollapsed && href ? (
          <MdOpenInNew className='w-4 h-4 ml-auto mr-4 text-tertiary' />
        ) : ''}

        {visited && !isCollapsed && badge ? (
          <span className='text-white ml-auto mr-4 px-2 py-0.5 text-xs font-bold bg-purple-600 rounded-full'>
            {badge}
          </span>
        ) : ''}

        {!visited && !isCollapsed && (
          <span className='text-white ml-auto mr-4 px-2 py-0.5 text-xs font-bold bg-purple-600 rounded-full'>
            {t('accountPage.sidebar.newBadge')}
          </span>
        )}
      </ContainerComponent>
    </TooltipContainer>
  );
}