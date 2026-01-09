import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { AppType } from '../types';
import { Button, Card, StatusBadge, Tabs, Input, Modal } from '../components/SharedComponents';
import { 
  PieChart, BarChart, List, CheckSquare, FileText, Share2, Settings, Workflow, 
  TrendingUp, TrendingDown, MoreHorizontal, Calendar, Award, BookOpen, Folder, 
  File, Download, ChevronRight, ArrowRight, Zap, AlertCircle, CheckCircle, Search, Upload, Sun, Moon, ExternalLink, Bot, Cpu,
  Briefcase, GraduationCap, Target, Users, Clock, AlertTriangle, Layers, Grid, Activity, Database, Server
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, BarChart as ReBar, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLayout } from '../contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';

// --- Types ---
type ViewState = 'dashboard' | 'issues' | 'tasks' | 'achievements' | 'library' | 'knowledge' | 'system';
type SystemTab = 'general' | 'category' | 'index' | 'queue';

// --- Mock Data ---
const DASHBOARD_DATA = {
  pie: [
    { name: '製造 (Mfg)', value: 35 },
    { name: '人資 (HR)', value: 20 },
    { name: '銷售 (Sales)', value: 25 },
    { name: '研發 (R&D)', value: 20 },
  ],
  trend: [
    { name: 'Q1', roi: 120, cost: 80 },
    { name: 'Q2', roi: 180, cost: 90 },
    { name: 'Q3', roi: 250, cost: 85 },
    { name: 'Q4', roi: 380, cost: 95 },
  ]
};

const ISSUES = [
  { id: 'I-1023', name: 'PCB 瑕疵檢測 AI 化', owner: 'Mike Ross', dept: 'Mfg', status: 'Running', progress: 65, priority: 'High', start: '2024-01-10', end: '2024-06-30' },
  { id: 'I-1024', name: '履歷篩選自動化', owner: 'Rachel Zane', dept: 'HR', status: 'Pending', progress: 10, priority: 'Medium', start: '2024-02-01', end: '2024-04-15' },
  { id: 'I-1025', name: '銷售預測模型 v2', owner: 'Harvey S.', dept: 'Sales', status: 'Completed', progress: 100, priority: 'High', start: '2023-11-01', end: '2024-01-20' },
  { id: 'I-1026', name: '客戶情緒分析', owner: 'Donna P.', dept: 'Support', status: 'Failed', progress: 45, priority: 'Low', start: '2024-03-01', end: '2024-05-30' },
];

const ACHIEVEMENTS = [
  { 
    id: 'ach1', 
    title: '自動化 AOI 瑕疵分類', 
    industry: '半導體', 
    roi: '350%', 
    author: '製程工程團隊',
    desc: '利用 AI 電腦視覺取代人工複檢，減少 85% 的誤殺率。',
    tags: ['電腦視覺', '成本降低'],
    beforeNodes: ['AOI 掃描', '人工複檢 (3 人)', '分類', '報廢/通過'],
    afterNodes: ['AOI 掃描', 'AI 模型 (99.8% 準確)', '自動分類', '通過'],
    stats: { labor: '-60%', throughput: '+200%', accuracy: '+15%' }
  },
  { 
    id: 'ach2', 
    title: '智慧冰水主機最佳化', 
    industry: '石化業', 
    roi: '120%', 
    author: '廠務團隊',
    desc: '基於天氣與負載預測，AI 驅動的冰水機設定點最佳化。',
    tags: ['預測控制', '節能'],
    beforeNodes: ['天氣檢查', '固定排程', '人工調整'],
    afterNodes: ['IoT 感測器', 'AI 預測', '自動設定'],
    stats: { energy: '-18%', cost: '-$200k/年', stability: '+30%' }
  },
];

