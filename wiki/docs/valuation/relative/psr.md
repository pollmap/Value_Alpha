---
id: psr
title: PSR (주가매출비율)
sidebar_label: PSR
description: 적자 기업 및 초기 성장기업 가치평가 지표
keywords: [PSR, 주가매출비율, Price Sales Ratio, 성장주, 밸류에이션]
---

# PSR (주가매출비율)

<span className="difficulty-badge difficulty-beginner">초급</span>

## 정의

**PSR(Price-to-Sales Ratio)**은 주가를 주당매출(SPS)로 나눈 값으로, 매출 대비 시장 가치를 측정합니다. 적자 기업이나 초기 성장기업 분석에 유용합니다.

<div className="formula-block">

**PSR = 주가 / SPS = 시가총액 / 매출**

</div>

## 언제 사용하나?

| 상황 | PSR 사용 이유 |
|------|--------------|
| **적자 기업** | PER 사용 불가 |
| **초기 성장 기업** | 매출은 있으나 이익 미발생 |
| **턴어라운드** | 일시적 적자, 매출 기반 평가 |
| **사이클 바닥** | 이익 왜곡 시점 |

## 해석

| PSR | 일반적 해석 |
|-----|-------------|
| < 1x | 저평가 가능성 (특히 수익성 있는 기업) |
| 1-3x | 적정 범위 (산업별 상이) |
| > 5x | 높은 성장 기대 반영 |
| > 10x | 매우 높은 프리미엄, 리스크 주의 |

:::warning 주의
PSR이 낮다고 항상 저평가는 아닙니다. 수익성이 영구적으로 낮은 기업은 낮은 PSR이 정당합니다.
:::

## PSR과 마진의 관계

<div className="formula-block">

**PSR = PER × 순이익률**

따라서: **PSR / 순이익률 = PER**

</div>

**예시:**
- 기업 A: PSR 2x, 순이익률 10% → 내재 PER = 20x
- 기업 B: PSR 2x, 순이익률 5% → 내재 PER = 40x

→ 같은 PSR이라도 마진이 높은 기업이 더 저평가

## 산업별 PSR (참고)

| 산업 | 평균 PSR | 특징 |
|------|----------|------|
| 소매/유통 | 0.3-0.8x | 박리다매, 낮은 마진 |
| 제조업 | 0.5-1.5x | 다양한 마진 |
| 기술 | 3-10x | 높은 성장성, 확장성 |
| SaaS | 5-15x+ | 반복 매출, 높은 마진 |
| 바이오 | 10x+ | 미래 매출 기대 |

## 활용 예시

### 성장기업 비교

| 기업 | 매출 (억원) | 시총 (억원) | PSR | 매출성장률 |
|------|------------|------------|-----|-----------|
| 쿠팡 | 30조 | 30조 | 1.0x | 20% |
| 토스 | 2조 | 10조 | 5.0x | 50% |
| 배민 | 3조 | 15조 | 5.0x | 30% |

### EV/Sales (자본구조 중립)

<div className="formula-block">

**EV/Sales = (시총 + 순부채) / 매출**

</div>

부채가 많은 기업은 EV/Sales가 더 정확합니다.

## PSR의 한계

### 1. 수익성 무시

- 매출만 보고 비용 구조 무시
- 영원히 적자인 기업도 PSR 가능

### 2. 자본 집약도 무시

- 매출 1조를 위해 자본 10조 vs 1조
- 동일 PSR이지만 가치 다름

### 3. 회계 기준 차이

- 총매출 vs 순매출
- 수수료 수익 인식 방식

## Rule of 40

SaaS 기업 평가에 널리 사용:

<div className="formula-block">

**Rule of 40 = 매출성장률(%) + 영업이익률(%)**

40 이상이면 **건강한 성장기업**

</div>

| 기업 | 성장률 | 이익률 | Rule of 40 |
|------|--------|--------|-----------|
| Snowflake | 50% | -10% | 40 ✅ |
| Salesforce | 20% | 25% | 45 ✅ |
| 일반 SaaS | 30% | 5% | 35 ❌ |

## 관련 학습

- [상대가치평가 개요](/valuation/relative/overview)
- [PER](/valuation/relative/per)
- [EV/EBITDA](/valuation/relative/ev-ebitda)

## 참고자료

- Kenneth Fisher "Super Stocks" (PSR 창시)
- Damodaran, A. "Investment Valuation" Chapter 18
