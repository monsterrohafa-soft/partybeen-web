'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export default function ContactCTA() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-[#013A46] via-[#025566] to-[#013A46] text-white relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/pattern-dots.svg')] bg-repeat opacity-20" />
      </div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-white/10 rounded-full">
            Contact Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            견적이 궁금하신가요?
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            언제든지 편하게 문의해 주세요. 친절하고 빠른 상담을 약속드립니다.
          </p>
        </motion.div>

        {/* 문의 카드들 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12"
        >
          {/* 카카오톡 - 강조 */}
          <a
            href={CONTACT.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center gap-4 p-6 sm:p-8 bg-[#FEE500] text-[#391B1B] rounded-3xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(254,229,0,0.3)] hover:scale-[1.02]"
          >
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#391B1B] text-[#FEE500] text-xs font-bold rounded-full">
              추천
            </div>
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-[#391B1B]/10 rounded-2xl">
              <MessageCircle size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="text-center">
              <span className="block text-base sm:text-lg font-bold mb-1">카카오톡 문의</span>
              <span className="text-xs sm:text-sm opacity-80">가장 빠른 답변</span>
            </div>
          </a>

          {/* 전화 */}
          <a
            href={`tel:${CONTACT.phone}`}
            className="group flex flex-col items-center gap-4 p-6 sm:p-8 glass-dark rounded-3xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/10 rounded-2xl">
              <Phone size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="text-center">
              <span className="block text-base sm:text-lg font-bold mb-1">전화 문의</span>
              <span className="text-xs sm:text-sm text-gray-300">{CONTACT.phone}</span>
            </div>
          </a>

          {/* 이메일 */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex flex-col items-center gap-4 p-6 sm:p-8 glass-dark rounded-3xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/10 rounded-2xl">
              <Mail size={28} className="sm:w-8 sm:h-8" />
            </div>
            <div className="text-center">
              <span className="block text-base sm:text-lg font-bold mb-1">이메일 문의</span>
              <span className="text-xs sm:text-sm text-gray-300 break-all">{CONTACT.email}</span>
            </div>
          </a>

          {/* 공식 인스타그램 */}
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 p-6 sm:p-8 rounded-3xl transition-all duration-300 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(45deg, #405DE6, #5851DB, #833AB4, #C13584, #E1306C, #FD1D1D, #F56040, #F77737, #FCAF45)' }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/20 rounded-2xl">
              <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-white">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div className="text-center text-white">
              <span className="block text-base sm:text-lg font-bold mb-1">공식 인스타</span>
              <span className="text-xs sm:text-sm opacity-80">@partybeen_catering</span>
            </div>
          </a>

          {/* 공식 블로그 */}
          <a
            href={CONTACT.blog}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-4 p-6 sm:p-8 bg-[#03C75A] text-white rounded-3xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(3,199,90,0.3)] hover:scale-[1.02]"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/20 rounded-2xl">
              <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-white">
                <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
              </svg>
            </div>
            <div className="text-center">
              <span className="block text-base sm:text-lg font-bold mb-1">공식 블로그</span>
              <span className="text-xs sm:text-sm opacity-80">네이버 블로그</span>
            </div>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
