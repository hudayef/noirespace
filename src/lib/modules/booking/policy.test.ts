import { describe, it, expect } from "vitest"
import { canReschedule, canCancelBooking } from "./policy"

describe("Booking Business Rules (BR-06, BR-07, BR-08)", () => {
  it("allows reschedule when confirmed, 0 attempts, and >= 24h notice", () => {
    const res = canReschedule({
      status: "confirmed",
      bookingDateTime: new Date("2026-10-10T14:00:00+07:00"),
      rescheduleCount: 0,
      now: new Date("2026-10-08T10:00:00+07:00"),
    })
    expect(res.allowed).toBe(true)
  })

  it("blocks reschedule when already rescheduled once", () => {
    const res = canReschedule({
      status: "confirmed",
      bookingDateTime: new Date("2026-10-10T14:00:00+07:00"),
      rescheduleCount: 1,
      now: new Date("2026-10-08T10:00:00+07:00"),
    })
    expect(res.allowed).toBe(false)
    expect(res.reason).toContain("Batas reschedule")
  })

  it("blocks reschedule when under 24 hours notice", () => {
    const res = canReschedule({
      status: "confirmed",
      bookingDateTime: new Date("2026-10-10T14:00:00+07:00"),
      rescheduleCount: 0,
      now: new Date("2026-10-09T18:00:00+07:00"), // only 20 hours before
    })
    expect(res.allowed).toBe(false)
    expect(res.reason).toContain("24 jam")
  })

  it("blocks reschedule for past sessions", () => {
    const res = canReschedule({
      status: "confirmed",
      bookingDateTime: new Date("2026-10-07T14:00:00+07:00"),
      rescheduleCount: 0,
      now: new Date("2026-10-08T10:00:00+07:00"),
    })
    expect(res.allowed).toBe(false)
    expect(res.reason).toContain("lewat")
  })

  it("blocks reschedule when status is not confirmed", () => {
    const res = canReschedule({
      status: "pending",
      bookingDateTime: new Date("2026-10-10T14:00:00+07:00"),
      rescheduleCount: 0,
      now: new Date("2026-10-08T10:00:00+07:00"),
    })
    expect(res.allowed).toBe(false)
    expect(res.reason).toContain("dikonfirmasi")
  })

  it("verifies user cancellation policy rule", () => {
    expect(canCancelBooking("pending")).toBe(true)
    expect(canCancelBooking("awaiting_payment")).toBe(true)
    expect(canCancelBooking("paid")).toBe(false)
    expect(canCancelBooking("confirmed")).toBe(false)
    expect(canCancelBooking("cancelled")).toBe(false)
  })
})
