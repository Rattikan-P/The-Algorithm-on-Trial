import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WindowHeaderProps {
  title: string;
  icon?: LucideIcon;
  accent?: string;
}

export const WindowHeader: React.FC<WindowHeaderProps> = ({
  title,
  icon: Icon,
  accent = '#f99d33',
}) => {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 bg-[#2a2a2a] px-3 py-2">
      <div className="flex gap-1.5">
        <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        {Icon && <Icon className="h-3.5 w-3.5" style={{ color: accent }} />}
        <span>{title}</span>
      </div>
    </div>
  );
};
