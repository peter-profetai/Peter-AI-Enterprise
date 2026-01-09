import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppType, User } from '../types';
import { MainLayout } from '../layouts/MainLayout';
import { Button, Card, StatusBadge, Input, Tabs } from '../components/SharedComponents';
import { 
  Bot, Workflow, Cpu, Settings, Users, Shield, Search, MoreVertical, Database, LayoutDashboard, Grid, Lock, Moon, Sun, Monitor, Globe, Maximize2, Minimize2, PanelLeftClose, PanelLeft 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLayout } from '../contexts/LayoutContext';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Alice Chen', email: 'alice@company.com', role: 'Admin', status: 'Active', access: [AppType.AI_STUDIO, AppType.AILM, AppType.AUTOML] },
  { id: '2', name: 'Bob Smith', email: 'bob@company.com', role: 'Editor', status: 'Active', access: [AppType.AI_STUDIO] },
  { id: '3', name: 'Charlie Kim', email: 'charlie@company.com', role: 'Viewer', status: 'Inactive', access: [AppType.AILM] },
  { id: '4', name: 'David Lee', email: 'david@company.com', role: 'Editor', status: 'Active', access: [AppType.AUTOML, AppType.AI_STUDIO] },
];

export const Portal: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { layoutMode, setLayoutMode, sidebarMode, setSidebarMode } = useLayout();
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'settings' | 'security'>('overview');

  // Spec: Sidebar Active State (Left Border + Glow)
  // Fix: Using absolute positioned div for the active line instead of border-l-4 to ensure visibility across all browsers/modes.
  const SidebarItem = ({ id, label, icon: Icon }: any) => {
    const isActive = activeView === id;
    return (
      <button
        onClick={() => setActiveView(id)}
        className={`relative w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 group
          ${isActive 
            ? 'bg-primary-light text-primary dark:bg-primary-glow dark:text-primary' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-text-medium dark:hover:bg-surface-3 dark:hover:text-text-high'}
        `}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
        <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-text-medium dark:group-hover:text-text-high'} />
        {label}
      </button>
    );
  };

  const PortalSidebar = (
    <div className="h-full flex flex-col py-6 bg-white dark:bg-surface-1">
      <div className="px-6 mb-8 flex items-center gap-2 text-gray-900 dark:text-text-high font-bold text-xl tracking-tight">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-sm">
          <LayoutDashboard size={18} />
        </div>
        Portal
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-text-disable">管理</div>
        <SidebarItem id="overview" label="系統總覽" icon={Grid} />
        <SidebarItem id="users" label="使用者管理" icon={Users} />
        
        <div className="px-6 py-2 mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-text-disable">系統</div>
        <SidebarItem id="settings" label="全域設定" icon={Settings} />
        <SidebarItem id="security" label="稽核日誌" icon={Shield} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-borderColor-dark">
         <div className="bg-primary-light dark:bg-primary-glow rounded-lg p-4">
            <p className="text-xs font-semibold text-primary mb-1">企業版方案</p>
            <div className="w-full bg-white dark:bg-surface-3 rounded-full h-1.5 mb-2 overflow-hidden">
               <div className="bg-primary h-full" style={{width: '75%'}}></div>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-text-medium">已使用 12.5M / 15M Tokens</p>
         </div>
      </div>
    </div>
  );

  const AppCard = ({ title, desc, icon: Icon, path, features }: any) => (
    <div 
      onClick={() => navigate(path)}
      className="group bg-white dark:bg-surface-1 rounded-xl border border-gray-200 dark:border-borderColor-dark p-6 cursor-pointer hover:shadow-l2 hover:border-primary/30 transition-all duration-300 relative overflow-hidden dark:hover:shadow-none dark:hover:border-primary"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-primary-light dark:bg-primary-glow text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon size={24} />
        </div>
        <div className="text-primary opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <Button variant="ghost" className="text-primary hover:bg-white/50 dark:hover:bg-surface-3">啟動 →</Button>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-text-high mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-text-medium text-sm mb-6 leading-relaxed h-10 line-clamp-2">{desc}</p>
      
      <div className="space-y-2 border-t border-gray-50 dark:border-borderColor-dark pt-4">
        {features.map((feat: string, i: number) => (
          <div key={i} className="flex items-center text-xs text-gray-600 dark:text-text-medium font-medium">
            <div className="w-1 h-1 rounded-full bg-primary mr-2" />
            {feat}
          </div>
        ))}
      </div>
    </div>
  );

  const UserTable = () => (
    <Card title="使用者管理" action={<Button icon={Users}>新增使用者</Button>}>
      <div className="mb-4 flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-text-medium" size={16} />
          <input 
            type="text" 
            placeholder="搜尋姓名或 Email..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-borderColor-dark-light dark:bg-surface-3 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-text-high dark:focus:ring-0 dark:focus:shadow-glow"
          />
        </div>
        <div className="flex gap-2">
            <Button variant="secondary">匯出 CSV</Button>
            <Button variant="secondary">篩選</Button>
        </div>
      </div>
      <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-borderColor-dark">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-surface-1 border-b border-gray-200 dark:border-borderColor-dark">
            <tr className="text-gray-500 dark:text-text-medium text-xs font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">使用者</th>
              <th className="py-3 px-4">角色</th>
              <th className="py-3 px-4">權限</th>
              <th className="py-3 px-4">狀態</th>
              <th className="py-3 px-4 text-right">動作</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-transparent divide-y divide-gray-100 dark:divide-borderColor-dark">
            {MOCK_USERS.map((user, i) => (
              // Zebra striping for dark mode
              <tr key={user.id} className={`hover:bg-primary-light/30 dark:hover:bg-primary-glow/10 transition-colors ${i % 2 === 1 ? 'dark:bg-white/[0.03]' : ''}`}>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-text-high">{user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-text-medium">{user.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-surface-3 text-gray-600 dark:text-text-medium text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {user.access.map(a => (
                      <div key={a} title={a} className="w-6 h-6 rounded bg-gray-100 dark:bg-surface-3 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-text-medium text-[10px] font-bold">
                        {a === AppType.AI_STUDIO ? 'S' : a === AppType.AILM ? 'L' : 'M'}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={user.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button className="text-gray-400 hover:text-primary p-1 rounded hover:bg-primary-light dark:hover:bg-primary-glow dark:hover:text-primary">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <MainLayout activeApp={AppType.PORTAL} sidebar={PortalSidebar}>
      <div className={`${layoutMode === 'centered' ? 'max-w-6xl mx-auto' : 'w-full'} space-y-8`}>
        
        {/* Welcome Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-text-high tracking-tight">歡迎回來，管理員</h2>
          <p className="text-gray-500 dark:text-text-medium mt-1">從單一入口管理您的企業 AI 生態系統。</p>
        </div>

        {activeView === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AppCard 
              title="AI Studio"
              desc="建置、測試並部署具備 RAG 能力的 AI Agent 與工作流。"
              icon={Bot}
              path="/studio"
              features={['工作流建置器', '知識庫 (RAG)', 'Prompt 工程']}
            />
            <AppCard 
              title="AILM"
              desc="企業 AI 專案的生命週期管理，從構想到 ROI 分析。"
              icon={Workflow}
              path="/ailm"
              features={['議題追蹤', '專案甘特圖', 'ROI 儀表板']}
            />
            <AppCard 
              title="AutoML"
              desc="無程式碼機器學習平台，提供自動化建模與資料分析。"
              icon={Cpu}
              path="/automl"
              features={['自動訓練', '相關係數矩陣', '模型排行榜']}
            />
          </div>
        )}

        {activeView === 'users' && <UserTable />}

        {activeView === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
             {/* Preferences Settings */}
             <Card title="偏好設定">
                <div className="space-y-6">
                    {/* Sidebar Settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-high">側邊欄模式 / Sidebar</h4>
                        <p className="text-xs text-gray-500 dark:text-text-medium">固定顯示或允許收合隱藏。</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-surface-3 p-1 rounded-lg">
                        <button 
                          onClick={() => setSidebarMode('fixed')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sidebarMode === 'fixed' ? 'bg-white dark:bg-surface-1 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium dark:hover:text-text-high'}`}
                        >
                          <PanelLeft size={14} /> 固定
                        </button>
                        <button 
                          onClick={() => setSidebarMode('collapsible')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${sidebarMode === 'collapsible' ? 'bg-white dark:bg-surface-1 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium dark:hover:text-text-high'}`}
                        >
                          <PanelLeftClose size={14} /> 可收合
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-borderColor-dark" />

                    {/* Layout Settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-high">版面配置 / Layout</h4>
                        <p className="text-xs text-gray-500 dark:text-text-medium">選擇頁面內容寬度。</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-surface-3 p-1 rounded-lg">
                        <button 
                          onClick={() => setLayoutMode('centered')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${layoutMode === 'centered' ? 'bg-white dark:bg-surface-1 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium dark:hover:text-text-high'}`}
                        >
                          <Minimize2 size={14} /> 居中
                        </button>
                        <button 
                          onClick={() => setLayoutMode('full')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${layoutMode === 'full' ? 'bg-white dark:bg-surface-1 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium dark:hover:text-text-high'}`}
                        >
                          <Maximize2 size={14} /> 滿版
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-borderColor-dark" />

                    {/* Language Settings */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-high">語言 / Language</h4>
                        <p className="text-xs text-gray-500 dark:text-text-medium">選擇您的偏好語言。</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-surface-3 p-1 rounded-lg">
                        <button 
                          onClick={() => setLanguage('zh-TW')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'zh-TW' ? 'bg-white dark:bg-surface-1 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium dark:hover:text-text-high'}`}
                        >
                          繁體中文
                        </button>
                        <button 
                          onClick={() => setLanguage('en-US')}
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en-US' ? 'bg-white dark:bg-surface-1 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium dark:hover:text-text-high'}`}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    <div className="h-px bg-gray-100 dark:bg-borderColor-dark" />

                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-text-high">介面主題</h4>
                        <p className="text-xs text-gray-500 dark:text-text-medium">選擇顯示模式。</p>
                      </div>
                      <div className="flex bg-gray-100 dark:bg-surface-3 p-1 rounded-lg">
                        <button 
                          onClick={() => theme === 'dark' && toggleTheme()}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'light' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium'}`}
                        >
                          <Sun size={14} /> 淺色
                        </button>
                        <button 
                          onClick={() => theme === 'light' && toggleTheme()}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${theme === 'dark' ? 'bg-surface-1 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-text-medium'}`}
                        >
                          <Moon size={14} /> 深色
                        </button>
                      </div>
                    </div>
                </div>
            </Card>

            <Card title="安全性設定">
               <div className="space-y-4">
                 <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-borderColor-dark">
                   <div>
                     <p className="font-semibold text-gray-800 dark:text-text-high">雙重驗證 (2FA)</p>
                     <p className="text-xs text-gray-500 dark:text-text-medium">強制所有管理員帳號啟用 2FA</p>
                   </div>
                   {/* Custom Switch Component based on spec */}
                   <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                   </div>
                 </div>
                 <div className="flex items-center justify-between py-2">
                   <div>
                     <p className="font-semibold text-gray-800 dark:text-text-high">SSO 配置</p>
                     <p className="text-xs text-gray-500 dark:text-text-medium">管理 SAML/OIDC 連線</p>
                   </div>
                   <Button variant="secondary">設定</Button>
                 </div>
               </div>
            </Card>

            {/* Cross Platform Settings */}
            <Card title="平台參數配置" className="lg:col-span-2">
              <div className="space-y-2">
                {[
                  { name: 'AI Studio 設定', desc: '管理全域 LLM 金鑰與向量資料庫連線。', icon: Bot, link: '/studio' },
                  { name: 'AILM 配置', desc: '設定預設議題類別與工作流狀態。', icon: Workflow, link: '/ailm' },
                  { name: 'AutoML 資源', desc: '設定 GPU 配額與運算叢集。', icon: Cpu, link: '/automl' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 dark:border-borderColor-dark rounded-lg hover:bg-gray-50 dark:hover:bg-surface-3 transition-colors cursor-pointer" onClick={() => navigate(item.link)}>
                     <div className="flex items-center gap-4">
                       <div className="p-2 bg-gray-100 dark:bg-surface-3 rounded-lg text-gray-600 dark:text-text-medium">
                         <item.icon size={20} />
                       </div>
                       <div>
                         <h5 className="font-bold text-gray-900 dark:text-text-high text-sm">{item.name}</h5>
                         <p className="text-xs text-gray-500 dark:text-text-medium">{item.desc}</p>
                       </div>
                     </div>
                     <Button variant="ghost" size="sm">管理</Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
        
        {activeView === 'security' && (
           <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-surface-1 rounded-xl border border-gray-200 dark:border-borderColor-dark text-gray-500 dark:text-text-medium shadow-sm">
              <Lock size={48} className="mb-4 text-gray-300 dark:text-gray-600"/>
              <p>安全性稽核日誌檢視器</p>
              <Button variant="ghost" className="mt-2">查看完整日誌</Button>
           </div>
        )}
      </div>
    </MainLayout>
  );
};