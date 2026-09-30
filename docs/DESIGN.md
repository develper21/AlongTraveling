# 🎨 Design System

**HopAlong – Clean. Modern. Travel-ready.**

This document defines the visual design system, UI components, and user experience guidelines for HopAlong. The goal is to create a modern, minimal, and student-friendly interface with a consistent look and feel.

---

## 1. Design Principles

| | | |
|:---:|:---:|:---:|
| 👥 **User-Centered** | 🌿 **Minimal & Clean** | 🧩 **Consistent** |
| Simple and intuitive for college students. | Reduce clutter and focus on content. | Follow a unified design system. |

---

## 2. Color Palette

Primary colors used across the application.

| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| 🟦 | **Primary** | `#4F46E5` | Main brand color — buttons, links, active states |
| 🟪 | **Secondary** | `#7C3AED` | Secondary actions, badges, highlights |
| 🟩 | **Success** | `#10B981` | Success messages, approved requests, completed tasks |
| 🟨 | **Warning** | `#F59E0B` | Warnings, pending states, caution messages |
| 🟥 | **Error** | `#EF4444` | Error messages, rejected states, destructive actions |
| ⬛ | **Dark** | `#0F172A` | Dark surfaces, headers, footers |
| ⬜ | **Light** | `#F8FAFC` | Page backgrounds, cards on dark |

**Semantic usage:**

- Request status: `pending` → Warning • `approved` → Success • `rejected` → Error
- Trip status: `upcoming` → Primary • `ongoing` → Warning • `completed` → Success • `cancelled` → Error
- Toasts: success (green), error (red), info (indigo)

---

## 3. Typography

We use **Inter** as the primary font for a clean, modern, highly readable interface.

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page titles | Inter | 700 (Bold) | 30px |
| Section headings | Inter | 600 (SemiBold) | 20px |
| Body text | Inter | 400 (Regular) | 16px |
| Secondary text / captions | Inter | 400 (Regular) | 14px |
| Badges / labels | Inter | 500 (Medium) | 12px |

---

## 4. UI Components

Standard components to be used throughout the application.

### Buttons

| Variant | Style | Usage |
|---------|-------|-------|
| **Primary** | Solid indigo (`#4F46E5`), white text, rounded-lg | Create trip, Send request, Login |
| **Secondary** | White/10% glass background, border, muted text | Filters, Cancel, secondary actions |
| **Destructive** | Solid red (`#EF4444`), white text | Delete trip, Delete message |

### Cards

- Glassmorphism: `bg-white/10 backdrop-blur` on dark gradient backgrounds.
- Rounded corners (`rounded-xl`), subtle border (`border-white/10`).
- Hover: slight lift + border highlight.

### Badges

- Status pills with soft backgrounds (10–20% tint of semantic color).
- Used for trip status, travel mode, trip type, request status.

### Forms

- Labels: 14px, muted color, above the input.
- Inputs: dark translucent background, 1px border, focus ring in Primary color.
- Validation errors shown below the field in Error color.

### Modals

- Centered overlay with blurred backdrop (`RequestModal`).
- Close on Escape / backdrop click.

### Toasts

- Top-right stacked notifications (`NotificationToast`).
- Auto-dismiss after ~4s; color-coded by type.

---

## 5. Layout & Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Container | `max-w-7xl` | Main content width |
| Page padding | `px-4 py-8` | Horizontal/vertical rhythm |
| Card padding | `p-4`–`p-6` | Inner spacing |
| Grid gap | `gap-4`–`gap-6` | Trip grid spacing |
| Radius | `rounded-lg` / `rounded-xl` | Buttons / cards |

---

## 6. Responsiveness

| Breakpoint | Layout behavior |
|------------|-----------------|
| Mobile (< 640px) | Single column; filters collapse into a drawer; bottom-safe tap targets |
| Tablet (640–1024px) | 2-column trip grid; side-by-side detail layout |
| Desktop (> 1024px) | 3-column trip grid; full filters bar; wide chat panel |

---

## 7. States & Feedback

- **Loading:** Skeleton loaders for cards and chat messages.
- **Empty states:** Friendly illustration + call-to-action ("No trips found — create one!").
- **Error states:** Inline field errors + toast for API failures.
- **Optimistic UI:** Chat messages appear instantly; reconcile on socket ack.

---

## 8. Accessibility

- Minimum contrast ratio 4.5:1 for body text.
- All interactive elements reachable by keyboard, visible focus rings.
- Icon-only buttons include `aria-label`.
- Form fields have associated labels and error announcements.
