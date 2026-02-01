---
id: wacc
title: WACC (가중평균자본비용)
sidebar_label: WACC
description: 기업의 자본조달 비용을 측정하는 핵심 지표
keywords: [WACC, 자본비용, DCF, 할인율, 베타, CAPM]
---

# WACC (가중평균자본비용)

<span className="difficulty-badge difficulty-intermediate">중급</span>

## 정의

**WACC(Weighted Average Cost of Capital)**는 기업이 자기자본과 부채를 통해 자금을 조달할 때 발생하는 **평균 비용**입니다. DCF 분석에서 미래 현금흐름을 현재가치로 할인할 때 사용하는 핵심 할인율입니다.

:::tip 왜 중요한가?
WACC는 DCF 모델에서 기업가치의 60-80%를 차지하는 **터미널 가치** 계산에 직접 사용됩니다. WACC가 1%p 변하면 기업가치가 10-20% 변동할 수 있습니다.
:::

## 공식

<div className="formula-block">

**WACC = (E/V) × Re + (D/V) × Rd × (1-T)**

</div>

### 구성요소

- **E** — 의미: Equity (자기자본), 설명: 시가총액 사용
- **D** — 의미: Debt (부채), 설명: 이자부부채 (총부채 아님)
- **V** — 의미: E + D, 설명: 기업의 총 자본
- **Re** — 의미: Cost of Equity, 설명: 자기자본비용 (CAPM으로 산출)
- **Rd** — 의미: Cost of Debt, 설명: 부채비용 (이자율)
- **T** — 의미: Tax Rate, 설명: 법인세율

## 자기자본비용 (CAPM)

자기자본비용은 **CAPM(자본자산가격결정모형)**으로 계산합니다:

<div className="formula-block">

**Re = Rf + β × (Rm - Rf)**

</div>

- **Rf** — 의미: 무위험이자율, 한국 기준 예시: 국고채 10년물 (3.5%)
- **β** — 의미: 베타 (시장 대비 변동성), 한국 기준 예시: 1.0 = 시장과 동일
- **Rm - Rf** — 의미: 시장위험프리미엄 (ERP), 한국 기준 예시: 5-7%

### 베타(β) 추정 방법

#### 1. Historical Beta (과거 베타)
과거 주가와 시장지수의 회귀분석

```
주식 수익률 = α + β × 시장 수익률 + ε
```

#### 2. Adjusted Beta (조정 베타)
평균 회귀(mean reversion) 반영

<div className="formula-block">

**Adjusted β = (Raw β × 2/3) + (1 × 1/3)**

</div>

#### 3. Unlevered/Relevered Beta
산업 평균 베타를 목표 자본구조로 조정

<div className="formula-block">

**βL = βU × [1 + (1-T) × (D/E)]**

</div>

- **βL**: 레버드 베타 (부채 반영)
- **βU**: 언레버드 베타 (순수 영업위험)
- **D/E**: 부채비율
- **T**: 법인세율

## 부채비용 (Rd)

부채비용은 다음 방법으로 추정합니다:

1. **기존 부채의 YTM**: 발행 채권의 만기수익률
2. **신용등급 기반**: 신용등급별 스프레드 가산
3. **이자비용/부채**: 단순 평균 이자율

:::note 세후 부채비용
부채 이자는 세금 공제 대상이므로 (1-T)를 곱합니다.

**세후 Rd = Rd × (1-T)**
:::

## 실무 적용 예시

### 삼성전자 WACC 산출 (가상)

- **시가총액 (E)** — 값: 400조원
- **이자부부채 (D)** — 값: 50조원
- **E/V** — 값: 88.9%
- **D/V** — 값: 11.1%
- **무위험이자율 (Rf)** — 값: 3.5%, 비고: 국고채 10년
- **베타 (β)** — 값: 1.1, 비고: 조정 베타
- **시장위험프리미엄** — 값: 6.0%
- **자기자본비용 (Re)** — 값: **10.1%**, 비고: 3.5% + 1.1×6%
- **세전 부채비용 (Rd)** — 값: 4.5%
- **법인세율 (T)** — 값: 22%
- **세후 부채비용** — 값: **3.51%**, 비고: 4.5% × (1-22%)
- **WACC** — 값: **9.37%**, 비고: 88.9%×10.1% + 11.1%×3.51%

## 산업별 WACC 범위 (참고)

- **유틸리티** — 일반적 WACC 범위: 5-7%, 특징: 안정적 현금흐름, 낮은 베타
- **금융** — 일반적 WACC 범위: 6-8%, 특징: 레버리지 효과
- **소비재** — 일반적 WACC 범위: 7-9%, 특징: 경기 민감도
- **산업재** — 일반적 WACC 범위: 8-10%, 특징: 자본 집약적
- **기술** — 일반적 WACC 범위: 9-12%, 특징: 높은 성장성, 높은 변동성
- **바이오** — 일반적 WACC 범위: 12-15%+, 특징: 높은 불확실성

## 흔한 실수와 주의점

### 흔한 실수

1. **장부가 vs 시장가**
   -  장부상 자본과 부채 사용
   -  **시장가치** 기준으로 계산

2. **이자부부채만 포함**
   -  매입채무, 미지급금 포함
   -  이자 발생 부채만 포함

3. **국가별 무위험이자율**
   -  미국 국채 일괄 적용
   -  해당 국가 국채 수익률 사용

4. **목표 vs 현재 자본구조**
   - 이론적으로는 **목표 자본구조** 사용이 올바름
   - 실무에서는 현재 구조 또는 산업 평균 사용

### 특수 상황

- **신생 기업 (베타 없음)**: 유사 기업 또는 산업 평균 베타
- **비상장 기업**: 상장 유사기업 베타 + 유동성 프리미엄
- **다국적 기업**: 지역별 WACC 가중평균 또는 주요 시장 기준
- **적자 기업**: 세금 효과 없음 (T=0)

## 인터랙티브 도구

**[WACC 계산기로 직접 계산해보기 →](/calculators/wacc)**

## 관련 학습

- [DCF 분석 개요](/valuation/dcf/overview)
- [FCFF vs FCFE](/valuation/dcf/fcff-fcfe)
- [터미널 가치](/valuation/dcf/terminal-value)
- [민감도 분석](/valuation/dcf/sensitivity)

## 용어 사전

- [베타 (β)](/glossary/a-c#beta-베타)
- [CAPM](/glossary/a-c#capm-capital-asset-pricing-model-자본자산가격결정모형)
- [무위험이자율](/glossary/m-r#risk-free-rate-무위험이자율)
- [시장위험프리미엄](/glossary/m-r#risk-premium-위험-프리미엄)

## 참고자료

- Damodaran, A. "Investment Valuation" Chapter 8
- CFA Institute Level II Curriculum - Corporate Finance
- Brealey, Myers & Allen "Principles of Corporate Finance" Chapter 9
