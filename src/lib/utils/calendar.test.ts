import { describe, it, expect } from "vitest"
import { generateGoogleCalendarUrl, generateIcsDataUri } from "./calendar"

describe("Calendar Utilities", () => {
  it("generates valid Google Calendar URL", () => {
    const url = generateGoogleCalendarUrl({
      title: "Studio Session",
      description: "Booking Session",
      location: "Noire Space Hub",
      date: "2026-10-15",
      startTime: "10:00:00",
      endTime: "12:00:00",
    })

    expect(url).toContain("https://calendar.google.com/calendar/render")
    expect(url).toContain("text=Studio+Session")
    expect(url).toContain("dates=20261015T100000%2F20261015T120000")
    expect(url).toContain("ctz=Asia%2FJakarta")
  })

  it("generates valid ICS data URI", () => {
    const uri = generateIcsDataUri({
      title: "Studio Session",
      description: "Booking Session",
      location: "Noire Space Hub",
      date: "2026-10-15",
      startTime: "10:00",
      endTime: "12:00",
    })

    expect(uri.startsWith("data:text/calendar;charset=utf-8,")).toBe(true)
    const decoded = decodeURIComponent(uri.replace("data:text/calendar;charset=utf-8,", ""))
    expect(decoded).toContain("BEGIN:VCALENDAR")
    expect(decoded).toContain("SUMMARY:Studio Session")
    expect(decoded).toContain("DTSTART;TZID=Asia/Jakarta:20261015T100000")
    expect(decoded).toContain("DTEND;TZID=Asia/Jakarta:20261015T120000")
    expect(decoded).toContain("END:VCALENDAR")
  })
})
