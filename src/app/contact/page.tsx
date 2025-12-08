'use client';

import { useState } from 'react';
import { Phone, Mail, Instagram, Send, CheckCircle } from 'lucide-react';
import { BRAND, CONTACT } from '@/lib/constants';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    eventDate: '',
    guestCount: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Formspree로 전송 (나중에 실제 ID로 교체)
      const response = await fetch('https://formspree.io/f/xpwzgvqr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: `[파티빈] 새로운 견적 문의 - ${formData.name}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          phone: '',
          email: '',
          eventType: '',
          eventDate: '',
          guestCount: '',
          message: '',
        });
      }
    } catch (error) {
      alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            견적 문의
          </h1>
          <p className="text-gray-600">
            아래 양식을 작성해주시면 빠른 시일 내에 연락드리겠습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 문의 폼 */}
          <div className="lg:col-span-2">
            {isSubmitted ? (
              <div className="p-8 bg-green-50 rounded-2xl text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  문의가 접수되었습니다!
                </h2>
                <p className="text-gray-600 mb-6">
                  빠른 시일 내에 연락드리겠습니다.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-[#025566] text-white font-medium rounded-full hover:bg-[#013A46] transition-colors"
                >
                  새 문의 작성
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이름 & 연락처 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition"
                      placeholder="홍길동"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition"
                    placeholder="example@email.com"
                  />
                </div>

                {/* 행사 유형 & 날짜 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      행사 유형
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="">선택해주세요</option>
                      <option value="기업행사">기업행사</option>
                      <option value="웨딩/피로연">웨딩/피로연</option>
                      <option value="생일파티">생일파티</option>
                      <option value="홈파티">홈파티</option>
                      <option value="세미나/컨퍼런스">세미나/컨퍼런스</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      행사 예정일
                    </label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* 예상 인원 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    예상 인원
                  </label>
                  <select
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition bg-white"
                  >
                    <option value="">선택해주세요</option>
                    <option value="10명 이하">10명 이하</option>
                    <option value="11-30명">11-30명</option>
                    <option value="31-50명">31-50명</option>
                    <option value="51-100명">51-100명</option>
                    <option value="100명 이상">100명 이상</option>
                  </select>
                </div>

                {/* 문의 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#025566] focus:border-transparent outline-none transition resize-none"
                    placeholder="행사 장소, 원하시는 메뉴, 예산 등 상세 내용을 적어주세요."
                  />
                </div>

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#025566] text-white font-semibold rounded-lg hover:bg-[#013A46] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    '전송 중...'
                  ) : (
                    <>
                      <Send size={18} />
                      견적 문의하기
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* 사이드바 - 다른 연락 방법 */}
          <div className="space-y-4">
            {/* 카카오톡 */}
            <a
              href={CONTACT.kakaoChannel}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-[#FEE500] rounded-xl hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#391B1B]">
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.89 5.32 4.71 6.72-.17.61-.64 2.21-.73 2.56-.12.45.16.44.34.32.14-.09 2.17-1.47 3.05-2.06.53.07 1.07.11 1.63.11 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
                </svg>
                <span className="font-bold text-[#391B1B]">카카오톡 문의</span>
              </div>
              <p className="text-sm text-[#391B1B]/70">가장 빠른 답변!</p>
            </a>

            {/* 전화 */}
            <a
              href={`tel:${CONTACT.phone}`}
              className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-[#025566] rounded-full flex items-center justify-center text-white">
                <Phone size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">전화 문의</h3>
                <p className="text-gray-600 text-sm">{CONTACT.phone}</p>
              </div>
            </a>

            {/* 이메일 */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
                <Mail size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">이메일</h3>
                <p className="text-gray-600 text-xs break-all">{CONTACT.email}</p>
              </div>
            </a>

            {/* SNS */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">SNS</h3>
              <div className="flex gap-2">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  <Instagram size={16} />
                  인스타
                </a>
                <a
                  href={CONTACT.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#03C75A] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
                >
                  <span className="font-bold">N</span>
                  블로그
                </a>
              </div>
            </div>

            {/* 운영 시간 */}
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">운영 시간</h3>
              <p className="text-gray-600 text-sm">평일 09:00 - 18:00</p>
              <p className="text-gray-500 text-xs">주말 및 공휴일 휴무</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
