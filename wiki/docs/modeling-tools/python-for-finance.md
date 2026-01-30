---
id: python-for-finance
title: "파이썬 금융 분석 실전"
sidebar_label: "파이썬 금융 분석"
---

# 파이썬 금융 분석 실전

Python은 금융 분석의 **자동화 엔진**입니다. Excel이 개별 기업의 정교한 모델링에 강하다면, Python은 대량 데이터 처리, 반복 작업 자동화, 통계 분석, 백테스팅에서 압도적 우위를 가집니다. 이 가이드는 금융 분석에 필요한 Python 역량을 실전 중심으로 안내합니다.

---

## 1. 환경 설정

### 1.1 추천 환경

| 환경 | 장점 | 단점 | 추천 대상 |
|------|------|------|----------|
| **Anaconda** | 패키지 관리 편리, 과학 계산 최적화 | 용량 큼 (5GB+) | 로컬 개발 (기본 추천) |
| **Jupyter Notebook** | 셀 단위 실행, 시각화 즉시 확인 | 대규모 프로젝트에 부적합 | 데이터 분석, 탐색 |
| **VS Code** | 강력한 편집기, 디버깅, Git 연동 | 초기 설정 필요 | 모듈/패키지 개발 |
| **Google Colab** | 설치 불필요, 무료 GPU | 로컬 파일 접근 제한 | 입문자, 협업 |

### 1.2 Anaconda 설치 및 환경 구성

```python
# 1. Anaconda 다운로드: https://www.anaconda.com/download
# 2. 설치 후 터미널(Anaconda Prompt)에서 가상환경 생성

# 가상환경 생성
conda create -n finance python=3.11

# 가상환경 활성화
conda activate finance

# 필수 패키지 설치
pip install pandas numpy matplotlib seaborn
pip install yfinance openpyxl xlsxwriter
pip install OpenDartReader FinanceDataReader
pip install scipy statsmodels scikit-learn
pip install jupyter notebook

# Jupyter Notebook 실행
jupyter notebook
```

### 1.3 Google Colab 빠른 시작

```python
# Google Colab에서는 대부분 기본 설치되어 있음
# 추가 패키지만 설치

!pip install yfinance OpenDartReader FinanceDataReader
```

---

## 2. 필수 라이브러리 가이드

### 2.1 pandas - 데이터 분석의 핵심

```python
import pandas as pd

# DataFrame 생성 (재무 데이터 예시)
financial_data = pd.DataFrame({
    '연도': ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024'],
    '매출': [236807, 279604, 302231, 258935, 300870],
    '영업이익': [35994, 51630, 43376, 6566, 32726],
    '당기순이익': [26409, 39907, 55654, 15487, 34680]
})

# 기본 분석
print(financial_data.describe())

# 성장률 계산
financial_data['매출_성장률'] = financial_data['매출'].pct_change()
financial_data['영업이익률'] = financial_data['영업이익'] / financial_data['매출']

print(financial_data)
```

### 2.2 numpy - 수치 계산

```python
import numpy as np

# DCF에서 현재가치 계산
cash_flows = np.array([10000, 12000, 14000, 15000, 16000])
wacc = 0.10
years = np.arange(1, 6)

# 각 연도 현재가치
pv_factors = 1 / (1 + wacc) ** years
pv_cash_flows = cash_flows * pv_factors

print(f"각 연도 PV: {pv_cash_flows}")
print(f"PV 합계: {pv_cash_flows.sum():,.0f}")

# Terminal Value (영구성장률 방식)
g = 0.02
terminal_value = cash_flows[-1] * (1 + g) / (wacc - g)
pv_terminal = terminal_value / (1 + wacc) ** 5
print(f"Terminal Value PV: {pv_terminal:,.0f}")
```

### 2.3 matplotlib / seaborn - 시각화

```python
import matplotlib.pyplot as plt
import matplotlib as mpl
import seaborn as sns

# 한글 폰트 설정 (필수!)
plt.rcParams['font.family'] = 'Malgun Gothic'  # Windows
# plt.rcParams['font.family'] = 'AppleGothic'  # Mac
plt.rcParams['axes.unicode_minus'] = False

# 매출 및 영업이익 추이 차트
fig, ax1 = plt.subplots(figsize=(10, 6))

years = ['FY2020', 'FY2021', 'FY2022', 'FY2023', 'FY2024']
revenue = [236807, 279604, 302231, 258935, 300870]
op_income = [35994, 51630, 43376, 6566, 32726]

ax1.bar(years, revenue, color='steelblue', alpha=0.7, label='매출')
ax1.set_ylabel('매출 (십억원)', color='steelblue')

ax2 = ax1.twinx()
ax2.plot(years, op_income, color='red', marker='o', linewidth=2, label='영업이익')
ax2.set_ylabel('영업이익 (십억원)', color='red')

plt.title('삼성전자 매출 및 영업이익 추이')
fig.legend(loc='upper left', bbox_to_anchor=(0.12, 0.88))
plt.tight_layout()
plt.show()
```

