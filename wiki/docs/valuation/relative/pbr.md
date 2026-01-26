---
id: pbr
title: PBR (주가순자산비율)
sidebar_label: PBR
description: 자산 가치 기반의 주식 밸류에이션 지표
keywords: [PBR, 주가순자산비율, Price Book Ratio, 장부가, 밸류에이션]
---

# PBR (주가순자산비율)

<span className="difficulty-badge difficulty-beginner">초급</span>

## 정의

**PBR(Price-to-Book Ratio)**은 주가를 주당순자산가치(BPS)로 나눈 값으로, 기업의 자산 대비 시장에서 평가받는 가치를 나타냅니다.

<div className="formula-block">

**PBR = 주가 / BPS = 시가총액 / 순자산(자본총계)**

</div>

## 해석

| PBR | 의미 |
|-----|------|
| **PBR < 1** | 장부가 이하 거래 (청산가치 이하 가능성) |
| **PBR = 1** | 장부가 수준 거래 |
| **PBR > 1** | 장부가 대비 프리미엄 (성장/브랜드 가치 반영) |

<div className="master-quote">
"PBR 1 이하의 기업은 청산 가치보다 싸게 거래되는 것이다."

<span className="author">— 벤자민 그레이엄</span>
</div>

## PBR과 ROE의 관계

PBR은 ROE(자기자본이익률)와 밀접하게 연관됩니다:

<div className="formula-block">

**PBR = ROE × PER = ROE / (r - g) × (1 - b)**

</div>

**핵심 통찰:**
- ROE > 자기자본비용(r) → PBR > 1 정당화
- ROE < 자기자본비용(r) → PBR < 1이 적정

| ROE | 자본비용 대비 | 정당화 PBR |
|-----|---------------|-----------|
| 15% | > 10% (r) | > 1.0x |
| 10% | = 10% (r) | ≈ 1.0x |
| 5% | < 10% (r) | < 1.0x |

## PBR이 적합한 경우

| 상황 | 이유 |
|------|------|
| **금융업** | 자산 대부분이 시가 평가 |
| **적자 기업** | PER 사용 불가 시 대안 |
| **자산주** | 보유 부동산/투자 자산 가치 |
| **청산 가치 분석** | 최소 가치 추정 |
| **경기 저점** | 이익이 일시적 부진할 때 |

## 산업별 평균 PBR (참고)

| 산업 | 평균 PBR | 특징 |
|------|----------|------|
| 은행 | 0.5-1.0x | 규제 자본, 금리 민감 |
| 보험 | 0.8-1.2x | 투자자산 기반 |
| 제조업 | 1.0-2.0x | 유형자산 비중 |
| 기술 | 3.0-10x+ | 무형자산, 브랜드 |
| 바이오 | 2.0-5.0x | R&D, 파이프라인 |

## PBR 조정: Tangible Book Value

무형자산을 제외한 유형순자산 기준

<div className="formula-block">

**P/TBV = 시가총액 / (순자산 - 무형자산 - 영업권)**

</div>

**사용 시점:**
- 인수합병으로 영업권 큰 기업
- 무형자산의 실질 가치가 불확실할 때

## 활용 예시

### 은행 비교 분석

| 은행 | PBR | ROE | P/TBV |
|------|-----|-----|-------|
| KB금융 | 0.45x | 9% | 0.48x |
| 신한지주 | 0.42x | 8% | 0.45x |
| 하나금융 | 0.35x | 7% | 0.38x |
| JP Morgan | 1.5x | 15% | 1.8x |

**해석**: 한국 은행들은 PBR 0.5 미만으로 장부가 대비 대폭 할인 거래 중. ROE 개선 시 리레이팅 여력 있음.

### 그레이엄의 Net-Net 전략

<div className="formula-block">

**NCAV = 유동자산 - 총부채**

**Net-Net 기준: 시총 < NCAV의 2/3**

</div>

이 기준을 충족하면 청산 시에도 이익이 발생하는 극단적 저평가 상태입니다.

## PBR의 한계

### 1. 장부가의 한계

| 문제 | 설명 |
|------|------|
| 역사적 원가 | 자산이 시가로 평가되지 않음 |
| 무형자산 미반영 | 브랜드, 기술, 인적자본 누락 |
| 감가상각 차이 | 회계 정책에 따른 차이 |

### 2. 자본 변동 영향

- 자사주 매입 → 순자산 감소 → PBR 상승
- 대규모 적자 → 순자산 감소 → PBR 상승 (왜곡)

### 3. 업종 간 비교 어려움

- 기술 기업: 무형자산 위주 → 높은 PBR 자연스러움
- 제조업: 유형자산 위주 → 낮은 PBR

## ROE-PBR 매트릭스

```
         PBR
   High  │ 고ROE-고PBR     고PBR-저ROE
         │ (성장 우량주)    (고평가 주의)
         │
         ├─────────────────────────────
         │
   Low   │ 저PBR-고ROE     저ROE-저PBR
         │ (저평가 기회!)   (가치함정?)
         └─────────────────────────────
              Low                High
                     ROE
```

**투자 시사점:**
- ✅ 저PBR + 고ROE: 가치투자 매력
- ⚠️ 저PBR + 저ROE: 이유 있는 할인일 수 있음
- ⚠️ 고PBR + 저ROE: 고평가 위험

## 관련 학습

- [상대가치평가 개요](/valuation/relative/overview)
- [PER](/valuation/relative/per)
- [벤자민 그레이엄](/masters/graham) — Net-Net 전략
- [DuPont 분석](/valuation/residual-income) — ROE 분해

## 참고자료

- Graham, B. "The Intelligent Investor" (Net-Net)
- Damodaran, A. "Investment Valuation" Chapter 19
