---
id: per
title: PER (주가수익비율)
sidebar_label: PER
description: 가장 널리 사용되는 주식 밸류에이션 지표
keywords: [PER, 주가수익비율, Price Earnings Ratio, 멀티플, 밸류에이션]
---

# PER (주가수익비율)

<span className="difficulty-badge difficulty-beginner">초급</span>

## 정의

**PER(Price-to-Earnings Ratio)**는 주가를 주당순이익(EPS)으로 나눈 값으로, 주식의 상대적 가치를 측정하는 가장 대표적인 지표입니다.

<div className="formula-block">

**PER = 주가 / EPS = 시가총액 / 당기순이익**

</div>

## 해석

| PER | 의미 |
|-----|------|
| **낮은 PER** | 저평가 가능성, 또는 성장 기대 낮음 |
| **높은 PER** | 고평가 가능성, 또는 높은 성장 기대 |

:::tip 직관적 이해
"PER 15배"는 "현재 이익 수준이 15년간 유지된다면 투자금 회수"를 의미합니다. 하지만 실제로는 이익 성장을 기대하므로 높은 PER도 정당화될 수 있습니다.
:::

## PER의 구성요소 분해

Gordon Growth Model에서 PER을 분해하면:

<div className="formula-block">

**P/E = (1-b) / (r - g) = Payout Ratio / (Cost of Equity - Growth)**

</div>

| 요소 | 영향 | 설명 |
|------|------|------|
| **(1-b) 배당성향** | ↑ → PER ↑ | 배당을 많이 줄수록 |
| **r (자기자본비용)** | ↑ → PER ↓ | 위험이 높을수록 |
| **g (성장률)** | ↑ → PER ↑ | 성장이 빠를수록 |

## PER의 종류

| 종류 | 공식 | 용도 |
|------|------|------|
| **Trailing PER** | 주가 / TTM EPS | 실적 확정, 보수적 |
| **Forward PER** | 주가 / 예상 EPS | 미래 전망 반영 |
| **Shiller PER (CAPE)** | 주가 / 10년 평균 실질 EPS | 경기순환 조정 |

## 산업별 평균 PER (참고)

| 산업 | 평균 PER | 특징 |
|------|----------|------|
| 유틸리티 | 12-15x | 안정적, 저성장 |
| 금융 | 8-12x | 경기민감, 레버리지 |
| 소비재 | 15-20x | 안정적 수요 |
| 기술 | 20-30x | 고성장 |
| 바이오 | 30x+ 또는 N/A | 고위험, 적자 다수 |

## 활용 예시

### 상대 비교

| 기업 | PER | EPS 성장률 | PEG |
|------|-----|-----------|-----|
| 삼성전자 | 12x | 8% | 1.5 |
| SK하이닉스 | 8x | 15% | 0.53 |
| TSMC | 20x | 20% | 1.0 |

**해석**: SK하이닉스가 PER은 가장 낮으면서 성장률이 높아 PEG 기준 가장 저평가

### 적정 주가 산출

```
네이버 분석:
- 예상 EPS (2024): 35,000원
- 동종업계 평균 Forward PER: 25x
- 적정 주가 = 35,000 × 25 = 875,000원
```

## PER의 한계

### 1. 적자 기업 적용 불가

EPS가 음수면 PER은 의미 없음

**대안**: PSR, EV/Sales, PBR

### 2. 회계 조작 취약

순이익은 다양한 방법으로 조정 가능:
- 감가상각 방법
- 충당금 설정
- 일회성 항목

**대안**: EV/EBITDA, 현금흐름 기반 지표

### 3. 자본구조 무시

부채가 많아도 EPS가 높을 수 있음

**대안**: EV/EBITDA (자본구조 중립)

### 4. 성장률 미반영

같은 PER이라도 성장률이 다르면 가치가 다름

**대안**: PEG Ratio

## PEG Ratio

<div className="formula-block">

**PEG = PER / 연간 EPS 성장률**

</div>

| PEG | 해석 |
|-----|------|
| < 1.0 | **저평가** (피터 린치 기준) |
| 1.0 | 적정 가치 |
| > 2.0 | **고평가** |

<div className="master-quote">
"PEG가 1 이하인 기업은 성장 대비 저평가되어 있다."

<span className="author">— 피터 린치</span>
</div>

## Shiller PER (CAPE)

경기순환을 조정한 장기 지표

<div className="formula-block">

**CAPE = 주가 / (10년 평균 실질 EPS)**

</div>

| CAPE | S&P 500 역사적 해석 |
|------|---------------------|
| < 15 | 저평가 (매수 기회) |
| 15-20 | 적정 |
| 20-25 | 고평가 주의 |
| > 25 | 과열 (버블 경고) |

## 관련 학습

- [상대가치평가 개요](/valuation/relative/overview)
- [PBR](/valuation/relative/pbr)
- [EV/EBITDA](/valuation/relative/ev-ebitda)
- [피터 린치](/masters/lynch) — PEG 창시자

## 용어 사전

- [EPS](/glossary/d-f#eps)
- [시가총액](/glossary/s-z#market-cap)
- [멀티플](/glossary/m-r#multiple)

## 참고자료

- Damodaran, A. "Investment Valuation" Chapter 18
- Lynch, P. "One Up on Wall Street" (PEG 원리)
