---
id: duration
title: 듀레이션 계산기
sidebar_label: 듀레이션 계산기
description: 채권의 듀레이션과 컨벡시티를 계산합니다
keywords: [듀레이션, 컨벡시티, 채권, 금리위험, 수정듀레이션]
---

# 듀레이션 계산기

채권의 **금리 민감도**를 측정하는 듀레이션과 컨벡시티를 계산합니다.

## 핵심 개념

### 맥컬레이 듀레이션 (Macaulay Duration)

현금흐름의 **가중평균 회수 기간** (년)

### 수정 듀레이션 (Modified Duration)

금리 1%p 변동 시 **채권 가격 변동률**

<div className="formula-block">

**Modified Duration = Macaulay Duration / (1 + YTM/n)**

</div>

### 컨벡시티 (Convexity)

듀레이션의 **비선형 보정치**

<div className="formula-block">

**가격 변동 ≈ -Duration × Δy + ½ × Convexity × (Δy)²**

</div>

## 예시

| 채권 | 쿠폰 | 만기 | YTM | 수정듀레이션 |
|------|------|------|-----|-------------|
| 국채 3년 | 3% | 3년 | 3.5% | 2.8년 |
| 회사채 5년 | 5% | 5년 | 6% | 4.2년 |
| 제로쿠폰 10년 | 0% | 10년 | 4% | 9.6년 |

## 활용

1. **금리 위험 관리**: 듀레이션 매칭
2. **포트폴리오 헷징**: 선물 계약 비율 결정
3. **상대 가치**: 유사 만기 채권 비교

## 관련 학습

- [채권 가격결정](/assets/bonds/pricing)
- [듀레이션 심화](/assets/bonds/duration)
- [컨벡시티](/assets/bonds/convexity)
