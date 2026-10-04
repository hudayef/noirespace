# Noire Space -- Domain Model

## 1. Domain Overview

```
+----------------+     +------------------+     +-------------------+
|  Catalog       |---->|  Scheduling      |---->|  Booking          |
|  (Product,     |     |  (Schedule,      |     |  (Booking,        |
|   Category)    |     |   Slot, Block)   |     |   BookingItem)    |
+----------------+     +------------------+     +-------------------+
        |                      ^                        |
        v                      |                        v
+----------------+     +------------------+     +-------------------+
|  Resource      |-----|  Settings        |     |  Commerce         |
|  (Room,        |     |  (Setting,       |     |  (Cart, Order,    |
|   Instructor)  |     |   BusinessHours) |     |   OrderItem)      |
+----------------+     +------------------+     +-------------------+
                                                        |
        +------------------+                            v
        |  Customer        |                +-------------------+
        |  (User,          |<---------------|  Payment          |
        |   CustomerProfile)|               |  (Payment,        |
        +------------------+                |   PaymentLog)     |
                |                           +-------------------+
                v
        +------------------+     +------------------+
        |  Auth            |     |  Notification    |
        |  (Role,          |     |  (Notification,  |
        |   Permission)    |     |   Template)      |
        +------------------+     +------------------+

        +------------------+     +------------------+
        |  School          |     |  Audit           |
        |  (SchoolInquiry) |     |  (AuditLog)      |
        +------------------+     +------------------+
```

---

## 2. Catalog Domain

### Product

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| name | string | |
| slug | string | unique, URL-friendly |
| type | enum | education, studio, creative_service, school |
| category_id | uuid | FK -> Category |
| description | text | rich text |
| short_description | string | for cards/listings |
| price | decimal | IDR, in smallest unit |
| duration_minutes | integer | nullable for async services |
| capacity | integer | max participants per slot |
| status | enum | draft, published, archived |
| images | jsonb | array of image URLs |
| requirements | text | nullable |
| includes | text | nullable, what's included |
| sort_order | integer | display ordering |
| meta_title | string | SEO |
| meta_description | string | SEO |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to Category
- has_many ProductResource
- has_many Schedule
- has_many BookingItem
- has_many CartItem

**Status enum:** `draft` | `published` | `archived`

**Type enum:** `education` | `studio` | `creative_service` | `school`

### Category

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| name | string | |
| slug | string | unique |
| description | text | nullable |
| parent_id | uuid | FK -> Category, nullable (self-referencing) |
| sort_order | integer | |
| status | enum | active, inactive |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- has_many Product
- has_many Category (children, via parent_id)
- belongs_to Category (parent, nullable)

### ProductResource

Links a product to the resources it requires per booking.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK -> Product |
| resource_type | enum | room, resource, instructor |
| resource_id | uuid | FK -> Room / Resource / Instructor |
| is_required | boolean | default true |
| created_at | timestamp | |

**Relationships:**
- belongs_to Product
- polymorphic belongs_to (Room | Resource | Instructor) via resource_type + resource_id

---

## 3. Resource Domain

### Location

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| name | string | |
| address | text | |
| city | string | |
| phone | string | nullable |
| email | string | nullable |
| timezone | string | default "Asia/Jakarta" |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- has_many Room

MVP: single location. Schema supports multi-location for future.

### Room

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| location_id | uuid | FK -> Location |
| name | string | |
| capacity | integer | |
| amenities | jsonb | nullable |
| status | enum | active, inactive, maintenance |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to Location
- has_many ProductResource (as resource)
- has_many BookingResource

**Status enum:** `active` | `inactive` | `maintenance`

### Resource

General-purpose resource (equipment, props, etc.).

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| name | string | |
| type | string | equipment, prop, software, etc. |
| description | text | nullable |
| quantity | integer | default 1 |
| status | enum | active, inactive |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- has_many ProductResource (as resource)
- has_many BookingResource

### Instructor

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK -> User, nullable (not all instructors are system users in MVP) |
| name | string | |
| bio | text | nullable |
| photo | string | URL, nullable |
| specializations | jsonb | array of strings |
| status | enum | active, inactive |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User (nullable)
- has_many ProductResource (as resource)
- has_many BookingResource

---

## 4. Scheduling Domain

### Schedule

