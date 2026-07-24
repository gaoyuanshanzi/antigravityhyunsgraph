import React, { useState } from 'react';
import { useChartStore } from '../../store/useChartStore';
import { toPng, toSvg } from 'html-to-image';
import { EmbedModal } from './EmbedModal';
import { 
  Download, 
  Code2, 
  Check, 
  Copy, 
  Image, 
  FileText, 
  GitBranch, 
  Globe, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { ChartPreviewCanvas } from '../step2/ChartPreviewCanvas';

export const ExportPanel: React.FC = () => {
  const { projectTitle, metadata, data, auth, setStep } = useChartStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Export High-Res PNG Image
  const exportAsPng = async () => {
    const node = document.getElementById('datawrapper-export-canvas');
    if (!node) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(node, { quality: 0.95, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `${projectTitle.replace(/\s+/g, '_')}_datawrapper.png`;
      link.href = dataUrl;
      link.click();
      showToast('PNG 이미지가 성공적으로 다운로드되었습니다!');
    } catch (err) {
      console.error('Failed to export PNG', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Export Vector SVG File
  const exportAsSvg = async () => {
    const node = document.getElementById('datawrapper-export-canvas');
    if (!node) return;
    try {
      setIsExporting(true);
      const dataUrl = await toSvg(node);
      const link = document.createElement('a');
      link.download = `${projectTitle.replace(/\s+/g, '_')}_datawrapper.svg`;
      link.href = dataUrl;
      link.click();
      showToast('SVG 벡터 그래픽 파일이 성공적으로 다운로드되었습니다!');
    } catch (err) {
      console.error('Failed to export SVG', err);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Export Raw JSON Data
  const exportAsJson = () => {
    const jsonStr = JSON.stringify({ projectTitle, metadata, data }, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${projectTitle.replace(/\s+/g, '_')}_data.json`;
    link.href = url;
    link.click();
    showToast('JSON 데이터 파일이 다운로드되었습니다!');
  };

  return (
    <>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                STEP 3
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                내보내기 및 웹사이트 퍼가기 (Export & Embed)
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              완성된 시각화를 PNG/SVG 벡터로 다운로드하거나 반응형 iframe 퍼가기 코드를 생성하세요.
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>차트 수정으로 돌아가기</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Preview Canvas */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              최종 출력 결과물 (Final Output Canvas)
            </div>
            <ChartPreviewCanvas />
          </div>

          {/* Right: Export Options & Embed Generator */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* 1. Image Storage & Download Options */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-500" />
                이미지 & 벡터 파일 저장 (Image & Vector Export)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* PNG Download Button */}
                <button
                  onClick={exportAsPng}
                  disabled={isExporting}
                  className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/60 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Image className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs">PNG 다운로드</div>
                    <div className="text-[10px] text-blue-600/70 dark:text-blue-400/70">고해상도 비트맵</div>
                  </div>
                </button>

                {/* SVG Download Button */}
                <button
                  onClick={exportAsSvg}
                  disabled={isExporting}
                  className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold text-xs transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs">SVG 다운로드</div>
                    <div className="text-[10px] text-purple-600/70 dark:text-purple-400/70">벡터 그래픽 (Vector)</div>
                  </div>
                </button>

                {/* JSON Data Download Button */}
                <button
                  onClick={exportAsJson}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all flex flex-col justify-between space-y-2 group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-xs">JSON 내보내기</div>
                    <div className="text-[10px] text-slate-400">데이터 & 구조</div>
                  </div>
                </button>

              </div>
            </div>

            {/* 2. Responsive Embed Code Generator Launcher */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-500" />
                    웹사이트 퍼가기 코드 생성기 (Embed Generator)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    반응형 &lt;iframe&gt; 퍼가기 스니펫을 원하는 크기로 맞춤 생성합니다.
                  </p>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={() => setIsEmbedModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
                >
                  <Code2 className="w-4 h-4" />
                  <span>반응형 Embed 퍼가기 코드 생성 모달 열기</span>
                </button>
              </div>
            </div>

            {/* 3. GitHub & Vercel Deployment Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-500" />
                  GitHub & Vercel 클라우드 배포 준비
                </h3>
                {auth.isAuthenticated && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin Authorized
                  </span>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <GitBranch className="w-4 h-4 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">1. GitHub 저장소 연동</strong>
                    <p className="text-slate-500 mt-0.5">
                      사용자의 지시에 따라 Git commit 후 GitHub 저장소로 푸시할 준비가 완료되어 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 dark:text-slate-100">2. Vercel 원클릭 클라우드 호스팅</strong>
                    <p className="text-slate-500 mt-0.5">
                      Vercel CLI로 글로벌 CDN 주소를 즉시 배포할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Embed Generator Modal */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        onShowToast={showToast}
      />
    </>
  );
};
