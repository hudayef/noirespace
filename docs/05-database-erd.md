# 05 - Database ERD

Entity-Relationship definitions for Noire Space. All tables use `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` unless noted. Timestamps use `TIMESTAMPTZ`.

---

## Auth & Users

### `users`

| Column             | Type         | Constraints                          |
|--------------------|--------------|--------------------------------------|
| id                 | UUID         | PK, DEFAULT gen_random_uuid()       |
| email              | VARCHAR(255) | NOT NULL, UNIQUE                     |
| password_hash      | VARCHAR(255) | NOT NULL                             |
| name               | VARCHAR(255) | NOT NULL                             |
| phone              | VARCHAR(20)  | NULL                                 |
| role               | VARCHAR(20)  | NOT NULL, DEFAULT 'customer'         |
| status             | VARCHAR(20)  | NOT NULL, DEFAULT 'active'           |
| email_verified_at  | TIMESTAMPTZ  | NULL                                 |
| created_at         | TIMESTAMPTZ  | NOT NULL, DEFAULT now()              |
| updated_at         | TIMESTAMPTZ  | NOT NULL, DEFAULT now()              |

**Indexes:**
- `idx_users_email` UNIQUE on `email`
- `idx_users_role` on `role`
- `idx_users_status` on `status`

---

### `roles`

| Column      | Type         | Constraints                    |
|-------------|--------------|--------------------------------|
| id          | UUID         | PK                             |
| name        | VARCHAR(100) | NOT NULL                       |
| slug        | VARCHAR(100) | NOT NULL, UNIQUE               |
| description | TEXT         | NULL                           |

**Indexes:**
- `idx_roles_slug` UNIQUE on `slug`

---

### `permissions`

| Column      | Type         | Constraints                    |
|-------------|--------------|--------------------------------|
| id          | UUID         | PK                             |
| name        | VARCHAR(100) | NOT NULL                       |
| slug        | VARCHAR(100) | NOT NULL, UNIQUE               |
| module      | VARCHAR(50)  | NOT NULL                       |
| description | TEXT         | NULL                           |

**Indexes:**
- `idx_permissions_slug` UNIQUE on `slug`
- `idx_permissions_module` on `module`

---

### `role_permissions`

| Column        | Type | Constraints                              |
|---------------|------|------------------------------------------|
| role_id       | UUID | NOT NULL, FK -> roles(id) ON DELETE CASCADE |
| permission_id | UUID | NOT NULL, FK -> permissions(id) ON DELETE CASCADE |

**PK:** (`role_id`, `permission_id`)

---

### `user_roles`

| Column  | Type | Constraints                              |
|---------|------|------------------------------------------|
| user_id | UUID | NOT NULL, FK -> users(id) ON DELETE CASCADE |
| role_id | UUID | NOT NULL, FK -> roles(id) ON DELETE CASCADE |

**PK:** (`user_id`, `role_id`)

---

## Catalog

### `categories`

| Column      | Type         | Constraints                              |
|-------------|--------------|------------------------------------------|
| id          | UUID         | PK                                       |
| name        | VARCHAR(255) | NOT NULL                                 |
| slug        | VARCHAR(255) | NOT NULL, UNIQUE                         |
| description | TEXT         | NULL                                     |
| parent_id   | UUID         | NULL, FK -> categories(id) ON DELETE SET NULL |
| sort_order  | INTEGER      | NOT NULL, DEFAULT 0                      |
| status      | VARCHAR(20)  | NOT NULL, DEFAULT 'active'               |

**Indexes:**
- `idx_categories_slug` UNIQUE on `slug`
- `idx_categories_parent` on `parent_id`
- `idx_categories_sort` on `sort_order`

---

### `products`

