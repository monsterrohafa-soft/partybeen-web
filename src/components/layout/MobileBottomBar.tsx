'use client';

import { Phone } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export default function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t shadow-lg safe-area-pb">
      <div className="flex">
        {/* 카카오톡 문의 */}
        <a
          href={CONTACT.kakaoChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#FEE500] text-[#391B1B] font-medium"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
          </svg>
          카카오톡 문의
        </a>

        {/* 전화 문의 */}
        <a
          href={`tel:${CONTACT.phone}`}
          className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#013A46] text-white font-medium"
        >
          <Phone size={18} />
          전화 문의
        </a>
      </div>
    </div>
  );
}
