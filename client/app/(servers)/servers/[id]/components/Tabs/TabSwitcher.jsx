import { motion } from 'framer-motion';
import cn from '@/lib/cn';

export default function TabSwitcher({ tab, activeTab, setActiveTab }) {
  return (
    <div 
      className='relative cursor-pointer select-none group'
      onClick={() => !tab.disabled && setActiveTab(tab.id)}
    >
      <div className={cn(
        'px-4 py-2 font-semibold text-sm z-10 relative transition-colors',
        activeTab === tab.id ? 'text-white dark:text-black duration-500' : 'group-hover:text-tertiary',
        tab.disabled && 'opacity-50 cursor-not-allowed group-hover:text-primary'
      )}>
        {tab.label}
      </div>

      {activeTab === tab.id && (
        <motion.div
          layoutId='tabIndicator'
          className='absolute bottom-0 left-0 w-full h-full bg-black rounded-full pointer-events-none dark:bg-white'
        />
      )}
    </div>
  );
}