const QUEUE_DATA = [
    { id: 'JOB-9921', type: 'Model Training', owner: 'Mike Ross', status: 'Running', duration: '2h 15m' },
    { id: 'JOB-9922', type: 'Data Ingestion', owner: 'System', status: 'Queued', duration: '-' },
    { id: 'JOB-9923', type: 'Report Gen', owner: 'Rachel Z.', status: 'Completed', duration: '5m 30s' },
];

// Colors
const COLORS = ['#28AAA0', '#17a2b8', '#6F42C1', '#FD7E14'];

// --- Sub-Components ---

// 1. Dashboard View
const DashboardView = () => {
  const [activeTab, setActiveTab] = useState('executive');
  const { theme } = useTheme();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab}
          tabs={[
            { id: 'executive', label: '高階主管儀表板 (Executive)', icon: TrendingUp },
            { id: 'functional', label: '功能主管看板 (Functional)', icon: Briefcase },
          ]}
          className="w-full max-w-lg"
        />
      </div>

      {activeTab === 'executive' && (
        <div className="space-y-6 animate-in slide-in-from-right-2">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-primary to-primary-dark text-white border-none">
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-white/80 text-xs font-bold uppercase">累計預估效益</p>
                       <h3 className="text-3xl font-bold mt-1">$ 12.5 M</h3>
                    </div>
                    <div className="p-2 bg-white/20 rounded-lg"><Zap size={24} className="text-white"/></div>
                 </div>
                 <div className="mt-4 flex items-center text-xs font-medium text-white/90">
                    <TrendingUp size={12} className="mr-1"/> 比去年同期 +125%
                 </div>
              </Card>
              <Card>
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-gray-500 dark:text-text-medium text-xs font-bold uppercase">AI 專案完成率</p>
                       <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-text-high">78%</h3>
                    </div>
                    <div className="p-2 bg-blue-50 dark:bg-surface-3 rounded-lg text-blue-600"><CheckCircle size={24}/></div>
                 </div>
                 <div className="mt-4 flex items-center text-xs font-medium text-success">
                    <TrendingUp size={12} className="mr-1"/> +5% MoM
                 </div>
              </Card>
              <Card>
                 <div className="flex justify-between items-start">
                    <div>
                       <p className="text-gray-500 dark:text-text-medium text-xs font-bold uppercase">參與人數</p>
                       <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-text-high">245</h3>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-surface-3 rounded-lg text-purple-600"><Users size={24}/></div>
                 </div>
              </Card>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card title="部門議題分佈" className="lg:col-span-1 h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <RePie data={DASHBOARD_DATA.pie} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {DASHBOARD_DATA.pie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </RePie>
                 </ResponsiveContainer>
                 <div className="flex flex-wrap justify-center gap-2 -mt-4">
                     {DASHBOARD_DATA.pie.map((e, i) => (
                        <div key={i} className="flex items-center text-xs text-gray-600 dark:text-text-medium">
                           <div className="w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[i % COLORS.length]}}/>{e.name}
                        </div>
                     ))}
                 </div>
              </Card>
              <Card title="ROI 成長趨勢" className="lg:col-span-2 h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DASHBOARD_DATA.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                       <defs>
                          <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#28AAA0" stopOpacity={0.8}/>
                             <stop offset="95%" stopColor="#28AAA0" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={theme === 'dark' ? '#666' : '#94a3b8'}/>
                       <YAxis axisLine={false} tickLine={false} stroke={theme === 'dark' ? '#666' : '#94a3b8'}/>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#333' : '#e2e8f0'}/>
                       <Tooltip contentStyle={{borderRadius: '8px', border: 'none', backgroundColor: theme === 'dark' ? '#2D2D2D' : '#fff'}}/>
                       <Area type="monotone" dataKey="roi" stroke="#28AAA0" fillOpacity={1} fill="url(#colorRoi)" name="ROI"/>
                    </AreaChart>
                 </ResponsiveContainer>
              </Card>
           </div>
        </div>
      )}
      
      {activeTab === 'functional' && (
         <div className="text-center py-20 text-gray-500">
            <Activity size={48} className="mx-auto mb-4 opacity-50"/>
            <h3 className="text-lg font-bold">功能主管監控視圖</h3>
            <p>此區域將顯示各部門具體的專案進度細節與資源分配。</p>
         </div>
      )}
    </div>
  );
};

