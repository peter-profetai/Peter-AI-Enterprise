import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { AppType } from '../types';
import { 
  Compass, Layout, Database, Bot, Settings, Plus, Search, Play, FileText, Code, Globe, MessageSquare, 
  ChevronLeft, Upload, File, CheckCircle, RefreshCw, X, MoreHorizontal, Zap, Layers, Cpu, Save, Send, Sun, Moon, ExternalLink,
  Sliders, Link, Server, Shield, Key, Workflow, Folder
} from 'lucide-react';
import { Button, Card, StatusBadge, Input, Modal, Skeleton, Tabs } from '../components/SharedComponents';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLayout } from '../contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';

// --- Types ---
type ViewState = 'explore' | 'workspace' | 'knowledge' | 'assistants' | 'module-settings' | 'system-settings';

// --- Mock Data ---
const TEMPLATES = [
  { id: 't1', title: "公司研究助手", icon: Globe, desc: "輸入公司名稱，自動爬取新聞、財報並生成結構化報告。", inputs: ['company_name', 'focus_area'] },
  { id: 't2', title: "財報分析專家", icon: FileText, desc: "上傳 PDF 財報，提取關鍵財務比率與風險評估。", inputs: ['report_file', 'fiscal_year'] },
  { id: 't3', title: "Python 資料清洗", icon: Code, desc: "生成用於資料前處理的 Python 腳本，包含 Pandas 操作。", inputs: ['data_description'] },
  { id: 't4', title: "RAG 客服機器人", icon: MessageSquare, desc: "基於知識庫回答客戶問題的標準範本。", inputs: [] },
];

const DATASETS = [
  { id: 'kb1', name: '企業採購手冊 v3.pdf', type: 'PDF', chunks: 142, status: 'ready', date: '2 天前' },
  { id: 'kb2', name: '產品技術規格書', type: 'Folder', chunks: 850, status: 'indexing', date: '1 分鐘前' },
];

// --- Sub-Components ---

