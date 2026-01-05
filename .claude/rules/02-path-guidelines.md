# 경로 지침 (NAS 환경)

## 절대 원칙
**상규형에게 실행 명령어를 안내할 때는 무조건 `/volume1/`로 시작하는 경로 사용!**

| 용도 | 경로 |
|------|------|
| **상규형에게 안내 시** | `/volume1/backup/app/partybeen` |
| **Claude 파일 작업 시** | `/mnt/nas/backup/app/partybeen` |

## 명령어 예시

**✅ 올바른 안내 (상규형에게)**:
```bash
cd /volume1/backup/app/partybeen
npm run dev
```

**❌ 잘못된 안내**:
```bash
cd /mnt/nas/backup/app/partybeen  # 절대 금지!
```
