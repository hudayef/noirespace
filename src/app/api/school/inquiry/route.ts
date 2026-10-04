import { NextRequest, NextResponse } from "next/server"
import { schoolInquirySchema } from "@/lib/validators/school"
import { createSchoolInquiry } from "@/lib/modules/school/inquiry.service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schoolInquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const inquiry = await createSchoolInquiry(parsed.data)
    return NextResponse.json({ success: true, inquiry }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Gagal memproses pengajuan" }, { status: 500 })
  }
}