// 2. Issue Management (List + Detailed Editor)
const IssueManagementView = () => {
   const [selectedIssue, setSelectedIssue] = useState<any>(null);
   const [detailTab, setDetailTab] = useState('info'); // info, tasks, flow, files

   // Issue Detail / Editor
   if (selectedIssue) {
      return (
         <div className="flex flex-col h-[calc(100vh-8rem)] animate-in slide-in-from-right-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" icon={ChevronRight} className="rotate-180" onClick={() => setSelectedIssue(null)}>列表</Button>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <div>
                     <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-500">{selectedIssue.id}</span>
                        <StatusBadge status={selectedIssue.status} />
                     </div>
                     <h2 className="text-xl font-bold text-gray-900 dark:text-text-high">{selectedIssue.name}</h2>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="secondary" size="sm">儲存草稿</Button>
                  <Button variant="primary" size="sm">提交審核</Button>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white dark:bg-surface-1 rounded-xl border border-gray-200 dark:border-borderColor-dark overflow-hidden flex flex-col">
               <div className="border-b border-gray-200 dark:border-borderColor-dark px-6 pt-2">
                  <Tabs 
                     activeTab={detailTab}
                     onChange={setDetailTab}
                     tabs={[
                        { id: 'info', label: '基本資料 (Info)', icon: FileText },
                        { id: 'tasks', label: '工作清單 (Tasks)', icon: CheckSquare },
                        { id: 'flow', label: '流程設計 (Process Flow)', icon: Workflow },
                        { id: 'files', label: '文件 (Files)', icon: Folder },
                     ]}
                  />
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA] dark:bg-surface-base">
                  {detailTab === 'info' && (
                     <div className="max-w-4xl mx-auto space-y-6">
                        <Card title="專案概述">
                           <div className="grid grid-cols-2 gap-6">
                              <Input label="專案名稱" defaultValue={selectedIssue.name} />
                              <Input label="負責人" defaultValue={selectedIssue.owner} />
                              <Input label="開始日期" type="date" defaultValue={selectedIssue.start} />
                              <Input label="預計結束" type="date" defaultValue={selectedIssue.end} />
                              <div className="col-span-2">
                                 <label className="text-sm font-semibold text-gray-700 dark:text-text-high block mb-1">專案描述</label>
                                 <textarea className="w-full border border-gray-300 dark:border-borderColor-dark-light dark:bg-surface-3 rounded-lg p-3 text-sm h-32 focus:ring-2 focus:ring-primary/20 outline-none" placeholder="描述此 AI 專案的目標與預期效益..." />
                              </div>
                           </div>
                        </Card>
                        <Card title="團隊成員">
                           <div className="flex items-center gap-2 p-2 border border-gray-200 dark:border-borderColor-dark-light rounded-lg bg-white dark:bg-surface-2">
                              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">MR</div>
                              <span className="text-sm font-bold text-gray-800 dark:text-text-high">Mike Ross</span>
                              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-surface-3 px-2 py-0.5 rounded">Owner</span>
                           </div>
                        </Card>
                     </div>
                  )}

                  {detailTab === 'tasks' && (
                     <div className="h-full flex flex-col">
                        <div className="flex justify-between mb-4">
                           <h3 className="font-bold text-lg text-gray-900 dark:text-text-high">甘特圖檢視 (Gantt Chart)</h3>
                           <Button size="sm" icon={Calendar}>新增任務</Button>
                        </div>
                        <div className="flex-1 bg-white dark:bg-surface-2 border border-gray-200 dark:border-borderColor-dark rounded-lg overflow-hidden relative">
                           {/* Simulated Gantt */}
                           <div className="absolute inset-0 overflow-auto">
                              <div className="min-w-[800px]">
                                 <div className="flex border-b border-gray-100 dark:border-borderColor-dark bg-gray-50 dark:bg-surface-3">
                                    <div className="w-48 p-2 text-xs font-bold text-gray-500">任務名稱</div>
                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => (
                                       <div key={m} className="flex-1 p-2 text-center text-xs text-gray-500 border-l border-gray-100 dark:border-borderColor-dark">{m}</div>
                                    ))}
                                 </div>
                                 <div className="space-y-4 p-2 relative mt-2">
                                    <div className="flex items-center">
                                       <div className="w-48 text-sm font-medium text-gray-700 dark:text-text-high px-2">需求訪談</div>
                                       <div className="relative flex-1 h-6 bg-gray-100 dark:bg-surface-3 rounded-full">
                                          <div className="absolute left-[5%] width-[15%] h-full bg-success rounded-full flex items-center justify-center text-[10px] text-white">100%</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center">
                                       <div className="w-48 text-sm font-medium text-gray-700 dark:text-text-high px-2">資料標註</div>
                                       <div className="relative flex-1 h-6 bg-gray-100 dark:bg-surface-3 rounded-full">
                                          <div className="absolute left-[20%] w-[30%] h-full bg-primary rounded-full flex items-center justify-center text-[10px] text-white">60%</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center">
                                       <div className="w-48 text-sm font-medium text-gray-700 dark:text-text-high px-2">模型POC</div>
                                       <div className="relative flex-1 h-6 bg-gray-100 dark:bg-surface-3 rounded-full">
                                          <div className="absolute left-[50%] w-[25%] h-full bg-gray-300 dark:bg-surface-1 rounded-full border border-dashed border-gray-400"></div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {detailTab === 'flow' && (
                     <div className="h-full flex flex-col relative">
                        <div className="absolute top-4 left-4 z-10 bg-white dark:bg-surface-2 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-borderColor-dark flex flex-col gap-2">
                           <div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-surface-3 rounded cursor-pointer" title="Input Node"><Database size={18}/></div>
                           <div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-surface-3 rounded cursor-pointer" title="Process Node"><Settings size={18}/></div>
                           <div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-surface-3 rounded cursor-pointer" title="Logic/Check"><Activity size={18}/></div>
                           <div className="w-8 h-8 flex items-center justify-center bg-primary-light dark:bg-primary-glow text-primary rounded cursor-pointer" title="AI Model"><Zap size={18}/></div>
                        </div>
                        
                        <div className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-borderColor-dark rounded-lg relative overflow-hidden">
                           {/* Canvas Grid */}
                           <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.5}}></div>
                           
                           {/* Simulated Flowchart */}
                           <div className="absolute top-20 left-32 flex items-center gap-12">
                              {/* Node 1 */}
                              <div className="w-40 p-3 bg-white dark:bg-surface-2 border-2 border-gray-300 dark:border-borderColor-dark rounded-lg shadow-sm text-center">
                                 <div className="text-xs text-gray-500 uppercase font-bold mb-1">設計輸入</div>
                                 <div className="text-sm font-bold text-gray-800 dark:text-text-high">AOI 影像檔</div>
                              </div>
                              <ArrowRight className="text-gray-400" />
                              
                              {/* Node 2 (Pain Point) */}
                              <div className="w-40 p-3 bg-white dark:bg-surface-2 border-2 border-red-300 dark:border-red-900 rounded-lg shadow-sm text-center relative">
                                 <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1"><AlertTriangle size={12}/></div>
                                 <div className="text-xs text-red-500 uppercase font-bold mb-1">人工檢查</div>
                                 <div className="text-sm font-bold text-gray-800 dark:text-text-high">人員複判</div>
                                 <div className="text-[10px] text-gray-400 mt-1">耗時且誤判率高</div>
                              </div>
                              <ArrowRight className="text-gray-400" />

                              {/* Node 3 (AI Opportunity) */}
                              <div className="w-40 p-3 bg-primary-light dark:bg-primary-glow border-2 border-primary rounded-lg shadow-l1 dark:shadow-glow text-center">
                                 <div className="text-xs text-primary uppercase font-bold mb-1 flex justify-center items-center gap-1"><Zap size={10}/> AI 辨識</div>
                                 <div className="text-sm font-bold text-primary-dark dark:text-primary">瑕疵分類模型</div>
                              </div>
                           </div>
                           
                           <div className="absolute bottom-4 right-4 bg-white/80 dark:bg-surface-2/80 backdrop-blur p-2 rounded text-xs text-gray-500">
                              拖拉節點以建立 As-Is / To-Be 流程
                           </div>
                        </div>
                     </div>
                  )}

                  {detailTab === 'files' && (
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Project_Charter.pdf', 'Data_Sample.csv', 'Requirement_Spec.docx'].map((f, i) => (
                           <div key={i} className="flex items-center gap-3 p-4 bg-white dark:bg-surface-2 border border-gray-200 dark:border-borderColor-dark rounded-lg">
                              <FileText className="text-gray-400" size={24} />
                              <div className="flex-1">
                                 <div className="text-sm font-bold text-gray-800 dark:text-text-high">{f}</div>
                                 <div className="text-xs text-gray-500">2.4 MB • Uploaded by Mike</div>
                              </div>
                              <Button variant="ghost" size="sm" icon={Download} />
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
      );
   }

   // Default List View
   return (
      <Card title="議題管理 (Issue Management)" action={<Button variant="primary" icon={Calendar}>新增議題</Button>}>
         <div className="mb-4 flex gap-2">
            <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
               <input type="text" placeholder="搜尋議題..." className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-borderColor-dark-light dark:bg-surface-3 rounded-lg text-sm focus:border-primary outline-none" />
            </div>
            <Button variant="secondary" icon={Grid}>看板模式</Button>
            <Button variant="secondary" icon={List}>列表模式</Button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-gray-200 dark:border-borderColor-dark bg-gray-50 dark:bg-surface-2 text-xs font-bold text-gray-500 dark:text-text-medium uppercase">
                     <th className="py-3 px-4">ID</th>
                     <th className="py-3 px-4">專案名稱</th>
                     <th className="py-3 px-4">負責人</th>
                     <th className="py-3 px-4">部門</th>
                     <th className="py-3 px-4">進度</th>
                     <th className="py-3 px-4">狀態</th>
                     <th className="py-3 px-4">優先級</th>
                     <th className="py-3 px-4 text-right">動作</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-borderColor-dark">
                  {ISSUES.map(issue => (
                     <tr key={issue.id} onClick={() => setSelectedIssue(issue)} className="hover:bg-primary-light/10 dark:hover:bg-primary-glow/10 cursor-pointer transition-colors">
                        <td className="py-3 px-4 font-mono text-primary text-xs">{issue.id}</td>
                        <td className="py-3 px-4 font-bold text-sm text-gray-900 dark:text-text-high">{issue.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-text-medium">{issue.owner}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-text-medium">{issue.dept}</td>
                        <td className="py-3 px-4 w-32">
                           <div className="w-full bg-gray-200 dark:bg-surface-3 rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full" style={{width: `${issue.progress}%`}}></div>
                           </div>
                        </td>
                        <td className="py-3 px-4"><StatusBadge status={issue.status} /></td>
                        <td className="py-3 px-4">
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${issue.priority === 'High' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-surface-3 dark:text-text-medium'}`}>{issue.priority}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                           <ChevronRight size={16} className="text-gray-400"/>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>
   );
};

// 3. AI Achievements (Before/After Comparison)
const AchievementsView = () => {
   const [selectedAch, setSelectedAch] = useState<any>(null);

   if (selectedAch) {
      return (
         <div className="space-y-6 animate-in slide-in-from-right-4">
             <div className="flex items-center gap-3 mb-2">
               <Button variant="ghost" size="sm" icon={ChevronRight} className="rotate-180" onClick={() => setSelectedAch(null)}>返回</Button>
               <h2 className="text-xl font-bold text-gray-900 dark:text-text-high">{selectedAch.title}</h2>
            </div>
            
            {/* KPI Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {Object.entries(selectedAch.stats).map(([k, v]: any) => (
                  <Card key={k} className="flex flex-col items-center justify-center p-4">
                     <span className="text-xs uppercase font-bold text-gray-400 dark:text-text-medium">{k}</span>
                     <span className="text-2xl font-bold text-primary mt-1">{v}</span>
                  </Card>
               ))}
            </div>

            {/* Comparison Flowcharts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Card title="改善前 (Before)">
                  <div className="flex flex-col items-center gap-4 py-8 bg-gray-50 dark:bg-surface-2 rounded border border-gray-100 dark:border-borderColor-dark-light">
                     {selectedAch.beforeNodes.map((n: string, i: number) => (
                        <React.Fragment key={i}>
                           <div className={`px-4 py-2 rounded shadow-sm border text-sm font-medium ${i===1 ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' : 'bg-white border-gray-200 text-gray-700 dark:bg-surface-1 dark:border-borderColor-dark dark:text-text-medium'}`}>
                              {n}
                           </div>
                           {i < selectedAch.beforeNodes.length - 1 && <ArrowRight className="text-gray-300 rotate-90" />}
                        </React.Fragment>
                     ))}
                  </div>
               </Card>
               <Card title="改善後 (After) - AI Solution">
                  <div className="flex flex-col items-center gap-4 py-8 bg-primary-light/20 dark:bg-primary-glow/10 rounded border border-primary/20">
                     {selectedAch.afterNodes.map((n: string, i: number) => (
                        <React.Fragment key={i}>
                           <div className={`px-4 py-2 rounded shadow-sm border text-sm font-medium ${i===1 ? 'bg-primary text-white border-primary shadow-lg ring-4 ring-primary/10' : 'bg-white border-gray-200 text-gray-700 dark:bg-surface-1 dark:border-borderColor-dark dark:text-text-medium'}`}>
                              {n}
                           </div>
                           {i < selectedAch.afterNodes.length - 1 && <ArrowRight className="text-primary rotate-90" />}
                        </React.Fragment>
                     ))}
                  </div>
               </Card>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-6 animate-in fade-in">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-text-high">AI 成果發表 (Achievements)</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACHIEVEMENTS.map(ach => (
               <div key={ach.id} onClick={() => setSelectedAch(ach)} className="group bg-white dark:bg-surface-1 rounded-xl border border-gray-200 dark:border-borderColor-dark overflow-hidden hover:shadow-l2 cursor-pointer transition-all dark:hover:border-primary">
                  <div className="h-32 bg-gray-100 dark:bg-surface-2 flex items-center justify-center relative">
                     <Award size={40} className="text-gray-300 group-hover:text-primary transition-colors" />
                     <div className="absolute top-2 right-2 bg-white dark:bg-surface-3 px-2 py-0.5 rounded text-[10px] font-bold border border-gray-100 dark:border-borderColor-dark shadow-sm">
                        ROI: {ach.roi}
                     </div>
                  </div>
                  <div className="p-5">
                     <div className="text-xs font-bold text-primary uppercase mb-1">{ach.industry}</div>
                     <h3 className="font-bold text-lg text-gray-900 dark:text-text-high mb-2">{ach.title}</h3>
                     <p className="text-sm text-gray-500 dark:text-text-medium line-clamp-2">{ach.desc}</p>
                     <div className="mt-4 pt-3 border-t border-gray-100 dark:border-borderColor-dark flex justify-between items-center">
                        <span className="text-xs text-gray-400">{ach.author}</span>
                        <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">查看案例 <ArrowRight size={10}/></span>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

// 4. System Management (Tabs: General, Category, Index, Queue)
const SystemManagementView = () => {
   const [tab, setTab] = useState<SystemTab>('queue');

   return (
      <div className="space-y-6 animate-in fade-in">
         <h2 className="text-xl font-bold text-gray-900 dark:text-text-high mb-4">系統管理 (System Administration)</h2>
         <Tabs 
            activeTab={tab}
            onChange={setTab}
            tabs={[
               { id: 'queue', label: '佇列管理 (Queue)', icon: Server },
               { id: 'category', label: '類型管理 (Category)', icon: Layers },
               { id: 'index', label: '索引管理 (Index)', icon: Database },
               { id: 'general', label: '一般設定 (General)', icon: Settings },
            ]}
         />

         {tab === 'queue' && (
            <Card title="工作排程監控">
               <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-surface-2 text-xs font-bold text-gray-500 uppercase">
                     <tr>
                        <th className="p-3">Job ID</th>
                        <th className="p-3">任務類型</th>
                        <th className="p-3">發起人</th>
                        <th className="p-3">耗時</th>
                        <th className="p-3">狀態</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-borderColor-dark">
                     {QUEUE_DATA.map(job => (
                        <tr key={job.id}>
                           <td className="p-3 font-mono">{job.id}</td>
                           <td className="p-3">{job.type}</td>
                           <td className="p-3">{job.owner}</td>
                           <td className="p-3">{job.duration}</td>
                           <td className="p-3"><StatusBadge status={job.status} /></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </Card>
         )}

         {tab === 'category' && (
            <Card title="下拉選單管理">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="text-sm font-bold block mb-2 text-gray-700 dark:text-text-high">產業類別</label>
                     <div className="border border-gray-200 dark:border-borderColor-dark rounded-lg p-2 h-40 overflow-y-auto space-y-1">
                        {['半導體', '石化', '金融', '零售', '醫療'].map(c => (
                           <div key={c} className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-surface-3 rounded cursor-pointer group">
                              <span>{c}</span>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">×</Button>
                           </div>
                        ))}
                     </div>
                     <Button variant="secondary" size="sm" className="mt-2 w-full">新增類別</Button>
                  </div>
                  <div>
                     <label className="text-sm font-bold block mb-2 text-gray-700 dark:text-text-high">專案優先級</label>
                     <div className="border border-gray-200 dark:border-borderColor-dark rounded-lg p-2 h-40 overflow-y-auto space-y-1">
                        {['Critical', 'High', 'Medium', 'Low'].map(c => (
                           <div key={c} className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 dark:hover:bg-surface-3 rounded cursor-pointer group">
                              <span>{c}</span>
                              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">×</Button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </Card>
         )}

         {tab === 'index' && (
             <Card title="搜尋引擎索引狀態">
                <div className="flex items-center gap-4 mb-6">
                   <div className="flex-1 bg-gray-100 dark:bg-surface-2 rounded-full h-2">
                      <div className="bg-success w-[92%] h-full rounded-full"></div>
                   </div>
                   <span className="text-sm font-bold text-success">92% Healthy</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div className="p-4 bg-gray-50 dark:bg-surface-2 rounded border border-gray-100 dark:border-borderColor-dark text-center">
                      <div className="text-2xl font-bold">1.2M</div>
                      <div className="text-xs text-gray-500 uppercase">Documents</div>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-surface-2 rounded border border-gray-100 dark:border-borderColor-dark text-center">
                      <div className="text-2xl font-bold">45ms</div>
                      <div className="text-xs text-gray-500 uppercase">Avg Latency</div>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-surface-2 rounded border border-gray-100 dark:border-borderColor-dark text-center">
                      <Button size="sm" icon={Activity}>重建索引</Button>
                   </div>
                </div>
             </Card>
         )}
      </div>
   );
};

// --- Main Page Component ---
export const AILM: React.FC = () => {
  const [view, setView] = useState<ViewState>('issues'); // Default to Issues as core function
  const { theme } = useTheme();
  const { layoutMode } = useLayout();

  const SidebarItem = ({ id, label, icon: Icon }: any) => {
    const isActive = view === id;
    return (
      <button
        onClick={() => setView(id)}
        className={`relative w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 group
          ${isActive 
            ? 'bg-primary-light text-primary dark:bg-primary-glow dark:text-primary' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-text-medium dark:hover:bg-surface-3 dark:hover:text-text-high'}
        `}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
        <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-text-medium dark:group-hover:text-text-high'} />
        {label}
      </button>
    );
  };

  const AILMSidebar = (
    <div className="h-full flex flex-col py-6 bg-white dark:bg-surface-1">
      <div className="px-6 mb-8 flex items-center gap-2 text-gray-900 dark:text-text-high font-bold text-xl">
         <Workflow className="text-primary" /> AILM
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-text-disable">業務功能</div>
        <SidebarItem id="issues" label="議題管理 (Issues)" icon={List} />
        <SidebarItem id="dashboard" label="管理看板 (Dashboard)" icon={PieChart} />
        <SidebarItem id="tasks" label="工作清單 (Tasks)" icon={Calendar} />
        
        <div className="px-6 py-2 mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-text-disable">資源庫</div>
        <SidebarItem id="achievements" label="AI 成果發表" icon={Award} />
        <SidebarItem id="library" label="產業 AI 無限庫" icon={BookOpen} />
        <SidebarItem id="knowledge" label="企業知識庫" icon={Folder} />
        
        <div className="px-6 py-2 mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-text-disable">管理後台</div>
        <SidebarItem id="system" label="系統管理 (System)" icon={Settings} />
      </div>
    </div>
  );

  return (
    <MainLayout activeApp={AppType.AILM} sidebar={AILMSidebar}>
      <div className={`${layoutMode === 'centered' ? 'max-w-7xl mx-auto' : 'w-full'}`}>
        {view === 'dashboard' && <DashboardView />}
        {view === 'issues' && <IssueManagementView />}
        {view === 'tasks' && (
           <Card title="我的工作清單 (Task List)" action={<Button variant="primary">匯出報表</Button>}>
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                 <CheckSquare size={64} className="mb-4 opacity-20"/>
                 <p>請前往「議題管理」選擇特定專案以檢視甘特圖與詳細任務。</p>
                 <Button variant="secondary" className="mt-4" onClick={() => setView('issues')}>前往議題管理</Button>
              </div>
           </Card>
        )}
        {view === 'achievements' && <AchievementsView />}
        {view === 'library' && (
           <Card title="產業 AI 無限庫">
              <div className="text-center p-12">
                <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4"/>
                <h3 className="text-gray-900 dark:text-text-high font-bold">Marketplace 連線中...</h3>
                <p className="text-gray-500 dark:text-text-medium">存取外部 500+ 個產業標準模型與範本。</p>
              </div>
           </Card>
        )}
        {view === 'knowledge' && (
           <Card title="企業知識庫" action={<Button icon={Upload}>上傳文件</Button>}>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['SOP_Manufacturing', 'Legal_Compliance', 'HR_Policies', 'IT_Security'].map(f => (
                     <div key={f} className="p-4 border border-gray-200 dark:border-borderColor-dark rounded-xl hover:shadow-md cursor-pointer flex flex-col items-center text-center bg-white dark:bg-surface-2">
                        <Folder size={40} className="text-yellow-400 mb-2" fill="currentColor" fillOpacity={0.2} />
                        <span className="font-bold text-sm text-gray-700 dark:text-text-high">{f}</span>
                        <span className="text-xs text-gray-400">12 files</span>
                     </div>
                  ))}
               </div>
           </Card>
        )}
        {view === 'system' && <SystemManagementView />}
      </div>
    </MainLayout>
  );
};
