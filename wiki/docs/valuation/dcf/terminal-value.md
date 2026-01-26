---
id: terminal-value
title: 터미널 가치 (Terminal Value)
sidebar_label: 터미널 가치
description: DCF 분석에서 예측 기간 이후의 가치를 산정하는 방법
keywords: [터미널 가치, Terminal Value, Gordon Growth, Exit Multiple, DCF]
---

# 터미널 가치 (Terminal Value)

<span className="difficulty-badge difficulty-intermediate">중급</span>

## 정의

**터미널 가치(Terminal Value, TV)**는 DCF 분석에서 명시적 예측 기간(보통 5-10년) 이후의 기업가치를 나타냅니다.

:::warning 중요성
터미널 가치는 전체 기업가치의 **60-80%**를 차지합니다. TV 가정이 조금만 바뀌어도 결과가 크게 달라지므로, 가장 신중하게 다뤄야 할 부분입니다.
:::

## 두 가지 산정 방법

### 1. Gordon Growth Model (영구성장모형)

<div className="formula-block">

**TV = FCFn × (1+g) / (WACC - g)**

</div>

| 변수 | 의미 | 주의점 |
|------|------|--------|
| **FCFn** | 마지막 예측 연도 FCF | 정상화된 수준이어야 함 |
| **g** | 영구성장률 | 장기 GDP 성장률 이하 |
| **WACC** | 가중평균자본비용 | g보다 커야 함 |

#### 영구성장률(g) 설정 가이드

| 시장 | 일반적 범위 | 근거 |
|------|-------------|------|
| 선진국 | 2-3% | 장기 명목 GDP 성장률 |
| 신흥국 | 3-5% | 높은 경제 성장률 반영 |
| 고성장 기업 | 3-4% | 시간이 지나면 성장 둔화 |
| 쇠퇴 산업 | 0-2% | 물가상승률 수준 |

:::tip 황금률
영구성장률은 **장기 GDP 성장률을 초과하면 안 됩니다**. 기업이 경제 전체보다 영원히 빠르게 성장하는 것은 논리적으로 불가능합니다.
:::

### 2. Exit Multiple Method (출구배수법)

<div className="formula-block">

**TV = EBITDAn × Exit Multiple**

</div>

| 변수 | 의미 | 결정 방법 |
|------|------|----------|
| **EBITDAn** | 마지막 예측 연도 EBITDA | 정상화 필요 |
| **Exit Multiple** | 출구 시점 예상 배수 | 유사 기업 현재 배수 참고 |

#### Exit Multiple 결정 기준

1. **현재 Comparable 평균**: 동종업계 현재 EV/EBITDA
2. **과거 평균**: 산업의 장기 평균 배수
3. **예상 성장성 반영**: 고성장 → 높은 배수

### 두 방법 비교

| 항목 | Gordon Growth | Exit Multiple |
|------|---------------|---------------|
| **가정** | 영구적 성장 | 특정 시점 매각 |
| **적용** | 대부분의 기업 | PE/M&A 분석 |
| **장점** | 이론적 일관성 | 시장 검증 가능 |
| **단점** | g 가정에 민감 | 현재 배수가 미래에도 유효한가? |
| **선호 상황** | 장기 보유 관점 | 투자 회수 관점 |

## 계산 예시

### 예시 데이터

- 마지막 연도(5년차) FCFF: 100억원
- WACC: 10%
- 영구성장률: 3%
- 5년차 EBITDA: 150억원
- 동종업계 EV/EBITDA: 8x

### Gordon Growth 방식

<div className="formula-block">

TV = 100 × (1 + 0.03) / (0.10 - 0.03) = 103 / 0.07 = **1,471억원**

</div>

### Exit Multiple 방식

<div className="formula-block">

TV = 150 × 8 = **1,200억원**

</div>

### 현재가치 환산

<div className="formula-block">

PV(TV) = TV / (1 + WACC)^5

Gordon: 1,471 / (1.10)^5 = **914억원**

Exit: 1,200 / (1.10)^5 = **745억원**

</div>

## 터미널 가치의 함정

### 1. 과도한 TV 의존도

TV가 전체 가치의 80%를 넘으면 위험 신호입니다.

**해결책:**
- 예측 기간 연장 (5년 → 10년)
- 가정의 합리성 재검토
- 민감도 분석 필수

### 2. WACC ≤ g 오류

<div className="formula-block">

TV = FCF × (1+g) / (WACC - g)

</div>

WACC가 g보다 작거나 같으면 TV가 **무한대 또는 음수**가 됩니다.

### 3. 정상화되지 않은 FCF

마지막 연도 FCF가 비정상적이면 TV도 왜곡됩니다.

**체크포인트:**
- CapEx = 감가상각비 (유지보수 수준)
- 마진이 산업 평균 수렴
- 이상적 일회성 항목 제거

## 실무 베스트 프랙티스

### 1. 두 방법 병행

```
┌─────────────────────────────────────────┐
│          터미널 가치 검증               │
├─────────────────────────────────────────┤
│ Gordon Growth TV:     1,471억원         │
│ Exit Multiple TV:     1,200억원         │
├─────────────────────────────────────────┤
│ 차이: 271억원 (22.6%)                   │
│ → 차이가 20% 이상이면 가정 재검토       │
└─────────────────────────────────────────┘
```

### 2. 내재 Exit Multiple 계산

Gordon Growth로 계산한 TV에서 내재된 배수를 역산:

<div className="formula-block">

Implied EV/EBITDA = TV / EBITDAn = 1,471 / 150 = **9.8x**

</div>

이 배수가 합리적인지 검증합니다.

### 3. 민감도 분석 필수

| WACC \ g | 2.0% | 2.5% | 3.0% | 3.5% | 4.0% |
|----------|------|------|------|------|------|
| **9.0%** | 1,457 | 1,579 | 1,717 | 1,876 | 2,060 |
| **9.5%** | 1,360 | 1,467 | 1,588 | 1,726 | 1,885 |
| **10.0%** | 1,275 | 1,371 | 1,479 | 1,600 | 1,738 |
| **10.5%** | 1,200 | 1,286 | 1,382 | 1,489 | 1,609 |
| **11.0%** | 1,133 | 1,211 | 1,297 | 1,393 | 1,500 |

## 관련 학습

- [DCF 분석 개요](/valuation/dcf/overview)
- [WACC 산정](/valuation/dcf/wacc)
- [민감도 분석](/valuation/dcf/sensitivity)
- [상대가치평가](/valuation/relative/overview) - Exit Multiple 참고

## 인터랙티브 도구

- [DCF 계산기](/calculators/dcf) - 터미널 가치 자동 계산 및 민감도 분석

## 참고자료

- Damodaran, A. "Investment Valuation" Chapter 12
- McKinsey "Valuation" Chapter 12: Estimating Continuing Value
