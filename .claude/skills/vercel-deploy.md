# Vercel 배포 Skill

**목적**: partybeen 프로젝트의 Vercel 자동 배포 프로세스 표준화

## 🎯 이 Skill을 사용해야 하는 상황

### ✅ 자동 실행 트리거

다음 키워드가 포함된 사용자 요청 시 **자동으로 이 Skill 실행**:
- 배포, deploy, 반영
- 푸시, push
- 변경사항 적용
- Vercel

---

## 🚀 표준 배포 프로세스

### 코드 수정 후 배포 (3단계)

```bash
# 1. 변경사항 확인
cd /mnt/nas/backup/app/partybeen
git status

# 2. 커밋
git add .
git commit -m "변경 내용 설명"

# 3. 푸시 (Vercel 자동 배포 시작)
git push origin main
```

### 예상 소요 시간
- Git push: 즉시
- Vercel 빌드 + 배포: **1-2분**

---

## 📋 배포 후 확인 체크리스트

### 1단계: Vercel 빌드 상태 확인
- GitHub 커밋에 ✅ 체크 표시 확인
- 또는 Vercel 대시보드에서 빌드 로그 확인

### 2단계: 실제 사이트 확인
- 브라우저에서 배포된 URL 접속
- 변경사항 반영 확인
- 캐시 문제 시 시크릿 모드(Ctrl+Shift+N)로 확인

---

## 🛠️ 문제별 해결 방법

### 문제 1: Vercel 빌드 실패

**증상:**
- GitHub 커밋에 ❌ 표시
- Vercel 대시보드에서 빌드 에러

**해결:**
```bash
# 로컬에서 빌드 테스트
cd /mnt/nas/backup/app/partybeen
npm run build

# 에러 메시지 확인 후 수정
```

### 문제 2: 푸시는 됐는데 변경사항 안 보임

**증상:**
- Git push 성공
- 사이트에서 변경사항 안 보임

**원인 & 해결:**
1. **Vercel 빌드 진행 중** → 1-2분 대기
2. **브라우저 캐시** → 시크릿 모드로 확인
3. **빌드 실패** → Vercel 대시보드 로그 확인

### 문제 3: 이미지가 안 보임

**증상:**
- 이미지 깨짐 또는 404 에러

**해결:**
1. 이미지 파일이 `public/images/`에 있는지 확인
2. 경로가 `/images/파일명.jpg`로 시작하는지 확인
3. 외부 이미지면 `next.config.ts`에 도메인 추가:
```typescript
images: {
  remotePatterns: [
    { hostname: 'www.partybeen.com' },
  ],
},
```

---

## ⚠️ 주의사항

### ❌ 하지 말 것
1. **Docker 명령어 사용** - partybeen은 Vercel 배포!
2. **node_modules 커밋** - .gitignore에 포함되어 있음
3. **빌드 안 해보고 푸시** - 에러 있으면 Vercel 빌드 실패

### ✅ 항상 할 것
1. **커밋 메시지 명확하게** - 무엇을 변경했는지
2. **큰 변경 전 브랜치** - 문제 시 롤백 용이
3. **배포 후 확인** - 실제 사이트에서 검증

---

## 📁 관련 파일

- **GitHub**: monsterrohafa-soft/partybeen-web
- **프로젝트 경로**: `/mnt/nas/backup/app/partybeen`
- **NAS 경로** (상규형 PuTTY용): `/volume1/backup/app/partybeen`

---

**마지막 업데이트**: 2024-12-08