---

## 3. 주가 데이터 분석

### 3.1 yfinance로 주가 데이터 가져오기

```python
import yfinance as yf
import pandas as pd

# 삼성전자 주가 다운로드 (한국 종목: 종목코드.KS)
samsung = yf.download('005930.KS', start='2020-01-01', end='2024-12-31')

print(samsung.head())
print(f"\n데이터 기간: {samsung.index[0]} ~ {samsung.index[-1]}")
print(f"총 거래일: {len(samsung)}일")
```

### 3.2 수익률 계산

```python
# 일일 수익률
samsung['Daily_Return'] = samsung['Close'].pct_change()

# 누적 수익률
samsung['Cumulative_Return'] = (1 + samsung['Daily_Return']).cumprod() - 1

# 연환산 수익률 및 변동성
annual_return = samsung['Daily_Return'].mean() * 252
annual_volatility = samsung['Daily_Return'].std() * (252 ** 0.5)
sharpe_ratio = annual_return / annual_volatility

print(f"연환산 수익률: {annual_return:.2%}")
print(f"연환산 변동성: {annual_volatility:.2%}")
print(f"샤프 비율: {sharpe_ratio:.2f}")
```

### 3.3 이동평균선 분석

```python
# 이동평균 계산
samsung['MA20'] = samsung['Close'].rolling(window=20).mean()
samsung['MA60'] = samsung['Close'].rolling(window=60).mean()
samsung['MA120'] = samsung['Close'].rolling(window=120).mean()

# 골든크로스 / 데드크로스 시그널
samsung['Signal'] = 0
samsung.loc[samsung['MA20'] > samsung['MA60'], 'Signal'] = 1
samsung.loc[samsung['MA20'] < samsung['MA60'], 'Signal'] = -1
samsung['Signal_Change'] = samsung['Signal'].diff()

# 골든크로스 날짜
golden_cross = samsung[samsung['Signal_Change'] == 2]
dead_cross = samsung[samsung['Signal_Change'] == -2]

print(f"골든크로스 횟수: {len(golden_cross)}")
print(f"데드크로스 횟수: {len(dead_cross)}")

# 시각화
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10), gridspec_kw={'height_ratios': [3, 1]})

ax1.plot(samsung.index, samsung['Close'], label='종가', linewidth=1)
ax1.plot(samsung.index, samsung['MA20'], label='MA20', linewidth=0.8)
ax1.plot(samsung.index, samsung['MA60'], label='MA60', linewidth=0.8)
ax1.plot(samsung.index, samsung['MA120'], label='MA120', linewidth=0.8)
ax1.scatter(golden_cross.index, golden_cross['Close'], marker='^', color='red', s=100, label='골든크로스')
ax1.scatter(dead_cross.index, dead_cross['Close'], marker='v', color='blue', s=100, label='데드크로스')
ax1.set_title('삼성전자 이동평균선 분석')
ax1.legend()
ax1.set_ylabel('주가 (원)')

ax2.bar(samsung.index, samsung['Volume'], color='gray', alpha=0.5)
ax2.set_ylabel('거래량')

plt.tight_layout()
plt.show()
```

### 3.4 볼린저 밴드 (Bollinger Bands)

```python
# 볼린저 밴드 계산
window = 20
samsung['BB_Middle'] = samsung['Close'].rolling(window=window).mean()
samsung['BB_Std'] = samsung['Close'].rolling(window=window).std()
samsung['BB_Upper'] = samsung['BB_Middle'] + 2 * samsung['BB_Std']
samsung['BB_Lower'] = samsung['BB_Middle'] - 2 * samsung['BB_Std']

# %B 지표 (현재 가격의 밴드 내 위치)
samsung['BB_PctB'] = (samsung['Close'] - samsung['BB_Lower']) / (samsung['BB_Upper'] - samsung['BB_Lower'])

# 밴드폭 (Bandwidth)
samsung['BB_Width'] = (samsung['BB_Upper'] - samsung['BB_Lower']) / samsung['BB_Middle']

# 시각화
fig, axes = plt.subplots(3, 1, figsize=(14, 12), gridspec_kw={'height_ratios': [3, 1, 1]})

# 가격 + 볼린저 밴드
axes[0].plot(samsung.index[-250:], samsung['Close'][-250:], label='종가', linewidth=1)
axes[0].plot(samsung.index[-250:], samsung['BB_Upper'][-250:], 'r--', linewidth=0.7, label='상단밴드')
axes[0].plot(samsung.index[-250:], samsung['BB_Middle'][-250:], 'gray', linewidth=0.7, label='중심선')
axes[0].plot(samsung.index[-250:], samsung['BB_Lower'][-250:], 'b--', linewidth=0.7, label='하단밴드')
axes[0].fill_between(samsung.index[-250:], samsung['BB_Upper'][-250:], samsung['BB_Lower'][-250:], alpha=0.1)
axes[0].set_title('삼성전자 볼린저 밴드')
axes[0].legend()

# %B
axes[1].plot(samsung.index[-250:], samsung['BB_PctB'][-250:], color='purple')
axes[1].axhline(y=1, color='r', linestyle='--', linewidth=0.5)
axes[1].axhline(y=0, color='b', linestyle='--', linewidth=0.5)
axes[1].set_ylabel('%B')

# 밴드폭
axes[2].plot(samsung.index[-250:], samsung['BB_Width'][-250:], color='green')
axes[2].set_ylabel('밴드폭')

plt.tight_layout()
plt.show()
```

