/**
 * 東海大學 116-120 學年校務發展計畫統計儀表板
 * 提供全校性宏觀指標、構面佔比、單位執行負擔矩陣、雙軸轉型度與評鑑改善追蹤
 */

import React, { useState } from 'react';
import {
  PLAN_STATISTICS,
  PILLARS_DATA,
  ALL_WORK_ITEMS,
  ALL_EXEC_UNITS,
  Pillar
} from '../data/planData';
import {
  BarChart3,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Users,
  AlertCircle,
  FileText,
  TrendingUp,
  Award,
  ArrowRight
} from 'lucide-react';

interface StatsDashboardProps {
  onSelectPillar: (pillarId: string) => void;
  onFilterByUnit: (unit: string) => void;
  onFilterByTag: (tag: 'evaluation' | 'newConcept' | 'ai' | 'crossUnit') => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  onSelectPillar,
  onFilterByUnit,
  onFilterByTag
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* 頂部宏觀指標卡片群 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>發展構面</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{PLAN_STATISTICS.totalPillars}</span>
            <span className="text-xs text-slate-400 ml-1">大主軸</span>
          </div>
          <div className="text-[11px] text-emerald-400/90 mt-1">100% 全校治理覆蓋</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>關鍵策略</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{PLAN_STATISTICS.totalStrategies}</span>
            <span className="text-xs text-slate-400 ml-1">項策略</span>
          </div>
          <div className="text-[11px] text-amber-400/90 mt-1">跨領域系統整合</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>推進計畫</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">{PLAN_STATISTICS.totalPlans}</span>
            <span className="text-xs text-slate-400 ml-1">個專案</span>
          </div>
          <div className="text-[11px] text-sky-400/90 mt-1">主責處室分工落地</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>執行工作項目</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400">{PLAN_STATISTICS.totalWorkItems}</span>
            <span className="text-xs text-slate-400 ml-1">項具體任務</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">116-120五年全期</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>AI / 智慧實踐</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-cyan-400">{PLAN_STATISTICS.aiFocusedCount}</span>
            <span className="text-xs text-slate-400 ml-1">項工作 (30%)</span>
          </div>
          <div className="text-[11px] text-cyan-400/90 mt-1">生成式AI與算力轉型</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>評鑑改善追蹤</span>
            <Award className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-400">{PLAN_STATISTICS.evaluationImprovementsCount}</span>
            <span className="text-xs text-slate-400 ml-1">項重點改善</span>
          </div>
          <div className="text-[11px] text-rose-400/90 mt-1">教育部校務評鑑對接</div>
        </div>
      </div>

