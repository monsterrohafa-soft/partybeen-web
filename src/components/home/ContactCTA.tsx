'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
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
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12"
        >
          {/* 카카오톡 - 강조 */}
          <a
            href={CONTACT.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center gap-4 p-8 bg-[#FEE500] text-[#391B1B] rounded-3xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(254,229,0,0.3)] hover:scale-[1.02]"
          >
            <div className="absolute -top-3 -right-3 px-3 py-1 bg-[#391B1B] text-[#FEE500] text-xs font-bold rounded-full">
              추천
            </div>
            <div className="w-16 h-16 flex items-center justify-center bg-[#391B1B]/10 rounded-2xl">
              <MessageCircle size={32} />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold mb-1">카카오톡 문의</span>
              <span className="text-sm opacity-80">가장 빠른 답변</span>
            </div>
          </a>

          {/* 전화 */}
          <a
            href={`tel:${CONTACT.phone}`}
            className="group flex flex-col items-center gap-4 p-8 glass-dark rounded-3xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl">
              <Phone size={32} />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold mb-1">전화 문의</span>
              <span className="text-sm text-gray-300">{CONTACT.phone}</span>
            </div>
          </a>

          {/* 이메일 */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="group flex flex-col items-center gap-4 p-8 glass-dark rounded-3xl transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white/10 rounded-2xl">
              <Mail size={32} />
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold mb-1">이메일 문의</span>
              <span className="text-sm text-gray-300 break-all">{CONTACT.email}</span>
            </div>
          </a>
        </motion.div>

        {/* 하단 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 sm:gap-12 text-sm text-gray-400"
        >
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>평일 09:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>부산광역시</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
