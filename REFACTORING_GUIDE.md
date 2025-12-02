# 리팩토링 가이드: 쇼핑몰 애플리케이션

## 개요
`src/basic/App.tsx` (1,124줄)를 힌트 구조에 맞게 리팩토링합니다.

---

## 타입 정보

기본 타입은 `src/types.ts`에 이미 정의되어 있습니다. 이 파일을 그대로 사용하세요.

```typescript
// src/types.ts (이미 존재함 - 수정 불필요)
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  discounts: Discount[];
}

export interface Discount {
  quantity: number;
  rate: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  name: string;
  code: string;
  discountType: 'amount' | 'percentage';
  discountValue: number;
}
```

**추가로 필요한 타입** (basic 폴더 내에서 정의):

```typescript
// 확장된 상품 타입 (origin에서 사용)
interface ProductWithUI extends Product {
  description?: string;
  isRecommended?: boolean;
}

// 알림 타입
interface Notification {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning';
}

// 장바구니 총액 타입
interface CartTotals {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
}
```

**타입 import 방법:**
```typescript
import { Product, CartItem, Coupon, Discount } from '../types';
```

---

## 목표 폴더 구조

```
src/basic/
├── App.tsx
├── main.tsx
├── components/
│   ├── CartPage.tsx
│   └── AdminPage.tsx
├── hooks/
│   ├── useCart.ts
│   ├── useProducts.ts
│   └── useCoupons.ts
├── models/
│   └── cart.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── hooks/
│       ├── useLocalStorage.ts
│       └── useDebounce.ts
└── constants/
    └── index.ts
```

---

## 단계별 가이드

### Step 1: constants/index.ts
App.tsx에서 초기 데이터를 추출합니다.

**할 일:**
- [ ] `constants/index.ts` 파일 생성
- [ ] `initialProducts` 배열 이동 (origin 16-50줄 참고)
- [ ] `initialCoupons` 배열 이동 (origin 52-65줄 참고)

**힌트:** 상품에 `description`과 `isRecommended` 필드를 포함하세요.

---

### Step 2: utils/hooks/useLocalStorage.ts
범용 localStorage 훅을 생성합니다.

**할 일:**
- [ ] `utils/hooks/useLocalStorage.ts` 파일 생성
- [ ] `useLocalStorage<T>(key, initialValue)` 훅 구현
- [ ] JSON 파싱 에러를 안전하게 처리
- [ ] `[value, setValue]` 튜플 반환

**참고:** origin 69-103줄의 localStorage 패턴을 확인하세요.

---

### Step 3: utils/hooks/useDebounce.ts
검색용 디바운스 훅을 생성합니다.

**할 일:**
- [ ] `utils/hooks/useDebounce.ts` 파일 생성
- [ ] `useDebounce<T>(value, delay)` 훅 구현
- [ ] setTimeout/clearTimeout 패턴 사용
- [ ] 디바운스된 값 반환

**참고:** origin 240-245줄 확인.

---

### Step 4: utils/formatters.ts
포맷팅 유틸리티 함수를 생성합니다.

**할 일:**
- [ ] `utils/formatters.ts` 파일 생성
- [ ] `formatPrice(price: number): string` → "₩10,000" 또는 "10,000원"
- [ ] `formatPercentage(rate: number): string` → "10%"

---

### Step 5: utils/validators.ts
유효성 검사 유틸리티 함수를 생성합니다.

**할 일:**
- [ ] `utils/validators.ts` 파일 생성
- [ ] `isValidPrice(price: number): boolean`
- [ ] `isValidStock(stock: number): boolean`
- [ ] `extractNumbers(value: string): string`

---

### Step 6: models/cart.ts ⭐ (핵심)
순수 계산 함수를 추출합니다. **부작용 없이!**

**할 일:**
- [ ] `models/cart.ts` 파일 생성
- [ ] `calculateItemTotal(item, cart)` - 할인 적용 후 아이템 총액
- [ ] `getMaxApplicableDiscount(item, cart)` - 최대 할인율 (대량 구매 보너스 포함)
- [ ] `calculateCartTotal(cart, coupon)` - `{ totalBeforeDiscount, totalAfterDiscount }` 반환
- [ ] `getRemainingStock(product, cart)` - 남은 재고
- [ ] `addItemToCart(cart, product)` - 새 장바구니 배열 반환
- [ ] `removeItemFromCart(cart, productId)` - 새 장바구니 배열 반환
- [ ] `updateCartItemQuantity(cart, productId, quantity)` - 새 장바구니 배열 반환

**핵심 로직:**
- 대량 구매: 수량 >= 10 → +5% 추가 할인 (최대 50%)
- 쿠폰: 'amount'는 값을 빼고, 'percentage'는 (1 - value/100)을 곱함

**참고:** origin 147-205줄 확인.

---

### Step 7: hooks/useProducts.ts
상품 상태 관리 훅을 생성합니다.

