---
id: graham-number
title: 그레이엄 넘버 계산기
sidebar_label: 그레이엄 넘버
description: 벤자민 그레이엄의 적정 주가 공식으로 저평가 종목을 찾습니다
keywords: [그레이엄 넘버, 안전마진, 가치투자, PER, PBR]
---

import { GrahamNumberCalculator } from '@site/src/components/Calculator';

# 그레이엄 넘버 계산기

**벤자민 그레이엄**이 제시한 적정 주가 공식으로 저평가 여부를 판단합니다.

## 계산기

<GrahamNumberCalculator />

## 그레이엄 넘버란?

벤자민 그레이엄이 "현명한 투자자"에서 제시한 주식의 최대 적정 가격입니다.

**공식:**
```
Graham Number = √(22.5 × EPS × BVPS)
```

**22.5의 의미:**
- PER 15 (그레이엄의 PER 상한)
- PBR 1.5 (그레이엄의 PBR 상한)
- 15 × 1.5 = 22.5

## 사용 방법

1. **EPS (주당순이익)**: 최근 12개월 또는 예상 EPS
2. **BVPS (주당순자산)**: 최근 분기 기준
3. **현재 주가**: 비교를 위한 현재 시장가

## 결과 해석

### 저평가 신호 ✅
- 현재 주가 < 그레이엄 넘버
- 안전마진 존재
- PER ≤ 15, PBR ≤ 1.5

### 고평가 신호 ❌
- 현재 주가 > 그레이엄 넘버
- 프리미엄 존재
- 그레이엄 기준 미충족

## 그레이엄의 방어적 투자자 기준

| 기준 | 조건 |
|------|------|
| PER | ≤ 15 |
| PBR | ≤ 1.5 |
| PER × PBR | ≤ 22.5 |
| 부채비율 | 낮음 |
| 배당 | 20년 연속 |

## 한계점

1. **성장 미반영**: 고성장 기업에 부적합
2. **산업 차이**: 기술주 등 무형자산 기업에 부적합
3. **일시적 이익 왜곡**: 정상화된 EPS 사용 필요

## 관련 학습

- [벤자민 그레이엄](/masters/graham)
- [PER 분석](/valuation/relative/per)
- [PBR 분석](/valuation/relative/pbr)
