'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  imageUrl: string;
  category: { name: string };
}

export default function RecentPortfolio() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadPortfolios = async () => {
      try {
        const res = await fetch('/api/portfolio?limit=8');
        const data = await res.json();
        setPortfolios(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error('Failed to load portfolios:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolios();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (portfolios.length <= 4) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % (portfolios.length - 3));
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [portfolios.length]);

  const handlePrev = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex((prev) => Math.min(portfolios.length - 4, prev + 1));
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-12"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (portfolios.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-[#025566] bg-[#025566]/10 rounded-full">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            최근 포트폴리오
          </h2>
          <p className="text-gray-600">
            파티빈이 만들어온 특별한 순간들
          </p>
        </motion.div>

        {/* 캐러셀 */}
        <div className="relative">
          {/* 네비게이션 버튼 */}
          {portfolios.length > 4 && (
            <>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= portfolios.length - 4}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* 슬라이드 컨테이너 */}
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: `-${currentIndex * (100 / 4 + 1)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {portfolios.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-[calc(25%-12px)]"
                >
                  <Link
                    href="/portfolio"
                    className="group block relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-white/70 mb-1">{item.category.name}</span>
                      <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 인디케이터 */}
          {portfolios.length > 4 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: portfolios.length - 3 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-[#025566]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 전체보기 링크 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#013A46] text-white font-semibold rounded-full hover:bg-[#025566] transition-all duration-300 hover:shadow-lg hover:shadow-[#013A46]/20"
          >
            <span>전체 포트폴리오 보기</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