Defines recurring availability for a product.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| product_id | uuid | FK -> Product |
| day_of_week | integer | 0=Sunday, 6=Saturday |
| start_time | time | |
| end_time | time | |
| valid_from | date | schedule active start |
| valid_until | date | nullable, null = ongoing |
| max_participants | integer | override product capacity if set |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to Product
- generates ScheduleSlot (computed, not stored permanently)

### ScheduleSlot

Materialized or computed slot for a specific date.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| schedule_id | uuid | FK -> Schedule |
| product_id | uuid | FK -> Product |
| date | date | specific date |
| start_time | time | |
| end_time | time | |
| capacity | integer | |
| booked_count | integer | default 0 |
| status | enum | available, full, blocked |
| created_at | timestamp | |

**Relationships:**
- belongs_to Schedule
- belongs_to Product
- has_many BookingItem

**Status enum:** `available` | `full` | `blocked`

### BlockedDate

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| date | date | |
| reason | string | nullable |
| scope_type | enum | global, product, room, instructor |
| scope_id | uuid | nullable, FK depending on scope_type |
| created_by | uuid | FK -> User |
| created_at | timestamp | |

**Relationships:**
- belongs_to User (creator)
- polymorphic scope (global has null scope_id)

### BusinessHours

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| location_id | uuid | FK -> Location |
| day_of_week | integer | 0-6 |
| open_time | time | |
| close_time | time | |
| is_closed | boolean | default false |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to Location

---

## 5. Booking Domain

### Booking

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| booking_number | string | unique, human-readable (e.g. NS-20260101-001) |
| customer_id | uuid | FK -> User |
| order_id | uuid | FK -> Order, nullable (set after checkout) |
| status | enum | see below |
| notes | text | nullable, customer notes |
| admin_notes | text | nullable |
| total_amount | decimal | |
| booked_at | timestamp | |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User (customer)
- belongs_to Order (nullable)
- has_many BookingItem
- has_many BookingStatusHistory

**Status enum:** `pending` | `confirmed` | `in_progress` | `completed` | `cancelled` | `no_show`

```
Booking Status Flow:

  pending -------> confirmed -------> in_progress -------> completed
     |                |
     +-> cancelled    +-> cancelled
                      +-> no_show
```

### BookingItem

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| booking_id | uuid | FK -> Booking |
| product_id | uuid | FK -> Product |
| schedule_slot_id | uuid | FK -> ScheduleSlot |
| date | date | booking date |
| start_time | time | |
| end_time | time | |
| quantity | integer | default 1 (participants) |
| unit_price | decimal | price at time of booking |
| subtotal | decimal | |
| created_at | timestamp | |

**Relationships:**
- belongs_to Booking
- belongs_to Product
- belongs_to ScheduleSlot
- has_many BookingResource

### BookingResource

Tracks which specific resources are allocated to a booking item.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| booking_item_id | uuid | FK -> BookingItem |
| resource_type | enum | room, resource, instructor |
| resource_id | uuid | FK -> Room / Resource / Instructor |
| created_at | timestamp | |

**Relationships:**
- belongs_to BookingItem
- polymorphic belongs_to (Room | Resource | Instructor)

### BookingStatusHistory

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| booking_id | uuid | FK -> Booking |
| from_status | enum | nullable (null for initial) |
| to_status | enum | |
| changed_by | uuid | FK -> User |
| reason | text | nullable |
| created_at | timestamp | |

**Relationships:**
- belongs_to Booking
- belongs_to User (actor)

---

## 6. Commerce Domain

### Cart

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK -> User, nullable (guest cart via session) |
| session_id | string | for guest carts |
| expires_at | timestamp | cart expiration |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User (nullable)
- has_many CartItem

### CartItem

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| cart_id | uuid | FK -> Cart |
| product_id | uuid | FK -> Product |
| schedule_slot_id | uuid | FK -> ScheduleSlot |
| date | date | selected date |
| start_time | time | |
| end_time | time | |
| quantity | integer | default 1 |
| unit_price | decimal | price at time of add |
| held_until | timestamp | slot hold expiration (15 min from checkout start) |
| created_at | timestamp | |

**Relationships:**
- belongs_to Cart
- belongs_to Product
- belongs_to ScheduleSlot

