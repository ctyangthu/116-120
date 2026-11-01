/**
 * 官方主冊文檔檢視與下載模態視窗
 * 嵌入展示 /assets/aistudio/____116-120________-____1150903___866f5ae7.pdf
 * 並提供 8 頁完整條目精準對照視圖
 */

import React, { useState } from 'react';
import { ORIGINAL_PDF_PATH, PILLARS_DATA } from '../data/planData';
import { FileText, Download, ExternalLink, X, BookOpen, Layers } from 'lucide-react';

interface OfficialDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialDocModal: React.FC<OfficialDocModalProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>('pdf');
  const [activePage, setActivePage] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                東海大學 116-120 學年度校務發展計畫《主冊》官方文件
              </h3>
              <p className="text-xs text-slate-400">核定版次：1150903（共 8 頁全冊）</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 視圖切換 */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setViewMode('pdf')}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  viewMode === 'pdf' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                PDF 內嵌
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  viewMode === 'text' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                條目對照
              </button>
            </div>

            <a
              href={ORIGINAL_PDF_PATH}
              download="東海大學116-120學年度校務發展計畫主冊_1150903.pdf"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">下載 PDF</span>
            </a>

            <a
              href={ORIGINAL_PDF_PATH}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="在新分頁開啟"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {viewMode === 'pdf' ? (
          <div className="flex-1 bg-slate-950 w-full h-full relative">
            <object
              data={`${ORIGINAL_PDF_PATH}#toolbar=1`}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-500" />
                <p className="text-sm text-slate-300">
                  您的瀏覽器未啟用 PDF 直接預覽外掛，您可以直接下載或切換至「條目對照」。
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={ORIGINAL_PDF_PATH}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    在新視窗開啟 PDF
                  </a>
                  <button
                    onClick={() => setViewMode('text')}
                    className="px-4 py-2 bg-slate-800 text-slate-200 text-xs font-bold rounded-lg"
                  >
                    檢視條目對照
                  </button>
                </div>
              </div>
            </object>
          </div>
        ) : (
          <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                《主冊》校務發展構面及策略 8 頁條目精確對照：
              </span>
              <span className="text-xs text-slate-500">共 4 構面 / 12 策略 / 77 具體工作項目</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PILLARS_DATA.map(pillar => (
                <div
                  key={pillar.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: pillar.themeColor.hex }}
                    />
                    <h4 className="text-sm font-bold text-white">{pillar.fullName}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{pillar.subtitle}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    {pillar.strategies.map(s => (
                      <div key={s.id} className="text-xs space-y-1">
                        <div className="font-semibold text-slate-300">
                          策略 {s.strategyNumber}：{s.title}
                        </div>
                        <ul className="list-disc list-inside text-slate-400 pl-2 space-y-0.5">
                          {s.plans.map(pl => (
                            <li key={pl.id} className="text-[11px]">
                              計畫 {pl.id}：{pl.title}
                              <span className="text-slate-500 ml-1">
                                ({pl.workItems.length} 項工作，主責：{pl.leadUnit})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