| Column                     | Type           | Constraints                              |
|----------------------------|----------------|------------------------------------------|
| id                         | UUID           | PK                                       |
| category_id                | UUID           | NULL, FK -> categories(id) ON DELETE SET NULL |
| name                       | VARCHAR(255)   | NOT NULL                                 |
| slug                       | VARCHAR(255)   | NOT NULL, UNIQUE                         |
| type                       | VARCHAR(20)    | NOT NULL, CHECK (type IN ('education','studio','service','school')) |
| description                | TEXT           | NULL                                     |
| short_description          | VARCHAR(500)   | NULL                                     |
| price                      | DECIMAL(12,2)  | NOT NULL, DEFAULT 0                      |
| compare_price              | DECIMAL(12,2)  | NULL                                     |
| duration_minutes           | INTEGER        | NULL                                     |
| capacity                   | INTEGER        | NULL                                     |
| min_booking_notice_hours   | INTEGER        | NOT NULL, DEFAULT 2                      |
| max_advance_booking_days   | INTEGER        | NOT NULL, DEFAULT 30                     |
| buffer_minutes             | INTEGER        | NOT NULL, DEFAULT 0                      |
| requires_instructor        | BOOLEAN        | NOT NULL, DEFAULT false                  |
| requires_room              | BOOLEAN        | NOT NULL, DEFAULT false                  |
| status                     | VARCHAR(20)    | NOT NULL, DEFAULT 'draft', CHECK (status IN ('draft','published','archived')) |
| featured                   | BOOLEAN        | NOT NULL, DEFAULT false                  |
| meta_title                 | VARCHAR(255)   | NULL                                     |
| meta_description           | VARCHAR(500)   | NULL                                     |
| images                     | JSONB          | NOT NULL, DEFAULT '[]'                   |
| includes                   | JSONB          | NOT NULL, DEFAULT '[]'                   |
| requirements               | JSONB          | NOT NULL, DEFAULT '[]'                   |
| created_at                 | TIMESTAMPTZ    | NOT NULL, DEFAULT now()                  |
| updated_at                 | TIMESTAMPTZ    | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_products_slug` UNIQUE on `slug`
- `idx_products_category` on `category_id`
- `idx_products_type` on `type`
- `idx_products_status` on `status`
- `idx_products_featured` on `featured` WHERE `status = 'published'`
- `idx_products_type_status` on (`type`, `status`) -- catalog filtering

---

### `product_resources`

| Column      | Type    | Constraints                                  |
|-------------|---------|----------------------------------------------|
| id          | UUID    | PK                                           |
| product_id  | UUID    | NOT NULL, FK -> products(id) ON DELETE CASCADE |
| resource_id | UUID    | NOT NULL, FK -> resources(id) ON DELETE CASCADE |
| is_required | BOOLEAN | NOT NULL, DEFAULT true                       |

**Indexes:**
- `idx_product_resources_product` on `product_id`
- UNIQUE on (`product_id`, `resource_id`)

---

## Resources

### `locations`

| Column   | Type         | Constraints                |
|----------|--------------|----------------------------|
| id       | UUID         | PK                         |
| name     | VARCHAR(255) | NOT NULL                   |
| address  | TEXT         | NOT NULL                   |
| phone    | VARCHAR(20)  | NULL                       |
| email    | VARCHAR(255) | NULL                       |
| timezone | VARCHAR(50)  | NOT NULL, DEFAULT 'Asia/Jakarta' |
| status   | VARCHAR(20)  | NOT NULL, DEFAULT 'active' |

---

### `rooms`

| Column      | Type         | Constraints                              |
|-------------|--------------|------------------------------------------|
| id          | UUID         | PK                                       |
| location_id | UUID         | NOT NULL, FK -> locations(id) ON DELETE CASCADE |
| name        | VARCHAR(255) | NOT NULL                                 |
| slug        | VARCHAR(255) | NOT NULL, UNIQUE                         |
| description | TEXT         | NULL                                     |
| capacity    | INTEGER      | NOT NULL                                 |
| status      | VARCHAR(20)  | NOT NULL, DEFAULT 'active'               |
| images      | JSONB        | NOT NULL, DEFAULT '[]'                   |

**Indexes:**
- `idx_rooms_slug` UNIQUE on `slug`
- `idx_rooms_location` on `location_id`
- `idx_rooms_status` on `status`

---

### `resources`

| Column      | Type         | Constraints                              |
|-------------|--------------|------------------------------------------|
| id          | UUID         | PK                                       |
| location_id | UUID         | NOT NULL, FK -> locations(id) ON DELETE CASCADE |
| name        | VARCHAR(255) | NOT NULL                                 |
| type        | VARCHAR(20)  | NOT NULL, CHECK (type IN ('equipment','camera','lighting','other')) |
| description | TEXT         | NULL                                     |
| quantity    | INTEGER      | NOT NULL, DEFAULT 1                      |
| status      | VARCHAR(20)  | NOT NULL, DEFAULT 'active'               |

**Indexes:**
- `idx_resources_location` on `location_id`
- `idx_resources_type` on `type`

---

### `instructors`

| Column          | Type         | Constraints                              |
|-----------------|--------------|------------------------------------------|
| id              | UUID         | PK                                       |
| user_id         | UUID         | NULL, FK -> users(id) ON DELETE SET NULL  |
| name            | VARCHAR(255) | NOT NULL                                 |
| slug            | VARCHAR(255) | NOT NULL, UNIQUE                         |
| bio             | TEXT         | NULL                                     |
| specializations | JSONB        | NOT NULL, DEFAULT '[]'                   |
| photo           | VARCHAR(500) | NULL                                     |
| status          | VARCHAR(20)  | NOT NULL, DEFAULT 'active'               |

**Indexes:**
- `idx_instructors_slug` UNIQUE on `slug`
- `idx_instructors_user` on `user_id`
- `idx_instructors_status` on `status`

---

## Scheduling

### `business_hours`

| Column      | Type     | Constraints                              |
|-------------|----------|------------------------------------------|
| id          | UUID     | PK                                       |
| location_id | UUID     | NOT NULL, FK -> locations(id) ON DELETE CASCADE |
| day_of_week | SMALLINT | NOT NULL, CHECK (day_of_week BETWEEN 0 AND 6) |
| open_time   | TIME     | NOT NULL                                 |
| close_time  | TIME     | NOT NULL                                 |
| is_closed   | BOOLEAN  | NOT NULL, DEFAULT false                  |

**Indexes:**
- UNIQUE on (`location_id`, `day_of_week`)

---

### `schedules`

| Column          | Type        | Constraints                              |
|-----------------|-------------|------------------------------------------|
| id              | UUID        | PK                                       |
| product_id      | UUID        | NOT NULL, FK -> products(id) ON DELETE CASCADE |
| room_id         | UUID        | NULL, FK -> rooms(id) ON DELETE SET NULL  |
| instructor_id   | UUID        | NULL, FK -> instructors(id) ON DELETE SET NULL |
| day_of_week     | SMALLINT    | NULL, CHECK (day_of_week BETWEEN 0 AND 6) |
| specific_date   | DATE        | NULL                                     |
| start_time      | TIME        | NOT NULL                                 |
| end_time        | TIME        | NOT NULL                                 |
| capacity        | INTEGER     | NOT NULL                                 |
| recurrence_type | VARCHAR(20) | NOT NULL, CHECK (recurrence_type IN ('weekly','specific')) |
| status          | VARCHAR(20) | NOT NULL, DEFAULT 'active'               |

**Indexes:**
- `idx_schedules_product` on `product_id`
- `idx_schedules_room` on `room_id`
- `idx_schedules_instructor` on `instructor_id`
- `idx_schedules_day` on `day_of_week` WHERE `recurrence_type = 'weekly'`
- `idx_schedules_date` on `specific_date` WHERE `recurrence_type = 'specific'`
- `idx_schedules_availability` on (`product_id`, `status`, `day_of_week`, `start_time`) -- availability lookup

---

### `blocked_dates`

| Column        | Type        | Constraints                              |
|---------------|-------------|------------------------------------------|
| id            | UUID        | PK                                       |
| location_id   | UUID        | NULL, FK -> locations(id) ON DELETE CASCADE |
| room_id       | UUID        | NULL, FK -> rooms(id) ON DELETE CASCADE   |
| instructor_id | UUID        | NULL, FK -> instructors(id) ON DELETE CASCADE |
| date          | DATE        | NOT NULL                                 |
| start_time    | TIME        | NULL                                     |
| end_time      | TIME        | NULL                                     |
| reason        | VARCHAR(255)| NULL                                     |
| type          | VARCHAR(20) | NOT NULL, CHECK (type IN ('holiday','maintenance','personal')) |

**Indexes:**
- `idx_blocked_dates_date` on `date`
- `idx_blocked_dates_location_date` on (`location_id`, `date`)
- `idx_blocked_dates_room_date` on (`room_id`, `date`)
- `idx_blocked_dates_instructor_date` on (`instructor_id`, `date`)

---

## Booking

### `bookings`

| Column              | Type         | Constraints                              |
|---------------------|--------------|------------------------------------------|
| id                  | UUID         | PK                                       |
| booking_number      | VARCHAR(20)  | NOT NULL, UNIQUE                         |
| customer_id         | UUID         | NOT NULL, FK -> users(id)                |
| order_id            | UUID         | NULL, FK -> orders(id) ON DELETE SET NULL |
| product_id          | UUID         | NOT NULL, FK -> products(id)             |
| room_id             | UUID         | NULL, FK -> rooms(id)                    |
| instructor_id       | UUID         | NULL, FK -> instructors(id)              |
| schedule_id         | UUID         | NULL, FK -> schedules(id)                |
| booking_date        | DATE         | NOT NULL                                 |
| start_time          | TIME         | NOT NULL                                 |
| end_time            | TIME         | NOT NULL                                 |
| participants        | INTEGER      | NOT NULL, DEFAULT 1                      |
| status              | VARCHAR(20)  | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending','confirmed','in_progress','completed','cancelled','no_show')) |
| notes               | TEXT         | NULL                                     |
| cancelled_at        | TIMESTAMPTZ  | NULL                                     |
| cancelled_by        | UUID         | NULL, FK -> users(id)                    |
| cancellation_reason | TEXT         | NULL                                     |
| created_at          | TIMESTAMPTZ  | NOT NULL, DEFAULT now()                  |
| updated_at          | TIMESTAMPTZ  | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_bookings_number` UNIQUE on `booking_number`
- `idx_bookings_customer` on `customer_id`
- `idx_bookings_product` on `product_id`
- `idx_bookings_order` on `order_id`
- `idx_bookings_status` on `status`
- `idx_bookings_date` on `booking_date`
- `idx_bookings_room_date_time` on (`room_id`, `booking_date`, `start_time`, `end_time`) WHERE `status NOT IN ('cancelled')` -- room conflict detection
- `idx_bookings_instructor_date_time` on (`instructor_id`, `booking_date`, `start_time`, `end_time`) WHERE `status NOT IN ('cancelled')` -- instructor conflict detection
- `idx_bookings_customer_upcoming` on (`customer_id`, `booking_date`) WHERE `status IN ('pending','confirmed')` -- customer dashboard

