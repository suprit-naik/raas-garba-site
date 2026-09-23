import { NextResponse } from "next/server"
import eventData from "@/data/event.json"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, adults = 0, kids = 0, total = 0 } = body

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      )
    }

    // Generate a reliable fallback booking ID in case Google Sheets is slow or offline
    const fallbackId = `RG3-${Math.floor(1000 + Math.random() * 9000)}`
    let bookingId = fallbackId

    if (eventData.sheetUrl) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 6000)

        const response = await fetch(eventData.sheetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify({
            name,
            phone,
            adults,
            kids,
            total,
            fallbackId,
          }),
          signal: controller.signal,
          redirect: "follow",
        })

        clearTimeout(timeout)

        if (response.ok) {
          const text = await response.text()
          try {
            const data = JSON.parse(text)
            if (data?.id) {
              bookingId = data.id
            }
          } catch {
            // If response text was not JSON but Google Sheet handled it, fallbackId is used
            console.warn("Google Sheet returned non-JSON response:", text)
          }
        }
      } catch (sheetError) {
        console.warn("Google Sheet sync failed, using fallback booking ID:", sheetError)
      }
    }

    return NextResponse.json({
      success: true,
      id: bookingId,
    })
  } catch (err) {
    console.error("Booking API error:", err)
    // Always provide a booking ID so the user is never prevented from paying
    const fallbackId = `RG3-${Math.floor(1000 + Math.random() * 9000)}`
    return NextResponse.json({
      success: true,
      id: fallbackId,
    })
  }
}
