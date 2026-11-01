/**
 * 東海大學各行政與學術單位校務發展職責矩陣
 * 讓各處室主管與同仁一鍵檢索所屬單位的全部主責與協辦任務
 */

import React, { useState } from 'react';
import {
  ALL_EXEC_UNITS,
  ALL_WORK_ITEMS,
  PLAN_STATISTICS,
  FlattenedWorkItem
} from '../data/planData';
import {
  Users,
  CheckCircle,
  Cpu,
  Award,
  Layers,
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';

interface UnitMatrixViewProps {
  initialUnit?: string | null;
  onSelectWorkItem?: (item: FlattenedWorkItem) => void;
}

export const UnitMatrixView: React.FC<UnitMatrixViewProps> = ({
  initialUnit = null
}) => {
  const [activeUnit, setActiveUnit] = useState<string>(
    initialUnit || ALL_EXEC_UNITS[0] || '教務處'
  );

  const unitItems = ALL_WORK_ITEMS.filter(
    i => i.execUnits.includes(activeUnit) || i.leadUnit === activeUnit
  );

  const leadingItems = unitItems.filter(i => i.leadUnit === activeUnit);
  const supportingItems = unitItems.filter(
    i => i.execUnits.includes(activeUnit) && i.leadUnit !== activeUnit
  );
  const aiItems = unitItems.filter(i => i.isAiFocused);
  const evalItems = unitItems.filter(i => i.isEvaluationImprovement);

  // Collaborating departments
  const partnerCountMap: Record<string, number> = {};
  unitItems.forEach(item => {
    item.execUnits.forEach(u => {
      if (u !== activeUnit) {
        partnerCountMap[u] = (partnerCountMap[u] || 0) + 1;
      }
    });
  });

  const topPartners = Object.entries(partnerCountMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 單位選擇滾動選單 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            選擇檢視行政/學術處室 ({ALL_EXEC_UNITS.length} 個單位)：
          </span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            列印此單位任務清單
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ALL_EXEC_UNITS.map(unit => {
            const count = ALL_WORK_ITEMS.filter(i => i.execUnits.includes(unit)).length;
            const isSelected = activeUnit === unit;

            return (
              <button
                key={unit}
                onClick={() => setActiveUnit(unit)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>{unit}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 單位責任看板 Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">{activeUnit}</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                116-120 校務任務分派
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              統整該單位在全校 4 大構面、12 項策略中所承辦的推動專案與協辦責任
            </p>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">總承辦項目</span>
              <span className="text-xl font-bold text-emerald-400">{unitItems.length} 項</span>
            </div>
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">主責專案</span>
              <span className="text-xl font-bold text-white">{leadingItems.length} 項</span>
            </div>
            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">AI 智慧轉型</span>
              <span className="text-xl font-bold text-cyan-400">{aiItems.length} 項</span>
            </div>
          </div>
        </div>

        {/* 協作處室關聯 */}
        {topPartners.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">常態跨處室協作夥伴：</span>
            {topPartners.map(([pUnit, pCount]) => (
              <span
                key={pUnit}
                onClick={() => setActiveUnit(pUnit)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 cursor-pointer transition flex items-center gap-1"
              >
                <span>{pUnit}</span>
                <span className="text-[10px] text-emerald-400 font-bold">{pCount}次協作</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 工作項目清單：分「主責推進」與「跨處室協辦」 */}
      <div className="space-y-6">
        {/* (A) 主責推動計畫項目 */}
        {leadingItems.length > 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                {activeUnit} 主責統籌工作項目 ({leadingItems.length} 項)
              </h3>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-medium">
                主要權責負責
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-xl border border-slate-800/80">
              {leadingItems.map(item => (
                <div key={item.id} className="p-4 hover:bg-slate-900/50 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded">
                          {item.id}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {item.pillarName} ▸ 計畫 {item.planId}：{item.planTitle}
                        </span>
                      </div>

                      <div className="text-sm font-semibold text-white leading-relaxed">
                        {item.name}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.isEvaluationImprovement && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            【校務評鑑後續改善】
                          </span>
                        )}
                        {item.isNewConcept && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            【新增意涵】
                          </span>
                        )}
                        {item.isAiFocused && (
                          <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            AI 智慧實踐
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block mb-1">共同執行單位:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {item.execUnits.map(u => (
                          <span
                            key={u}
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              u === activeUnit
                                ? 'bg-emerald-500 text-white font-bold'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* (B) 協辦與跨處室參與工作項目 */}
        {supportingItems.length > 0 && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                {activeUnit} 共同協辦工作項目 ({supportingItems.length} 項)
              </h3>
              <span className="text-xs text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30 font-medium">
                跨單位協同作戰
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 bg-slate-950/60 rounded-xl border border-slate-800/80">
              {supportingItems.map(item => (
                <div key={item.id} className="p-4 hover:bg-slate-900/50 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/40 rounded">
                          {item.id}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          主責：{item.leadUnit} ▸ 計畫 {item.planId}：{item.planTitle}
                        </span>
                      </div>

                      <div className="text-sm font-medium text-slate-200 leading-relaxed">
                        {item.name}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.isEvaluationImprovement && (
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            【校務評鑑後續改善】
                          </span>
                        )}
                        {item.isAiFocused && (
                          <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/40 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            AI 智慧實踐
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-400 block mb-1">參與單位:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {item.execUnits.map(u => (
                          <span
                            key={u}
                            className={`px-2 py-0.5 rounded text-[11px] ${
                              u === activeUnit
                                ? 'bg-sky-500 text-white font-bold'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
