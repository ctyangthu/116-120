/**
 * 東海大學 116-120 校務發展計畫互動檢索與階層展開瀏覽器
 * 具備全文即時搜尋、構面篩選、單位切換、標籤快篩、收藏清單與匯出功能
 */

import React, { useState, useMemo } from 'react';
import {
  PILLARS_DATA,
  ALL_WORK_ITEMS,
  ALL_EXEC_UNITS,
  FlattenedWorkItem,
  Pillar,
  Plan,
  Strategy
} from '../data/planData';
import {
  Search,
  Filter,
  Star,
  ChevronDown,
  ChevronRight,
  Layers,
  Cpu,
  Award,
  Sparkles,
  Users,
  Download,
  Share2,
  Check,
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

interface PlanExplorerProps {
  selectedPillarId: string | null;
  onSelectPillar: (pillarId: string | null) => void;
  filterUnit: string | null;
  onFilterUnit: (unit: string | null) => void;
  activeSpecialTag: string | null;
  onSelectSpecialTag: (tag: string | null) => void;
}

export const PlanExplorer: React.FC<PlanExplorerProps> = ({
  selectedPillarId,
  onSelectPillar,
  filterUnit,
  onFilterUnit,
  activeSpecialTag,
  onSelectSpecialTag
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedPlans, setCollapsedPlans] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('thu_plan_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState<FlattenedWorkItem | null>(null);

  // Toggle bookmark
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('thu_plan_bookmarks', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Toggle plan collapse
  const togglePlanCollapse = (planId: string) => {
    setCollapsedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const collapseAll = () => {
    const allPlanIds: Record<string, boolean> = {};
    PILLARS_DATA.forEach(p => {
      p.strategies.forEach(s => {
        s.plans.forEach(pl => {
          allPlanIds[pl.id] = true;
        });
      });
    });
    setCollapsedPlans(allPlanIds);
  };

  const expandAll = () => {
    setCollapsedPlans({});
  };

  const resetFilters = () => {
    setSearchQuery('');
    onSelectPillar(null);
    onFilterUnit(null);
    onSelectSpecialTag(null);
    setShowBookmarksOnly(false);
  };

  // Filtered Items logic
  const filteredItems = useMemo(() => {
    return ALL_WORK_ITEMS.filter(item => {
      // 1. Pillar filter
      if (selectedPillarId && item.pillarId !== selectedPillarId) return false;

      // 2. Unit filter
      if (filterUnit && !item.execUnits.includes(filterUnit) && item.leadUnit !== filterUnit) {
        return false;
      }

      // 3. Special tags filter
      if (activeSpecialTag === 'evaluation' && !item.isEvaluationImprovement) return false;
      if (activeSpecialTag === 'newConcept' && !item.isNewConcept) return false;
      if (activeSpecialTag === 'ai' && !item.isAiFocused) return false;
      if (activeSpecialTag === 'crossUnit' && item.execUnits.length <= 1) return false;

      // 4. Bookmark filter
      if (showBookmarksOnly && !bookmarkedIds.includes(item.id)) return false;

      // 5. Search query (matches id, name, plan title, strategy title, units)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inId = item.id.toLowerCase().includes(q);
        const inName = item.name.toLowerCase().includes(q);
        const inPlan = item.planTitle.toLowerCase().includes(q);
        const inStrat = item.strategyTitle.toLowerCase().includes(q);
        const inUnit = item.execUnits.some(u => u.toLowerCase().includes(q));
        const inLead = item.leadUnit.toLowerCase().includes(q);

        return inId || inName || inPlan || inStrat || inUnit || inLead;
      }

      return true;
    });
  }, [
    selectedPillarId,
    filterUnit,
    activeSpecialTag,
    showBookmarksOnly,
    bookmarkedIds,
    searchQuery
  ]);

  // Export filtered items to CSV
  const handleExportCSV = () => {
    const headers = [
      '序號',
      '工作項目名稱',
      '執行單位',
      '主責單位',
      '所屬計畫',
      '策略名稱',
      '發展構面',
      '評鑑改善項目',
      '新增意涵'
    ];
    const rows = filteredItems.map(item => [
      `"${item.id}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.execUnits.join('、')}"`,
      `"${item.leadUnit}"`,
      `"${item.planTitle.replace(/"/g, '""')}"`,
      `"${item.strategyTitle.replace(/"/g, '""')}"`,
      `"${item.pillarName}"`,
      item.isEvaluationImprovement ? '是' : '否',
      item.isNewConcept ? '是' : '否'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `東海大學116-120校務發展計畫_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const text = filteredItems
      .map(
        i =>
          `[${i.id}] ${i.name} (執行單位: ${i.execUnits.join('、')} | 主責: ${i.leadUnit})`
      )
      .join('\n');

    navigator.clipboard.writeText(
      `東海大學 116-120 學年校務發展計畫篩選清單 (共 ${filteredItems.length} 項):\n\n${text}`
    );
    setCopiedMessage('已複製清單文字至剪貼簿！');
    setTimeout(() => setCopiedMessage(null), 3000);
  };

  // Group filtered items by Pillar -> Strategy -> Plan
  const structuredView = useMemo(() => {
    const filteredItemIds = new Set(filteredItems.map(i => i.id));

    return PILLARS_DATA.map(pillar => {
      const strategies = pillar.strategies.map(strategy => {
        const plans = strategy.plans.map(plan => {
          const items = plan.workItems.filter(item => filteredItemIds.has(item.id));
          return {
            ...plan,
            filteredWorkItems: items
          };
        }).filter(p => p.filteredWorkItems.length > 0);

        return {
          ...strategy,
          filteredPlans: plans
        };
      }).filter(s => s.filteredPlans.length > 0);

      return {
        ...pillar,
        filteredStrategies: strategies
      };
    }).filter(p => p.filteredStrategies.length > 0);
  }, [filteredItems]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedPillarId || filterUnit || activeSpecialTag || showBookmarksOnly
  );

  return (
    <div className="space-y-6">
      {/* 搜尋與篩選控制中樞 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* 第一列：搜尋框與操作按鈕 */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜尋工作項目、計畫名稱、序號 (如 1-1-1, AI, 總務處, 評鑑, 華語)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                清除
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {/* 單位下拉篩選 */}
            <select
              value={filterUnit || ''}
              onChange={e => onFilterUnit(e.target.value || null)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="">所有執行單位 ({ALL_EXEC_UNITS.length})</option>
              {ALL_EXEC_UNITS.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* 收藏清單切換 */}
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs rounded-xl border transition whitespace-nowrap ${
                showBookmarksOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>已關注 ({bookmarkedIds.length})</span>
            </button>

            {/* 匯出 CSV */}
            <button
              onClick={handleExportCSV}
              title="匯出篩選結果為 CSV 檔案"
              className="flex items-center gap-1 px-3 py-2.5 text-xs rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>匯出</span>
            </button>

            {/* 複製文字 */}
            <button
              onClick={handleCopySummary}
              title="複製目前篩選的工作項目清單"
              className="flex items-center gap-1 px-3 py-2.5 text-xs rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>複製</span>
            </button>
          </div>
        </div>

        {/* 第二列：四大構面切換頁籤 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
          <button
            onClick={() => onSelectPillar(null)}
            className={`px-3.5 py-1.5 text-xs rounded-lg font-medium border transition whitespace-nowrap ${
              selectedPillarId === null
                ? 'bg-slate-100 text-slate-950 font-bold border-white shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            全部構面 ({ALL_WORK_ITEMS.length}項)
          </button>
          {PILLARS_DATA.map(p => {
            const isSelected = selectedPillarId === p.id;
            const pCount = ALL_WORK_ITEMS.filter(i => i.pillarId === p.id).length;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPillar(isSelected ? null : p.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-lg font-medium border transition whitespace-nowrap ${
                  isSelected
                    ? 'border-white text-white font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                style={
                  isSelected
                    ? {
                        backgroundColor: p.themeColor.hex,
                        color: '#ffffff'
                      }
                    : {}
                }
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: p.themeColor.hex }}
                />
                <span>{p.fullName} ({pCount})</span>
              </button>
            );
          })}
        </div>

        {/* 第三列：重點標籤快篩 */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> 特色標籤:
            </span>

            <button
              onClick={() =>
                onSelectSpecialTag(activeSpecialTag === 'ai' ? null : 'ai')
              }
              className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                activeSpecialTag === 'ai'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>AI / 智慧實踐 (18)</span>
            </button>

            <button
              onClick={() =>
                onSelectSpecialTag(activeSpecialTag === 'evaluation' ? null : 'evaluation')
              }
              className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                activeSpecialTag === 'evaluation'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-bold'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Award className="w-3 h-3 text-rose-400" />
              <span>校務評鑑改善 (5)</span>
            </button>

            <button
              onClick={() =>
                onSelectSpecialTag(activeSpecialTag === 'newConcept' ? null : 'newConcept')
              }
              className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                activeSpecialTag === 'newConcept'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 font-bold'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>新增意涵 (4)</span>
            </button>

            <button
              onClick={() =>
                onSelectSpecialTag(activeSpecialTag === 'crossUnit' ? null : 'crossUnit')
              }
              className={`px-2.5 py-1 rounded-md border transition flex items-center gap-1 ${
                activeSpecialTag === 'crossUnit'
                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500 font-bold'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Users className="w-3 h-3 text-indigo-400" />
              <span>跨處室協作 (10)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 underline text-xs"
              >
                <RotateCcw className="w-3 h-3" /> 重設條件
              </button>
            )}
            <button
              onClick={expandAll}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5"
            >
              全部展開
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={collapseAll}
              className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5"
            >
              全部收合
            </button>
          </div>
        </div>

        {/* 複製成功提示 */}
        {copiedMessage && (
          <div className="p-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{copiedMessage}</span>
          </div>
        )}
      </div>

      {/* 搜尋結果筆數提示 */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div>
          符合條件項目：
          <span className="font-bold text-emerald-400 text-sm ml-1">
            {filteredItems.length}
          </span>{' '}
          / {ALL_WORK_ITEMS.length} 項
          {filterUnit && (
            <span className="ml-2 bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              執行單位：{filterUnit}
            </span>
          )}
          {activeSpecialTag && (
            <span className="ml-2 bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              標籤篩選中
            </span>
          )}
        </div>
      </div>

      {/* 空狀態 */}
      {structuredView.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-slate-300">查無符合條件的計畫工作項目</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            建議嘗試調整關鍵字搜尋詞或點擊「重設條件」檢視全校校務發展計畫完整架構。
          </p>
          <button
            onClick={resetFilters}
            className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
          >
            重設所有篩選條件
          </button>
        </div>
      )}

      {/* 階層結構清單 (Pillar -> Strategy -> Plan -> Work Items) */}
      <div className="space-y-8">
        {structuredView.map(pillar => (
          <section key={pillar.id} className="space-y-4">
            {/* 構面標題 Header */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: pillar.themeColor.hex }}
                />
                <div>
                  <h2 className="text-lg font-black text-white">{pillar.fullName}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{pillar.subtitle}</p>
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-md border"
                style={{
                  backgroundColor: `${pillar.themeColor.hex}15`,
                  borderColor: `${pillar.themeColor.hex}40`,
                  color: pillar.themeColor.hex
                }}
              >
                {pillar.filteredStrategies.reduce(
                  (acc, s) =>
                    acc + s.filteredPlans.reduce((a, p) => a + p.filteredWorkItems.length, 0),
                  0
                )}{' '}
                項工作
              </span>
            </div>

            {/* 策略列表 */}
            <div className="space-y-4 pl-2 md:pl-4 border-l-2 border-slate-800">
              {pillar.filteredStrategies.map(strategy => (
                <div key={strategy.id} className="space-y-3">
                  {/* 策略標頭 */}
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    <span>策略 {strategy.strategyNumber}：{strategy.title}</span>
                  </div>

                  {/* 計畫卡片群 */}
                  <div className="grid grid-cols-1 gap-3">
                    {strategy.filteredPlans.map(plan => {
                      const isCollapsed = Boolean(collapsedPlans[plan.id]);

                      return (
                        <div
                          key={plan.id}
                          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition shadow-sm"
                        >
                          {/* 計畫標頭 (點擊可展開收合) */}
                          <div
                            onClick={() => togglePlanCollapse(plan.id)}
                            className="p-3.5 bg-slate-900/90 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition select-none"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                              <span className="text-slate-400">
                                {isCollapsed ? (
                                  <ChevronRight className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </span>
                              <div className="font-bold text-sm text-slate-100 truncate">
                                計畫 {plan.id}：{plan.title}
                              </div>
                              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap hidden sm:inline-block">
                                主責：{plan.leadUnit}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-400">
                                {plan.filteredWorkItems.length} 項工作
                              </span>
                            </div>
                          </div>

                          {/* 工作項目表格/清單 */}
                          {!isCollapsed && (
                            <div className="p-3 bg-slate-950/40 divide-y divide-slate-800/80">
                              {plan.filteredWorkItems.map(item => {
                                const isBookmarked = bookmarkedIds.includes(item.id);

                                return (
                                  <div
                                    key={item.id}
                                    onClick={() =>
                                      setSelectedItemDetail({
                                        ...item,
                                        pillarId: pillar.id,
                                        pillarNumber: pillar.pillarNumber,
                                        pillarName: pillar.name,
                                        strategyId: strategy.id,
                                        strategyNumber: strategy.strategyNumber,
                                        strategyTitle: strategy.title,
                                        planId: plan.id,
                                        planTitle: plan.title,
                                        leadUnit: plan.leadUnit
                                      })
                                    }
                                    className="py-3 px-2 rounded-lg hover:bg-slate-900/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                                  >
                                    <div className="flex items-start gap-3 flex-1">
                                      {/* 序號標記 */}
                                      <div className="mt-0.5">
                                        <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                                          {item.id}
                                        </span>
                                      </div>

                                      {/* 工作項目主體內容 */}
                                      <div className="space-y-1.5 flex-1">
                                        <div className="text-sm text-slate-200 group-hover:text-emerald-300 font-medium leading-relaxed">
                                          {item.name}
                                        </div>

                                        {/* 標籤群 */}
                                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                          {item.isEvaluationImprovement && (
                                            <span className="text-[10px] bg-rose-500/15 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                              <Award className="w-3 h-3 text-rose-400" />
                                              【校務評鑑後續改善】
                                            </span>
                                          )}

                                          {item.isNewConcept && (
                                            <span className="text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                              <Sparkles className="w-3 h-3 text-amber-400" />
                                              【新增意涵】
                                            </span>
                                          )}

                                          {item.isAiFocused && (
                                            <span className="text-[10px] bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                              <Cpu className="w-3 h-3 text-sky-400" />
                                              AI / 智慧賦能
                                            </span>
                                          )}

                                          {item.execUnits.length > 1 && (
                                            <span className="text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-medium">
                                              跨 {item.execUnits.length} 單位協辦
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* 執行單位標籤與收藏按鈕 */}
                                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                                      <div className="flex flex-wrap gap-1 items-center">
                                        {item.execUnits.map(unit => (
                                          <span
                                            key={unit}
                                            onClick={e => {
                                              e.stopPropagation();
                                              onFilterUnit(unit);
                                            }}
                                            className={`text-[11px] px-2 py-0.5 rounded border transition cursor-pointer ${
                                              filterUnit === unit
                                                ? 'bg-emerald-500 text-white font-bold border-emerald-400'
                                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                                            }`}
                                          >
                                            {unit}
                                          </span>
                                        ))}
                                      </div>

                                      <button
                                        onClick={e => toggleBookmark(item.id, e)}
                                        title={isBookmarked ? '取消關注' : '關注此工作項目'}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition"
                                      >
                                        <Star
                                          className={`w-4 h-4 ${
                                            isBookmarked
                                              ? 'fill-amber-400 text-amber-400'
                                              : 'text-slate-500 hover:text-amber-300'
                                          }`}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* 工作項目詳細檢視彈出視窗 (Modal) */}
      {selectedItemDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedItemDetail(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-800 text-emerald-400 rounded-md border border-slate-700">
                  序號 {selectedItemDetail.id}
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  {selectedItemDetail.pillarName} ▸ 策略 {selectedItemDetail.strategyNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white leading-relaxed">
                {selectedItemDetail.name}
              </h3>
            </div>

            {/* 標籤 */}
            <div className="flex flex-wrap gap-2">
              {selectedItemDetail.isEvaluationImprovement && (
                <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  【校務評鑑後續改善重點項目】
                </span>
              )}
              {selectedItemDetail.isNewConcept && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  【新增意涵】深植發展
                </span>
              )}
              {selectedItemDetail.isAiFocused && (
                <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  AI / 智慧雙軸轉型工作
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">主責推動單位：</span>
                <span className="text-sm font-bold text-emerald-400">
                  {selectedItemDetail.leadUnit}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">協同執行單位：</span>
                <span className="text-sm font-bold text-slate-200">
                  {selectedItemDetail.execUnits.join('、')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">所屬計畫名稱：</span>
                <span className="text-slate-300">
                  計畫 {selectedItemDetail.planId}：{selectedItemDetail.planTitle}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">所屬推動策略：</span>
                <span className="text-slate-300">
                  策略 {selectedItemDetail.strategyNumber}：{selectedItemDetail.strategyTitle}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={e => toggleBookmark(selectedItemDetail.id, e)}
                className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition"
              >
                <Star
                  className={`w-4 h-4 ${
                    bookmarkedIds.includes(selectedItemDetail.id)
                      ? 'fill-amber-400 text-amber-400'
                      : ''
                  }`}
                />
                <span>
                  {bookmarkedIds.includes(selectedItemDetail.id) ? '已關注項目' : '關注加入清單'}
                </span>
              </button>

              <button
                onClick={() => setSelectedItemDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
