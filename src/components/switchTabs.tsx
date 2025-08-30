'use client';

import React, { useState } from 'react';

interface SwitchTabsProps {
  onTabChange?: (tab: 'orders' | 'create') => void;
}

const SwitchTabs: React.FC<SwitchTabsProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'create'>('orders');

  const handleTabClick = (tab: 'orders' | 'create') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  return (
    <div className="flex pb-4 rounded-xl w-full gap-4">
      <button
        className={`flex-1 h-14 rounded-xl text-lg font-semibold transition-colors duration-200 ${
          activeTab === 'orders'
            ? 'bg-[#0019FF] text-white'
            : 'bg-white text-gray-600'
        }`}
        onClick={() => handleTabClick('orders')}
      >
        Procurar Trocas
      </button>
      <button
        className={`flex-1 h-14 rounded-xl text-lg font-semibold transition-colors duration-200 ${
          activeTab === 'create'
            ? 'bg-[#0019FF] text-white'
            : 'bg-white text-gray-600'
        }`}
        onClick={() => handleTabClick('create')}
      >
        Publicar Troca
      </button>
    </div>
  );
};

export default SwitchTabs;
