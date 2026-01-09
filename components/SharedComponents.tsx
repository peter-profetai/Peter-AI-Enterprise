import React, { useEffect } from 'react';
import { LucideIcon, ChevronRight, X } from 'lucide-react';

// --- Badges & Tags ---
// Spec: Dark Mode uses high brightness text on low opacity background
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = status.toLowerCase();
  let classes = 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-text-medium';

  if (['active', 'completed', 'success', 'done', '已解決'].includes(s)) {
    classes = 'bg-[#d4edda] text-[#155724] dark:bg-success-darkBg dark:text-success-dark'; // Success
  } else if (['running', 'processing', 'in progress', '進行中', 'active'].includes(s)) {
    classes = 'bg-[#EAF6F5] text-[#28AAA0] dark:bg-primary-glow dark:text-primary'; // Brand/Processing
  } else if (['pending', 'waiting'].includes(s)) {
    classes = 'bg-[#fff3cd] text-[#856404] dark:bg-warning-darkBg dark:text-warning-dark'; // Warning
  } else if (['failed', 'error', 'inactive', 'stopped'].includes(s)) {
    classes = 'bg-[#f8d7da] text-[#721c24] dark:bg-error-darkBg dark:text-error-dark'; // Error
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold leading-4 ${classes}`}>
      {status}
    </span>
  );
};

// --- Buttons ---
// Spec: Primary #28AAA0 (Brightness hover), Secondary Transparent+Border, Disabled Opacity
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  className = '',
  isLoading = false,
  disabled,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded transition-all focus:outline-none focus:ring-0 disabled:cursor-not-allowed";
  
  let variantClasses = "";
  switch (variant) {
    case 'primary':
      // Dark Mode: No shadow, Brightness hover
      variantClasses = "bg-primary hover:bg-primary-dark text-white shadow-sm dark:shadow-none dark:hover:brightness-110 disabled:opacity-50";
      break;
    case 'secondary':
      // Dark Mode: Transparent bg, Lighter border (#444), Text #E0E0E0
      variantClasses = "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm dark:bg-transparent dark:border-borderColor-dark-light dark:text-gray-200 dark:hover:bg-surface-3 dark:shadow-none disabled:border-gray-700 disabled:text-gray-600";
      break;
    case 'danger':
      variantClasses = "bg-error hover:bg-red-700 text-white shadow-sm dark:bg-error-dark dark:text-black dark:hover:bg-opacity-90";
      break;
    case 'ghost':
      variantClasses = "bg-transparent text-gray-600 hover:bg-gray-100 dark:text-text-medium dark:hover:bg-surface-3 dark:hover:text-text-high";
      break;
  }

  if (disabled) {
      variantClasses += " opacity-50 dark:opacity-30";
  }

  return (
    <button 
      className={`${baseClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
      {!isLoading && Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

// --- Cards ---
// Spec: Dark Mode L1 (#1E1E1E) + 1px Border (#333)
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = '', title, action }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-l1 transition-shadow duration-300 overflow-hidden dark:bg-surface-1 dark:border-borderColor-dark dark:hover:shadow-none ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white dark:bg-surface-1 dark:border-borderColor-dark">
        {title && <h3 className="font-bold text-gray-800 text-lg dark:text-text-high">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

// --- Inputs ---
// Spec: Dark Mode Bg Base (#121212), Border Lighter (#444), Focus Glow
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }> = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-semibold text-gray-700 dark:text-text-high">{label}</label>}
    <input 
      className={`px-3 py-2 border rounded-lg transition-all outline-none text-sm
        dark:bg-surface-base dark:text-text-high dark:placeholder-text-disable
        ${error 
          ? 'border-error focus:ring-2 focus:ring-error/20 dark:border-error-dark dark:focus:shadow-[0_0_4px_rgba(255,138,128,0.4)]' 
          : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-borderColor-dark-light dark:focus:border-primary dark:focus:ring-0 dark:focus:shadow-glow'
        } ${className}`}
      {...props} 
    />
    {error && <span className="text-xs text-error dark:text-error-dark">{error}</span>}
  </div>
);

// --- Breadcrumbs ---
export const Breadcrumbs: React.FC<{ items: { label: string, path?: string }[] }> = ({ items }) => (
  <nav className="flex items-center gap-2 text-sm text-gray-500 mb-0 dark:text-text-medium">
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />}
          <span className={`${isLast ? 'font-bold text-gray-900 pointer-events-none dark:text-text-high' : 'hover:text-primary cursor-pointer transition-colors'}`}>
            {item.label}
          </span>
        </React.Fragment>
      );
    })}
  </nav>
);

// --- Tabs ---
// Spec: Active #28AAA0
export const Tabs: React.FC<{ 
  tabs: { id: string; label: string; icon?: LucideIcon }[]; 
  activeTab: string; 
  onChange: (id: any) => void;
  className?: string;
}> = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={`flex items-center gap-6 border-b border-gray-200 dark:border-borderColor-dark ${className}`}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`relative pb-3 text-sm font-medium transition-colors flex items-center gap-2
          ${activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-800 dark:text-text-medium dark:hover:text-text-high'}
        `}
      >
        {tab.icon && <tab.icon size={16} className={activeTab === tab.id ? 'text-primary' : ''} />}
        <span className={activeTab === tab.id ? 'text-primary' : ''}>{tab.label}</span>
        {activeTab === tab.id && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
        )}
      </button>
    ))}
  </div>
);

// --- Skeleton ---
// Spec: Dark Base #2D2D2D, Pulse #3D3D3D
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded dark:bg-surface-2 ${className}`} />
);

// --- Modal ---
// Spec: Bg L2 (#2D2D2D), Border 1px White/10, Backdrop 70% Black
export const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
  footer?: React.ReactNode; 
}> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity dark:bg-black/70" 
        onClick={onClose} 
      />
      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-transparent dark:bg-surface-2 dark:border-white/10 dark:shadow-dark-l2">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white dark:bg-surface-2 dark:border-borderColor-dark">
          <h3 className="font-bold text-lg text-gray-900 dark:text-text-high">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100 dark:hover:bg-surface-3 dark:hover:text-text-high">
             <X size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto dark:text-text-medium">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100 dark:bg-surface-2 dark:border-borderColor-dark">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};