---

### `booking_resources`

| Column      | Type    | Constraints                                    |
|-------------|---------|------------------------------------------------|
| id          | UUID    | PK                                             |
| booking_id  | UUID    | NOT NULL, FK -> bookings(id) ON DELETE CASCADE  |
| resource_id | UUID    | NOT NULL, FK -> resources(id)                   |
| quantity    | INTEGER | NOT NULL, DEFAULT 1                            |

**Indexes:**
- `idx_booking_resources_booking` on `booking_id`
- UNIQUE on (`booking_id`, `resource_id`)

---

### `booking_reschedules`

| Column              | Type         | Constraints                              |
|---------------------|--------------|------------------------------------------|
| id                  | UUID         | PK                                       |
| booking_id          | UUID         | NOT NULL, FK -> bookings(id) ON DELETE CASCADE |
| original_date       | DATE         | NOT NULL                                 |
| original_start_time | TIME         | NOT NULL                                 |
| original_end_time   | TIME         | NOT NULL                                 |
| new_date            | DATE         | NOT NULL                                 |
| new_start_time      | TIME         | NOT NULL                                 |
| new_end_time        | TIME         | NOT NULL                                 |
| reason              | TEXT         | NULL                                     |
| requested_by        | UUID         | NOT NULL, FK -> users(id)                |
| approved_by         | UUID         | NULL, FK -> users(id)                    |
| status              | VARCHAR(20)  | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending','approved','rejected')) |
| created_at          | TIMESTAMPTZ  | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_booking_reschedules_booking` on `booking_id`
- `idx_booking_reschedules_status` on `status`

---

## Commerce

### `carts`

| Column      | Type        | Constraints                |
|-------------|-------------|----------------------------|
| id          | UUID        | PK                         |
| customer_id | UUID        | NOT NULL, FK -> users(id) ON DELETE CASCADE |
| expires_at  | TIMESTAMPTZ | NOT NULL                   |
| created_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()    |
| updated_at  | TIMESTAMPTZ | NOT NULL, DEFAULT now()    |

**Indexes:**
- `idx_carts_customer` on `customer_id`
- `idx_carts_expires` on `expires_at` -- cleanup job

---

### `cart_items`

| Column       | Type          | Constraints                              |
|--------------|---------------|------------------------------------------|
| id           | UUID          | PK                                       |
| cart_id      | UUID          | NOT NULL, FK -> carts(id) ON DELETE CASCADE |
| product_id   | UUID          | NOT NULL, FK -> products(id)             |
| schedule_id  | UUID          | NULL, FK -> schedules(id)                |
| booking_date | DATE          | NULL                                     |
| start_time   | TIME          | NULL                                     |
| end_time     | TIME          | NULL                                     |
| quantity     | INTEGER       | NOT NULL, DEFAULT 1                      |
| price        | DECIMAL(12,2) | NOT NULL                                 |
| options      | JSONB         | NOT NULL, DEFAULT '{}'                   |
| created_at   | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_cart_items_cart` on `cart_id`

