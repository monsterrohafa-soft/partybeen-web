'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center justify-center overflow-hidden">
      {/* 배경 영상 - PC/모바일 모두 자동재생 */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
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
