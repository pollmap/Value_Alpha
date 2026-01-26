---
id: ev-ebitda
title: EV/EBITDA
sidebar_label: EV/EBITDA
description: 자본구조에 중립적인 기업가치 평가 지표
keywords: [EV/EBITDA, Enterprise Value, EBITDA, M&A, 멀티플]
---

# EV/EBITDA

<span className="difficulty-badge difficulty-intermediate">중급</span>

## 정의

**EV/EBITDA**는 기업가치(Enterprise Value)를 EBITDA로 나눈 값으로, 자본구조에 관계없이 기업의 영업 성과 대비 가치를 측정합니다.

<div className="formula-block">

**EV/EBITDA = Enterprise Value / EBITDA**

**EV = 시가총액 + 순부채 (= 총부채 - 현금)**

**EBITDA = 영업이익 + 감가상각비**

</div>

## 왜 EV/EBITDA인가?

### PER 대비 장점

| 항목 | PER | EV/EBITDA |
|------|-----|-----------|
| **자본구조** | 영향받음 | 중립 |
| **감가상각** | 포함 | 제외 (현금흐름 근사) |
| **세금** | 포함 | 제외 (세율 차이 중립) |
| **M&A 분석** | 부적합 | 최적 |

:::tip 핵심 통찰
EV/EBITDA는 "이 기업을 인수하려면 영업현금흐름의 몇 배를 지불해야 하나?"를 나타냅니다. M&A와 LBO 분석에서 가장 많이 사용됩니다.
:::

## EV (Enterprise Value) 계산

<div className="formula-block">

**EV = 시가총액 + 총부채 - 현금 및 현금성자산**

또는 상세하게:

**EV = 시가총액 + 이자부부채 + 우선주 + 소수주주지분 - 현금**

</div>

### 조정 항목

| 항목 | 처리 | 이유 |
|------|------|------|
| **운용리스** | + 부채화 | IFRS 16 조정 전 기준 |
| **연금 부채** | + 추가 | 실질적 부채 |
| **비영업자산** | - 차감 | 핵심 영업가치만 측정 |

## EBITDA 계산

<div className="formula-block">

**EBITDA = 매출 - 매출원가 - 판관비 + 감가상각비**
         **= 영업이익 + 감가상각비**
         **= 당기순이익 + 이자비용 + 세금 + 감가상각비**

</div>

### Adjusted EBITDA

실질적인 영업 수익력을 위해 조정:

| 조정 항목 | 처리 |
|----------|------|
| 일회성 구조조정비용 | + 가산 |
| 자산손상차손 | + 가산 |
| 주식보상비용 | + 가산 (논란 있음) |
| 일회성 이익 | - 차감 |

## 산업별 EV/EBITDA (참고)

| 산업 | 평균 범위 | 특징 |
|------|----------|------|
| 유틸리티 | 6-8x | 안정적, 저성장 |
| 제조업 | 7-10x | 자본 집약적 |
| 통신 | 5-7x | 높은 CapEx |
| 소프트웨어 | 15-25x | 높은 마진, 성장 |
| 미디어/엔터 | 8-12x | 콘텐츠 자산 |

## 활용 예시

### Comparable Analysis

| 기업 | EV (조원) | EBITDA (조원) | EV/EBITDA |
|------|----------|--------------|-----------|
| 삼성전자 | 450 | 65 | 6.9x |
| SK하이닉스 | 100 | 18 | 5.6x |
| TSMC | 800 | 50 | 16.0x |
| 인텔 | 200 | 25 | 8.0x |
| **평균** | - | - | **9.1x** |

### 적정 EV 산출

```
대상 기업: K반도체
- EBITDA: 5조원
- 적용 배수: 8x (동종업계 중앙값)
- 적정 EV: 40조원
- 순부채: 10조원
- 적정 시가총액: 30조원
- 발행주식수: 1억주
- 적정 주가: 30만원
```

## M&A에서의 활용

### Transaction Comparable

과거 유사 거래의 배수 참고:

| 거래 | 연도 | EV/EBITDA | 프리미엄 |
|------|------|-----------|----------|
| Deal A | 2023 | 10x | 25% |
| Deal B | 2022 | 9x | 20% |
| Deal C | 2022 | 11x | 30% |
| **평균** | - | **10x** | **25%** |

### Control Premium

지배권 인수 시 추가 프리미엄:
- 일반적 범위: 20-40%
- 경쟁 입찰: 40-50%+

<div className="formula-block">

**인수 가격 = 현재 EV × (1 + Control Premium)**

</div>

## EV/EBITDA의 한계

### 1. CapEx 미반영

EBITDA는 감가상각을 더하므로 **유지보수 CapEx를 무시**합니다.

**대안**: EV/EBIT 또는 EV/(EBITDA - Maintenance CapEx)

### 2. 운전자본 변동 미반영

성장 기업은 운전자본 증가로 현금 유출

### 3. 성장률 미반영

같은 EV/EBITDA라도 성장률이 다르면 가치 다름

**대안**: EV/EBITDA를 EBITDA 성장률로 나눈 비율

### 4. 회계 기준 차이

- R&D 자본화 여부
- 리스 처리 방식 (IFRS 16)

## EV/EBIT vs EV/EBITDA

| 상황 | 선호 지표 | 이유 |
|------|----------|------|
| 감가상각 큼 | EV/EBIT | 실질 비용 반영 |
| 자본집약 산업 | EV/EBIT | CapEx 간접 반영 |
| 동종 비교 | EV/EBITDA | 회계 차이 중립 |
| M&A | EV/EBITDA | 업계 표준 |

## 관련 학습

- [상대가치평가 개요](/valuation/relative/overview)
- [LBO 모델링](/valuation/lbo) — EV/EBITDA 핵심 활용
- [DCF 분석](/valuation/dcf/overview) — 내재가치 접근

## 용어 사전

- [Enterprise Value](/glossary/d-f#enterprise-value)
- [EBITDA](/glossary/d-f#ebitda)
- [순부채](/glossary/m-r#net-debt)

## 참고자료

- Rosenbaum & Pearl "Investment Banking" Chapter 1
- Damodaran, A. "Investment Valuation" Chapter 18
