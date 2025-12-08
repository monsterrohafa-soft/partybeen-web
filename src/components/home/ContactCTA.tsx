'use client';

import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export default function ContactCTA() {
  return (
    <section className="py-16 sm:py-24 bg-[#013A46] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            견적이 궁금하신가요?
          </h2>
          <p className="text-gray-400 mb-8 sm:mb-12 max-w-xl mx-auto">
            언제든지 편하게 문의해 주세요. 친절하고 빠른 상담을 약속드립니다.
          </p>
        </motion.div>

        {/* 문의 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {/* 카카오톡 */}
          <a
            href={CONTACT.kakaoChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 p-6 bg-[#FEE500] text-[#391B1B] rounded-2xl hover:scale-105 transition-transform"
          >
            <MessageCircle size={32} />
            <span className="font-semibold">카카오톡 문의</span>
            <span className="text-sm opacity-80">가장 빠른 답변</span>
          </a>

          {/* 전화 */}
          <a
            href={`tel:${CONTACT.phone}`}
            className="flex flex-col items-center gap-3 p-6 bg-[#025566] text-white rounded-2xl hover:scale-105 transition-transform"
          >
            <Phone size={32} />
            <span className="font-semibold">전화 문의</span>
            <span className="text-sm opacity-80">{CONTACT.phone}</span>
          </a>

          {/* 이메일 */}
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex flex-col items-center gap-3 p-6 bg-[#013A46] text-white rounded-2xl hover:scale-105 transition-transform"
          >
            <Mail size={32} />
            <span className="font-semibold">이메일 문의</span>
            <span className="text-sm opacity-80">{CONTACT.email}</span>
          </a>
        </motion.div>

        {/* 운영 시간 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm text-gray-500"
        >
          영업시간: 평일 09:00 - 18:00 | 주말 및 공휴일 휴무
        </motion.p>
      </div>
    </section>
  );
}