---

### `orders`

| Column      | Type          | Constraints                              |
|-------------|---------------|------------------------------------------|
| id          | UUID          | PK                                       |
| order_number| VARCHAR(20)   | NOT NULL, UNIQUE                         |
| customer_id | UUID          | NOT NULL, FK -> users(id)                |
| subtotal    | DECIMAL(12,2) | NOT NULL, DEFAULT 0                      |
| discount    | DECIMAL(12,2) | NOT NULL, DEFAULT 0                      |
| tax         | DECIMAL(12,2) | NOT NULL, DEFAULT 0                      |
| total       | DECIMAL(12,2) | NOT NULL, DEFAULT 0                      |
| status      | VARCHAR(20)   | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending','awaiting_payment','paid','fulfilled','cancelled')) |
| notes       | TEXT          | NULL                                     |
| created_at  | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  |
| updated_at  | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_orders_number` UNIQUE on `order_number`
- `idx_orders_customer` on `customer_id`
- `idx_orders_status` on `status`
- `idx_orders_created` on `created_at`

---

### `order_items`

| Column      | Type          | Constraints                              |
|-------------|---------------|------------------------------------------|
| id          | UUID          | PK                                       |
| order_id    | UUID          | NOT NULL, FK -> orders(id) ON DELETE CASCADE |
| product_id  | UUID          | NOT NULL, FK -> products(id)             |
| booking_id  | UUID          | NULL, FK -> bookings(id) ON DELETE SET NULL |
| description | VARCHAR(255)  | NOT NULL                                 |
| quantity    | INTEGER       | NOT NULL, DEFAULT 1                      |
| unit_price  | DECIMAL(12,2) | NOT NULL                                 |
| total       | DECIMAL(12,2) | NOT NULL                                 |
| options     | JSONB         | NOT NULL, DEFAULT '{}'                   |

**Indexes:**
- `idx_order_items_order` on `order_id`
- `idx_order_items_booking` on `booking_id`

---

## Payment

### `payments`

| Column            | Type          | Constraints                              |
|-------------------|---------------|------------------------------------------|
| id                | UUID          | PK                                       |
| order_id          | UUID          | NOT NULL, FK -> orders(id)               |
| payment_number    | VARCHAR(30)   | NOT NULL, UNIQUE                         |
| amount            | DECIMAL(12,2) | NOT NULL                                 |
| method            | VARCHAR(50)   | NULL                                     |
| gateway           | VARCHAR(30)   | NOT NULL                                 |
| gateway_reference | VARCHAR(255)  | NULL                                     |
| gateway_response  | JSONB         | NULL                                     |
| status            | VARCHAR(20)   | NOT NULL, DEFAULT 'pending', CHECK (status IN ('pending','waiting','paid','failed','expired')) |
| paid_at           | TIMESTAMPTZ   | NULL                                     |
| expired_at        | TIMESTAMPTZ   | NULL                                     |
| created_at        | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  |
| updated_at        | TIMESTAMPTZ   | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_payments_number` UNIQUE on `payment_number`
- `idx_payments_order` on `order_id`
- `idx_payments_status` on `status`
- `idx_payments_gateway_ref` on `gateway_reference` -- webhook lookup