---

## 4. 재무제표 분석 자동화

### 4.1 DART OpenAPI 활용

```python
import OpenDartReader as odr

# API 키 설정 (https://opendart.fss.or.kr 에서 발급)
dart = odr.OpenDartReader('YOUR_API_KEY_HERE')

# 삼성전자 기업코드 조회
corp_code = dart.corp_code('삼성전자')
print(f"삼성전자 기업코드: {corp_code}")

# 재무제표 가져오기 (연간, 연결)
fs_2023 = dart.finstate('삼성전자', 2023)
print(fs_2023.head(20))
```

### 4.2 FinanceDataReader로 주가 데이터 수집

```python
import FinanceDataReader as fdr

# 삼성전자 주가
df_samsung = fdr.DataReader('005930', '2020-01-01', '2024-12-31')

# KOSPI 지수
df_kospi = fdr.DataReader('KS11', '2020-01-01', '2024-12-31')

# KRX 상장 종목 전체 목록
krx_list = fdr.StockListing('KRX')
print(f"KRX 상장 종목 수: {len(krx_list)}")
print(krx_list.head())
```

### 4.3 재무비율 자동 계산 시스템

```python
import pandas as pd
import numpy as np

class FinancialAnalyzer:
    """재무비율 자동 계산 클래스"""

    def __init__(self, company_name):
        self.company_name = company_name
        self.data = {}

    def set_income_statement(self, revenue, cogs, sga, operating_income,
                              interest_expense, ebt, tax, net_income):
        """손익계산서 데이터 입력"""
        self.data['revenue'] = revenue
        self.data['cogs'] = cogs
        self.data['gross_profit'] = revenue - cogs
        self.data['sga'] = sga
        self.data['operating_income'] = operating_income
        self.data['interest_expense'] = interest_expense
        self.data['ebt'] = ebt
        self.data['tax'] = tax
        self.data['net_income'] = net_income

    def set_balance_sheet(self, total_assets, current_assets, cash,
                           receivables, inventory, total_liabilities,
                           current_liabilities, payables, total_debt,
                           total_equity):
        """재무상태표 데이터 입력"""
        self.data['total_assets'] = total_assets
        self.data['current_assets'] = current_assets
        self.data['cash'] = cash
        self.data['receivables'] = receivables
        self.data['inventory'] = inventory
        self.data['total_liabilities'] = total_liabilities
        self.data['current_liabilities'] = current_liabilities
        self.data['payables'] = payables
        self.data['total_debt'] = total_debt
        self.data['total_equity'] = total_equity

    def profitability_ratios(self):
        """수익성 비율"""
        d = self.data
        return {
            '매출총이익률': d['gross_profit'] / d['revenue'],
            '영업이익률': d['operating_income'] / d['revenue'],
            '순이익률': d['net_income'] / d['revenue'],
            'ROE': d['net_income'] / d['total_equity'],
            'ROA': d['net_income'] / d['total_assets'],
            'ROIC': d['operating_income'] * (1 - d['tax']/d['ebt']) / (d['total_equity'] + d['total_debt'] - d['cash'])
        }

    def stability_ratios(self):
        """안정성 비율"""
        d = self.data
        return {
            '부채비율': d['total_liabilities'] / d['total_equity'],
            '유동비율': d['current_assets'] / d['current_liabilities'],
            '이자보상배율': d['operating_income'] / d['interest_expense'] if d['interest_expense'] > 0 else float('inf'),
            '순차입금비율': (d['total_debt'] - d['cash']) / d['total_equity']
        }

    def efficiency_ratios(self):
        """효율성 비율"""
        d = self.data
        return {
            '총자산회전율': d['revenue'] / d['total_assets'],
            'DSO': d['receivables'] / d['revenue'] * 365,
            'DIO': d['inventory'] / d['cogs'] * 365,
            'DPO': d['payables'] / d['cogs'] * 365,
            'CCC (현금전환주기)': (d['receivables']/d['revenue']*365 +
                                  d['inventory']/d['cogs']*365 -
                                  d['payables']/d['cogs']*365)
        }

    def print_all_ratios(self):
        """모든 비율 출력"""
        print(f"\n{'='*50}")
        print(f"  {self.company_name} 재무비율 분석")
        print(f"{'='*50}")

        print("\n[수익성]")
        for k, v in self.profitability_ratios().items():
            print(f"  {k}: {v:.2%}")

        print("\n[안정성]")
        for k, v in self.stability_ratios().items():
            if v == float('inf'):
                print(f"  {k}: N/A (이자비용 없음)")
            else:
                print(f"  {k}: {v:.2f}x" if '배율' in k or '비율' in k else f"  {k}: {v:.2%}")

        print("\n[효율성]")
        for k, v in self.efficiency_ratios().items():
            if '일' in k or 'D' in k or 'CCC' in k:
                print(f"  {k}: {v:.1f}일")
            else:
                print(f"  {k}: {v:.2f}x")


# 사용 예시 (삼성전자 2023년 가상 데이터, 단위: 십억원)
analyzer = FinancialAnalyzer("삼성전자")

analyzer.set_income_statement(
    revenue=258935, cogs=185421, sga=62703, operating_income=6566,
    interest_expense=1810, ebt=7504, tax=3432, net_income=15487
)

analyzer.set_balance_sheet(
    total_assets=455905, current_assets=192824, cash=65044,
    receivables=40516, inventory=41739, total_liabilities=92228,
    current_liabilities=66890, payables=11080, total_debt=9425,
    total_equity=363677
)

analyzer.print_all_ratios()
```

