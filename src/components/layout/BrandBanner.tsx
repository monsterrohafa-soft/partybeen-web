'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ExternalLink } from 'lucide-react';

interface BrandBannerProps {
  targetBrand: 'cheflunchbox' | 'partybeen';
}

const BRAND_CONFIG = {
  cheflunchbox: {
    name: '쉐프의 도시락',
    tagline: '단체 도시락이 필요하신가요?',
    url: 'https://cheflunchbox.com',
    bgColor: 'bg-[#8B7355]',
    hoverColor: 'hover:bg-[#7A6548]',
    textColor: 'text-white',
  },
  partybeen: {
    name: '파티빈 케이터링',
    tagline: '케이터링/출장뷔페가 필요하신가요?',
    url: 'https://partybeen.com',
    bgColor: 'bg-[#013A46]',
    hoverColor: 'hover:bg-[#025566]',
    textColor: 'text-white',
  },
};

export default function BrandBanner({ targetBrand }: BrandBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const config = BRAND_CONFIG[targetBrand];

  if (!isVisible) return null;

  return (
    <div className={`${config.bgColor} ${config.textColor} py-2 px-4 relative z-[60]`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <span className="hidden sm:inline">{config.tagline}</span>
        <span className="sm:hidden">단체 도시락</span>
        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 ${config.hoverColor} transition-colors font-medium`}
        >
          {config.name}
          <ExternalLink size={14} />
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 sm:right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="배너 닫기"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