### Order

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| order_number | string | unique, human-readable (e.g. NS-ORD-20260101-001) |
| customer_id | uuid | FK -> User |
| status | enum | see below |
| subtotal | decimal | |
| tax | decimal | |
| discount | decimal | default 0 |
| total | decimal | |
| notes | text | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User (customer)
- has_many OrderItem
- has_one Booking
- has_many Payment

**Status enum:** `pending` | `awaiting_payment` | `paid` | `partially_paid` | `fulfilled` | `cancelled`

```
Order Status Flow:

  pending --> awaiting_payment --> paid --> fulfilled
                   |
                   +-> cancelled (only pre-payment)
```

### OrderItem

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| order_id | uuid | FK -> Order |
| product_id | uuid | FK -> Product |
| product_name | string | snapshot at order time |
| date | date | |
| start_time | time | |
| end_time | time | |
| quantity | integer | |
| unit_price | decimal | |
| subtotal | decimal | |
| created_at | timestamp | |

**Relationships:**
- belongs_to Order
- belongs_to Product

---

## 7. Payment Domain

### Payment

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| order_id | uuid | FK -> Order |
| payment_number | string | unique |
| gateway | string | e.g. "xendit", "manual" |
| method | string | e.g. "bank_transfer", "ewallet", "manual" |
| amount | decimal | |
| currency | string | default "IDR" |
| status | enum | see below |
| gateway_reference | string | nullable, external transaction ID |
| gateway_response | jsonb | nullable, raw gateway response |
| paid_at | timestamp | nullable |
| expires_at | timestamp | payment window expiration |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to Order
- has_many PaymentLog

**Status enum:** `pending` | `waiting` | `paid` | `failed` | `expired`

```
Payment Status Flow:

  pending --> waiting --> paid
                |
                +-> failed
                +-> expired
```

### PaymentLog

Immutable log of all payment state changes and gateway callbacks.

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| payment_id | uuid | FK -> Payment |
| event | string | e.g. "created", "callback_received", "status_changed", "manual_verify" |
| from_status | string | nullable |
| to_status | string | nullable |
| data | jsonb | event payload / gateway callback body |
| created_by | uuid | FK -> User, nullable (null for webhook) |
| created_at | timestamp | |

**Relationships:**
- belongs_to Payment
- belongs_to User (nullable)

---

## 8. Customer Domain

### User

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| email | string | unique |
| password_hash | string | |
| name | string | |
| phone | string | nullable |
| email_verified_at | timestamp | nullable |
| is_active | boolean | default true |
| last_login_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- has_one CustomerProfile
- has_many UserRole
- has_many Booking (as customer)
- has_many Order (as customer)
- has_many Cart
- has_many AuditLog (as actor)

### CustomerProfile

Extended profile for customers (separated from User to keep auth entity lean).

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK -> User, unique |
| date_of_birth | date | nullable |
| address | text | nullable |
| avatar | string | URL, nullable |
| notes | text | nullable, admin notes about customer |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User

---

## 9. School Domain

### SchoolInquiry

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| school_name | string | |
| pic_name | string | person in charge |
| email | string | |
| phone | string | |
| student_count | integer | estimated |
| program_interest | string | which program(s) |
| preferred_dates | text | nullable, free text |
| notes | text | nullable |
| status | enum | see below |
| admin_notes | text | nullable |
| handled_by | uuid | FK -> User, nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User (handled_by, nullable)

**Status enum:** `new` | `contacted` | `proposal_sent` | `confirmed` | `declined`

```
Inquiry Status Flow:

  new --> contacted --> proposal_sent --> confirmed
                            |
                            +-> declined
```

---

## 10. Auth Domain

### Role

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| name | string | unique (super_admin, admin, staff, customer) |
| description | string | nullable |
| created_at | timestamp | |

**Relationships:**
- has_many UserRole
- has_many Permission

### Permission

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| role_id | uuid | FK -> Role |
| module | string | e.g. "products", "bookings", "payments" |
| action | string | e.g. "create", "read", "update", "delete" |
| created_at | timestamp | |

**Relationships:**
- belongs_to Role

Permission format: `module.action` (e.g. `products.create`, `bookings.update`).

### UserRole

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK -> User |
| role_id | uuid | FK -> Role |
| created_at | timestamp | |

**Relationships:**
- belongs_to User
- belongs_to Role

---

## 11. Notification Domain

