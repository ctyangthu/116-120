/**
 * 東海大學 116-120 學年校務發展計畫完整資料集
 * 包含四大構面、12項策略、28個計畫與60項具體工作項目
 */

export interface WorkItem {
  id: string; // e.g. "1-1-1"
  name: string; // 計畫名稱 / 建議方向
  execUnits: string[]; // 執行單位清單
  isEvaluationImprovement?: boolean; // 【校務評鑑後續改善】
  isNewConcept?: boolean; // 【新增意涵】
  isAiFocused?: boolean; // AI / 智慧治理相關
  notes?: string; // 補充說明
}

export interface Plan {
  id: string; // e.g. "1-1"
  title: string; // 計畫名稱
  leadUnit: string; // 主責單位
  workItems: WorkItem[];
}

export interface Strategy {
  id: string; // e.g. "1"
  strategyNumber: number; // 1 ~ 12
  title: string; // 策略名稱
  plans: Plan[];
}

export interface Pillar {
  id: string; // e.g. "pillar-1"
  pillarNumber: number; // 1 ~ 4
  name: string; // 永續發展
  fullName: string; // 構面一：永續發展
  subtitle: string; // 建立行政、財務與環境之健全體系
  description: string;
  themeColor: {
    primary: string; // e.g. emerald-600
    border: string;
    bg: string;
    badge: string;
    hex: string;
    glow: string;
  };
  iconName: string;
  strategies: Strategy[];
}

