import React, { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { AppType } from '../types';
import { Button, Card, StatusBadge, Input, Skeleton, Modal, Tabs } from '../components/SharedComponents';
import { 
  Database, GitBranch, Table, Activity, Cpu, Layers, ChevronRight, Play, Search, Filter, ArrowRight, CheckCircle, AlertTriangle,
  BarChart2, FileText, Settings, Download, Sun, Moon, ExternalLink, Bot, Workflow, Sliders, Smartphone, Grid, TrendingUp, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, BarChart, Bar, Cell, ReferenceLine, ComposedChart, Area
} from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useLayout } from '../contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const DATASETS = [
  { id: 'DS001', name: 'MFG_LineA_Sensor.csv', size: '14.2 MB', rows: '2,400,120', cols: 45, status: 'Active', created: '2024-05-12' },
  { id: 'DS002', name: 'Quality_Control_Q3.xlsx', size: '5.8 MB', rows: '85,000', cols: 28, status: 'Active', created: '2024-05-10' },
  { id: 'DS003', name: 'Machine_Vibration_Logs.csv', size: '128 MB', rows: '12,500,000', cols: 12, status: 'Processing', created: '2024-05-09' },
  { id: 'DS004', name: 'Energy_Consumption_v2.csv', size: '2.1 MB', rows: '45,200', cols: 18, status: 'Error', created: '2024-05-01' },
];

const PREDICTION_DATA = Array.from({ length: 50 }, (_, i) => {
  const actual = 10 + Math.random() * 10;
  const error = (Math.random() - 0.5) * 2; // +/- 1
  return {
    id: i,
    actual: parseFloat(actual.toFixed(2)),
    predicted: parseFloat((actual + error).toFixed(2)),
    error: parseFloat(error.toFixed(2))
  };
});

const ERROR_DIST_DATA = [
  { bin: '-1.0 ~ -0.6', count: 4 },
  { bin: '-0.6 ~ -0.2', count: 12 },
  { bin: '-0.2 ~ 0.2', count: 18 },
  { bin: '0.2 ~ 0.6', count: 10 },
  { bin: '0.6 ~ 1.0', count: 6 },
];

const HISTOGRAM_DATA = [
  { bin: '10-20', count: 15 },
  { bin: '20-30', count: 45 },
  { bin: '30-40', count: 30 },
  { bin: '40-50', count: 10 },
];

const AD_DATA = Array.from({ length: 60 }, (_, i) => {
  const base = 50 + Math.sin(i / 5) * 20;
  const noise = Math.random() * 5;
  const isAnomaly = i === 42 || i === 43;
  return {
    time: i,
    value: isAnomaly ? base + 40 : base + noise,
    thresholdUpper: base + 25,
    thresholdLower: base - 25,
    isAnomaly
  };
});

const APPS = [
  { name: 'PCB 瑕疵檢測 API', type: 'Classification', calls: '1.2M', accuracy: '99.2%', status: 'Online' },
  { name: '厚度預測服務', type: 'Regression', calls: '850k', accuracy: '94.5%', status: 'Online' },
  { name: '機台異音偵測', type: 'Anomaly', calls: '2.1M', accuracy: '98.0%', status: 'Maintenance' },
];

// --- Sub-Components ---

