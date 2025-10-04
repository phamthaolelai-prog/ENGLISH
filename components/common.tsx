
import React from 'react';
import type { ToastState } from '../types';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'next';
  isPressed?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, variant = 'default', isPressed = false, className, ...props }) => {
  const baseClasses = "w-14 h-14 rounded-2xl border border-slate-200 grid place-items-center transition-transform duration-75 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none";
  const variantClasses = {
    default: "bg-white text-slate-800",
    next: "bg-violet-600 text-white border-none",
  };
  const pressedClasses = isPressed ? "ring-4 ring-blue-200 bg-blue-100" : "";

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${pressedClasses} ${className}`} aria-pressed={isPressed} {...props}>
      {children}
    </button>
  );
};

interface ScoreBarProps {
  score: number;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ score }) => (
  <div className="grid grid-cols-10 gap-1 items-end">
    {Array.from({ length: 10 }).map((_, i) => (
      <div
        key={i}
        className={`rounded-sm ${i < score ? 'bg-gradient-to-t from-blue-500 to-blue-300' : 'bg-slate-200'}`}
        style={{ height: `${6 + (i + 1) * 2}px` }}
      />
    ))}
  </div>
);

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.visible) return null;

  const styles = {
    ok: "bg-green-50 border border-green-300 text-green-800",
    warn: "bg-amber-50 border border-amber-300 text-amber-800",
    bad: "bg-red-50 border border-red-300 text-red-800",
  };

  return (
    <div className={`p-3 rounded-xl text-sm mt-2.5 ${styles[toast.type]}`}>
      {toast.message}
    </div>
  );
};

interface ChipProps {
    children: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({ children }) => (
    <span className="bg-blue-100 border border-blue-200 text-slate-800 py-1.5 px-3 rounded-full text-xs font-medium">
        {children}
    </span>
);
