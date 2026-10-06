"use client"

import { Calendar, Download, ExternalLink } from "lucide-react"
import { generateGoogleCalendarUrl, generateIcsDataUri } from "@/lib/utils/calendar"

interface AddToCalendarProps {
  title: string
  description?: string
  location?: string
  date: string
  startTime: string
  endTime: string
  className?: string
}

export function AddToCalendar({
  title,
  description,
  location,
  date,
  startTime,
  endTime,
  className = "",
}: AddToCalendarProps) {
  const googleUrl = generateGoogleCalendarUrl({
    title,
    description,
    location,
    date,
    startTime,
    endTime,
  })

  const icsDataUri = generateIcsDataUri({
    title,
    description,
    location,
    date,
    startTime,
    endTime,
  })

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#6f6f6a] flex items-center gap-1.5">
        <Calendar className="h-3 w-3 text-[#6f6f6a]" />
        Simpan ke Kalender:
      </span>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] font-medium px-2 py-1 border border-[#f3f1eb]/[0.12] bg-[#111111] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] hover:border-[#f3f1eb]/[0.3] transition-colors"
      >
        <span>Google Calendar</span>
        <ExternalLink className="h-2.5 w-2.5" />
      </a>
      <a
        href={icsDataUri}
        download={`booking-${date}.ics`}
        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] font-medium px-2 py-1 border border-[#f3f1eb]/[0.12] bg-[#111111] text-[#e8e6df] hover:text-[#f3f1eb] hover:bg-[#171717] hover:border-[#f3f1eb]/[0.3] transition-colors"
      >
        <span>iCal / Apple / Outlook</span>
        <Download className="h-2.5 w-2.5" />
      </a>
    </div>
  )
}