---

## 5. 포트폴리오 최적화

### 5.1 효율적 프론티어 (Efficient Frontier)

```python
import numpy as np
import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt
from scipy.optimize import minimize

# 포트폴리오 구성 종목 (한국 대형주 5종목)
tickers = ['005930.KS', '000660.KS', '035420.KS', '051910.KS', '006400.KS']
names = ['삼성전자', 'SK하이닉스', 'NAVER', 'LG화학', '삼성SDI']

# 주가 데이터 다운로드
data = yf.download(tickers, start='2021-01-01', end='2024-12-31')['Close']
data.columns = names

# 일일 수익률
returns = data.pct_change().dropna()

# 연환산 기대수익률 및 공분산 행렬
mean_returns = returns.mean() * 252
cov_matrix = returns.cov() * 252

n_assets = len(names)

def portfolio_performance(weights, mean_returns, cov_matrix):
    """포트폴리오 수익률과 변동성 계산"""
    port_return = np.sum(mean_returns * weights)
    port_volatility = np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights)))
    return port_return, port_volatility

def negative_sharpe(weights, mean_returns, cov_matrix, risk_free=0.035):
    """음의 샤프비율 (최소화 목적)"""
    p_ret, p_vol = portfolio_performance(weights, mean_returns, cov_matrix)
    return -(p_ret - risk_free) / p_vol

# 몬테카를로 시뮬레이션
n_portfolios = 10000
results = np.zeros((3, n_portfolios))  # 수익률, 변동성, 샤프

for i in range(n_portfolios):
    weights = np.random.random(n_assets)
    weights /= np.sum(weights)

    p_ret, p_vol = portfolio_performance(weights, mean_returns, cov_matrix)
    sharpe = (p_ret - 0.035) / p_vol

    results[0, i] = p_ret
    results[1, i] = p_vol
    results[2, i] = sharpe

# 최적 포트폴리오 (최대 샤프)
constraints = {'type': 'eq', 'fun': lambda x: np.sum(x) - 1}
bounds = tuple((0, 1) for _ in range(n_assets))
init_weights = np.array([1/n_assets] * n_assets)

optimal = minimize(negative_sharpe, init_weights,
                   args=(mean_returns, cov_matrix),
                   method='SLSQP', bounds=bounds, constraints=constraints)

opt_ret, opt_vol = portfolio_performance(optimal.x, mean_returns, cov_matrix)

print("\n최적 포트폴리오 (최대 샤프비율):")
print(f"기대수익률: {opt_ret:.2%}")
print(f"변동성: {opt_vol:.2%}")
print(f"샤프비율: {-optimal.fun:.2f}")
print("\n종목별 비중:")
for name, weight in zip(names, optimal.x):
    print(f"  {name}: {weight:.1%}")

# 시각화
plt.figure(figsize=(12, 8))
scatter = plt.scatter(results[1, :], results[0, :], c=results[2, :],
                      cmap='viridis', marker='o', s=5, alpha=0.5)
plt.colorbar(scatter, label='샤프 비율')
plt.scatter(opt_vol, opt_ret, c='red', marker='*', s=500, label='최적 포트폴리오')
plt.xlabel('변동성 (연환산)')
plt.ylabel('기대수익률 (연환산)')
plt.title('효율적 프론티어')
plt.legend()
plt.tight_layout()
plt.show()
```

