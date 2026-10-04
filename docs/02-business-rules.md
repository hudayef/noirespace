# 02 - Business Rules

All configurable business rules for Noire Space. Each rule specifies default behavior for MVP and where it can be configured.

---

## Rules Reference

### BR-01: Operating Hours

| Property | Value |
|----------|-------|
| Description | Business hours during which bookings can be scheduled |
| Default | Monday-Saturday 09:00-18:00, Sunday closed |
| Configurable | Yes |
| Where | Admin Settings > per location |

Operating hours define which time slots are available for booking. Slots outside operating hours are not shown to customers. Each location can override the global default. Holiday closures are handled via blocked dates (separate from operating hours).

---

### BR-02: Booking Window

| Property | Value |
|----------|-------|
| Description | How far in advance a customer can book |
| Default | Minimum 1 day ahead, maximum 30 days ahead |
| Configurable | Yes |
| Where | Admin Settings (global) |

Customers cannot book for today (minimum 1 day buffer). The calendar on the product detail page only shows dates within the booking window. Admin can override this per situation by creating bookings directly.

---

### BR-03: Buffer Time

| Property | Value |
|----------|-------|
| Description | Mandatory gap between consecutive bookings for the same resource |
| Default | 15 minutes |
| Configurable | Yes |
| Where | Per product |

Buffer time accounts for setup, cleanup, and transition between sessions. The availability engine subtracts buffer time from available slots. A 60-minute session with 15-minute buffer occupies 75 minutes of the resource's time.

---

### BR-04: Checkout Hold (Slot Reservation)

| Property | Value |
|----------|-------|
| Description | Duration a time slot is temporarily reserved when added to cart |
| Default | 15 minutes |
| Configurable | No (MVP) |
| Where | System constant |

When a customer adds a bookable product to their cart, the selected slot is held for 15 minutes. If checkout is not completed within that window, the hold expires and the slot is released back to availability. Other customers cannot book a held slot. The hold timer is visible to the customer during checkout.

---

### BR-05: Payment Expiry

| Property | Value |
|----------|-------|
| Description | Time limit for customer to complete payment after order creation |
| Default | 24 hours |
| Configurable | Yes |
| Where | Admin Settings (global) |

After an order is created and a payment link is generated, the customer has 24 hours to complete payment. If the payment is not received within this window, the payment status moves to `expired`, and the order is cancelled. Associated booking slots are released.

---

### BR-06: Cancellation Policy

| Property | Value |
|----------|-------|
| Description | When and how a booking/order can be cancelled |
| Default | Only before payment is completed |
| Configurable | Yes (post-MVP) |
| Where | Admin Settings (global) |

In MVP, cancellation is only allowed while the order is in `pending` or `awaiting_payment` status. Once payment is received, cancellation is not available through the system. Admin can cancel manually in exceptional cases, but no automated refund is triggered. Post-MVP: configurable cancellation windows with penalty rules.

---

### BR-07: Reschedule Policy

| Property | Value |
|----------|-------|
| Description | Rules governing when a confirmed booking can be rescheduled |
| Default | Allowed up to 24 hours before booking time. Maximum 1 reschedule per booking. |
| Configurable | Yes |
| Where | Admin Settings (global) |

Rescheduling moves a booking to a different available slot. The system enforces availability checks on the new slot. The original slot is released. Reschedule count is tracked per booking. If the reschedule limit is reached, the customer must contact admin. Admin can reschedule without restrictions.

---

### BR-08: No Refund Policy

| Property | Value |
|----------|-------|
| Description | Refunds are not issued for any reason |
| Default | Absolute no refund |
| Configurable | No |
| Where | N/A |

Once payment is received, no refund is processed through the system. This is a business policy, not a technical limitation. The system does not implement refund flows. If a refund is required in exceptional cases, it is handled outside the system (manual bank transfer).

---

### BR-09: Capacity Rules

| Property | Value |
|----------|-------|
| Description | Maximum number of participants/enrollments per session |
| Default | Defined per product (e.g., 10-15 for classes, 1 for appointments) |
| Configurable | Yes |
| Where | Per product |

Enrollment closes automatically when the number of confirmed bookings reaches the product's `maxCapacity`. The system does not allow overbooking. The product detail page shows remaining capacity. When capacity is reached, the booking button is disabled and the status shows "Full".

---

### BR-10: Pricing

| Property | Value |
|----------|-------|
| Description | How product prices are determined |
| Default | Fixed price per product |
| Configurable | Yes |
| Where | Per product |

Each product has a single fixed price set by admin. No dynamic pricing, surge pricing, or time-based pricing in MVP. Price is stored in IDR (Indonesian Rupiah) as an integer (no decimals). Price displayed on product detail and confirmed at checkout.

---

### BR-11: Tax

| Property | Value |
|----------|-------|
| Description | Tax applied to product price |
| Default | 0% (no tax) |
| Configurable | Yes |
| Where | Per product |

Tax is optional and configured per product as a percentage. When set, tax is calculated on the product price and displayed as a separate line item in the order. Tax amount is stored on the order item for reporting. Most products in MVP will have 0% tax.

---

### BR-12: Discount

