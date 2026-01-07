'use client';

import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 복사되었습니다!');
      }
    } catch {
      // 사용자가 공유를 취소한 경우
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-[#025566] transition-colors"
    >
      <Share2 className="w-4 h-4" />
      공유하기
    </button>
  );
}
