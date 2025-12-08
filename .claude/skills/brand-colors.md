# 브랜드 컬러 관리 Skill

**목적**: partybeen 브랜드 컬러 일관성 유지 및 UI 색상 문제 해결

## 🎯 이 Skill을 사용해야 하는 상황

### ✅ 자동 실행 트리거

다음 키워드가 포함된 사용자 요청 시 **자동으로 이 Skill 실행**:
- 색상, 컬러, color
- 버튼 안 보임, 가려짐
- 브랜드, 디자인
- 피콕그린, 틸, 베이지

---

## 🎨 파티빈 브랜드 컬러

### 메인 컬러 (피콕그린)

| 용도 | 색상코드 | 사용처 |
|------|---------|--------|
| **Primary** | `#013A46` | 배경, 푸터, 주요 버튼 |
| **Primary Light** | `#025566` | 호버, 보조 버튼 |

### 보조 컬러

| 용도 | 색상코드 | 사용처 |
|------|---------|--------|
| **Beige** | `#FAF3ED` | 밝은 배경, 호버 텍스트 |
| **Kakao Yellow** | `#FEE500` | 카카오톡 버튼 |
| **Kakao Text** | `#391B1B` | 카카오톡 버튼 텍스트 |

### ❌ 더 이상 사용하지 않는 색상

| 이전 색상 | 코드 | 대체 색상 |
|----------|------|----------|
| 골드 | `#c9a962` | `#025566` (틸) |
| 골드 호버 | `#b8994f` | `#013A46` (딥 틸) |

---

## 📁 CSS 변수 정의

**파일:** `src/app/globals.css`

```css
:root {
  --color-primary: #013A46;        /* 피콕그린 */
  --color-primary-light: #025566;
  --color-accent: #013A46;
  --color-accent-light: #025566;
  --color-beige: #FAF3ED;          /* 베이지 */
}
```

---

## 🛠️ 문제별 해결 방법

### 문제 1: 버튼이 배경에 가려져 안 보임

**증상:**
- 버튼 색상과 배경 색상이 같아서 안 보임
- 예: `#025566` 버튼이 `#013A46` 배경에서 잘 안 보임

**해결 방법:**

**배경이 어두울 때 (푸터 등):**
```tsx
// ❌ 잘못된 예시
className="bg-[#025566]"  // 배경과 비슷해서 안 보임

// ✅ 올바른 예시 - 밝은 색상 사용
className="bg-[#FAF3ED] text-[#013A46]"  // 베이지 배경 + 다크 텍스트
// 또는 테두리 추가
className="bg-[#025566] border-2 border-[#FAF3ED]"
```

**배경이 밝을 때:**
```tsx
className="bg-[#025566] text-white"  // 정상 작동
```

### 문제 2: 호버 효과가 안 보임

**해결:**
```tsx
// 어두운 배경에서
className="bg-[#025566] hover:bg-[#FAF3ED] hover:text-[#013A46]"

// 밝은 배경에서
className="bg-[#025566] hover:bg-[#013A46]"
```

### 문제 3: SNS 아이콘 버튼 (푸터)

**어두운 푸터 배경(`#013A46`)에서의 권장 스타일:**

```tsx
// 인스타그램, 블로그 버튼
className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FAF3ED] text-[#013A46] hover:bg-white transition-colors"

// 카카오톡 버튼 (고유 색상 유지)
className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FEE500] text-[#391B1B] hover:opacity-80 transition-opacity"
```

---

## 📋 컴포넌트별 권장 색상

### 버튼

| 위치 | 배경 | 텍스트 | 호버 |
|------|------|--------|------|
| 밝은 배경 | `#025566` | white | `#013A46` |
| 어두운 배경 | `#FAF3ED` | `#013A46` | white |
| 카카오톡 | `#FEE500` | `#391B1B` | opacity-80 |

### 텍스트

| 위치 | 색상 |
|------|------|
| 밝은 배경 | `text-gray-900` 또는 `text-[#013A46]` |
| 어두운 배경 | `text-white` 또는 `text-[#FAF3ED]` |
| 보조 텍스트 | `text-gray-600` (밝은 배경) / `text-gray-400` (어두운 배경) |

### 테두리/포커스

```tsx
// 입력 필드 포커스
className="focus:ring-2 focus:ring-[#025566]"

// 카드 호버 테두리
className="border-4 border-[#013A46]"
```

---

## 🔍 색상 문제 진단 체크리스트

- [ ] 배경색과 요소색의 대비가 충분한가?
- [ ] 텍스트 색상이 배경에서 잘 읽히는가?
- [ ] 호버 효과가 눈에 띄는가?
- [ ] 접근성 기준 충족하는가? (대비율 4.5:1 이상)

---

## 📁 관련 파일

- **CSS 변수**: `src/app/globals.css`
- **상수 정의**: `src/lib/constants.ts`
- **푸터**: `src/components/layout/Footer.tsx`
- **헤더**: `src/components/layout/Header.tsx`
- **CTA 섹션**: `src/components/home/ContactCTA.tsx`

---

**마지막 업데이트**: 2024-12-08
