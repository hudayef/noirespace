import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

export async function GET() {
  try {
    await db.execute(sql`select 1`)
    return NextResponse.json(
      { status: "ok", database: "connected", timestamp: new Date().toISOString() },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { status: "error", database: "disconnected", timestamp: new Date().toISOString() },
      { status: 503 }
    )
  }
}