**할 일:**
- [ ] `hooks/useProducts.ts` 파일 생성
- [ ] 영속성을 위해 `useLocalStorage` 사용
- [ ] 반환값:
  - `products` - 상품 배열
  - `addProduct(product)` - 새 상품 추가
  - `updateProduct(productId, updates)` - 상품 수정
  - `deleteProduct(productId)` - 상품 삭제

---

### Step 8: hooks/useCoupons.ts
쿠폰 상태 관리 훅을 생성합니다.

**할 일:**
- [ ] `hooks/useCoupons.ts` 파일 생성
- [ ] 영속성을 위해 `useLocalStorage` 사용
- [ ] 반환값:
  - `coupons` - 쿠폰 배열
  - `addCoupon(coupon)` - 새 쿠폰 추가
  - `deleteCoupon(couponCode)` - 쿠폰 삭제

---

### Step 9: hooks/useCart.ts ⭐ (핵심)
장바구니 상태 관리 훅을 생성합니다.

**할 일:**
- [ ] `hooks/useCart.ts` 파일 생성
- [ ] 장바구니 영속성을 위해 `useLocalStorage` 사용
- [ ] `models/cart.ts`의 함수들 활용
- [ ] 반환값:
  - `cart` - CartItem 배열
  - `selectedCoupon` - 선택된 쿠폰 또는 null
  - `addToCart(product)` - 장바구니에 상품 추가
  - `removeFromCart(productId)` - 장바구니에서 제거
  - `updateQuantity(productId, quantity)` - 수량 변경
  - `applyCoupon(coupon)` - 쿠폰 적용
  - `clearCart()` - 장바구니 비우기
  - `calculateTotal()` - 총액 계산
  - `getRemainingStock(product)` - 남은 재고 확인

---

### Step 10: components/CartPage.tsx
쇼핑 페이지 컴포넌트를 생성합니다.

**할 일:**
- [ ] `components/CartPage.tsx` 파일 생성
- [ ] 훅 사용: `useProducts`, `useCart`, `useCoupons`, `useDebounce`
- [ ] 구현할 기능:
  - 디바운스가 적용된 검색바
  - 상품 그리드 (검색으로 필터링)
  - 수량 조절이 가능한 장바구니 사이드바
  - 쿠폰 선택기
  - 결제 요약
  - 주문 버튼

**참고:** origin 895-1117줄의 JSX 구조 확인.

---

### Step 11: components/AdminPage.tsx
관리자 대시보드 컴포넌트를 생성합니다.

**할 일:**
- [ ] `components/AdminPage.tsx` 파일 생성
- [ ] 훅 사용: `useProducts`, `useCoupons`
- [ ] 구현할 기능:
  - 탭 네비게이션 (상품 / 쿠폰)
  - 수정/삭제가 가능한 상품 테이블
  - 상품 폼 (추가/수정)
  - 삭제가 가능한 쿠폰 그리드
  - 쿠폰 폼 (추가)

**참고:** origin 490-892줄의 JSX 구조 확인.

---

### Step 12: App.tsx
메인 라우터 컴포넌트를 정리합니다.

**할 일:**
- [ ] `App.tsx` 단순화
- [ ] 유지할 것: `isAdmin` 상태, 헤더, 조건부 렌더링
- [ ] `isAdmin`에 따라 `CartPage` 또는 `AdminPage` 렌더링
- [ ] 알림 시스템은 여기에 두거나 별도 훅으로 분리

---

### Step 13: 테스트 & 디버깅

**할 일:**
- [ ] `pnpm test:basic` 실행
- [ ] 실패하는 테스트 수정
- [ ] 모든 기능 동작 확인:
  - [ ] 상품 검색
  - [ ] 장바구니 추가
  - [ ] 수량 +/-
  - [ ] 쿠폰 적용
  - [ ] 결제
  - [ ] 관리자: 상품 추가/수정/삭제
  - [ ] 관리자: 쿠폰 추가/삭제
  - [ ] LocalStorage 영속성

---

## 핵심 규칙

1. **상태 관리 라이브러리 사용 금지** - useState/useEffect만 사용
2. **models에는 순수 함수만** - 부작용 없이, 테스트 가능하게
3. **hooks는 models를 사용** - hooks는 상태 관리, models는 계산
4. **테스트 통과 필수** - `pnpm test:basic`

---

## 난이도 요약

| Step | 파일 | 난이도 |
|------|------|--------|
| 1 | constants/index.ts | 쉬움 |
| 2 | utils/hooks/useLocalStorage.ts | 중간 |
| 3 | utils/hooks/useDebounce.ts | 쉬움 |
| 4 | utils/formatters.ts | 쉬움 |
| 5 | utils/validators.ts | 쉬움 |
| 6 | models/cart.ts ⭐ | 어려움 |
| 7 | hooks/useProducts.ts | 중간 |
| 8 | hooks/useCoupons.ts | 중간 |
| 9 | hooks/useCart.ts ⭐ | 어려움 |
| 10 | components/CartPage.tsx | 어려움 |
| 11 | components/AdminPage.tsx | 어려움 |
| 12 | App.tsx | 쉬움 |
| 13 | 테스트 & 디버깅 | - |
