# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React TypeScript shopping mall application for learning **separation of concerns** through refactoring. The goal is to understand and separate responsibility layers (Component, hook, function) based on **entities**.

### Key Concepts
- Entity-handling state vs non-entity state (cart, isCartFull vs isShowPopup)
- Entity-handling components/hooks vs generic ones (CartItemView, useCart vs Button, useRoute)
- Entity-handling functions vs utility functions (calculateCartTotal(cart) vs capitalize(str))

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development servers (per implementation stage)
pnpm dev:origin    # Original monolithic implementation
pnpm dev:basic     # Basic refactoring (without state management library)
pnpm dev:advanced  # Advanced refactoring

# Testing
pnpm test          # Run all tests
pnpm test:origin   # Test origin only
pnpm test:basic    # Test basic only
pnpm test:advanced # Test advanced only
pnpm test:ui       # Vitest UI

# Build and lint
pnpm build
pnpm lint
```

## Architecture

### Directory Structure
- `src/origin/` - Monolithic single-file implementation (pre-refactoring, test baseline)
- `src/basic/` - Refactoring target (without state management library)
- `src/advanced/` - Advanced refactoring target
- `src/refactoring(hint)/` - Refactoring hints with TODO scaffolding

### Core Domain Types (`src/types.ts`)
- `Product`: id, name, price, stock, discounts[]
- `Discount`: quantity (threshold), rate (discount rate)
- `CartItem`: product reference with quantity
- `Coupon`: name, code, discountType ('amount' | 'percentage'), discountValue

## Refactoring Requirements

### 1) Separate cart/product calculation functions
- `calculateItemTotal` - Calculate item total after discount
- `getMaxApplicableDiscount` - Get maximum applicable discount rate
- `calculateCartTotal` - Calculate cart total (before/after discount)
- `updateCartItemQuantity` - Update quantity

### 2) Separate state hooks and utility hooks
- `useCart` - Cart state management
- `useCoupon` - Coupon state management
- `useProduct` - Product state management
- `useLocalStorage` - LocalStorage utility hook

### 3) Separate entity components and UI components
- Entity components: `ProductCard`, `Cart`, etc.
- Reusable UI components

## Functional Requirements

### Cart Page
- Product list: Display name, price, stock, discount info / Disable add when out of stock
- Cart: Adjust quantity, show applied discount rate (e.g., "10% discount applied")
- Coupon discount: Apply to final payment when selected
- Order summary: Total before discount, total discount, final payment amount

### Admin Page
- Product management: CRUD (name, price, stock, discount rate)
- Discount management: Set discount conditions per product (quantity-based discount rate)
- Coupon management: Create coupons (name, code, discount type-amount/percentage, value)

## Business Rules

- Bulk purchase discount: Additional 5% discount for quantity >= 10 (max 50%)
- Percentage coupons: Only available for purchases >= 10,000 won
- Cannot exceed stock quantity
- Search: 500ms debounce applied
- LocalStorage persistence for products, cart, coupons

## Testing

Uses Vitest + jsdom + Testing Library. `src/origin/__tests__/origin.test.tsx` is the integration test baseline. **Refactored code must pass the same tests.**
