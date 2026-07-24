import type { DataRow } from '../types/chart';

export interface SampleDataset {
  id: string;
  name: string;
  description: string;
  chartType: 'bar' | 'column' | 'line' | 'area' | 'pie' | 'scatter' | 'radar';
  xAxisKey: string;
  seriesKeys: string[];
  title: string;
  subtitle: string;
  source: string;
  unit: string;
  csvRaw: string;
  data: DataRow[];
}

export const SAMPLE_DATASETS: SampleDataset[] = [
  {
    id: 'gdp-comparison',
    name: '주요국 GDP 및 성장률 (2024)',
    description: '글로벌 주요 국가의 명목 GDP (조 달러)',
    chartType: 'column',
    xAxisKey: '국가',
    seriesKeys: ['GDP_조달러'],
    title: '2024년 세계 주요국 명목 GDP 비교',
    subtitle: '미국과 중국이 글로벌 경제의 큰 비중을 차지하고 있습니다.',
    source: 'IMF World Economic Outlook',
    unit: '조 달러',
    csvRaw: `국가,GDP_조달러
미국,28.7
중국,18.5
독일,4.7
일본,4.3
인도,3.9
영국,3.5
프랑스,3.1
대한민국,1.9`,
    data: [
      { 국가: '미국', GDP_조달러: 28.7 },
      { 국가: '중국', GDP_조달러: 18.5 },
      { 국가: '독일', GDP_조달러: 4.7 },
      { 국가: '일본', GDP_조달러: 4.3 },
      { 국가: '인도', GDP_조달러: 3.9 },
      { 국가: '영국', GDP_조달러: 3.5 },
      { 국가: '프랑스', GDP_조달러: 3.1 },
      { 국가: '대한민국', GDP_조달러: 1.9 },
    ],
  },
  {
    id: 'tech-revenue-trend',
    name: '빅테크 분기별 매출 추이',
    description: '2021년~2024년 글로벌 테크 기업들의 매출 연간 변화',
    chartType: 'line',
    xAxisKey: '연도',
    seriesKeys: ['애플', '마이크로소프트', '구글', '엔비디아'],
    title: '글로벌 주요 테크 기업 연간 매출 추이 (2021~2024)',
    subtitle: '엔비디아의 AI 붐에 따른 가파른 성장세가 두드러집니다.',
    source: '각 사 연례 기업 실적 보고서 (SEC Filing)',
    unit: '십억 달러',
    csvRaw: `연도,애플,마이크로소프트,구글,엔비디아
2021,365,168,257,26
2022,394,198,282,27
2023,383,211,307,60
2024,391,245,350,126`,
    data: [
      { 연도: '2021', 애플: 365, 마이크로소프트: 168, 구글: 257, 엔비디아: 26 },
      { 연도: '2022', 애플: 394, 마이크로소프트: 198, 구글: 282, 엔비디아: 27 },
      { 연도: '2023', 애플: 383, 마이크로소프트: 211, 구글: 307, 엔비디아: 60 },
      { 연도: '2024', 애플: 391, 마이크로소프트: 245, 구글: 350, 엔비디아: 126 },
    ],
  },
  {
    id: 'browser-market-share',
    name: '글로벌 웹 브라우저 점유율',
    description: '2024년 기준 데스크톱 및 모바일 통합 브라우저 시장 점유율',
    chartType: 'pie',
    xAxisKey: '브라우저',
    seriesKeys: ['점유율'],
    title: '2024년 글로벌 웹 브라우저 시장 점유율',
    subtitle: '크롬이 과반 이상의 압도적인 점유율을 유지하고 있습니다.',
    source: 'StatCounter Global Stats',
    unit: '%',
    csvRaw: `브라우저,점유율
Chrome,65.2
Safari,18.4
Edge,5.2
Firefox,3.1
Opera,2.8
기타,5.3`,
    data: [
      { 브라우저: 'Chrome', 점유율: 65.2 },
      { 브라우저: 'Safari', 점유율: 18.4 },
      { 브라우저: 'Edge', 점유율: 5.2 },
      { 브라우저: 'Firefox', 점유율: 3.1 },
      { 브라우저: 'Opera', 점유율: 2.8 },
      { 브라우저: '기타', 점유율: 5.3 },
    ],
  },
  {
    id: 'energy-mix-area',
    name: '에너지원별 발전 비중 추이',
    description: '신재생 에너지와 기존 화석 연료 발전 비율 변화',
    chartType: 'area',
    xAxisKey: '연도',
    seriesKeys: ['태양광풍력', '원자력', '천연가스', '석탄'],
    title: '에너지원별 발전 비중 변화 (2018~2024)',
    subtitle: '태양광 및 풍력 등 신재생 에너지 비중이 매년 지속 상승하고 있습니다.',
    source: '국제에너지기구 (IEA Report)',
    unit: 'TWh',
    csvRaw: `연도,태양광풍력,원자력,천연가스,석탄
2018,120,210,310,450
2020,180,215,300,410
2022,260,220,290,380
2024,380,225,280,340`,
    data: [
      { 연도: '2018', 태양광풍력: 120, 원자력: 210, 천연가스: 310, 석탄: 450 },
      { 연도: '2020', 태양광풍력: 180, 원자력: 215, 천연가스: 300, 석탄: 410 },
      { 연도: '2022', 태양광풍력: 260, 원자력: 220, 천연가스: 290, 석탄: 380 },
      { 연도: '2024', 태양광풍력: 380, 원자력: 225, 천연가스: 280, 석탄: 340 },
    ],
  }
];