### 5.2 몬테카를로 시뮬레이션 (주가 예측)

```python
import numpy as np
import matplotlib.pyplot as plt

# 삼성전자 파라미터 (예시)
S0 = 70000        # 현재 주가
mu = 0.08          # 기대 수익률 (연)
sigma = 0.30       # 변동성 (연)
T = 1.0            # 기간 (1년)
n_steps = 252      # 영업일 수
n_simulations = 1000

dt = T / n_steps
prices = np.zeros((n_steps + 1, n_simulations))
prices[0] = S0

# 기하 브라운 운동 (GBM) 시뮬레이션
np.random.seed(42)
for t in range(1, n_steps + 1):
    z = np.random.standard_normal(n_simulations)
    prices[t] = prices[t-1] * np.exp((mu - 0.5 * sigma**2) * dt + sigma * np.sqrt(dt) * z)

# 결과 분석
final_prices = prices[-1]
print(f"시뮬레이션 결과 (1년 후):")
print(f"  평균 주가: {final_prices.mean():,.0f}원")
print(f"  중앙값: {np.median(final_prices):,.0f}원")
print(f"  5% 분위: {np.percentile(final_prices, 5):,.0f}원")
print(f"  95% 분위: {np.percentile(final_prices, 95):,.0f}원")
print(f"  상승 확률: {(final_prices > S0).mean():.1%}")

# 시각화
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# 경로 플롯 (50개만)
for i in range(50):
    axes[0].plot(prices[:, i], linewidth=0.5, alpha=0.5)
axes[0].axhline(y=S0, color='red', linestyle='--', label=f'현재가: {S0:,}원')
axes[0].set_title('몬테카를로 시뮬레이션 (50개 경로)')
axes[0].set_xlabel('영업일')
axes[0].set_ylabel('주가 (원)')
axes[0].legend()

# 분포 히스토그램
axes[1].hist(final_prices, bins=50, color='steelblue', alpha=0.7, edgecolor='black')
axes[1].axvline(x=S0, color='red', linestyle='--', label=f'현재가: {S0:,}원')
axes[1].axvline(x=final_prices.mean(), color='green', linestyle='--', label=f'평균: {final_prices.mean():,.0f}원')
axes[1].set_title('1년 후 주가 분포')
axes[1].set_xlabel('주가 (원)')
axes[1].set_ylabel('빈도')
axes[1].legend()

plt.tight_layout()
plt.show()
```

---

## 6. DCF 자동화

### 6.1 Python DCF 모델 구현