      {/* 四大構面能量分布與戰略聚焦 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              四大構面發展架構與工作項目分佈
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              各構面工作項目佔比與雙軸轉型 (AI & 永續) 強度
            </p>
          </div>
          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            全校 {PLAN_STATISTICS.totalWorkItems} 項工作項目精準錨定
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PILLARS_DATA.map(pillar => {
            const dist = PLAN_STATISTICS.pillarDistribution.find(d => d.pillarId === pillar.id)!;
            const percent = Math.round((dist.itemCount / PLAN_STATISTICS.totalWorkItems) * 100);

            return (
              <div
                key={pillar.id}
                onClick={() => onSelectPillar(pillar.id)}
                className="group relative bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 transition-all cursor-pointer shadow-md hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-md border"
                      style={{
                        backgroundColor: `${pillar.themeColor.hex}15`,
                        borderColor: `${pillar.themeColor.hex}40`,
                        color: pillar.themeColor.hex
                      }}
                    >
                      {pillar.name}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {dist.itemCount} 項 ({percent}%)
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {pillar.fullName}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {pillar.subtitle}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent * 2.5}%`,
                        backgroundColor: pillar.themeColor.hex
                      }}
                    />
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {dist.planCount} 計畫
                    </span>
                    {dist.aiCount > 0 && (
                      <span className="text-[11px] bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded">
                        AI {dist.aiCount}項
                      </span>
                    )}
                  </div>
                  <span className="text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5 text-xs font-medium">
                    檢視構面 <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 執行單位負載與協作矩陣 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：各處室負載排行榜 (佔2欄) */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-400" />
                各單位執行工作項目矩陣 (共 {ALL_EXEC_UNITS.length} 個單位)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                點擊任一單位可快速過濾工作項目，區分主責推進與跨處室協作
              </p>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 主責承辦
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-500"></span> 協辦/跨單位
            </div>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {PLAN_STATISTICS.unitWorkloads.map(unitStat => {
              const maxItems = PLAN_STATISTICS.unitWorkloads[0].totalCount;
              const barWidth = Math.max(12, Math.round((unitStat.totalCount / maxItems) * 100));

              return (
                <div
                  key={unitStat.unit}
                  onClick={() => onFilterByUnit(unitStat.unit)}
                  className="group bg-slate-950/50 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        {unitStat.unit}
                      </span>
                      {unitStat.leadingCount > 0 && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-medium">
                          主責 {unitStat.leadingCount} 項
                        </span>
                      )}
                      {unitStat.aiRelatedCount > 0 && (
                        <span className="text-[10px] bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.2 rounded font-medium">
                          AI {unitStat.aiRelatedCount} 項
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-slate-300">
                      共 {unitStat.totalCount} 項工作
                    </div>
                  </div>

                  {/* Dual color progress bar */}
                  <div className="w-full bg-slate-800/80 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      style={{
                        width: `${(unitStat.leadingCount / unitStat.totalCount) * barWidth}%`
                      }}
                      className="bg-emerald-500 h-full"
                      title={`主責 ${unitStat.leadingCount} 項`}
                    />
                    <div
                      style={{
                        width: `${((unitStat.totalCount - unitStat.leadingCount) / unitStat.totalCount) * barWidth}%`
                      }}
                      className="bg-sky-500 h-full"
                      title={`協辦 ${unitStat.totalCount - unitStat.leadingCount} 項`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右側：專案特徵聚焦與評鑑看板 (佔1欄) */}
        <div className="space-y-4">
          {/* 校務評鑑後續改善焦點專區 */}
          <div
            onClick={() => onFilterByTag('evaluation')}
            className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-800/40 hover:border-rose-700 rounded-2xl p-5 cursor-pointer group transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                教育部重點
              </span>
              <span className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1">
                {PLAN_STATISTICS.evaluationImprovementsCount} 項指引 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-bold text-white">【校務評鑑後續改善】</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              涵蓋教師多元升等分析諮詢、投資市場風險評估與內控、學生教學評量全面性、貴重儀器與大數據結合、提升姐妹校交換生與雙聯學位等。
            </p>
          </div>

          {/* 最新時代「新增意涵」 */}
          <div
            onClick={() => onFilterByTag('newConcept')}
            className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 hover:border-amber-700 rounded-2xl p-5 cursor-pointer group transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                前瞻轉型
              </span>
              <span className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1">
                {PLAN_STATISTICS.newConceptsCount} 項概念 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-bold text-white">【新增意涵】深植發展</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              「態度為本、技能為輔、知識 AI 化」創新教學、AI 問題解決能力培養、強化職場態度與當責教育。
            </p>
          </div>

          {/* 跨單位合作網絡 */}
          <div
            onClick={() => onFilterByTag('crossUnit')}
            className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-800/40 hover:border-indigo-700 rounded-2xl p-5 cursor-pointer group transition"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/40">
                協同作戰
              </span>
              <span className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center gap-1">
                {PLAN_STATISTICS.crossDepartmentCount} 項協作 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-base font-bold text-white">【跨處室整合專案】</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              突破行政壁壘！行政流程智慧減量、一站式智慧校園平台、全校資安素養、貴重儀器大數據共享等跨單位合作。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
