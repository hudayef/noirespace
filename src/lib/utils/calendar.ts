export function generateGoogleCalendarUrl(params: {
  title: string
  description?: string
  location?: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm:ss or HH:mm
  endTime: string // HH:mm:ss or HH:mm
}): string {
  const { title, description = "", location = "Noire Space Creative Hub, Jakarta", date, startTime, endTime } = params

  const cleanDate = date.replace(/-/g, "")
  const cleanStart = startTime.replace(/:/g, "").slice(0, 4) + "00"
  const cleanEnd = endTime.replace(/:/g, "").slice(0, 4) + "00"

  // Jakarta is UTC+7. Google calendar accepts ISO strings or local times with specified timezone
  const startDateTime = `${cleanDate}T${cleanStart}`
  const endDateTime = `${cleanDate}T${cleanEnd}`

  const url = new URL("https://calendar.google.com/calendar/render")
  url.searchParams.set("action", "TEMPLATE")
  url.searchParams.set("text", title)
  url.searchParams.set("details", description)
  url.searchParams.set("location", location)
  url.searchParams.set("dates", `${startDateTime}/${endDateTime}`)
  url.searchParams.set("ctz", "Asia/Jakarta")

  return url.toString()
}

export function generateIcsDataUri(params: {
  title: string
  description?: string
  location?: string
  date: string
  startTime: string
  endTime: string
}): string {
  const { title, description = "", location = "Noire Space Creative Hub, Jakarta", date, startTime, endTime } = params
  const cleanDate = date.replace(/-/g, "")
  const cleanStart = startTime.replace(/:/g, "").slice(0, 4) + "00"
  const cleanEnd = endTime.replace(/:/g, "").slice(0, 4) + "00"

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Noire Space//Booking Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${title.replace(/\n/g, " ")}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location.replace(/\n/g, ", ")}`,
    `DTSTART;TZID=Asia/Jakarta:${cleanDate}T${cleanStart}`,
    `DTEND;TZID=Asia/Jakarta:${cleanDate}T${cleanEnd}`,
    `STATUS:CONFIRMED`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsLines)}`
}
