## 📁 FSD 폴더 구조 (basic)

```
src/basic/
├── App.tsx
├── main.tsx
│
├── pages/
│   ├── cart/
│   │   └── ui/
│   │       └── CartPage.tsx
│   └── admin/
│       └── ui/
│           └── AdminPage.tsx
│
├── widgets/
│   ├── Header/
│   │   └── ui/
│   │       └── Header.tsx
│   └── Notification/
│       └── ui/
│           └── Notification.tsx
│
├── features/
│   ├── cart/
│   │   ├── ui/
│   │   │   ├── CartList.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── model/
│   │       └── useCart.ts
│   ├── coupon/
│   │   ├── ui/
│   │   │   └── CouponSelector.tsx
│   │   └── model/
│   │       └── useCoupons.ts
│   ├── product-management/
│   │   └── ui/
│   │       ├── ProductManagement.tsx
│   │       ├── ProductTable.tsx
│   │       └── ProductForm.tsx
│   └── coupon-management/
│       └── ui/
│           ├── CouponManagement.tsx
│           ├── CouponGrid.tsx
│           └── CouponForm.tsx
│
├── entities/
│   ├── product/
│   │   ├── ui/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductGrid.tsx
│   │   └── model/
│   │       └── useProducts.ts
│   ├── cart/
│   │   └── model/
│   │       └── cart.ts
│   └── coupon/
│       └── ui/
│           └── CouponCard.tsx
│
└── shared/
    ├── ui/
    │   └── icons/
    │       └── index.tsx
    ├── lib/
    │   ├── useLocalStorage.ts
    │   ├── useDebounce.ts
    │   └── useNotification.ts
    └── config/
        └── index.ts
```

---

## 📐 FSD 의존성 규칙

```
pages    → widgets, features, entities, shared
widgets  → features, entities, shared
features → entities, shared
entities → shared
shared   → (다른 계층 import 금지, React/외부 라이브러리/shared 내부만 가능)
```

---

## 📝 변경 사항

| 기존 | 수정 | 이유 |
|------|------|------|
| `shared/hooks/` | `shared/lib/` | "hooks"는 기술적 분류명, FSD 비권장 |
| `shared/constants/` | `shared/config/` | FSD 공식 segment명 |
| `entities/Product/` | `entities/product/` | slice명은 소문자 권장 |
| `entities/Cart/` | `entities/cart/` | 동일 |
| `entities/Coupon/` | `entities/coupon/` | 동일 |

---

Sources:
- [Layers | Feature-Sliced Design](https://feature-sliced.design/docs/reference/layers)
- [Overview | Feature-Sliced Design](https://feature-sliced.design/docs/get-started/overview)
