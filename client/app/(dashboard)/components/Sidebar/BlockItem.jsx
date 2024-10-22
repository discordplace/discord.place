import Tooltip from '@/app/components/Tooltip';
import cn from '@/lib/cn';
import useDashboardStore from '@/stores/dashboard';
import Link from 'next/link';

export default function BlockItem({ id, name, icon, href, onClick, badge, disabled }) {
  const isCollapsed = useDashboardStore(state => state.isCollapsed);
  const activeTab = useDashboardStore(state => state.activeTab);
  const setActiveTab = useDashboardStore(state => state.setActiveTab);
  const loading = useDashboardStore(state => state.loading);

  const IconComponent = icon;
  const ContainerComponent = href ? Link : onClick ? 'button' : 'div';
  const TooltipContainer = isCollapsed ? Tooltip : 'div';

  return (
    <TooltipContainer
      content={`${name}${badge ? ` (${badge})` : ''}`}
      side='right'
    >
      <ContainerComponent
        className={cn(
          'flex items-center w-full py-2 rounded-lg gap-x-3 select-none',
          activeTab === id ? 'bg-quaternary text-primary pointer-events-none' : 'cursor-pointer hover:bg-quaternary text-secondary hover:text-primary',
          badge > 0 && 'hover:bg-tertiary hover:bg-gradient-to-l hover:from-red-600/20',
          activeTab === id && badge > 0 && 'bg-tertiary bg-gradient-to-l from-red-600/20',
          isCollapsed ? 'justify-center' : 'pl-4',
          disabled && 'opacity-50 pointer-events-none',
          loading && 'pointer-events-none'
        )}
        key={id}
        onClick={() => onClick ? onClick() : !href && setActiveTab(id)}
        href={href}
        target='_blank'
      >
        <IconComponent className='size-4' />

        <span
          className={cn(
            'font-medium',
            isCollapsed ? 'hidden' : 'block'
          )}
        >
          {name}
        </span>

        {!isCollapsed && badge ? (
          <span className='ml-auto mr-4 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white'>
            {badge}
          </span>
        ) : ''}
      </ContainerComponent>
    </TooltipContainer>
  );
}