```python
import numpy as np
import pandas as pd

class DCFModel:
    """DCF 밸류에이션 모델"""

    def __init__(self, company_name):
        self.company_name = company_name

    def set_assumptions(self, base_revenue, revenue_growth_rates,
                         ebit_margins, tax_rate, da_pct_revenue,
                         capex_pct_revenue, nwc_pct_revenue,
                         wacc, terminal_growth, shares_outstanding,
                         net_debt):
        """주요 가정 설정"""
        self.base_revenue = base_revenue
        self.growth_rates = revenue_growth_rates
        self.ebit_margins = ebit_margins
        self.tax_rate = tax_rate
        self.da_pct = da_pct_revenue
        self.capex_pct = capex_pct_revenue
        self.nwc_pct = nwc_pct_revenue
        self.wacc = wacc
        self.terminal_growth = terminal_growth
        self.shares = shares_outstanding
        self.net_debt = net_debt
        self.projection_years = len(revenue_growth_rates)

    def project_fcf(self):
        """FCFF 추정"""
        years = range(1, self.projection_years + 1)
        revenue = self.base_revenue

        projections = []
        prev_nwc = self.base_revenue * self.nwc_pct[0]

        for i, year in enumerate(years):
            revenue = revenue * (1 + self.growth_rates[i])
            ebit = revenue * self.ebit_margins[i]
            nopat = ebit * (1 - self.tax_rate)
            da = revenue * self.da_pct[i]
            capex = revenue * self.capex_pct[i]
            current_nwc = revenue * self.nwc_pct[i]
            delta_nwc = current_nwc - prev_nwc
            fcff = nopat + da - capex - delta_nwc

            projections.append({
                'Year': year,
                'Revenue': revenue,
                'EBIT': ebit,
                'NOPAT': nopat,
                'D&A': da,
                'CAPEX': capex,
                'Delta_NWC': delta_nwc,
                'FCFF': fcff
            })
            prev_nwc = current_nwc

        self.projections = pd.DataFrame(projections)
        return self.projections

    def calculate_valuation(self):
        """기업가치 및 주당 가치 산출"""
        if not hasattr(self, 'projections'):
            self.project_fcf()

        # 현재가치 계산
        fcffs = self.projections['FCFF'].values
        years = self.projections['Year'].values
        pv_factors = 1 / (1 + self.wacc) ** years
        pv_fcffs = fcffs * pv_factors

        # Terminal Value
        terminal_fcff = fcffs[-1] * (1 + self.terminal_growth)
        terminal_value = terminal_fcff / (self.wacc - self.terminal_growth)
        pv_terminal = terminal_value * pv_factors[-1]

        # 기업가치
        enterprise_value = pv_fcffs.sum() + pv_terminal
        equity_value = enterprise_value - self.net_debt
        price_per_share = equity_value / self.shares

        self.valuation = {
            'PV of FCFFs': pv_fcffs.sum(),
            'Terminal Value': terminal_value,
            'PV of Terminal Value': pv_terminal,
            'Enterprise Value': enterprise_value,
            'Net Debt': self.net_debt,
            'Equity Value': equity_value,
            'Shares Outstanding': self.shares,
            'Price per Share': price_per_share,
            'TV as % of EV': pv_terminal / enterprise_value
        }
        return self.valuation

    def sensitivity_analysis(self, wacc_range, growth_range):
        """WACC-영구성장률 민감도 분석"""
        results = pd.DataFrame(index=growth_range, columns=wacc_range)

        for w in wacc_range:
            for g in growth_range:
                # 간이 계산 (Terminal Value만 변경)
                fcffs = self.projections['FCFF'].values
                years = self.projections['Year'].values
                pv_factors = 1 / (1 + w) ** years
                pv_fcffs = fcffs * pv_factors

                tv_fcff = fcffs[-1] * (1 + g)
                tv = tv_fcff / (w - g)
                pv_tv = tv * pv_factors[-1]

                ev = pv_fcffs.sum() + pv_tv
                eq = ev - self.net_debt
                price = eq / self.shares
                results.loc[g, w] = round(price)

        return results

    def print_summary(self):
        """결과 요약 출력"""
        if not hasattr(self, 'valuation'):
            self.calculate_valuation()

        v = self.valuation

        print(f"\n{'='*60}")
        print(f"  {self.company_name} DCF 밸류에이션 결과")
        print(f"{'='*60}")
        print(f"\n  추정 FCFF 합계 (PV): {v['PV of FCFFs']:>15,.0f}")
        print(f"  Terminal Value (PV):  {v['PV of Terminal Value']:>15,.0f}")
        print(f"  {'─'*45}")
        print(f"  Enterprise Value:     {v['Enterprise Value']:>15,.0f}")
        print(f"  (-) 순차입금:          {v['Net Debt']:>15,.0f}")
        print(f"  {'─'*45}")
        print(f"  Equity Value:         {v['Equity Value']:>15,.0f}")
        print(f"  (/) 발행주식수:        {v['Shares Outstanding']:>15,.0f}")
        print(f"  {'='*45}")
        print(f"  주당 적정가치:         {v['Price per Share']:>15,.0f}원")
        print(f"\n  TV 비중: {v['TV as % of EV']:.1%}")


# 사용 예시 (가상 기업, 단위: 억원)
dcf = DCFModel("가상기업")

dcf.set_assumptions(
    base_revenue=100000,
    revenue_growth_rates=[0.10, 0.08, 0.07, 0.06, 0.05],
    ebit_margins=[0.15, 0.15, 0.14, 0.14, 0.13],
    tax_rate=0.22,
    da_pct_revenue=[0.05, 0.05, 0.05, 0.04, 0.04],
    capex_pct_revenue=[0.07, 0.06, 0.06, 0.05, 0.05],
    nwc_pct_revenue=[0.15, 0.15, 0.14, 0.14, 0.14],
    wacc=0.10,
    terminal_growth=0.02,
    shares_outstanding=1000000,  # 천주 단위
    net_debt=5000
)

# 실행
projections = dcf.project_fcf()
print("\n[FCFF 추정]")
print(projections.to_string(index=False, float_format='{:,.0f}'.format))

dcf.print_summary()

# 민감도 분석
wacc_range = [0.08, 0.09, 0.10, 0.11, 0.12]
growth_range = [0.01, 0.015, 0.02, 0.025, 0.03]

sensitivity = dcf.sensitivity_analysis(wacc_range, growth_range)
print("\n[민감도 분석: WACC (열) vs 영구성장률 (행)]")
print(sensitivity)
```

