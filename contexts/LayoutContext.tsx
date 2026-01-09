import React, { createContext, useContext, useEffect, useState } from 'react';

export type LayoutMode = 'centered' | 'full';
export type SidebarMode = 'fixed' | 'collapsible';

interface LayoutContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  sidebarMode: SidebarMode;
  setSidebarMode: (mode: SidebarMode) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(() => {
    const saved = localStorage.getItem('layoutMode') as LayoutMode;
    return saved || 'centered';
  });

  const [sidebarMode, setSidebarMode] = useState<SidebarMode>(() => {
    const saved = localStorage.getItem('sidebarMode') as SidebarMode;
    return saved || 'fixed';
  });

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode);
  }, [layoutMode]);

  useEffect(() => {
    localStorage.setItem('sidebarMode', sidebarMode);
  }, [sidebarMode]);

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode, sidebarMode, setSidebarMode }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};