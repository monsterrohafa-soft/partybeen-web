'use client';

import { useRef } from 'react';
import { Maximize, Download, ExternalLink } from 'lucide-react';

interface PdfViewerProps {
  fileUrl: string;
  filename: string;
  title: string;
}

export default function PdfViewer({ fileUrl, filename, title }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="bg-white rounded-xl shadow-sm overflow-hidden relative"
      >
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          className="w-full"
          style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}
          title={title}
          allowFullScreen
        />
      </div>

      {/* 버튼들 */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <button
          onClick={handleFullscreen}
          className="flex items-center gap-2 px-6 py-3 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
        >
          <Maximize className="w-5 h-5" />
          전체화면
        </button>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-[#025566] text-white rounded-lg hover:bg-[#013A46] transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          새 탭에서 열기
        </a>
        <a
          href={fileUrl}
          download={filename}
          className="flex items-center gap-2 px-6 py-3 border border-[#025566] text-[#025566] rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          다운로드
        </a>
      </div>
    </>
  );
}
