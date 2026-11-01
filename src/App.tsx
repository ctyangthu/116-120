/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PILLARS_DATA,
  ALL_WORK_ITEMS,
  PLAN_STATISTICS,
  ORIGINAL_PDF_PATH
} from './data/planData';
import { Campus3DViewer } from './components/Campus3DViewer';
import { StatsDashboard } from './components/StatsDashboard';
import { PlanExplorer } from './components/PlanExplorer';
import { UnitMatrixView } from './components/UnitMatrixView';
import { OfficialDocModal } from './components/OfficialDocModal';
import {
  Box,
  BarChart3,
  ListFilter,
  Users,
  FileText,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle,
  GraduationCap,
  Layers,
  Cpu,
  Globe,
  Leaf,
  ChevronRight
} from 'lucide-react';

type TabMode = '3d' | 'dashboard' | 'explorer' | 'matrix';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabMode>('3d');
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [filterUnit, setFilterUnit] = useState<string | null>(null);
  const [activeSpecialTag, setActiveSpecialTag] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Handler when user clicks explore plan in 3D scene
  const handleExploreFrom3D = (pillarId: string) => {
    setSelectedPillarId(pillarId);
    setActiveTab('explorer');
  };

  // Handler when user clicks unit in dashboard
  const handleFilterByUnit = (unit: string) => {
    setFilterUnit(unit);
    setActiveTab('matrix');
  };

  // Handler when user clicks special tag in dashboard
  const handleFilterByTag = (tag: 'evaluation' | 'newConcept' | 'ai' | 'crossUnit') => {
    setActiveSpecialTag(tag);
    setActiveTab('explorer');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 頂部全域導航列 */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & 標題 */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-950/50">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest text-emerald-400 uppercase">
                  TUNGHAI UNIVERSITY
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded border border-slate-700 font-mono">
                  116-120 學年
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                校務發展計畫導覽系統
              </h1>
            </div>
          </div>

          {/* 視圖切換按鈕群 */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                activeTab === '3d'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3D 校園戰略視圖</span>
              <span className="sm:hidden">3D</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">統計儀表板</span>
              <span className="sm:hidden">統計</span>
            </button>

            <button
              onClick={() => setActiveTab('explorer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                activeTab === 'explorer'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">計畫與工作項目</span>
              <span className="sm:hidden">計畫</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                activeTab === 'matrix'
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">處室職責矩陣</span>
              <span className="sm:hidden">處室</span>
            </button>

            {/* 官方 PDF 按鈕 */}
            <button
              onClick={() => setIsPdfModalOpen(true)}
              title="檢視官方主冊原檔 PDF"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 transition ml-1"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>官方主冊 PDF</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner (僅在 3D 與儀表板頁面頂部精簡顯示) */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
              <span>《主冊》校務發展構面及策略</span>
              <span>•</span>
              <span className="text-slate-400">核定版 1150903</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              雙軸轉型・邁向卓越 — 東海大學校務藍圖
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              以「永續發展」、「文理融合」、「AI 實踐」、「國際接軌」四大構面為核心架構，推動全校 {PLAN_STATISTICS.totalStrategies}
              項策略、{PLAN_STATISTICS.totalPlans} 個計畫、{PLAN_STATISTICS.totalWorkItems} 項具體工作項目，落實智慧治理與全球影響力。
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveTab('explorer');
                setActiveSpecialTag('ai');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-500/15 text-sky-300 hover:bg-sky-500/25 border border-sky-500/40 rounded-xl text-xs font-semibold transition"
            >
              <Cpu className="w-3.5 h-3.5 text-sky-400" />
              <span>AI 賦能 ({PLAN_STATISTICS.aiFocusedCount}項)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('explorer');
                setActiveSpecialTag('evaluation');
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/40 rounded-xl text-xs font-semibold transition"
            >
              <span>評鑑改善 ({PLAN_STATISTICS.evaluationImprovementsCount}項)</span>
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-slate-300 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>文件原檔</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主內容區塊 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Tab 1: 3D 校園戰略視圖 */}
        {activeTab === '3d' && (
          <div className="space-y-6">
            <Campus3DViewer
              selectedPillarId={selectedPillarId}
              onSelectPillar={id => setSelectedPillarId(id)}
              onExplorePlan={handleExploreFrom3D}
            />

            {/* 3D 場景下方的四大構面快速導覽卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PILLARS_DATA.map(pillar => {
                const isSelected = selectedPillarId === pillar.id;
                return (
                  <div
                    key={pillar.id}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-slate-900 border-white shadow-xl scale-[1.02]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: pillar.themeColor.hex }}
                        />
                        <span className="text-xs font-bold text-white">{pillar.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {pillar.strategies.reduce(
                          (acc, s) => acc + s.plans.reduce((a, p) => a + p.workItems.length, 0),
                          0
                        )}{' '}
                        項
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                      {pillar.fullName}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {pillar.subtitle}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleExploreFrom3D(pillar.id);
                        }}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-0.5"
                      >
                        檢視項目清單 <ChevronRight className="w-3 h-3" />
                      </button>
                      <span className="text-slate-500 text-[10px]">
                        {pillar.strategies.length} 策略
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: 統計儀表板 */}
        {activeTab === 'dashboard' && (
          <StatsDashboard
            onSelectPillar={id => {
              setSelectedPillarId(id);
              setActiveTab('explorer');
            }}
            onFilterByUnit={handleFilterByUnit}
            onFilterByTag={handleFilterByTag}
          />
        )}

        {/* Tab 3: 計畫與工作項目瀏覽器 */}
        {activeTab === 'explorer' && (
          <PlanExplorer
            selectedPillarId={selectedPillarId}
            onSelectPillar={setSelectedPillarId}
            filterUnit={filterUnit}
            onFilterUnit={setFilterUnit}
            activeSpecialTag={activeSpecialTag}
            onSelectSpecialTag={setActiveSpecialTag}
          />
        )}

        {/* Tab 4: 處室職責矩陣 */}
        {activeTab === 'matrix' && (
          <UnitMatrixView initialUnit={filterUnit} />
        )}
      </main>

      {/* 頁腳 */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-8 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-300">東海大學 116-120 學年校務發展計畫</span>
            <span className="text-slate-600">|</span>
            <span>行政、財務、永續、文理、AI、國際全週期藍圖</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="hover:text-emerald-400 transition"
            >
              檢視核定版主冊 (1150903)
            </button>
            <span className="text-slate-700">•</span>
            <span>
              共 {PLAN_STATISTICS.totalPillars} 構面 / {PLAN_STATISTICS.totalStrategies} 策略 /{' '}
              {PLAN_STATISTICS.totalPlans} 計畫 / {PLAN_STATISTICS.totalWorkItems} 工作項目
            </span>
          </div>
        </div>
      </footer>

      {/* 官方主冊 PDF 預覽模態視窗 */}
      <OfficialDocModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} />
    </div>
  );
}
