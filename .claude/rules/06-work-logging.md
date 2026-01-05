# 작업 기록 시스템

## 폴더 구조
```
partybeen/
├── logs/                    <- 일자별 작업 기록
│   ├── 2025-12-26.md
│   └── ARCHIVE.md
├── README.md
├── PROJECT_STATUS.md
└── CLAUDE.md
```

## 프로젝트 진입 시 (자동 수행)
1. `PROJECT_STATUS.md` 읽기
2. `logs/` 폴더에서 최근 파일 읽기
3. 상규형에게 현황 보고

## 작업 완료 시 (반드시 수행)
1. `logs/YYYY-MM-DD.md`에 기록
2. `PROJECT_STATUS.md` 업데이트