// 1. Dataset Management
const DatasetView = () => (
   <Card title="數據集管理 (Dataset Management)" action={<Button icon={Database}>上傳資料 (CSV/Excel)</Button>}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
               <th className="py-3 px-4">檔案名稱</th>
               <th className="py-3 px-4">資料筆數 (Rows)</th>
               <th className="py-3 px-4">特徵數 (Cols)</th>
               <th className="py-3 px-4">建立時間</th>
               <th className="py-3 px-4">狀態</th>
               <th className="py-3 px-4 text-right">動作</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100 dark:divide-slate-700">
             {DATASETS.map((ds, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer">
                   <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded">
                            <Table size={16} />
                         </div>
                         <div>
                            <div className="font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors">{ds.name}</div>
                            <div className="text-xs text-gray-400">{ds.size}</div>
                         </div>
                      </div>
                   </td>
                   <td className="py-3 px-4 font-mono text-gray-600 dark:text-slate-300">{ds.rows}</td>
                   <td className="py-3 px-4 font-mono text-gray-600 dark:text-slate-300">{ds.cols}</td>
                   <td className="py-3 px-4 text-gray-500">{ds.created}</td>
                   <td className="py-3 px-4"><StatusBadge status={ds.status} /></td>
                   <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" icon={ChevronRight}>分析</Button>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
   </Card>
);

// 2. Data Modeling (Modeling + EDA + Training)
const ModelingView = () => {
  const [activeStep, setActiveStep] = useState('health'); // 'health' | 'train' | 'analysis'
  const [activeEDA, setActiveEDA] = useState('corr'); // 'corr' | 'box' | 'hist'
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 3-Step Process Navigation */}
      <Tabs 
        activeTab={activeStep}
        onChange={setActiveStep}
        tabs={[
          { id: 'health', label: '1. 數據體檢 (Health Check)', icon: Activity },
          { id: 'train', label: '2. 自動訓練 (AutoML)', icon: Cpu },
          { id: 'analysis', label: '3. 結果分析 (Analysis)', icon: BarChart2 },
        ]}
      />

      {/* Step 1: Health Check (EDA) */}
      {activeStep === 'health' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
           {/* EDA Tabs */}
           <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700 pb-1">
              <button onClick={() => setActiveEDA('corr')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeEDA === 'corr' ? 'bg-gray-100 dark:bg-slate-800 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}>關聯性分析 (Correlation)</button>
              <button onClick={() => setActiveEDA('box')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeEDA === 'box' ? 'bg-gray-100 dark:bg-slate-800 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}>盒鬚圖 (Box Plot)</button>
              <button onClick={() => setActiveEDA('hist')} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeEDA === 'hist' ? 'bg-gray-100 dark:bg-slate-800 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:text-slate-400'}`}>直方圖 (Histogram)</button>
           </div>

           {/* Content based on EDA Tab */}
           {activeEDA === 'corr' && (
             <Card title="關聯性矩陣 (Correlation Matrix)">
                <p className="text-xs text-gray-500 mb-4">顏色越深代表特徵間的相關性越高。可用於排除多重共線性變數。</p>
                <div className="p-2 overflow-x-auto">
                    <div className="grid grid-cols-12 gap-1 min-w-[600px]">
                       {Array.from({ length: 144 }).map((_, i) => {
                         const val = Math.random(); 
                         let bg = 'bg-gray-100 dark:bg-slate-700';
                         // Simulated Heatmap Colors
                         if (i % 13 === 0) { bg = 'bg-gray-800 dark:bg-slate-900'; } // Diagonal
                         else if (val > 0.8) { bg = 'bg-primary'; } 
                         else if (val > 0.6) { bg = 'bg-primary/70'; } 
                         else if (val > 0.4) { bg = 'bg-primary/40'; } 
                         else if (val > 0.2) { bg = 'bg-primary/20'; } 
                         
                         return (
                           <div 
                            key={i} 
                            className={`aspect-square rounded-sm ${bg} hover:ring-2 ring-yellow-400 cursor-help transition-all relative group`} 
                           >
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10">
                                Corr: {(val * 2 - 1).toFixed(2)}
                             </div>
                           </div>
                         );
                       })}
                    </div>
                </div>
             </Card>
           )}

           {activeEDA === 'box' && (
             <Card title="離群值分析 (Box Plot)">
                <p className="text-xs text-gray-500 mb-4">檢查數據分佈與異常離群值 (Outliers)。</p>
                <div className="h-[400px] flex items-end justify-around p-8 border border-gray-100 dark:border-slate-800 rounded bg-gray-50/50 dark:bg-slate-900/50">
                   {['Pressure', 'Temp_A', 'Temp_B', 'Vibration', 'Rotation', 'Voltage'].map((label, i) => {
                      const height = 100 + Math.random() * 150;
                      const q1 = height * 0.25;
                      const q3 = height * 0.75;
                      const median = height * 0.5;
                      
                      return (
                         <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                            {/* Whisker Top */}
                            <div className="w-px h-8 bg-gray-400 relative">
                               <div className="absolute top-0 -left-1.5 w-3 h-px bg-gray-400"></div>
                            </div>
                            {/* Box */}
                            <div style={{height: `${height}px`}} className="w-12 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 relative hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors">
                               {/* Median Line */}
                               <div style={{bottom: `${median}px`}} className="absolute left-0 right-0 h-0.5 bg-blue-800 dark:bg-blue-400"></div>
                            </div>
                            {/* Whisker Bottom */}
                            <div className="w-px h-8 bg-gray-400 relative">
                               <div className="absolute bottom-0 -left-1.5 w-3 h-px bg-gray-400"></div>
                            </div>
                            {/* Outliers */}
                            <div className="flex flex-col gap-1 absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">
                               <div className="w-1.5 h-1.5 rounded-full border border-red-500"></div>
                               <div className="w-1.5 h-1.5 rounded-full border border-red-500"></div>
                            </div>
                            <span className="text-xs font-bold text-gray-600 dark:text-slate-400 mt-2">{label}</span>
                         </div>
                      )
                   })}
                </div>
             </Card>
           )}

           {activeEDA === 'hist' && (
             <Card title="特徵分佈 (Histogram)">
               <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={HISTOGRAM_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="bin" tick={{fontSize: 10}} />
                      <YAxis tick={{fontSize: 10}} />
                      <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                      <Bar dataKey="count" fill="#28AAA0" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </Card>
           )}
        </div>
      )}

      {/* Step 2: Auto Training */}
      {activeStep === 'train' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
           {/* Target Selection & Action */}
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 w-full space-y-4">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <TargetIcon /> 設定預測目標 (Target)
                   </h3>
                   <div className="flex items-center gap-4">
                      <select className="flex-1 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5">
                        <option>Thickness_mm (數值/回歸)</option>
                        <option>Defect_Type (類別/分類)</option>
                        <option>Pass_Fail (二元/分類)</option>
                      </select>
                      <div className="h-px w-8 bg-gray-300 dark:bg-slate-600"></div>
                      <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded border border-blue-100 dark:border-blue-800">
                        Regression Task
                      </div>
                   </div>
                </div>
                <div className="flex-shrink-0">
                   <Button variant="primary" className="h-12 px-8 text-base shadow-l2" icon={Play} onClick={() => setIsTrainingModalOpen(true)}>
                      開始自動訓練
                   </Button>
                </div>
             </div>
           </div>

           {/* Leaderboard */}
           <Card title="模型排行榜 (Leaderboard)">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700">
                   <tr className="text-xs font-bold uppercase tracking-wider">
                     <th className="p-3 pl-4">排名</th>
                     <th className="p-3">演算法 (Algorithm)</th>
                     <th className="p-3 text-right">R-Square</th>
                     <th className="p-3 text-right">RMSE</th>
                     <th className="p-3 text-right">訓練耗時</th>
                     <th className="p-3 text-center">狀態</th>
                     <th className="p-3 text-center">動作</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                   {[
                     { rank: 1, algo: 'Gradient Boosting Regressor', r2: '0.942', rmse: '0.042', time: '45s', best: true },
                     { rank: 2, algo: 'Random Forest', r2: '0.891', rmse: '0.051', time: '32s', best: false },
                     { rank: 3, algo: 'Ridge Regression', r2: '0.825', rmse: '0.089', time: '5s', best: false },
                     { rank: 4, algo: 'Lasso Regression', r2: '0.810', rmse: '0.092', time: '4s', best: false },
                     { rank: 5, algo: 'Linear Regression', r2: '0.720', rmse: '0.120', time: '2s', best: false },
                   ].map((row, i) => (
                     <tr key={i} className={`hover:bg-primary-light/20 dark:hover:bg-primary/10 transition-colors ${row.best ? 'bg-primary-light/10 dark:bg-primary/5' : ''}`}>
                       <td className="p-3 pl-4 font-bold text-gray-500 dark:text-slate-400">#{row.rank}</td>
                       <td className="p-3 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                         {row.algo}
                         {row.best && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border border-yellow-200 flex items-center gap-1"><CheckCircle size={10}/> Champion</span>}
                       </td>
                       <td className="p-3 text-right font-mono text-gray-600 dark:text-slate-300 tabular-nums">{row.r2}</td>
                       <td className="p-3 text-right font-mono text-gray-600 dark:text-slate-300 tabular-nums">{row.rmse}</td>
                       <td className="p-3 text-right text-gray-500 dark:text-slate-400 tabular-nums">{row.time}</td>
                       <td className="p-3 text-center"><StatusBadge status="Completed" /></td>
                       <td className="p-3 text-center">
                         <Button variant="secondary" size="sm" onClick={() => setActiveStep('analysis')}>詳細</Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </Card>
        </div>
      )}

      {/* Step 3: Analysis */}
      {activeStep === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
           {/* Header for Analysis */}
           <div className="lg:col-span-2 flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-lg">
                    <CheckCircle size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">Champion Model: Gradient Boosting</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">R2: 0.942 | RMSE: 0.042 | 部署狀態: 未部署</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <Button variant="secondary" size="sm" icon={Download}>下載模型</Button>
                 <Button variant="primary" size="sm" icon={Smartphone}>發布為 App</Button>
              </div>
           </div>

           {/* Y-Plot (Actual vs Predicted) */}
           <Card title="預測趨勢圖 (Y-Plot: True vs Predicted)">
              <div className="h-[320px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" />
                     <XAxis type="number" dataKey="actual" name="Actual" unit="mm" label={{ value: '實際值 (True Value)', position: 'bottom', offset: 0, fontSize: 12 }} tick={{fontSize: 10}} />
                     <YAxis type="number" dataKey="predicted" name="Predicted" unit="mm" label={{ value: '預測值 (Predicted Value)', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{fontSize: 10}} />
                     <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                     <Legend />
                     <Scatter name="預測落點" data={PREDICTION_DATA} fill="#28AAA0" shape="circle" />
                     {/* Ideal Line Simulation */}
                     <Scatter name="理想線 (Ideal)" data={[{actual: 10, predicted: 10}, {actual: 20, predicted: 20}]} line={{stroke: 'red', strokeWidth: 1, strokeDasharray: '5 5'}} shape={() => null} legendType="line" />
                   </ScatterChart>
                 </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">紅線代表完美預測，點越接近紅線越準確。</p>
           </Card>

           {/* Error Histogram */}
           <Card title="誤差分佈 (Error Histogram)">
              <div className="h-[320px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={ERROR_DIST_DATA} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="bin" tick={{fontSize: 10}} label={{ value: '誤差範圍', position: 'bottom', offset: 0, fontSize: 12 }} />
                     <YAxis tick={{fontSize: 10}} />
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px', borderRadius: '8px'}} />
                     <Bar dataKey="count" fill="#8884d8">
                       {ERROR_DIST_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === 2 ? '#28AAA0' : '#CBD5E1'} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">誤差集中在 0 附近代表模型表現良好。</p>
           </Card>
        </div>
      )}

      {/* Training Modal */}
      <Modal 
        isOpen={isTrainingModalOpen} 
        onClose={() => setIsTrainingModalOpen(false)} 
        title="啟動 Auto Training"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsTrainingModalOpen(false)}>取消</Button>
            <Button variant="primary" onClick={() => setIsTrainingModalOpen(false)}>確認執行</Button>
          </>
        }
      >
        <div className="space-y-4">
           <p className="text-gray-600 dark:text-slate-300 text-sm">
             系統將自動嘗試以下演算法：
             <span className="font-bold block mt-1 ml-2">• Linear, Ridge, Lasso Regression</span>
             <span className="font-bold block ml-2">• Random Forest, Gradient Boosting</span>
             <span className="font-bold block ml-2">• XGBoost, LightGBM</span>
           </p>
           <div className="h-px bg-gray-100 dark:bg-slate-700"></div>
           <Input label="專案名稱" defaultValue="Thickness_Prediction_20240520" />
           <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border border-blue-100 dark:border-blue-800 flex gap-3 items-start">
              <CheckCircle className="text-blue-600 dark:text-blue-400 text-sm shrink-0" size={16} />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-bold block mb-0.5">預估時間</span>
                約 5 分鐘 (根據資料量 2.4M 筆)
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};

// 3. Model Management View
const ModelManagementView = () => (
    <Card title="模型管理 (Model Management)" action={<Button icon={Filter}>篩選</Button>}>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Thickness_Pred_v1', algo: 'Gradient Boosting', acc: '94%', date: '2024-05-12', status: 'Deployed' },
            { name: 'Defect_Class_v3', algo: 'Random Forest', acc: '89%', date: '2024-05-10', status: 'Draft' },
            { name: 'Energy_Forecast_Q2', algo: 'LSTM', acc: '91%', date: '2024-05-08', status: 'Archived' },
          ].map((model, i) => (
             <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-l2 hover:border-primary/50 transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-300 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Layers size={20} />
                   </div>
                   <StatusBadge status={model.status} />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{model.name}</h4>
                <p className="text-xs text-gray-500 mb-4">{model.algo} • {model.date}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700">
                   <span className="text-xs font-bold text-gray-600 dark:text-slate-400">Accuracy: <span className="text-primary text-sm">{model.acc}</span></span>
                   <ChevronRight size={16} className="text-gray-300 dark:text-slate-600 group-hover:text-primary" />
                </div>
             </div>
          ))}
       </div>
    </Card>
);

// 4. Parameter Optimization
const ParamOptimizationView = () => (
   <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
      <div className="lg:col-span-1 space-y-6">
         <Card title="超參數調校 (Hyperparameters)">
            <div className="space-y-6">
               <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">Learning Rate</label>
                  <input type="range" min="0.01" max="0.5" step="0.01" className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                     <span>0.01</span>
                     <span className="font-mono text-primary font-bold">0.15</span>
                     <span>0.5</span>
                  </div>
               </div>
               <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">Max Depth</label>
                  <input type="range" min="3" max="20" step="1" className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                     <span>3</span>
                     <span className="font-mono text-primary font-bold">8</span>
                     <span>20</span>
                  </div>
               </div>
               <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">N Estimators</label>
                  <input type="range" min="50" max="500" step="10" className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                     <span>50</span>
                     <span className="font-mono text-primary font-bold">200</span>
                     <span>500</span>
                  </div>
               </div>
               <Button className="w-full" icon={Play}>重新訓練 (Retrain)</Button>
            </div>
         </Card>
      </div>
      <div className="lg:col-span-2">
         <Card title="效能預覽 (Validation Curve)">
             <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-slate-900/50 rounded text-gray-400">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={[{x: 1, y: 0.6}, {x: 2, y: 0.75}, {x: 3, y: 0.82}, {x: 4, y: 0.85}, {x: 5, y: 0.86}, {x: 6, y: 0.85}]} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" label={{value: 'Max Depth', position: 'bottom'}} />
                      <YAxis domain={[0.5, 1]} label={{value: 'Accuracy', angle: -90, position: 'insideLeft'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="y" stroke="#28AAA0" strokeWidth={2} dot={{r: 4}} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
         </Card>
      </div>
   </div>
);

// 5. Data Engineering (Visual Flow)
const EngineeringView = () => (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm animate-in fade-in">
      <div className="h-14 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-4 bg-gray-50 dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-gray-800 dark:text-white">資料工程流程圖 (Data Flow)</h3>
          <span className="px-2 py-0.5 rounded text-xs bg-success-bg text-success font-bold uppercase">Active</span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">自動排版</Button>
          <Button variant="primary" size="sm" icon={Play}>執行流程</Button>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 bg-[#F8F9FA] dark:bg-slate-950 relative overflow-auto cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
               backgroundSize: '24px 24px',
               opacity: 0.3
             }}>
        </div>

        {/* Connection Lines (Simulated SVG) */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
            </marker>
          </defs>
          <path d="M 320 160 C 380 160, 380 160, 420 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
          <path d="M 676 160 C 730 160, 730 160, 780 160" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
          <path d="M 676 160 C 730 160, 730 280, 780 280" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" fill="none" />
        </svg>

        {/* Source Node */}
        <div className="absolute top-28 left-20 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-l-4 border-l-blue-500 border-y border-r border-gray-200 dark:border-slate-700 hover:shadow-l3 transition-shadow">
          <div className="p-4">
             <div className="flex justify-between items-start mb-2">
               <div className="flex items-center gap-2">
                 <Database size={16} className="text-blue-500" />
                 <span className="font-bold text-gray-800 dark:text-white text-sm">來源資料</span>
               </div>
               <CheckCircle size={14} className="text-success" />
             </div>
             <p className="text-xs font-mono text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800 p-1.5 rounded border border-gray-100 dark:border-slate-700">MFG_Sensor_Raw.csv</p>
          </div>
        </div>

        {/* Transform Node */}
        <div className="absolute left-[420px] top-28 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-l-4 border-l-purple-500 border-y border-r border-gray-200 dark:border-slate-700 hover:shadow-l3 transition-shadow">
          <div className="p-4">
             <div className="flex justify-between items-start mb-2">
               <div className="flex items-center gap-2">
                 <Activity size={16} className="text-purple-500" />
                 <span className="font-bold text-gray-800 dark:text-white text-sm">特徵工程</span>
               </div>
               <div className="animate-spin w-3 h-3 border-2 border-primary border-t-transparent rounded-full" />
             </div>
             <div className="space-y-1 my-2">
               <div className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded inline-block mr-1">Missing Value</div>
               <div className="text-xs text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-1 rounded inline-block">Normalization</div>
             </div>
          </div>
        </div>

        {/* Validation Node (Split) */}
        <div className="absolute left-[780px] top-28 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-l-4 border-l-green-500 border-y border-r border-gray-200 dark:border-slate-700 hover:shadow-l3 transition-shadow">
          <div className="p-4">
             <span className="font-bold text-gray-800 dark:text-white text-sm block mb-1">訓練集 (80%)</span>
             <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5"><div className="w-4/5 h-full bg-green-500 rounded-full"></div></div>
          </div>
        </div>
        <div className="absolute left-[780px] top-64 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-l2 border-l-4 border-l-orange-500 border-y border-r border-gray-200 dark:border-slate-700 hover:shadow-l3 transition-shadow">
          <div className="p-4">
             <span className="font-bold text-gray-800 dark:text-white text-sm block mb-1">測試集 (20%)</span>
             <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5"><div className="w-1/5 h-full bg-orange-500 rounded-full"></div></div>
          </div>
        </div>
      </div>
    </div>
);

// 6. App List View
const AppListView = () => (
   <Card title="APP 列表 (Deployed Applications)" action={<Button icon={Smartphone}>部署新 APP</Button>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {APPS.map((app, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-l2 hover:border-primary/50 transition-all group">
               <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white shadow-sm">
                     <Smartphone size={20} />
                  </div>
                  <StatusBadge status={app.status} />
               </div>
               <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{app.name}</h4>
               <p className="text-xs text-gray-500 mb-4 font-mono">{app.type} Model</p>
               
               <div className="space-y-2 border-t border-gray-100 dark:border-slate-700 pt-4">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">API Calls</span>
                     <span className="font-bold text-gray-900 dark:text-white">{app.calls}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Accuracy</span>
                     <span className="font-bold text-success">{app.accuracy}</span>
                  </div>
               </div>
               <div className="mt-4">
                  <Button variant="secondary" className="w-full" size="sm">進入應用</Button>
               </div>
            </div>
         ))}
      </div>
   </Card>
);

// 7. AD Model (Anomaly Detection)
const ADModelView = () => (
   <div className="space-y-6 animate-in fade-in">
      <Card title="AD 模型監控 (Anomaly Detection)">
         <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
               <ComposedChart data={AD_DATA} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="time" type="number" hide />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip labelFormatter={() => ''} />
                  <Legend />
                  <Area type="monotone" dataKey="thresholdUpper" stroke="none" fill="#e5e7eb" fillOpacity={0.3} name="正常範圍" stackId="1" />
                  <Area type="monotone" dataKey="thresholdLower" stroke="none" fill="transparent" stackId="1" /> {/* Stack trick for range usually needs custom shape or 2 areas, simplifying here */}
                  <Line type="monotone" dataKey="value" stroke="#28AAA0" strokeWidth={2} dot={false} name="即時數值" />
                  <Scatter name="異常點" data={AD_DATA.filter(d => d.isAnomaly)} fill="#EF4444" shape="circle" />
               </ComposedChart>
            </ResponsiveContainer>
         </div>
         <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-primary rounded-full"></div>
               <span className="text-sm text-gray-600 dark:text-slate-300">正常訊號</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-3 h-3 bg-red-500 rounded-full"></div>
               <span className="text-sm text-gray-600 dark:text-slate-300">偵測異常 (Anomaly)</span>
            </div>
         </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card title="近期警報">
            <div className="space-y-3">
               {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 rounded-lg">
                     <AlertCircle className="text-red-500" size={20} />
                     <div>
                        <div className="font-bold text-red-700 dark:text-red-300 text-sm">數值超出閾值 (Value > 95.0)</div>
                        <div className="text-xs text-red-500">2024-05-12 14:30:22</div>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
         <Card title="模型設定">
            <div className="space-y-4">
               <Input label="監控頻率 (秒)" defaultValue="5" />
               <div>
                  <label className="text-sm font-bold text-gray-700 dark:text-slate-300 mb-2 block">敏感度 (Sensitivity)</label>
                  <input type="range" className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-gray-500">
                     <span>低</span>
                     <span>高</span>
                  </div>
               </div>
            </div>
         </Card>
      </div>
   </div>
);


// Helper Component for Icon
const TargetIcon = () => (
   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

export const AutoML: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dataset' | 'modeling' | 'models' | 'optimization' | 'engineering' | 'apps' | 'ad-model'>('dataset');
  const { theme } = useTheme();
  const { layoutMode } = useLayout();

  const SidebarItem = ({ id, label, icon: Icon }: any) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`relative w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-200 group
          ${isActive ? 'bg-primary-light text-primary dark:bg-primary/20 dark:text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'}
        `}
      >
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />}
        <Icon size={18} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
        {label}
      </button>
    );
  };

  const AutoMLSidebar = (
    <div className="h-full flex flex-col py-6 bg-white dark:bg-slate-900">
      <div className="px-6 mb-8 flex items-center gap-2 text-primary font-bold text-xl">
        <Cpu /> AutoML
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        <SidebarItem id="dataset" label="數據集管理" icon={Database} />
        <SidebarItem id="modeling" label="數據建模" icon={Activity} />
        <SidebarItem id="models" label="模型管理" icon={Layers} />
        <SidebarItem id="optimization" label="參數最佳化" icon={Sliders} />
        <SidebarItem id="engineering" label="數據工程" icon={GitBranch} />
        
        <div className="px-6 py-2 mt-6 text-xs font-bold text-gray-400 uppercase tracking-wider dark:text-slate-500">部署</div>
        <SidebarItem id="apps" label="APP 列表" icon={Grid} />
        <SidebarItem id="ad-model" label="AD 模型 (異常偵測)" icon={AlertTriangle} />
      </div>
    </div>
  );

  return (
    <MainLayout activeApp={AppType.AUTOML} sidebar={AutoMLSidebar}>
      <div className={`${layoutMode === 'centered' ? 'max-w-7xl mx-auto' : 'w-full'} pb-10`}>
        {activeTab === 'dataset' && <DatasetView />}
        {activeTab === 'modeling' && <ModelingView />}
        {activeTab === 'models' && <ModelManagementView />}
        {activeTab === 'optimization' && <ParamOptimizationView />}
        {activeTab === 'engineering' && <EngineeringView />}
        {activeTab === 'apps' && <AppListView />}
        {activeTab === 'ad-model' && <ADModelView />}
      </div>
    </MainLayout>
  );
};
