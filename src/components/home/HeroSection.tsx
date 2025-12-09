'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { BRAND, CONTACT } from '@/lib/constants';

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsClient(true);

    // 비디오 자동 재생 시도 (브라우저 정책으로 막힐 경우 대비)
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // 자동 재생 실패 시 무시 (muted라서 대부분 성공함)
      });
    }
  }, []);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[85vh] sm:h-screen min-h-[600px] max-h-[1000px] flex items-center justify-center overflow-hidden">
      {/* 배경 영상 - PC/모바일 모두 자동재생 */}
      <div className="absolute inset-0 z-0 bg-[#013A46]">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover opacity-70"
          poster="/videos/hero-poster.jpg?v=2"
        >
          <source src="/videos/hero.mp4?v=2" type="video/mp4" />
        </video>
        {/* 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#013A46]/80 via-transparent to-[#013A46]/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#013A46]/50 via-transparent to-[#013A46]/50" />
      </div>

      {/* 장식 요소 */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#025566]/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-[#025566]/15 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />

      {/* 콘텐츠 */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto">
        {/* 서브타이틀 뱃지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass text-sm font-medium"
        >
          <Sparkles size={16} className="text-[#FAF3ED]" />
          <span>Premium Catering Service</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="block">{BRAND.name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-4 font-light max-w-2xl mx-auto leading-relaxed"
        >
          {BRAND.slogan}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-sm sm:text-base text-gray-400 mb-10 max-w-xl mx-auto"
        >
          기업행사부터 프라이빗 파티까지, 특별한 순간을 완성합니다
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
            className="group w-full sm:w-auto px-8 py-4 bg-white text-[#013A46] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 text-center flex items-center justify-center gap-2"
          >
            <span>견적 문의하기</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <Link
            href="/portfolio"
            className="w-full sm:w-auto px-8 py-4 glass text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 text-center"
          >
            포트폴리오 보기
          </Link>
        </motion.div>

        {/* 신뢰 지표 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-12 text-center"
        >
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-white">500+</span>
            <span className="text-xs sm:text-sm text-gray-400">성공적인 행사</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-white">98%</span>
            <span className="text-xs sm:text-sm text-gray-400">고객 만족도</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-bold text-white">10+</span>
            <span className="text-xs sm:text-sm text-gray-400">년의 경험</span>
          </div>
        </motion.div>
      </div>

      {/* 스크롤 다운 표시 */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="아래로 스크롤"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={24} className="animate-bounce" />
        </div>
      </motion.button>
    </section>
  );
}