---

## 7. 백테스팅

### 7.1 단순 모멘텀 전략 백테스트

```python
import pandas as pd
import numpy as np
import FinanceDataReader as fdr

def momentum_backtest(ticker, start_date, end_date, lookback=60, holding=20):
    """
    단순 모멘텀 전략 백테스트
    - lookback일간 수익률이 양(+)이면 매수, 음(-)이면 매도(현금 보유)
    - holding일간 포지션 유지 후 재평가
    """
    # 데이터 로드
    df = fdr.DataReader(ticker, start_date, end_date)
    df['Return'] = df['Close'].pct_change()

    # 모멘텀 시그널
    df['Momentum'] = df['Close'].pct_change(lookback)
    df['Signal'] = (df['Momentum'] > 0).astype(int)

    # 전략 수익률 (시그널 다음 날부터 적용)
    df['Strategy_Return'] = df['Signal'].shift(1) * df['Return']

    # 누적 수익률
    df['Buy_Hold'] = (1 + df['Return']).cumprod()
    df['Strategy'] = (1 + df['Strategy_Return']).cumprod()

    # 성과 분석
    total_days = len(df.dropna())
    years = total_days / 252

    bh_total = df['Buy_Hold'].iloc[-1] - 1
    st_total = df['Strategy'].iloc[-1] - 1

    bh_annual = (1 + bh_total) ** (1/years) - 1
    st_annual = (1 + st_total) ** (1/years) - 1

    bh_vol = df['Return'].std() * np.sqrt(252)
    st_vol = df['Strategy_Return'].std() * np.sqrt(252)

    bh_sharpe = bh_annual / bh_vol
    st_sharpe = st_annual / st_vol

    # 최대 낙폭 (MDD)
    bh_cummax = df['Buy_Hold'].cummax()
    bh_mdd = ((df['Buy_Hold'] - bh_cummax) / bh_cummax).min()

    st_cummax = df['Strategy'].cummax()
    st_mdd = ((df['Strategy'] - st_cummax) / st_cummax).min()

    print(f"\n{'='*50}")
    print(f"  모멘텀 전략 백테스트 결과 ({ticker})")
    print(f"  기간: {start_date} ~ {end_date}")
    print(f"  Lookback: {lookback}일")
    print(f"{'='*50}")
    print(f"\n{'지표':<20} {'Buy & Hold':>12} {'모멘텀 전략':>12}")
    print(f"{'─'*44}")
    print(f"{'총 수익률':<20} {bh_total:>11.1%} {st_total:>11.1%}")
    print(f"{'연환산 수익률':<18} {bh_annual:>11.1%} {st_annual:>11.1%}")
    print(f"{'연환산 변동성':<18} {bh_vol:>11.1%} {st_vol:>11.1%}")
    print(f"{'샤프 비율':<20} {bh_sharpe:>11.2f} {st_sharpe:>11.2f}")
    print(f"{'최대 낙폭(MDD)':<17} {bh_mdd:>11.1%} {st_mdd:>11.1%}")

    return df

# 실행
result = momentum_backtest('005930', '2020-01-01', '2024-12-31', lookback=60)
```

### 7.2 PBR 기반 가치 전략 백테스트 (다종목)

```python
import pandas as pd
import numpy as np
import FinanceDataReader as fdr

def value_screening_backtest(universe, start_year=2020, end_year=2024):
    """
    PBR 하위 분위 종목 매수 전략
    매년 초 PBR 기준 하위 20% 종목을 동일비중으로 매수, 1년 보유
    """
    results = []

    for year in range(start_year, end_year):
        buy_date = f'{year}-04-01'
        sell_date = f'{year+1}-03-31'

        # 각 종목 수익률 계산
        returns = {}
        for ticker, name in universe.items():
            try:
                df = fdr.DataReader(ticker, buy_date, sell_date)
                if len(df) > 0:
                    ret = (df['Close'].iloc[-1] / df['Close'].iloc[0]) - 1
                    returns[name] = ret
            except Exception:
                continue

        if returns:
            avg_return = np.mean(list(returns.values()))
            results.append({
                'Year': f'{year}-{year+1}',
                'Avg_Return': avg_return,
                'N_Stocks': len(returns),
                'Best': max(returns, key=returns.get),
                'Worst': min(returns, key=returns.get)
            })

    results_df = pd.DataFrame(results)
    print("\n연도별 포트폴리오 성과:")
    print(results_df.to_string(index=False))
    return results_df

# 사용 예시 (간소화된 유니버스)
universe = {
    '005930': '삼성전자',
    '000660': 'SK하이닉스',
    '035420': 'NAVER',
    '051910': 'LG화학',
    '005380': '현대차'
}

value_screening_backtest(universe, 2021, 2024)
```

