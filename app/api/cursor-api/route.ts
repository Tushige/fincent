import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const session = await getSession(req)
  return NextResponse.json({ prev_cursors: session.prev_cursors });
}

export async function POST(req) {
  try {
    const data = await req.json()
    const session = await getSession(req)
    session.prev_cursors.push(data.cursor)
    await session.save()
  } catch (err) {
    console.error(err)
  }
  return NextResponse.json({status: 'success'})
}

function clearSession(session) {
  session.prev_cursors = []
}