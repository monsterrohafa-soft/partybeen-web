# Vercel 배포 지침

## 자동 배포 (GitHub 연동)

```bash
git add .
git commit -m "변경 내용"
git push
# → Vercel 자동 배포 시작 (1-2분)
```

## 배포 워크플로우

```
코드 수정 → git add → git commit → git push → Vercel 자동 배포
```

## 빌드 테스트

```bash
# 로컬 빌드 테스트
ssh rohafa2@rohafa88.synology.me "export PATH=/usr/local/bin:\$PATH && cd /volume1/backup/app/partybeen && npm run build"
```

## 트러블슈팅

### 빌드 에러 시
```bash
# node_modules 재설치
ssh rohafa2@rohafa88.synology.me "export PATH=/usr/local/bin:\$PATH && cd /volume1/backup/app/partybeen && rm -rf node_modules && npm install"
```

### Vercel 배포 실패 시
- Vercel 대시보드에서 로그 확인
- 빌드 에러 메시지 확인 후 수정