---

### `payment_logs`

| Column     | Type        | Constraints                              |
|------------|-------------|------------------------------------------|
| id         | UUID        | PK                                       |
| payment_id | UUID        | NOT NULL, FK -> payments(id) ON DELETE CASCADE |
| event      | VARCHAR(50) | NOT NULL                                 |
| data       | JSONB       | NULL                                     |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_payment_logs_payment` on `payment_id`

---

## School

### `school_inquiries`

| Column              | Type         | Constraints                              |
|---------------------|--------------|------------------------------------------|
| id                  | UUID         | PK                                       |
| school_name         | VARCHAR(255) | NOT NULL                                 |
| pic_name            | VARCHAR(255) | NOT NULL                                 |
| email               | VARCHAR(255) | NOT NULL                                 |
| phone               | VARCHAR(20)  | NOT NULL                                 |
| student_count       | INTEGER      | NOT NULL                                 |
| program_interest    | VARCHAR(255) | NOT NULL                                 |
| preferred_dates     | JSONB        | NOT NULL, DEFAULT '[]'                   |
| location_preference | VARCHAR(255) | NULL                                     |
| requirements        | TEXT         | NULL                                     |
| notes               | TEXT         | NULL                                     |
| status              | VARCHAR(20)  | NOT NULL, DEFAULT 'new', CHECK (status IN ('new','contacted','proposal_sent','confirmed','declined')) |
| admin_notes         | TEXT         | NULL                                     |
| handled_by          | UUID         | NULL, FK -> users(id)                    |
| created_at          | TIMESTAMPTZ  | NOT NULL, DEFAULT now()                  |
| updated_at          | TIMESTAMPTZ  | NOT NULL, DEFAULT now()                  |

**Indexes:**
- `idx_school_inquiries_status` on `status`
- `idx_school_inquiries_created` on `created_at`

---

## Notification

### `notifications`

| Column   | Type         | Constraints                              |
|----------|--------------|------------------------------------------|
| id       | UUID         | PK                                       |
| user_id  | UUID         | NOT NULL, FK -> users(id) ON DELETE CASCADE |
| type     | VARCHAR(50)  | NOT NULL                                 |
| channel  | VARCHAR(20)  | NOT NULL, CHECK (channel IN ('email','whatsapp','in_app')) |
| title    | VARCHAR(255) | NOT NULL                                 |
| body     | TEXT         | NOT NULL                                 |
| data     | JSONB        | NULL                                     |
| read_at  | TIMESTAMPTZ  | NULL                                     |
| sent_at  | TIMESTAMPTZ  | NULL                                     |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now()                 |

**Indexes:**
- `idx_notifications_user` on `user_id`
- `idx_notifications_user_unread` on (`user_id`, `read_at`) WHERE `read_at IS NULL` -- unread count
- `idx_notifications_type` on `type`

---

## Settings

### `settings`

| Column      | Type         | Constraints                              |
|-------------|--------------|------------------------------------------|
| id          | UUID         | PK                                       |
| group       | VARCHAR(50)  | NOT NULL                                 |
| key         | VARCHAR(100) | NOT NULL                                 |
| value       | JSONB        | NOT NULL                                 |
| type        | VARCHAR(20)  | NOT NULL, DEFAULT 'string', CHECK (type IN ('string','number','boolean','json')) |
| description | VARCHAR(255) | NULL                                     |
| updated_at  | TIMESTAMPTZ  | NOT NULL, DEFAULT now()                  |

**Indexes:**
- UNIQUE on (`group`, `key`)

---

## Audit

### `audit_logs`

| Column      | Type         | Constraints                |
|-------------|--------------|----------------------------|
| id          | UUID         | PK                         |
| user_id     | UUID         | NULL, FK -> users(id) ON DELETE SET NULL |
| action      | VARCHAR(50)  | NOT NULL                   |
| entity_type | VARCHAR(50)  | NOT NULL                   |
| entity_id   | UUID         | NOT NULL                   |
| before      | JSONB        | NULL                       |
| after       | JSONB        | NULL                       |
| ip_address  | VARCHAR(45)  | NULL                       |
| user_agent  | VARCHAR(500) | NULL                       |
| created_at  | TIMESTAMPTZ  | NOT NULL, DEFAULT now()    |

**Indexes:**
- `idx_audit_logs_user` on `user_id`
- `idx_audit_logs_entity` on (`entity_type`, `entity_id`)
- `idx_audit_logs_action` on `action`
- `idx_audit_logs_created` on `created_at`

---

## Relationships Diagram (Text)

```
users 1--* user_roles *--1 roles
roles 1--* role_permissions *--1 permissions

