'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, ChevronDown } from 'lucide-react';
import { BRAND, CONTACT } from '@/lib/constants';

// YouTube 비디오 ID 추출
const getYouTubeVideoId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : '';
};

// 모바일/터치 디바이스 감지 (더 정확한 방법)
const checkIsMobileDevice = () => {
  if (typeof window === 'undefined') return false;

  // 터치 디바이스 감지
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 모바일 User Agent 감지
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // 화면 너비 감지
  const isSmallScreen = window.innerWidth < 768;

  // 모바일 UA이거나 (터치 디바이스이면서 작은 화면)인 경우
  return isMobileUA || (isTouchDevice && isSmallScreen);
};

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(true); // 기본값을 true로 (모바일 우선)
  const [isClient, setIsClient] = useState(false);
  const videoId = getYouTubeVideoId(CONTACT.youtubeVideo);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(checkIsMobileDevice());
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* 배경 영상 (데스크톱) 또는 이미지 (모바일/터치 디바이스) */}
      <div className="absolute inset-0 z-0">
        {isClient && !isMobile ? (
          // 데스크톱: YouTube 자동재생
          <div className="relative w-full h-full overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&disablekb=1`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] min-w-full h-[56.25vw] min-h-full"
              allow="autoplay; encrypted-media; accelerometer; gyroscope"
              allowFullScreen
              style={{ border: 'none', pointerEvents: 'none' }}
            />
          </div>
        ) : (
          // 모바일/터치: 고화질 썸네일 이미지
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://img.youtube.com/vi/${videoId}/maxresdefault.jpg')`,
            }}
          />
        )}
        {/* 오버레이 */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight"
        >
          {BRAND.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 font-light"
        >
          {BRAND.slogan}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href={CONTACT.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-[#c9a962] hover:bg-[#b8994f] text-white font-semibold rounded-full transition-all transform hover:scale-105 text-center"
          >
            견적 문의하기
          </a>
          <Link
            href="/portfolio"
            className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all text-center"
          >
            포트폴리오 보기
          </Link>
        </motion.div>

        {/* 모바일 영상 재생 버튼 - 더 눈에 띄게 */}
        {isClient && isMobile && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            onClick={() => window.open(CONTACT.youtubeVideo, '_blank')}
            className="mt-8 flex items-center gap-2 mx-auto px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all"
          >
            <Play size={20} fill="white" />
            <span className="font-medium">영상으로 보기</span>
          </motion.button>
        )}
      </div>

      {/* 스크롤 다운 표시 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce"
        aria-label="아래로 스크롤"
      >
        <ChevronDown size={32} />
      </motion.button>
    </section>
  );
}