export const PILLARS_DATA: Pillar[] = [
  {
    id: "pillar-1",
    pillarNumber: 1,
    name: "永續發展",
    fullName: "構面一：永續發展",
    subtitle: "建立行政、財務與環境之健全體系",
    description: "精實行政創新與管理效率、完善財務規劃與資源活化、營造低碳節能與淨零校園生態，深化東海特色文資建築保存。",
    themeColor: {
      primary: "emerald-500",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/10",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      hex: "#10b981",
      glow: "rgba(16, 185, 129, 0.4)"
    },
    iconName: "Leaf",
    strategies: [
      {
        id: "strategy-1",
        strategyNumber: 1,
        title: "精實行政創新與管理效率",
        plans: [
          {
            id: "1-1",
            title: "啟動智慧校務治理與組織架構敏捷轉型",
            leadUnit: "人事室",
            workItems: [
              {
                id: "1-1-1",
                name: "跨單位行政流程數位化與智慧減量之具體實踐",
                execUnits: ["總務處", "會計室", "人事室"],
                isAiFocused: true
              },
              {
                id: "1-1-2",
                name: "整合教職員創新提案，深化校務精實與數位 AI 革新",
                execUnits: ["人事室"],
                isAiFocused: true
              },
              {
                id: "1-1-3",
                name: "因應智慧與永續雙軸轉型之敏捷性組織編制調適與架構整併",
                execUnits: ["人事室"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "1-2",
            title: "建構前瞻跨域人才培力與策略性績效治理",
            leadUnit: "人事室",
            workItems: [
              {
                id: "1-2-1",
                name: "推動主管及職工之「AI、跨域、永續」素養之培育計畫",
                execUnits: ["人事室"],
                isAiFocused: true
              },
              {
                id: "1-2-2",
                name: "精進數位化管考機制，強化重點工作執行效能",
                execUnits: ["秘書室"],
                isAiFocused: true
              },
              {
                id: "1-2-3",
                name: "優化與平衡團體績效考核機制，鏈結校務治理評估",
                execUnits: ["人事室"]
              },
              {
                id: "1-2-4",
                name: "宜針對教師多數選擇一般升等（或選擇其他升等方式未獲通過）之原因進行分析探討，以提供適當輔導與諮詢機制；亦宜擬定更積極之鼓勵作法，或可參考其他成效較佳學校之相關辦法，以營造支持多元價值之學術氛圍。(可修改計畫名稱或融入其他計畫內)",
                execUnits: ["人事室"],
                isEvaluationImprovement: true
              }
            ]
          }
        ]
      },
      {
        id: "strategy-2",
        strategyNumber: 2,
        title: "完善財務規劃與資源活化",
        plans: [
          {
            id: "2-1",
            title: "精進財務綜效與智慧會計",
            leadUnit: "會計室",
            workItems: [
              {
                id: "2-1-1",
                name: "強化財務韌性與資源綜效",
                execUnits: ["會計室"]
              },
              {
                id: "2-1-2",
                name: "預算會計作業革新與 AI 化",
                execUnits: ["會計室"],
                isAiFocused: true
              },
              {
                id: "2-1-3",
                name: "由於投資市場存在潛藏風險，宜定期實施投資市場風險評估，並納入內部控制制度落實管控與稽核。(可修改計畫名稱或融入其他計畫內)",
                execUnits: ["會計室", "秘書室"],
                isEvaluationImprovement: true
              }
            ]
          },
          {
            id: "2-2",
            title: "推廣資產活化，共創場域新價值",
            leadUnit: "總務處",
            workItems: [
              {
                id: "2-2-1",
                name: "創生東海・縫合城市之校區廊道開發與資產活化計畫",
                execUnits: ["總務處"]
              },
              {
                id: "2-2-2",
                name: "空間資產高效化，場域開放與資源共享",
                execUnits: ["推廣處"]
              }
            ]
          }
        ]
      },
      {
        id: "strategy-3",
        strategyNumber: 3,
        title: "營造低碳節能與永續校園",
        plans: [
          {
            id: "3-1",
            title: "打造智慧永續校園多元示範場域與實踐永續行動",
            leadUnit: "永續處",
            workItems: [
              {
                id: "3-1-1",
                name: "持續構築智慧永續校園多元示範場域，實踐永續價值與行動",
                execUnits: ["永續處"]
              },
              {
                id: "3-1-2",
                name: "精進校園生態與碳中和路徑之智慧監測與數據治理",
                execUnits: ["永續處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "3-2",
            title: "實踐淨零校園與多元節能",
            leadUnit: "永續處",
            workItems: [
              {
                id: "3-2-1",
                name: "推動淨零校園之實踐機制",
                execUnits: ["永續處"]
              },
              {
                id: "3-2-2",
                name: "規劃與執行多元節能作法",
                execUnits: ["總務處"]
              }
            ]
          },
          {
            id: "3-3",
            title: "維護特色建築與改善環境",
            leadUnit: "總務處",
            workItems: [
              {
                id: "3-3-1",
                name: "深化文資保存與再利用，彰顯特色建築之美與共享環境價值",
                execUnits: ["總務處"]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "pillar-2",
    pillarNumber: 2,
    name: "文理融合",
    fullName: "構面二：文理融合",
    subtitle: "精進跨域自主學習及研究",
    description: "創建文理融合之跨域學習典範、深化東海特色通識與職涯教育、推動品德勞作教育與三級輔導網絡，擴增文理特色研究群與產官學社會實踐。",
    themeColor: {
      primary: "amber-500",
      border: "border-amber-500/30",
      bg: "bg-amber-500/10",
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      hex: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.4)"
    },
    iconName: "GraduationCap",
    strategies: [
      {
        id: "strategy-4",
        strategyNumber: 4,
        title: "創建文理融合之跨域學習典範",
        plans: [
          {
            id: "4-1",
            title: "推動跨域自主學習機制",
            leadUnit: "教務處",
            workItems: [
              {
                id: "4-1-1",
                name: "深化跨校聯盟，擴大學生適性發展空間",
                execUnits: ["教務處"]
              },
              {
                id: "4-1-2",
                name: "精進 AI 課程，成立中區 AI 教學資源中心",
                execUnits: ["教務處"],
                isAiFocused: true
              },
              {
                id: "4-1-3",
                name: "持續開設跨域學程，並將實習與 AI 課程融入學程規劃，拓展學生多元學習管道",
                execUnits: ["教務處"],
                isAiFocused: true
              },
              {
                id: "4-1-4",
                name: "深化校園創新創業孵化鏈，鏈結外部資源與跨域支持體系",
                execUnits: ["研發處"]
              },
              {
                id: "4-1-5",
                name: "設計以態度為本、技能為輔、知識 AI 化的創新教學策略….. (可修改計畫名稱或融入其他計畫內)",
                execUnits: ["教務處"],
                isNewConcept: true,
                isAiFocused: true
              },
              {
                id: "4-1-6",
                name: "AI 為本之問題解決能力培養 (可修改計畫名稱或融入其他計畫內)",
                execUnits: ["教務處"],
                isNewConcept: true,
                isAiFocused: true
              },
              {
                id: "4-1-7",
                name: "宜鼓勵學生踴躍填答期末教學意見調查，使學生回饋之結果與意見更具全面性及代表性。(可修改計畫名稱或融入其他計畫內)",
                execUnits: ["教務處"],
                isEvaluationImprovement: true
              }
            ]
          },
          {
            id: "4-2",
            title: "精進具東海特色之通識課程",
            leadUnit: "教務處",
            workItems: [
              {
                id: "4-2-1",
                name: "設置通識各領域課程審查小組及課程評估機制",
                execUnits: ["教務處"]
              },
              {
                id: "4-2-2",
                name: "持續推廣通識自主學習實作課程，建立多元彈性審查機制",
                execUnits: ["教務處"]
              },
              {
                id: "4-2-3",
                name: "增設通識跨領域課程，鼓勵通識教師精進課程內涵",
                execUnits: ["教務處"]
              },
              {
                id: "4-2-4",
                name: "推動生成式 AI 思維教育，培育學生 AI 素養與跨域應用能力",
                execUnits: ["教務處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "4-3",
            title: "推動職涯課程模組化",
            leadUnit: "教務處",
            workItems: [
              {
                id: "4-3-1",
                name: "推動實習課程並完善制度及運作機制",
                execUnits: ["教務處"]
              },
              {
                id: "4-3-2",
                name: "強化系所職涯啟航與產業鏈結",
                execUnits: ["教務處"]
              },
              {
                id: "4-3-3",
                name: "強化職場態度教育 (可修改計畫名稱或融入其他計畫內)",
                execUnits: ["教務處"],
                isNewConcept: true
              }
            ]
          }
        ]
      },
      {
        id: "strategy-5",
        strategyNumber: 5,
        title: "推動全人教育與適性輔導",
        plans: [
          {
            id: "5-1",
            title: "推動品德教育與課外學習",
            leadUnit: "學務處",
            workItems: [
              {
                id: "5-1-1",
                name: "落實品德教育，推動住宿學習，培養自律能力與團隊精神",
                execUnits: ["學務處"]
              },
              {
                id: "5-1-2",
                name: "鼓勵學生參加社團或成立社群，培養領導能力及培育學生講師",
                execUnits: ["學務處"]
              },
              {
                id: "5-1-3",
                name: "推動勞作教育實作通識課程與社群共學，提升責任承擔與領導實踐能力 (強調盡責、團隊精神的態度教育)",
                execUnits: ["勞教處"]
              },
              {
                id: "5-1-4",
                name: "重視態度教育，培養追求完美、當責態度 (可修改計畫名稱或融入其他計畫內)",
                execUnits: ["學務處"],
                isNewConcept: true
              }
            ]
          },
          {
            id: "5-2",
            title: "建構多元支持網絡",
            leadUnit: "學務處",
            workItems: [
              {
                id: "5-2-1",
                name: "提升導師輔導知能，結合諮商輔導人員與醫療資源，落實三級輔導功能",
                execUnits: ["學務處"]
              },
              {
                id: "5-2-2",
                name: "推動多元獎勵、完善輔助機制，幫助學生安心學習",
                execUnits: ["學務處"]
              }
            ]
          }
        ]
      },
      {
        id: "strategy-6",
        strategyNumber: 6,
        title: "深化跨領域研究與共創實踐能量",
        plans: [
          {
            id: "6-1",
            title: "拓展文理跨領域之特色研究群",
            leadUnit: "研發處",
            workItems: [
              {
                id: "6-1-1",
                name: "依據學校特色與跨域發展需求，規劃並邀請校外專家、參與跨校合作與學術交流",
                execUnits: ["研發處"]
              },
              {
                id: "6-1-2",
                name: "透過跨系 AI 社群協作，開拓特色 AI 教學與研發",
                execUnits: ["研發處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "6-2",
            title: "推動產官學共創與社會實踐創新",
            leadUnit: "研發處",
            workItems: [
              {
                id: "6-2-1",
                name: "鏈結內外部資源推動產官學共創網絡",
                execUnits: ["研發處"]
              },
              {
                id: "6-2-2",
                name: "建構企業需求導向之產業服務與人才培育機制，推動企業培訓、計畫輔導及產學合作，促進學校研發與人才資源對接產業需求",
                execUnits: ["推廣處"]
              },
              {
                id: "6-2-3",
                name: "透過跨領域協作，推動社會實踐創新",
                execUnits: ["勞教處"]
              }
            ]
          },
          {
            id: "6-3",
            title: "厚實教學單位創研能量",
            leadUnit: "教務處",
            workItems: [
              {
                id: "6-3-1",
                name: "健全教學單位科研與產學激勵制度，深化學術卓越與國際合作能見度",
                execUnits: ["研發處"]
              },
              {
                id: "6-3-2",
                name: "強化自主學習動能，鼓勵學生投入展演、競賽與取得證照",
                execUnits: ["教務處"]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "pillar-3",
    pillarNumber: 3,
    name: "AI 實踐",
    fullName: "構面三：AI 實踐",
    subtitle: "推動校務、教學與研究的智慧轉型",
    description: "全面推動智慧校務治理、AI Agent 與一站式數位服務、AI 賦能雲端教學平台、AI TA 教學支援、建構前瞻 AI 算力基地與智慧產學研究動能。",
    themeColor: {
      primary: "sky-500",
      border: "border-sky-500/30",
      bg: "bg-sky-500/10",
      badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      hex: "#0ea5e9",
      glow: "rgba(14, 165, 233, 0.4)"
    },
    iconName: "Cpu",
    strategies: [
      {
        id: "strategy-7",
        strategyNumber: 7,
        title: "推動行政運作之智慧校務治理",
        plans: [
          {
            id: "7-1",
            title: "建置智慧化行政系統",
            leadUnit: "圖資處",
            workItems: [
              {
                id: "7-1-1",
                name: "推動行政業務智慧化，建置校務 AI Agent 平台",
                execUnits: ["圖資處"],
                isAiFocused: true
              },
              {
                id: "7-1-2",
                name: "智慧治理及校務研究",
                execUnits: ["永續處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "7-2",
            title: "優化數位校內服務品質",
            leadUnit: "圖資處",
            workItems: [
              {
                id: "7-2-1",
                name: "升級校園網路、雲端服務、教學場域，建構高速、穩定、安全的數位學習與行政環境",
                execUnits: ["教務處", "圖資處", "總務處"],
                isAiFocused: true
              },
              {
                id: "7-2-2",
                name: "整合智慧校園場域服務，打造一站式智慧校園服務平台",
                execUnits: ["圖資處", "總務處", "學務處", "教務處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "7-3",
            title: "提升 AI 與資安素養",
            leadUnit: "圖資處",
            workItems: [
              {
                id: "7-3-1",
                name: "持續推動資訊安全管理制度，建立校級資安韌性治理架構",
                execUnits: ["圖資處"]
              },
              {
                id: "7-3-2",
                name: "建立生成式 AI 使用與資料安全指引，完善教職員生 AI 及資安素養培訓機制",
                execUnits: ["圖資處", "教務處", "人事室", "法遵室"],
                isAiFocused: true
              }
            ]
          }
        ]
      },
      {
        id: "strategy-8",
        strategyNumber: 8,
        title: "建構 AI 賦能之教學與雲端學習環境",
        plans: [
          {
            id: "8-1",
            title: "整合 AI 智慧學習平台與教學支持系統",
            leadUnit: "教務處",
            workItems: [
              {
                id: "8-1-1",
                name: "建構 AI 教學支持中心與智慧教學環境",
                execUnits: ["教務處", "圖資處"],
                isAiFocused: true
              },
              {
                id: "8-1-2",
                name: "推動 AI 教學助理（AI TA）與教師教學支援系統",
                execUnits: ["教務處", "圖資處"],
                isAiFocused: true
              },
              {
                id: "8-1-3",
                name: "發展 AI 微學程、微課程與數位教材共享平台",
                execUnits: ["教務處", "圖資處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "8-2",
            title: "深化 AI 創新教學與終身學習發展",
            leadUnit: "教務處",
            workItems: [
              {
                id: "8-2-1",
                name: "推展 AI 數位課程、網路大學與混成教學",
                execUnits: ["教務處"],
                isAiFocused: true
              },
              {
                id: "8-2-2",
                name: "建立教師 AI 教學能力認證與專業發展制度",
                execUnits: ["教務處"],
                isAiFocused: true
              },
              {
                id: "8-2-3",
                name: "推動學生 AI 素養與自主學習支持機制",
                execUnits: ["教務處"],
                isAiFocused: true
              },
              {
                id: "8-2-4",
                name: "宜將 AI、物聯網及大數據分析等專業課程，與校內重點實驗室、貴重儀器結合，增進學生數位化設施、設備運用與大數據分析之能力。(可修改計畫名稱或融入其他計畫內)",
                execUnits: ["教務處", "總務處", "研發處", "圖資處"],
                isEvaluationImprovement: true,
                isAiFocused: true
              }
            ]
          }
        ]
      },
      {
        id: "strategy-9",
        strategyNumber: 9,
        title: "應用科技提升教研產學動能",
        plans: [
          {
            id: "9-1",
            title: "推動全校性 AI 教研",
            leadUnit: "教務處",
            workItems: [
              {
                id: "9-1-1",
                name: "學院 AI 教學研究加速計畫 (校務精進計畫)",
                execUnits: ["院級單位"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "9-2",
            title: "建置前瞻 AI 算力基地與數位研發環境",
            leadUnit: "圖資處",
            workItems: [
              {
                id: "9-2-1",
                name: "建置前瞻 AI 算力基地與數位研發環境，提供教師與學生進行 AI 運算所需資源",
                execUnits: ["圖資處", "總務處"],
                isAiFocused: true
              }
            ]
          },
          {
            id: "9-3",
            title: "推動智慧相關研究與產學計畫",
            leadUnit: "研發處",
            workItems: [
              {
                id: "9-3-1",
                name: "聚焦智慧研究，驅動產學創新",
                execUnits: ["研發處", "推廣處"],
                isAiFocused: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "pillar-4",
    pillarNumber: 4,
    name: "國際接軌",
    fullName: "構面四：國際接軌",
    subtitle: "全球夥伴鏈結與國際人才永續發展",
    description: "深化策略性全球姊妹校合作、推動交換與雙聯跨文化學習、精準拓展國際生源與 EMI 增能、健全國際生全週期生活輔導、推展東海全球品牌與國際校友鏈結。",
    themeColor: {
      primary: "violet-500",
      border: "border-violet-500/30",
      bg: "bg-violet-500/10",
      badge: "bg-violet-500/20 text-violet-300 border-violet-500/40",
      hex: "#8b5cf6",
      glow: "rgba(139, 92, 246, 0.4)"
    },
    iconName: "Globe",
    strategies: [
      {
        id: "strategy-10",
        strategyNumber: 10,
        title: "深化全球夥伴鏈結與國際合作影響力",
        plans: [
          {
            id: "10-1",
            title: "建構策略性全球夥伴網絡",
            leadUnit: "國際處",
            workItems: [
              {
                id: "10-1-1",
                name: "依校務發展特色及重點區域，深化重點姊妹校及策略聯盟之實質合作",
                execUnits: ["國際處"]
              },
              {
                id: "10-1-2",
                name: "建立國際合作績效檢視及夥伴關係管理機制",
                execUnits: ["國際處"]
              }
            ]
          },
          {
            id: "10-2",
            title: "推動國際人才雙向流動與跨文化學習",
            leadUnit: "國際處",
            workItems: [
              {
                id: "10-2-1",
                name: "發展交換、雙聯、訪學及短期研習等國際學習模式",
                execUnits: ["國際處"]
              },
              {
                id: "10-2-2",
                name: "強化國際移動經驗及學習成果之連結",
                execUnits: ["國際處"]
              },
              {
                id: "10-2-3",
                name: "宜提高國際姐妹校交換生名額，並與國外大學簽訂更多雙聯學制，鼓勵學生申請出國交換或攻讀雙聯學位，以達成提升學生國際移動力之目標。(可修改計畫名稱或融入其他計畫內)",
                execUnits: ["國際處"],
                isEvaluationImprovement: true
              }
            ]
          },
          {
            id: "10-3",
            title: "深化國際教研合作與跨域共創",
            leadUnit: "研發處",
            workItems: [
              {
                id: "10-3-1",
                name: "推動各學院依教研特色發展具延續性之國際合作",
                execUnits: ["研發處", "國際處"]
              },
              {
                id: "10-3-2",
                name: "推動國際合作與本校教研發展重點相互連結",
                execUnits: ["研發處", "國際處"]
              }
            ]
          }
        ]
      },
      {
        id: "strategy-11",
        strategyNumber: 11,
        title: "建構國際人才全週期培育與發展體系",
        plans: [
          {
            id: "11-1",
            title: "推動國際生源精準拓展與招生轉換",
            leadUnit: "國際處",
            workItems: [
              {
                id: "11-1-1",
                name: "依本校定位與人才培育方向，規劃重點國際生源布局",
                execUnits: ["國際處"]
              },
              {
                id: "11-1-2",
                name: "推廣與增強院系 EMI 課程量能",
                execUnits: ["教務處", "管理學院"]
              },
              {
                id: "11-1-3",
                name: "強化招生接觸、申請、錄取至註冊之整體轉換效能",
                execUnits: ["國際處", "教務處", "圖資處"]
              }
            ]
          },
          {
            id: "11-2",
            title: "發展華語教育與學位銜接培育",
            leadUnit: "國際處",
            workItems: [
              {
                id: "11-2-1",
                name: "強化華語學習與學位升學之銜接",
                execUnits: ["國際處"]
              },
              {
                id: "11-2-2",
                name: "發展具本校特色之華語教育與多元學習方案",
                execUnits: ["國際處"]
              }
            ]
          },
          {
            id: "11-3",
            title: "精進國際學生全週期輔導與生涯發展",
            leadUnit: "國際處",
            workItems: [
              {
                id: "11-3-1",
                name: "完善自錄取、入境、在學至畢業之學習、生活適應與全週期輔導",
                execUnits: ["國際處"]
              },
              {
                id: "11-3-2",
                name: "強化職涯培力、產業接軌、留臺就業及畢業流向追蹤",
                execUnits: ["國際處"]
              }
            ]
          }
        ]
      },
      {
        id: "strategy-12",
        strategyNumber: 12,
        title: "建立國際品牌與校友鏈結",
        plans: [
          {
            id: "12-1",
            title: "執行全球行銷與國際連結",
            leadUnit: "公事處",
            workItems: [
              {
                id: "12-1-1",
                name: "建立東海品牌，推動具東海特色之「卓越新聞+精準傳播」計畫",
                execUnits: ["公事處"]
              },
              {
                id: "12-1-2",
                name: "推廣國際鏈結課程 (如：喬治亞理工合作課程等)",
                execUnits: ["推廣處"]
              },
              {
                id: "12-1-3",
                name: "與校友會密切合作，深化學校與校友間的連結",
                execUnits: ["公事處"]
              }
            ]
          }
        ]
      }
    ]
  }
];

// 扁平化所有工作項目
export interface FlattenedWorkItem extends WorkItem {
  pillarId: string;
  pillarNumber: number;
  pillarName: string;
  strategyId: string;
  strategyNumber: number;
  strategyTitle: string;
  planId: string;
  planTitle: string;
  leadUnit: string;
}

export const ALL_WORK_ITEMS: FlattenedWorkItem[] = PILLARS_DATA.flatMap(pillar =>
  pillar.strategies.flatMap(strategy =>
    strategy.plans.flatMap(plan =>
      plan.workItems.map(item => ({
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
      }))
    )
  )
);

// 提取所有唯一執行單位
export const ALL_EXEC_UNITS = Array.from(
  new Set(ALL_WORK_ITEMS.flatMap(i => i.execUnits))
).sort((a, b) => {
  // Sort by count descending
  const countA = ALL_WORK_ITEMS.filter(i => i.execUnits.includes(a)).length;
  const countB = ALL_WORK_ITEMS.filter(i => i.execUnits.includes(b)).length;
  return countB - countA;
});

// 提取所有唯一主責單位
export const ALL_LEAD_UNITS = Array.from(
  new Set(PILLARS_DATA.flatMap(p => p.strategies.flatMap(s => s.plans.map(pl => pl.leadUnit))))
).sort();

// 核心統計資料
export const PLAN_STATISTICS = {
  totalPillars: PILLARS_DATA.length,
  totalStrategies: PILLARS_DATA.reduce((acc, p) => acc + p.strategies.length, 0),
  totalPlans: PILLARS_DATA.reduce(
    (acc, p) => acc + p.strategies.reduce((sAcc, s) => sAcc + s.plans.length, 0),
    0
  ),
  totalWorkItems: ALL_WORK_ITEMS.length,
  totalUnits: ALL_EXEC_UNITS.length,
  evaluationImprovementsCount: ALL_WORK_ITEMS.filter(i => i.isEvaluationImprovement).length,
  newConceptsCount: ALL_WORK_ITEMS.filter(i => i.isNewConcept).length,
  aiFocusedCount: ALL_WORK_ITEMS.filter(i => i.isAiFocused).length,
  crossDepartmentCount: ALL_WORK_ITEMS.filter(i => i.execUnits.length > 1).length,
  
  // 各構面工作項目數量
  pillarDistribution: PILLARS_DATA.map(p => {
    const items = ALL_WORK_ITEMS.filter(i => i.pillarId === p.id);
    return {
      pillarId: p.id,
      pillarNumber: p.pillarNumber,
      name: p.name,
      fullName: p.fullName,
      hex: p.themeColor.hex,
      itemCount: items.length,
      planCount: p.strategies.reduce((acc, s) => acc + s.plans.length, 0),
      aiCount: items.filter(i => i.isAiFocused).length,
      crossUnitCount: items.filter(i => i.execUnits.length > 1).length
    };
  }),

  // 各執行單位參與項目數量（含主責與協辦）
  unitWorkloads: ALL_EXEC_UNITS.map(unit => {
    const executingItems = ALL_WORK_ITEMS.filter(i => i.execUnits.includes(unit));
    const leadingItems = ALL_WORK_ITEMS.filter(i => i.leadUnit === unit);
    return {
      unit,
      totalCount: executingItems.length,
      leadingCount: leadingItems.length,
      crossCollaborationCount: executingItems.filter(i => i.execUnits.length > 1).length,
      aiRelatedCount: executingItems.filter(i => i.isAiFocused).length
    };
  }).sort((a, b) => b.totalCount - a.totalCount)
};

export const ORIGINAL_PDF_PATH = "/assets/aistudio/____116-120________-____1150903___866f5ae7.pdf";
