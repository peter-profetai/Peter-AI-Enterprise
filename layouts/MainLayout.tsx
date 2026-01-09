import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppType } from '../types';
import { Breadcrumbs } from '../components/SharedComponents';
import { LayoutGrid, Bell, Bot, Workflow, Cpu, Grid, ExternalLink, Search, Menu, User, PanelLeftClose, PanelLeftOpen, ChevronLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

interface MainLayoutProps {
  children: React.ReactNode;
  activeApp: AppType;
  sidebar?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, activeApp, sidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarMode } = useLayout();
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  
  // Local state for sidebar visibility.
  // We initialize based on sidebarMode, but allow manual toggle.
  const [isSidebarVisible, setIsSidebarVisible] = useState(sidebarMode === 'fixed');

  const launcherRef = useRef<HTMLDivElement>(null);

  // Sync visibility when global setting changes, but don't override manual toggle if it's just a remount.
  // Here we respond to the 'sidebarMode' context change (e.g. from Settings page).
  useEffect(() => {
    setIsSidebarVisible(sidebarMode === 'fixed');
  }, [sidebarMode]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (launcherRef.current && !launcherRef.current.contains(event.target as Node)) {
        setIsLauncherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Base classes for sidebar with Dark Mode support (V9 Spec)
  // 1. Increased border contrast (border-gray-300) to fix "missing line" issue reported by user.
  // 2. Used negative margin trick or transform for smooth collapsing if needed, but width transition is standard.
  const sidebarContainerClass = `flex-shrink-0 h-full flex flex-col z-20 transition-all duration-300 ease-in-out bg-white border-r border-gray-300 text-gray-600 dark:bg-surface-1 dark:border-borderColor-dark dark:text-text-medium ${isSidebarVisible ? 'w-[260px] opacity-100' : 'w-0 opacity-0 border-none overflow-hidden'}`;

  // Generate breadcrumb items based on path
  const getBreadcrumbs = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    const items = [{ label: '首頁', path: '/' }];
    
    if (activeApp !== AppType.PORTAL) {
      let label = '';
      if (activeApp === AppType.AI_STUDIO) label = 'AI Studio';
      if (activeApp === AppType.AILM) label = 'AILM';
      if (activeApp === AppType.AUTOML) label = 'AutoML';
      items.push({ label, path: parts[0] ? `/${parts[0]}` : undefined });
    }
    
    if (parts.length > 1) {
      const subLabel = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).replace(/-/g, ' ');
      items.push({ label: subLabel, path: undefined });
    }
    return items;
  };

  const LauncherItem = ({ app, icon: Icon, path, label }: any) => (
    <button 
      onClick={() => {
        navigate(path);
        setIsLauncherOpen(false);
      }}
      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-primary-light transition-colors group gap-2 border border-transparent hover:border-primary/20 dark:hover:bg-surface-3 dark:hover:border-primary/40"
    >
      <div className="w-10 h-10 rounded-lg bg-white text-primary shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 dark:bg-surface-2 dark:border-borderColor-dark-light">
        <Icon size={22} />
      </div>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-primary text-center dark:text-text-high">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-[#F8F9FA] dark:bg-surface-base overflow-hidden font-sans text-gray-900 dark:text-text-high transition-colors duration-200">
      
      {/* Sidebar: Global Anchor */}
      {sidebar && (
        <aside className={sidebarContainerClass}>
          {/* Inner container with fixed width to prevent content squishing during transition */}
          <div className="w-[260px] h-full flex flex-col relative group">
            
            {/* Collapse Button (User Customizable Toggle) */}
            <button 
               onClick={() => setIsSidebarVisible(false)}
               className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-surface-3 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
               title="收合側邊欄"
            >
               <PanelLeftClose size={18} />
            </button>

            {sidebar}
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Header: Global Control Center */}
        {/* Bg: #121212 (surface-base), Border Bottom: #333333 */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-30 shadow-sm dark:bg-surface-base dark:border-borderColor-dark dark:shadow-none transition-colors duration-200">
          
          {/* Left: Menu Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4 min-w-[200px]">
             {/* Sidebar Toggle Button - Show whenever sidebar is hidden to allow opening */}
             {!isSidebarVisible && (
                <button 
                  onClick={() => setIsSidebarVisible(true)}
                  className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-text-medium dark:hover:bg-surface-3 transition-colors animate-in fade-in zoom-in-95"
                  title="展開選單"
                >
                  <Menu size={20} />
                </button>
             )}
             <Breadcrumbs items={getBreadcrumbs()} />
          </div>

          {/* Center: Global Search (Visual only) */}
          {/* Search Bg: #2D2D2D (surface-2) */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-text-medium" size={16} />
            <input 
              type="text" 
              placeholder="搜尋專案、模型或文件... (Ctrl+K)" 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:bg-surface-2 dark:border-borderColor-dark-light dark:text-text-high dark:placeholder-text-disable dark:focus:border-primary dark:focus:shadow-glow dark:focus:ring-0"
            />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 min-w-[200px] justify-end">
            
            {/* Notification */}
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors dark:text-text-medium dark:hover:bg-surface-3">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-white dark:border-surface-base dark:bg-error-dark"></span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1 dark:bg-borderColor-dark"></div>

            {/* App Switcher */}
            <div className="relative" ref={launcherRef}>
              <button 
                onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${isLauncherOpen ? 'bg-primary-light text-primary' : 'text-gray-500 hover:bg-gray-100 dark:text-text-medium dark:hover:bg-surface-3'}`}
                title="切換產品"
              >
                <Grid size={20} />
              </button>

              {isLauncherOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-xl shadow-l2 border border-gray-100 p-4 transform origin-top-right transition-all z-50 animate-in fade-in zoom-in-95 dark:bg-surface-2 dark:border-borderColor-dark dark:shadow-dark-l2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2 dark:text-text-disable">PROFET AI Suite</div>
                  <div className="grid grid-cols-2 gap-2">
                    <LauncherItem app={AppType.PORTAL} path="/" icon={LayoutGrid} label="入口網站" />
                    <LauncherItem app={AppType.AI_STUDIO} path="/studio" icon={Bot} label="AI Studio" />
                    <LauncherItem app={AppType.AILM} path="/ailm" icon={Workflow} label="AILM" />
                    <LauncherItem app={AppType.AUTOML} path="/automl" icon={Cpu} label="AutoML" />
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center px-2 dark:border-borderColor-dark">
                     <span className="text-xs text-gray-400 dark:text-text-disable">v7.0.0</span>
                     <a href="#" className="text-xs text-primary hover:underline flex items-center gap-1 dark:text-primary-textLink">說明文件 <ExternalLink size={10} /></a>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="ml-2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-xs cursor-pointer shadow-sm hover:ring-2 hover:ring-primary/30 transition-all">
              JD
            </div>
          </div>
        </header>

        {/* Scroll Area */}
        <main className="flex-1 overflow-auto p-6 md:p-8 scroll-smooth relative">
           {children}
        </main>
      </div>
    </div>
  );
};