---

## 8. 한국 시장 API 가이드

### 8.1 DART OpenAPI 상세

```python
import OpenDartReader as odr

# 초기화
dart = odr.OpenDartReader('YOUR_API_KEY')

# 1. 기업 검색
samsung_code = dart.corp_code('삼성전자')

# 2. 공시 검색
disclosures = dart.list('삼성전자', start='2024-01-01', end='2024-12-31')
print(f"삼성전자 2024년 공시 수: {len(disclosures)}")

# 3. 재무제표 (연간, 연결)
fs = dart.finstate('삼성전자', 2023, reprt_code='11011')
# reprt_code: 11011=사업보고서, 11012=반기, 11013=1분기, 11014=3분기

# 4. 주요 재무 항목 필터링
revenue = fs[fs['account_nm'].str.contains('매출액|수익')].iloc[0]
print(f"매출액: {revenue['thstrm_amount']}")

# 5. 최대주주 정보
shareholders = dart.major_shareholders('삼성전자')
```

### 8.2 KRX 데이터 수집

```python
import FinanceDataReader as fdr
import pandas as pd

# KOSPI 전 종목 목록
kospi_list = fdr.StockListing('KOSPI')
print(f"KOSPI 종목 수: {len(kospi_list)}")

# KOSDAQ 전 종목 목록
kosdaq_list = fdr.StockListing('KOSDAQ')
print(f"KOSDAQ 종목 수: {len(kosdaq_list)}")

# 전 종목 시가총액 기준 정렬
all_stocks = pd.concat([kospi_list, kosdaq_list])
all_stocks_sorted = all_stocks.sort_values('Marcap', ascending=False)
print("\n시가총액 Top 10:")
print(all_stocks_sorted[['Name', 'Marcap']].head(10))
```

### 8.3 네이버 금융 크롤링 주의사항

:::warning 크롤링 법적 주의사항
- 네이버 금융은 공식 API를 제공하지 않습니다.
- 크롤링 시 **이용약관 위반** 가능성이 있으므로 주의하세요.
- 대안: `FinanceDataReader` 라이브러리는 합법적 방법으로 데이터를 수집합니다.
- 대량 크롤링은 서버에 부담을 주므로 적절한 딜레이(`time.sleep`)를 반드시 넣으세요.
- 상업적 목적의 크롤링은 법적 문제가 될 수 있습니다.
:::

```python
# 권장: FinanceDataReader 사용 (네이버 금융 크롤링 대안)
import FinanceDataReader as fdr

# 네이버 금융에서 제공하는 것과 동일한 데이터를 합법적으로 수집
df = fdr.DataReader('005930', '2024-01-01')
print(df.tail())

# ETF 데이터
etf_list = fdr.StockListing('ETF/KR')
print(f"\n한국 ETF 수: {len(etf_list)}")
```

---

## 9. 실전 프로젝트 아이디어

Python 금융 분석 역량을 키우기 위한 단계별 프로젝트를 제안합니다.

### 입문 프로젝트
1. **5개 종목 수익률 비교 대시보드**: yfinance로 데이터 수집, matplotlib로 시각화
2. **자동 재무비율 계산기**: DART API로 데이터 수집, 비율 자동 계산

### 중급 프로젝트
3. **PER/PBR 밴드 차트 자동 생성**: 과거 밸류에이션 밴드를 자동으로 그리는 도구
4. **포트폴리오 최적화 도구**: 효율적 프론티어, 최소 분산 포트폴리오 계산

### 고급 프로젝트
5. **팩터 스크리닝 시스템**: 밸류, 모멘텀, 퀄리티 팩터를 결합한 종목 선별
6. **실시간 공시 알림 봇**: DART API로 특정 기업 공시 모니터링, 텔레그램 알림
7. **DCF 자동화 파이프라인**: 데이터 수집부터 밸류에이션까지 전 과정 자동화

:::tip Python 학습 우선순위
1. `pandas` 능숙하게 다루기 (금융 분석의 80%)
2. `matplotlib` 시각화 (분석 결과 표현)
3. API 데이터 수집 (`yfinance`, `OpenDartReader`)
4. 통계 분석 (`scipy`, `statsmodels`)
5. 자동화 스크립트 작성

Excel을 완전히 대체하려 하지 마세요. Excel과 Python은 보완적입니다. Excel로 개별 모델을 정교하게 만들고, Python으로 대량 처리와 자동화를 담당하는 것이 현업의 베스트 프랙티스입니다.
:::
