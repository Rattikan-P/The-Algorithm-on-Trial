import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon, Eye, Check } from 'lucide-react';

export function useInactivityHint(delayMs = 60000) {
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const schedule = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowHint(false);
    timerRef.current = setTimeout(() => setShowHint(true), delayMs);
  };

  useEffect(() => {
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { showHint, schedule };
}

interface ClueMarkerProps {
  icon: LucideIcon;
  label: string;
  style: React.CSSProperties;
  onClick: () => void;
  discovered: boolean;
  showHint: boolean;
}

export const ClueMarker: React.FC<ClueMarkerProps> = ({
  icon: Icon,
  label,
  style,
  onClick,
  discovered,
  showHint,
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      style={style}
      className={`group absolute flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors duration-150 backdrop-blur-[1px] ${
        discovered
          ? 'border-slate-600/70 bg-slate-900/80 text-slate-400 hover:border-slate-400 hover:bg-slate-800/90 hover:text-slate-200'
          : 'border-amber-400/80 bg-amber-500/20 text-amber-200 shadow-[0_0_16px_rgba(245,158,11,0.4)] hover:border-amber-300 hover:bg-amber-500/35 hover:shadow-[0_0_25px_rgba(245,158,11,0.8)]'
      }`}
      whileHover={{ scale: discovered ? 1.05 : 1.08 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
    >
      <Icon
        className={`h-5 w-5 transition ${
          discovered ? 'text-slate-400 group-hover:text-slate-200' : 'text-amber-200 group-hover:text-amber-100'
        }`}
      />
      {discovered ? (
        <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 border border-slate-600 text-emerald-400 shadow-sm">
          <Check className="h-2.5 w-2.5" />
        </span>
      ) : (
        <span className="pointer-events-none absolute -right-1 -top-1 opacity-0 transition group-hover:opacity-100">
          <Eye className="h-4 w-4 text-amber-300" />
        </span>
      )}
      <span className="pointer-events-none absolute top-full mt-2 whitespace-nowrap rounded bg-slate-900/95 px-2 py-1 text-[10px] text-slate-200 border border-slate-700 opacity-0 transition group-hover:opacity-100 shadow-lg">
        {discovered ? `✓ ${label} (Inspected)` : label}
      </span>
      {showHint && !discovered && (
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full border-2 border-amber-400"
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.25, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

interface RoomCanvasProps {
  image: string;
  alt: string;
  children: React.ReactNode;
  extras?: React.ReactNode;
}

export const RoomCanvas: React.FC<RoomCanvasProps> = ({
  image,
  alt,
  children,
  extras,
}) => {
  return (
    <div className="relative mx-auto h-[540px] max-w-5xl overflow-hidden rounded-xl border border-amber-900/40 shadow-[0_0_60px_rgba(245,158,11,0.12)]">
      <img
        src={image}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Center ambient lighting */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-full w-2/3 -translate-x-1/2"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(245,158,11,0.18) 0%, transparent 65%)',
        }}
      />
      {/* Vignette gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/40" />
      {extras}
      {children}
    </div>
  );
};