### Notification

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| user_id | uuid | FK -> User |
| type | string | e.g. "booking_confirmed", "payment_received" |
| channel | enum | email (MVP), whatsapp (Phase 2), in_app (Phase 2) |
| subject | string | |
| body | text | rendered content |
| data | jsonb | nullable, reference IDs and metadata |
| sent_at | timestamp | nullable |
| read_at | timestamp | nullable |
| created_at | timestamp | |

**Relationships:**
- belongs_to User

### NotificationTemplate

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| type | string | unique, matches Notification.type |
| channel | enum | email |
| subject_template | string | with placeholders |
| body_template | text | with placeholders |
| is_active | boolean | |
| created_at | timestamp | |
| updated_at | timestamp | |

MVP: templates are code-managed. Phase 2: admin-editable via UI.

---

## 12. Audit Domain

### AuditLog

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| actor_id | uuid | FK -> User, nullable (null for system) |
| action | string | e.g. "create", "update", "delete", "status_change" |
| entity_type | string | e.g. "booking", "order", "product" |
| entity_id | uuid | |
| before | jsonb | nullable, state before change |
| after | jsonb | nullable, state after change |
| ip_address | string | nullable |
| user_agent | string | nullable |
| created_at | timestamp | immutable, no updated_at |

**Relationships:**
- belongs_to User (actor, nullable)

Append-only table. Never update or delete rows.

---

## 13. Settings Domain

### Setting

| Attribute | Type | Notes |
|-----------|------|-------|
| id | uuid | PK |
| key | string | unique (e.g. "booking.buffer_minutes", "booking.hold_minutes") |
| value | text | stored as string, parsed by application |
| type | enum | string, integer, boolean, json |
| description | string | nullable |
| updated_by | uuid | FK -> User, nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

**Relationships:**
- belongs_to User (last updater, nullable)

Default MVP settings:

| Key | Value | Type |
|-----|-------|------|
| booking.buffer_minutes | 15 | integer |
| booking.hold_minutes | 15 | integer |
| booking.window_min_days | 1 | integer |
| booking.window_max_days | 30 | integer |
| booking.max_reschedule | 1 | integer |
| payment.expiry_hours | 24 | integer |
| business.currency | IDR | string |

---

## 14. Entity Relationship Summary

```
User
  |-- has_one CustomerProfile
  |-- has_many UserRole --> Role --> Permission
  |-- has_many Cart --> CartItem --> Product, ScheduleSlot
  |-- has_many Order --> OrderItem --> Product
  |                  \-> Payment --> PaymentLog
  |                  \-> Booking
  |-- has_many Booking --> BookingItem --> Product, ScheduleSlot
  |                   |              \-> BookingResource --> Room|Resource|Instructor
  |                   \-> BookingStatusHistory
  |-- has_many Notification
  |-- has_many AuditLog (as actor)

Product
  |-- belongs_to Category
  |-- has_many ProductResource --> Room|Resource|Instructor
  |-- has_many Schedule --> ScheduleSlot
  |-- has_many CartItem
  |-- has_many OrderItem
  |-- has_many BookingItem

Location
  |-- has_many Room
  |-- has_many BusinessHours

BlockedDate (polymorphic scope)

SchoolInquiry (standalone, B2B flow)

Setting (key-value config store)
```

---

## 15. Key Constraints & Business Rules

1. **Double booking prevention**: unique constraint on (schedule_slot_id, date) with booked_count < capacity check, enforced at DB level via transaction + row lock.
2. **Slot hold**: CartItem.held_until expires after 15 min. Expired holds release the slot. Background job or lazy check on read.
3. **No refund**: Payment status cannot transition from `paid` back to any refund state. No refund entity in MVP.
4. **Cancellation**: Booking can only be cancelled if Order status is `pending` or `awaiting_payment` (pre-payment).
5. **Reschedule**: Max 1 per booking (configurable). Must be >= 24h before original booking time.
6. **Audit immutability**: AuditLog rows are insert-only. Application code must never issue UPDATE or DELETE on this table.
7. **Soft delete**: Products and Categories use `status = archived` instead of hard delete. Active bookings/orders prevent archival.
8. **Price snapshot**: OrderItem.unit_price and BookingItem.unit_price capture price at transaction time. Product price changes do not affect existing orders.
