export function canReschedule(booking: {
  status: string
  bookingDateTime: Date
  rescheduleCount: number
  now: Date
}): { allowed: boolean; reason?: string } {
  const { status, bookingDateTime, rescheduleCount, now } = booking

  if (bookingDateTime.getTime() <= now.getTime()) {
    return { allowed: false, reason: "Sesi telah lewat atau sedang berlangsung" }
  }

  if (rescheduleCount >= 1) {
    return { allowed: false, reason: "Batas reschedule telah tercapai (maksimal 1 kali)" }
  }

  const diffHours = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
  if (diffHours < 24) {
    return { allowed: false, reason: "Reschedule hanya dapat dilakukan maksimal 24 jam sebelum jadwal" }
  }

  if (status !== "confirmed") {
    return { allowed: false, reason: "Hanya booking yang telah dikonfirmasi yang dapat di-reschedule" }
  }

  return { allowed: true }
}

export function canCancelBooking(status: string): boolean {
  return ["pending", "awaiting_payment"].includes(status)
}
