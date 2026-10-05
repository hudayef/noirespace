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
      <span className="text-xs text-neutral-400 flex items-center gap-1.5 font-medium">
        <Calendar className="h-3.5 w-3.5 text-amber-400" />
        Simpan ke Kalender:
      </span>
      <a
        href={googleUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/[0.12] bg-white/[0.04] text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <span>Google Calendar</span>
        <ExternalLink className="h-3 w-3" />
      </a>
      <a
        href={icsDataUri}
        download={`booking-${date}.ics`}
        className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-white/[0.12] bg-white/[0.04] text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-colors"
      >
        <span>iCal / Apple / Outlook</span>
        <Download className="h-3 w-3" />
      </a>
    </div>
  )
}