| Property | Value |
|----------|-------|
| Description | Price reductions applied to orders |
| Default | No automatic discounts |
| Configurable | Yes (manual by admin) |
| Where | Per order (admin only) |

Admin can apply a manual discount (fixed amount or percentage) to an order. No promo codes, coupon system, or automated discount rules in MVP. Discount is recorded on the order with an optional note explaining the reason. Discount is applied before tax calculation.

---

### BR-13: Double Booking Prevention

| Property | Value |
|----------|-------|
| Description | System-enforced uniqueness constraints on resource scheduling |
| Default | Always enforced |
| Configurable | No |
| Where | System-enforced |

Three uniqueness rules are enforced at the database and application level:

1. **Room + Time**: A room can only have one booking per time slot. Two sessions cannot use the same room at overlapping times.
2. **Instructor + Time**: An instructor can only be assigned to one session at a time. No overlapping instructor assignments.
3. **Resource + Time**: Equipment and other resources respect their quantity. If 3 cameras exist, a maximum of 3 bookings can use "camera" in the same time slot.

These constraints are enforced via database-level checks (unique constraints, transaction isolation) and application-level validation in the availability engine. Both layers must pass for a booking to be created.

---

### BR-14: Booking Status Flow

| Property | Value |
|----------|-------|
| Description | Allowed state transitions for bookings |
| Default | See flow below |
| Configurable | No |
| Where | System-enforced |

```
pending --> confirmed --> in_progress --> completed
pending --> cancelled
confirmed --> no_show
```

| Transition | Trigger |
|------------|---------|
| pending -> confirmed | Payment received (automatic) or admin confirmation |
| confirmed -> in_progress | Session start time reached (automatic or staff action) |
| in_progress -> completed | Session end time reached (automatic or staff action) |
| pending -> cancelled | Customer cancels before payment, or payment expires |
| confirmed -> no_show | Customer did not attend; marked by staff/admin |

---

### BR-15: Order Status Flow

| Property | Value |
|----------|-------|
| Description | Allowed state transitions for orders |
| Default | See flow below |
| Configurable | No |
| Where | System-enforced |

```
pending --> awaiting_payment --> paid --> fulfilled
pending --> cancelled
awaiting_payment --> cancelled (payment expired)
```

| Transition | Trigger |
|------------|---------|
| pending -> awaiting_payment | Payment link generated |
| awaiting_payment -> paid | Payment confirmed via webhook |
| paid -> fulfilled | All bookings in order completed |
| pending -> cancelled | Customer cancels or cart hold expires |
| awaiting_payment -> cancelled | Payment expiry reached (24h) |

Cancellation is only possible before payment. Once `paid`, the order progresses to `fulfilled` when all associated bookings are completed.

---

### BR-16: Payment Status Flow

| Property | Value |
|----------|-------|
| Description | Allowed state transitions for payments |
| Default | See flow below |
| Configurable | No |
| Where | System-enforced |

```
pending --> waiting --> paid
waiting --> expired
waiting --> failed
```

| Transition | Trigger |
|------------|---------|
| pending -> waiting | Payment request sent to gateway |
| waiting -> paid | Gateway confirms payment via webhook |
| waiting -> expired | Payment window (24h) elapsed without payment |
| waiting -> failed | Gateway reports payment failure |

Payment records store the gateway response for audit. Each payment attempt creates a new payment record if retry is needed.

---

### BR-17: School Inquiry Status Flow

| Property | Value |
|----------|-------|
| Description | Allowed state transitions for school B2B inquiries |
| Default | See flow below |
| Configurable | No |
| Where | System-enforced |

```
new --> contacted --> proposal_sent --> confirmed
                                   --> declined
```

| Transition | Trigger |
|------------|---------|
| new -> contacted | Admin reaches out to school PIC |
| contacted -> proposal_sent | Admin sends proposal/quotation |
| proposal_sent -> confirmed | School accepts and agreement is signed |
| proposal_sent -> declined | School declines or no response after follow-up |

School inquiries are handled outside the standard booking flow. In MVP, this is a simple status tracker. No automated proposal generation or contract management.

---

## Rules Configuration Summary

| Rule | Default | Configurable | Where |
|------|---------|-------------|-------|
| Operating Hours | Mon-Sat 09:00-18:00 | Yes | Per location |
| Booking Window | 1-30 days ahead | Yes | Admin Settings |
| Buffer Time | 15 min | Yes | Per product |
| Checkout Hold | 15 min | No (MVP) | System |
| Payment Expiry | 24 hours | Yes | Admin Settings |
| Cancellation | Before payment only | Yes (post-MVP) | Admin Settings |
| Reschedule | 24h before, max 1x | Yes | Admin Settings |
| No Refund | Absolute | No | N/A |
| Capacity | Per product max | Yes | Per product |
| Pricing | Fixed per product | Yes | Per product |
| Tax | 0% | Yes | Per product |
| Discount | Manual by admin | Yes | Per order |
| Double Booking Prevention | Always on | No | System |
| Booking Status Flow | Fixed | No | System |
| Order Status Flow | Fixed | No | System |
| Payment Status Flow | Fixed | No | System |
| School Inquiry Flow | Fixed | No | System |