// 1. Explore View: App Store & Run Modal
const ExploreView = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">探索 (Explore)</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">從應用市集快速啟用 AI Agent，或將其作為開發模板。</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="搜尋 Agent 範本..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedTemplate(item)}
            className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-l2 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary-light dark:bg-primary/20 text-primary flex items-center justify-center mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 leading-relaxed line-clamp-2">{item.desc}</p>
            <div className="flex items-center text-primary text-sm font-semibold">
              啟用 Agent <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Run Agent Modal */}
      <Modal 
        isOpen={!!selectedTemplate} 
        onClose={() => { setSelectedTemplate(null); setIsRunning(false); }}
        title={selectedTemplate?.title || '執行 Agent'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedTemplate(null)}>取消</Button>
            <Button variant="primary" icon={Play} isLoading={isRunning} onClick={() => setIsRunning(true)}>
              {isRunning ? '生成報告中...' : '執行工作流'}
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-slate-300 text-sm">{selectedTemplate?.desc}</p>
          
          {selectedTemplate?.inputs.length > 0 && (
            <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-100 dark:border-slate-700 space-y-4">
              <h4 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wide">輸入變數 (Input Variables)</h4>
              {selectedTemplate.inputs.map((input: string) => (
                <Input key={input} label={input.replace('_', ' ').toUpperCase()} placeholder={`請輸入 ${input}...`} />
              ))}
            </div>
          )}

          {isRunning && (
            <div className="bg-primary-light/30 border border-primary/20 rounded-lg p-4">
               <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                 <Zap size={16} className="animate-pulse" />
                 AI 工作流執行中...
               </div>
               <div className="space-y-3">
                 <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                    <CheckCircle size={12} className="text-success" /> <span>搜尋 Google 資訊...</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-300">
                    <CheckCircle size={12} className="text-success" /> <span>讀取知識庫文件...</span>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-primary font-bold animate-pulse">
                    <RefreshCw size={12} className="animate-spin" /> <span>LLM 正在撰寫報告...</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

// 2. Workspace View: Visual Canvas & Node Properties
const WorkspaceView = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in">
      {/* Toolbar */}
      <div className="h-14 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded text-purple-600 dark:text-purple-400">
             <Layout size={18} />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-white">公司研究助手 (Workflow)</h3>
          <span className="px-2 py-0.5 rounded text-xs bg-warning-bg text-warning-text font-bold uppercase">編輯中</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={Play}>試運行 (Test Run)</Button>
          <Button variant="primary" size="sm">發布</Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette (Left) */}
        <div className="w-52 bg-gray-50 dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col py-4 overflow-y-auto">
           <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">節點 (Nodes)</div>
           <div className="space-y-1 px-2">
             {[
               { icon: Play, label: '開始 (Start)', color: 'text-primary' },
               { icon: Bot, label: 'LLM 模型', color: 'text-purple-600' },
               { icon: Database, label: '知識庫檢索', color: 'text-blue-600' },
               { icon: Globe, label: '工具 (Tools)', color: 'text-orange-600' },
               { icon: Code, label: '程式碼', color: 'text-gray-600' },
             ].map((node, i) => (
               <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-slate-600 cursor-grab transition-all select-none">
                  <node.icon size={16} className={node.color} />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{node.label}</span>
               </div>
             ))}
           </div>
           
           <div className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-6">邏輯 (Logic)</div>
           <div className="space-y-1 px-2">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-slate-600 cursor-grab transition-all select-none">
                  <Workflow size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-slate-300">條件判斷 (If/Else)</span>
               </div>
           </div>
        </div>

        {/* Canvas (Center) */}
        <div className="flex-1 bg-[#F8F9FA] dark:bg-slate-950 relative overflow-hidden cursor-grab active:cursor-grabbing">
          <div className="absolute inset-0" 
               style={{ 
                 backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
                 backgroundSize: '24px 24px',
                 opacity: 0.3
               }}>
          </div>

          {/* Connector SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
            <path d="M 300 150 C 360 150, 360 150, 420 150" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
            <path d="M 620 150 C 680 150, 680 250, 740 250" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrowhead)" fill="none" />
          </svg>

          {/* Node 1: Start */}
          <div 
            onClick={() => setSelectedNode('start')}
            className={`absolute top-20 left-20 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-2 transition-colors cursor-pointer ${selectedNode === 'start' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 dark:border-slate-700 hover:border-primary/50'}`}
          >
            <div className="bg-primary-light dark:bg-primary/20 px-3 py-2 rounded-t flex justify-between items-center border-b border-gray-100 dark:border-slate-700">
              <span className="text-xs font-bold text-primary uppercase">Start</span>
              <Play size={14} className="text-primary" />
            </div>
            <div className="p-3">
               <div className="text-xs text-gray-500 font-mono bg-gray-50 dark:bg-slate-800 p-1.5 rounded mb-1">input: company_name</div>
            </div>
            <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full" />
          </div>

          {/* Node 2: Tools (Google Search) */}
          <div 
            onClick={() => setSelectedNode('tools')}
            className={`absolute top-20 left-[420px] w-56 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-2 transition-colors cursor-pointer ${selectedNode === 'tools' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 dark:border-slate-700 hover:border-primary/50'}`}
          >
            <div className="bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-t flex justify-between items-center border-b border-orange-100 dark:border-orange-900/30">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">Google Search</span>
              <Globe size={14} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div className="p-3">
               <div className="text-xs text-gray-500 truncate">Query: {'{{company_name}} news'}</div>
            </div>
            <div className="absolute -left-1.5 top-1/2 w-3 h-3 bg-white border-2 border-gray-400 rounded-full" />
            <div className="absolute -right-1.5 top-1/2 w-3 h-3 bg-white border-2 border-primary rounded-full" />
          </div>

          {/* Node 3: LLM */}
          <div 
            onClick={() => setSelectedNode('llm')}
            className={`absolute top-[200px] left-[740px] w-56 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-2 transition-colors cursor-pointer ${selectedNode === 'llm' ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 dark:border-slate-700 hover:border-primary/50'}`}
          >
             <div className="bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-t flex justify-between items-center border-b border-purple-100 dark:border-purple-900/30">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">LLM Analysis</span>
              <Bot size={14} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="p-3 space-y-2">
               <div className="flex justify-between">
                 <span className="text-xs text-gray-500">Model</span>
                 <span className="text-xs font-bold bg-gray-100 dark:bg-slate-800 px-1 rounded dark:text-slate-300">GPT-4 Turbo</span>
               </div>
               <div className="text-[10px] text-gray-400">Prompt: Summarize news...</div>
            </div>
            <div className="absolute -left-1.5 top-8 w-3 h-3 bg-white border-2 border-gray-400 rounded-full" />
          </div>
        </div>

        {/* Properties Panel (Right) */}
        {selectedNode && (
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-800">
               <h4 className="font-bold text-sm text-gray-800 dark:text-white">節點屬性</h4>
               <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
               {selectedNode === 'llm' && (
                 <>
                   <Input label="節點名稱" defaultValue="LLM Analysis" />
                   <div>
                     <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1">模型 (Model)</label>
                     <select className="w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none">
                       <option>GPT-4 Turbo</option>
                       <option>Claude 3.5 Sonnet</option>
                       <option>Llama 3 70B</option>
                     </select>
                   </div>
                   <div>
                      <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1">提示詞 (System Prompt)</label>
                      <textarea className="w-full h-32 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm p-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono" defaultValue="You are a research assistant. Summarize the following search results about {{company_name}}..." />
                   </div>
                 </>
               )}
               {selectedNode === 'tools' && (
                 <>
                   <Input label="節點名稱" defaultValue="Google Search" />
                   <Input label="搜尋查詢 (Query)" defaultValue="{{company_name}} latest news" />
                   <div>
                     <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1">結果數量限制</label>
                     <input type="range" min="1" max="10" defaultValue="5" className="w-full accent-primary" />
                     <div className="flex justify-between text-xs text-gray-500">
                       <span>1</span>
                       <span>10</span>
                     </div>
                   </div>
                 </>
               )}
               {selectedNode === 'start' && (
                  <>
                    <p className="text-xs text-gray-500 mb-4">定義此工作流的起始觸發與輸入變數。</p>
                    <Input label="變數名稱 (Variable)" defaultValue="company_name" />
                    <Input label="預設測試值" defaultValue="NVIDIA" />
                  </>
               )}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
              <Button className="w-full" icon={Save}>儲存設定</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Knowledge Base View: Upload -> Chunking -> Indexing
const KnowledgeView = () => {
  const [activeDataset, setActiveDataset] = useState<string | null>(null);

  // Detail View for a Dataset
  if (activeDataset) {
    const isIndexing = activeDataset === 'kb2'; // Simulate indexing state for demo
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setActiveDataset(null)} icon={ChevronLeft}>返回列表</Button>
          <div className="h-4 w-px bg-gray-300 mx-2"></div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isIndexing ? '產品技術規格書' : '企業採購手冊 v3.pdf'}</h2>
          <StatusBadge status={isIndexing ? 'Processing' : 'Active'} />
        </div>

        {/* Processing Pipeline Visualization */}
        <Card title="資料處理管線 (RAG Pipeline)">
           <div className="flex items-center justify-between px-4 md:px-20 py-8 relative">
              {/* Progress Line */}
              <div className="absolute left-20 right-20 top-1/2 h-1 bg-gray-100 dark:bg-slate-700 -z-0">
                 <div className={`h-full bg-primary transition-all duration-1000 ${isIndexing ? 'w-2/3' : 'w-full'}`}></div>
              </div>

              {/* Steps */}
              {[
                  { label: '匯入文件', icon: Upload }, 
                  { label: '切分 (Chunking)', icon: Layers }, 
                  { label: '索引 (Indexing)', icon: Database }, 
                  { label: '完成 (Ready)', icon: CheckCircle }
              ].map((step, i) => {
                 const isCompleted = !isIndexing || i < 2;
                 const isCurrent = isIndexing && i === 2;
                 
                 return (
                   <div key={i} className="flex flex-col items-center gap-3 z-10 bg-white dark:bg-slate-800 px-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted ? 'bg-primary border-primary text-white' : 
                        isCurrent ? 'bg-white dark:bg-slate-800 border-primary text-primary animate-pulse shadow-glow' : 
                        'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-300 dark:text-slate-600'
                      }`}>
                         {isCompleted ? <step.icon size={20} /> : isCurrent ? <RefreshCw size={20} className="animate-spin" /> : <span className="text-sm font-bold">{i+1}</span>}
                      </div>
                      <span className={`text-sm font-bold ${isCompleted || isCurrent ? 'text-gray-800 dark:text-white' : 'text-gray-400'}`}>{step.label}</span>
                   </div>
                 );
              })}
           </div>
           <div className="px-6 pb-6 text-center">
              {isIndexing ? (
                  <p className="text-sm text-primary animate-pulse">正在將文字轉換為向量數據 (Vector Embedding)...</p>
              ) : (
                  <p className="text-sm text-success">所有文件已建立索引，可隨時被助手調用。</p>
              )}
           </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card title="資料集統計" className="md:col-span-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-700">
                   <span className="text-sm text-gray-500">文件總數</span>
                   <span className="font-bold text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-700">
                   <span className="text-sm text-gray-500">切塊 (Chunks) 總數</span>
                   <span className="font-bold text-gray-900 dark:text-white">{isIndexing ? '850 (解析中...)' : '142'}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-50 dark:border-slate-700">
                   <span className="text-sm text-gray-500">Embedding 模型</span>
                   <span className="font-mono text-xs bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">text-embedding-3-small</span>
                </div>
              </div>
           </Card>

           <Card title="文件列表" className="md:col-span-2">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-3">檔案名稱</th>
                    <th className="p-3">大小</th>
                    <th className="p-3">狀態</th>
                    <th className="p-3 text-right">動作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {['Employee_Handbook.pdf', 'Travel_Policy_v3.docx', 'Benefits_Guide.pdf'].map((file, i) => (
                    <tr key={i}>
                      <td className="p-3 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                        <FileText size={16} className="text-gray-400" /> {file}
                      </td>
                      <td className="p-3 text-gray-500">2.4 MB</td>
                      <td className="p-3"><StatusBadge status="Success" /></td>
                      <td className="p-3 text-right text-gray-400 hover:text-primary cursor-pointer"><MoreHorizontal size={16} /></td>
                    </tr>
                  ))}
                  {isIndexing && (
                     <tr>
                      <td className="p-3 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
                        <FileText size={16} className="text-gray-400" /> New_Product_Spec.pdf
                      </td>
                      <td className="p-3 text-gray-500">5.1 MB</td>
                      <td className="p-3"><StatusBadge status="Processing" /></td>
                      <td className="p-3 text-right text-gray-400"><MoreHorizontal size={16} /></td>
                    </tr>
                  )}
                </tbody>
              </table>
           </Card>
        </div>
      </div>
    );
  }

  // List View
  return (
    <Card title="知識庫 (Knowledge Base)" action={<Button icon={Plus}>新建資料集</Button>}>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
         {DATASETS.map((kb) => (
           <div 
            key={kb.id} 
            onClick={() => setActiveDataset(kb.id)}
            className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 hover:border-primary hover:bg-primary-light/10 dark:hover:bg-primary/5 transition-colors flex items-start gap-3 cursor-pointer group"
           >
             <div className="p-2 bg-gray-50 dark:bg-slate-800 rounded text-gray-600 dark:text-slate-400 border border-gray-100 dark:border-slate-700 group-hover:text-primary group-hover:border-primary/20">
               <Database size={20} />
             </div>
             <div className="flex-1">
               <div className="flex justify-between items-start">
                 <h4 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-primary transition-colors">{kb.name}</h4>
                 <StatusBadge status={kb.status === 'ready' ? 'Active' : 'Processing'} />
               </div>
               <div className="flex gap-2 text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-wide">
                 <span className="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{kb.type}</span>
                 <span>{kb.chunks} chunks</span>
               </div>
               <p className="text-xs text-gray-400 mt-2">更新於 {kb.date}</p>
             </div>
           </div>
         ))}
       </div>
    </Card>
  );
};

// 4. Assistants View: Config + Preview Chat
const AssistantsView = () => {
  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Configuration Panel */}
      <div className="w-1/2 flex flex-col gap-6 overflow-y-auto pr-2">
        <Card title="助手設定 (Configuration)">
          <div className="space-y-4">
             <Input label="名稱" defaultValue="採購助理" />
             
             <div>
               <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1">人設 (System Prompt)</label>
               <textarea 
                className="w-full h-32 border border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm p-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none" 
                defaultValue="You are a senior procurement manager. Answer questions based on the attached knowledge base. If the answer is not in the documents, state that you don't know."
               />
               <p className="text-xs text-gray-500 mt-1">定義 AI 的角色與回答規範。</p>
             </div>

             <div>
               <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1">掛載知識庫 (Knowledge Base)</label>
               <select className="w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg text-sm p-2 outline-none">
                 <option>企業採購手冊 v3.pdf</option>
                 <option>產品技術規格書</option>
               </select>
             </div>

             <div>
               <label className="text-sm font-semibold text-gray-700 dark:text-slate-300 block mb-1">模型選擇 (LLM)</label>
               <div className="grid grid-cols-3 gap-2">
                  {['GPT-4o', 'Claude 3.5', 'Llama 3'].map(m => (
                    <button key={m} className={`px-2 py-2 rounded-lg border text-sm font-medium ${m === 'GPT-4o' ? 'border-primary bg-primary-light dark:bg-primary/20 text-primary' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'}`}>
                      {m}
                    </button>
                  ))}
               </div>
             </div>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
           <Button variant="secondary">取消</Button>
           <Button icon={Save}>儲存助手</Button>
        </div>
      </div>

      {/* Chat Preview */}
      <div className="w-1/2 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success"></div>
            <span className="font-bold text-gray-700 dark:text-white text-sm">測試預覽</span>
          </div>
          <Button variant="ghost" size="sm" icon={RefreshCw}>重置對話</Button>
        </div>
        
        <div className="flex-1 bg-[#F8F9FA] dark:bg-slate-950 p-4 space-y-4 overflow-y-auto">
           {/* AI Message */}
           <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-gray-800 dark:text-slate-200 max-w-[90%]">
                您好！我是您的採購助理。請查看左側設定以調整我的人設與知識庫。有什麼可以幫您的嗎？
              </div>
           </div>

           {/* User Message */}
           <div className="flex gap-3 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold">JD</span>
              </div>
              <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-[90%]">
                採購單的簽核流程是什麼？
              </div>
           </div>

           {/* AI Thinking */}
           <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary/20 text-primary flex items-center justify-center shrink-0">
                <Bot size={18} />
              </div>
              <div className="bg-transparent p-2 flex items-center gap-2">
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                 <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 <span className="text-xs text-gray-400 ml-1">正在檢索 "企業採購手冊 v3.pdf"...</span>
              </div>
           </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
           <div className="relative">
             <input 
               type="text" 
               placeholder="輸入訊息測試..." 
               className="w-full pl-4 pr-10 py-3 border border-gray-200 dark:border-slate-700 rounded-full bg-gray-50 dark:bg-slate-800 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white"
             />
             <button className="absolute right-2 top-2 p-1.5 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors">
               <Send size={16} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// 5. Module Settings (Model Parameters & Tools)
const ModuleSettingsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
       <Card title="模型參數 (Model Parameters)">
          <div className="space-y-6">
             <div>
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">Temperature (隨機性)</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                   <span>0 (精確)</span>
                   <span className="font-mono text-primary font-bold">0.7</span>
                   <span>1 (創意)</span>
                </div>
             </div>
             <div>
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">Max Output Tokens</label>
                <input type="range" min="256" max="4096" step="256" defaultValue="2048" className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                   <span>256</span>
                   <span className="font-mono text-primary font-bold">2048</span>
                   <span>4096</span>
                </div>
             </div>
             <div>
                <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">Top P</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="1" className="w-full accent-primary" />
             </div>
          </div>
       </Card>

       <Card title="預設工具 (Default Tools)">
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">
                      <Globe size={18} />
                   </div>
                   <div>
                      <div className="font-bold text-gray-800 dark:text-white text-sm">Google Search</div>
                      <div className="text-xs text-gray-500">允許 AI 搜尋即時網路資訊</div>
                   </div>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" /></div>
             </div>
             <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded">
                      <Code size={18} />
                   </div>
                   <div>
                      <div className="font-bold text-gray-800 dark:text-white text-sm">Code Interpreter</div>
                      <div className="text-xs text-gray-500">沙盒環境執行 Python 程式碼</div>
                   </div>
                </div>
                <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" /></div>
             </div>
          </div>
       </Card>
    </div>
);

// 6. System Settings (API Keys & MCP)
const SystemSettingsView = () => (
    <div className="space-y-6 animate-in fade-in">
       <Card title="模型供應商 (Model Providers)">
          <div className="space-y-4">
            <Input label="OpenAI API Key" type="password" placeholder="sk-..." icon={Key} />
            <Input label="Anthropic API Key" type="password" placeholder="sk-ant-..." icon={Key} />
            <div className="flex justify-end">
               <Button size="sm">驗證並儲存</Button>
            </div>
          </div>
       </Card>

       <Card title="MCP 伺服器 (Model Context Protocol)">
          <div className="mb-4 text-sm text-gray-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-100 dark:border-blue-800">
             MCP 是一種標準協議，允許 AI 安全地連接至本地數據庫或外部工具。
             <a href="#" className="text-primary ml-1 hover:underline">了解更多</a>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                      <Database size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">PostgreSQL Connector</h4>
                      <p className="text-xs text-gray-500">localhost:5432</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <StatusBadge status="Connected" />
                   <Button variant="ghost" size="sm">設定</Button>
                </div>
             </div>
             
             <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg opacity-60">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 rounded">
                      <Folder size={20} />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">Google Drive MCP</h4>
                      <p className="text-xs text-gray-500">未連接</p>
                   </div>
                </div>
                <Button variant="secondary" size="sm">連接</Button>
             </div>
          </div>
       </Card>
    </div>
);


// --- Main Component ---
export const AIStudio: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ViewState>('explore');
  const { theme, toggleTheme } = useTheme();
  const { layoutMode } = useLayout();
  const navigate = useNavigate();

  // Sidebar Item Component
  const SidebarItem = ({ id, label, icon: Icon }: { id: ViewState, label: string, icon: any }) => {
    const isActive = activeModule === id;
    return (
      <button
        onClick={() => setActiveModule(id)}
        className={`relative w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-200 group
          ${isActive ? 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
        `}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
        <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
        {label}
      </button>
    );
  };

  const StudioSidebar = (
    <div className="h-full flex flex-col py-6 bg-white dark:bg-slate-900">
      <div className="px-6 mb-8 flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl">
        <Bot className="text-primary" /> AI Studio
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-slate-500">應用</div>
        <SidebarItem id="explore" label="探索 (Explore)" icon={Compass} />
        
        <div className="px-6 py-2 mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-slate-500">開發</div>
        <SidebarItem id="workspace" label="工作空間 (Workspace)" icon={Layout} />
        <SidebarItem id="knowledge" label="知識庫 (Knowledge)" icon={Database} />
        <SidebarItem id="assistants" label="助手 (Assistants)" icon={Bot} />
        
        <div className="px-6 py-2 mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-slate-500">管理</div>
        <SidebarItem id="module-settings" label="模組設定" icon={Sliders} />
        <SidebarItem id="system-settings" label="系統設定" icon={Settings} />
      </div>
    </div>
  );

  return (
    <MainLayout activeApp={AppType.AI_STUDIO} sidebar={StudioSidebar}>
      <div className={`${layoutMode === 'centered' ? 'max-w-7xl mx-auto' : 'w-full'} h-full`}>
        {activeModule === 'explore' && <ExploreView />}
        {activeModule === 'workspace' && <WorkspaceView />}
        {activeModule === 'knowledge' && <KnowledgeView />}
        {activeModule === 'assistants' && <AssistantsView />}
        {activeModule === 'module-settings' && <ModuleSettingsView />}
        {activeModule === 'system-settings' && <SystemSettingsView />}
      </div>
    </MainLayout>
  );
};