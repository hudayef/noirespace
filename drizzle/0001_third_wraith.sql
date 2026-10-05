CREATE INDEX "idx_bookings_product_date_status" ON "bookings" USING btree ("product_id","booking_date","status");--> statement-breakpoint
CREATE INDEX "idx_bookings_customer" ON "bookings" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_bookings_date" ON "bookings" USING btree ("booking_date");--> statement-breakpoint
CREATE INDEX "idx_bookings_room_time" ON "bookings" USING btree ("room_id","booking_date","start_time");--> statement-breakpoint
CREATE INDEX "idx_bookings_instructor_time" ON "bookings" USING btree ("instructor_id","booking_date","start_time");--> statement-breakpoint
CREATE INDEX "idx_orders_customer_status" ON "orders" USING btree ("customer_id","status");--> statement-breakpoint
CREATE INDEX "idx_orders_created" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_schedules_product_day" ON "schedules" USING btree ("product_id","day_of_week");--> statement-breakpoint
CREATE INDEX "idx_schedules_status" ON "schedules" USING btree ("status");