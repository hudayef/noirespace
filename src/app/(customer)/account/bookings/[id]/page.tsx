import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/modules/auth"
import { getBookingById } from "@/lib/modules/booking/booking.service"
import { BookingDetailView } from "@/components/features/booking/booking-detail-view"

interface Props {
  params: Promise<{ id: string }>
}

export default async function BookingDetailPage({ params }: Props) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const { id } = await params
  const bookingData = await getBookingById(id)

  if (!bookingData || bookingData.customerId !== session.user.id) {
    notFound()
  }

  return (
    <BookingDetailView
      booking={bookingData}
      product={bookingData.product}
      reschedules={bookingData.reschedules}
    />
  )
}
