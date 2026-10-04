import { describe, it, expect, vi, beforeEach } from "vitest"

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number)
  return h * 60 + m
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
}

function getOverlap(slotStart: number, slotEnd: number, bookingStart: number, bookingEnd: number): boolean {
  return Math.max(slotStart, bookingStart) < Math.min(slotEnd, bookingEnd)
}

describe("Booking Time Parsing & Overlap Logic", () => {
  describe("parseTimeToMinutes", () => {
    it("parses HH:MM format correctly", () => {
      expect(parseTimeToMinutes("09:00")).toBe(540)
      expect(parseTimeToMinutes("13:30")).toBe(810)
      expect(parseTimeToMinutes("23:59")).toBe(1439)
    })

    it("parses HH:MM:SS format correctly", () => {
      expect(parseTimeToMinutes("09:00:00")).toBe(540)
      expect(parseTimeToMinutes("18:30:00")).toBe(1110)
    })
  })

  describe("formatMinutesToTime", () => {
    it("converts minutes to HH:MM:SS format", () => {
      expect(formatMinutesToTime(540)).toBe("09:00:00")
      expect(formatMinutesToTime(810)).toBe("13:30:00")
      expect(formatMinutesToTime(1439)).toBe("23:59:00")
    })
  })

  describe("getOverlap", () => {
    it("detects overlapping time ranges", () => {
      expect(getOverlap(540, 600, 540, 600)).toBe(true) // identical
      expect(getOverlap(540, 600, 570, 630)).toBe(true) // partial overlap start
      expect(getOverlap(540, 600, 510, 570)).toBe(true) // partial overlap end
      expect(getOverlap(540, 600, 510, 630)).toBe(true) // encompasses
      expect(getOverlap(540, 600, 555, 585)).toBe(true) // inside
    })

    it("detects non-overlapping time ranges", () => {
      expect(getOverlap(540, 600, 600, 660)).toBe(false) // adjacent
      expect(getOverlap(540, 600, 480, 540)).toBe(false) // adjacent before
      expect(getOverlap(540, 600, 660, 720)).toBe(false) // separate
    })
  })
})

describe("Booking Capacity Logic", () => {
  function calculateRemainingCapacity(
    maxCap: number,
    existingBookings: { participants: number; startTime: string; endTime: string }[],
    newSlotStart: string,
    newSlotEnd: string,
    newParticipants: number = 1
  ): number {
    const reqStart = parseTimeToMinutes(newSlotStart)
    const reqEnd = parseTimeToMinutes(newSlotEnd)

    const overlapping = existingBookings.filter((b) => {
      const bStart = parseTimeToMinutes(b.startTime)
      const bEnd = parseTimeToMinutes(b.endTime)
      return Math.max(reqStart, bStart) < Math.min(reqEnd, bEnd)
    })

    const bookedCount = overlapping.reduce((sum, b) => sum + (b.participants || 1), 0)
    return Math.max(0, maxCap - bookedCount - newParticipants)
  }

  it("calculates remaining capacity correctly", () => {
    const existing = [
      { participants: 2, startTime: "10:00", endTime: "11:00" },
      { participants: 1, startTime: "11:15", endTime: "12:15" },
    ]

    expect(calculateRemainingCapacity(10, existing, "10:00", "11:00")).toBe(7)
    expect(calculateRemainingCapacity(10, existing, "11:15", "12:15")).toBe(8)
    expect(calculateRemainingCapacity(10, existing, "10:30", "11:30")).toBe(6) // overlaps both sessions (2 + 1 = 3 booked)
  })

  it("returns 0 when capacity exceeded", () => {
    const existing = [
      { participants: 8, startTime: "10:00", endTime: "11:00" },
    ]

    expect(calculateRemainingCapacity(10, existing, "10:00", "11:00", 3)).toBe(0)
    expect(calculateRemainingCapacity(10, existing, "10:00", "11:00", 5)).toBe(0)
  })
})

describe("Booking Validation Rules", () => {
  function validateBookingTime(startTime: string, endTime: string): { valid: boolean; error?: string } {
    const reqStart = parseTimeToMinutes(startTime)
    const reqEnd = parseTimeToMinutes(endTime)

    if (reqStart >= reqEnd) {
      return { valid: false, error: "Waktu mulai harus lebih awal dari waktu selesai" }
    }
    return { valid: true }
  }

  it("rejects invalid time ranges", () => {
    expect(validateBookingTime("10:00", "10:00")).toEqual({ valid: false, error: "Waktu mulai harus lebih awal dari waktu selesai" })
    expect(validateBookingTime("11:00", "10:00")).toEqual({ valid: false, error: "Waktu mulai harus lebih awal dari waktu selesai" })
  })

  it("accepts valid time ranges", () => {
    expect(validateBookingTime("10:00", "11:00")).toEqual({ valid: true })
    expect(validateBookingTime("09:30", "17:00")).toEqual({ valid: true })
  })
})