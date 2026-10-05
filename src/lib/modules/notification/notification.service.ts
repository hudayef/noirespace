import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"

export interface SendNotificationParams {
  userId?: string
  type: string
  channel?: "email" | "whatsapp" | "in_app"
  title: string
  body: string
  data?: Record<string, unknown>
}

export async function sendNotification(params: SendNotificationParams) {
  const { userId, type, channel = "email", title, body, data = {} } = params

  let record = null
  if (userId) {
    try {
      const [inserted] = await db
        .insert(notifications)
        .values({
          userId,
          type,
          channel,
          title,
          body,
          data,
          sentAt: new Date(),
        })
        .returning()
      record = inserted
    } catch (dbErr) {
      console.warn("Could not insert notification record:", dbErr)
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (resendApiKey && channel === "email") {
    try {
      const recipient = data?.recipientEmail as string
      if (recipient) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Noire Space <booking@noirespace.com>",
            to: [recipient],
            subject: title,
            html: `<div style="font-family: sans-serif; padding: 20px;">
              <h2>${title}</h2>
              <p>${body}</p>
            </div>`,
          }),
        })
      }
    } catch (err) {
      console.error("Failed to dispatch Resend email:", err)
    }
  }

  const fonnteToken = process.env.FONNTE_TOKEN
  if (fonnteToken && (channel === "whatsapp" || channel === "email")) {
    try {
      const rawPhone = (data?.phone as string) || ""
      const digits = rawPhone.replace(/[^0-9]/g, "")
      const phone = digits.startsWith("0") ? `62${digits.slice(1)}` : digits

      if (phone.length >= 10) {
        await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: fonnteToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: phone,
            message: `*${title}*\n\n${body}`,
          }),
        })
      }
    } catch (err) {
      console.error("Failed to dispatch WhatsApp notification:", err)
    }
  }

  return record
}