categories 1--* categories (self-ref via parent_id)
categories 1--* products

products 1--* product_resources *--1 resources
products 1--* schedules
products 1--* bookings
products 1--* cart_items
products 1--* order_items

locations 1--* rooms
locations 1--* resources
locations 1--* business_hours
locations 1--* blocked_dates

rooms 1--* schedules
rooms 1--* bookings
rooms 1--* blocked_dates

instructors 1--* schedules
instructors 1--* bookings
instructors 1--* blocked_dates
instructors ?--1 users (optional link)

schedules 1--* bookings
schedules 1--* cart_items

users (customer) 1--* bookings
users (customer) 1--* orders
users (customer) 1--* carts
users (customer) 1--* notifications

bookings 1--* booking_resources *--1 resources
bookings 1--* booking_reschedules

carts 1--* cart_items
orders 1--* order_items
orders 1--* payments
orders 1--* bookings (via order_id)

order_items ?--1 bookings (optional link)

payments 1--* payment_logs

users 1--* audit_logs
users 1--* school_inquiries (via handled_by)
```

---

## Key Index Notes

| Query Pattern                        | Index Used                                |
|--------------------------------------|-------------------------------------------|
| Check room availability on a date    | `idx_bookings_room_date_time`             |
| Check instructor availability        | `idx_bookings_instructor_date_time`       |
| Customer upcoming bookings           | `idx_bookings_customer_upcoming`          |
| Fetch published/featured products    | `idx_products_featured`                   |
| Product catalog filtering            | `idx_products_type_status`                |
| Schedule availability lookup         | `idx_schedules_availability`              |
| Blocked date checks                  | `idx_blocked_dates_*_date` (per entity)   |
| Payment webhook by gateway ref       | `idx_payments_gateway_ref`               |
| Unread notification count            | `idx_notifications_user_unread`           |
| Expired cart cleanup                 | `idx_carts_expires`                       |
| Audit trail for entity               | `idx_audit_logs_entity`                   |
