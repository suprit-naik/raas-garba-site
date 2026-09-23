"use client"
import { useState } from "react"
import { Minus, Plus, MessageCircle, Loader2, CheckCircle2 } from "lucide-react"
import e from "@/data/event.json"

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`

export function Booking() {
  const [qty, setQty] = useState<Record<string, number>>({ adult: 1, kids: 0 })
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [id, setId] = useState("")
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState("")

  const set = (k: string, d: number) => !id && setQty((q) => ({ ...q, [k]: Math.min(10, Math.max(0, (q[k] || 0) + d)) }))
  const total = e.tickets.reduce((s, t) => s + t.price * (qty[t.id] || 0), 0)
  const summary = e.tickets.filter((t) => qty[t.id]).map((t) => `${t.label} ${qty[t.id]} × ${inr(t.price)}`).join(", ")
  const mobile = phone.replace(/\D/g, "").slice(-10)
  const valid = total > 0 && name.trim().length > 1 && /^[6-9]\d{9}$/.test(mobile)

  const buildWaUrl = (bookingId: string) => {
    const text = `Hi! I want to book tickets for Raas Garba Season 3.\nBooking ID: ${bookingId}\nName: ${name.trim()}\nPhone: ${mobile}\nTickets: ${summary}\nTotal Amount: ${inr(total)}`
    return `https://wa.me/${e.whatsapp}?text=${encodeURIComponent(text)}`
  }

  const handleBooking = async () => {
    if (!valid || busy) return
    setBusy(true)
    setErr("")

    let bookingId = `RG3-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const r = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: mobile,
          adults: qty.adult || 0,
          kids: qty.kids || 0,
          total
        })
      })
      const data = await r.json()
      if (data?.id) {
        bookingId = data.id
      }
    } catch {
      // Fallback ID generated above ensures user is never blocked
    }

    setId(bookingId)
    setBusy(false)

    // Redirect directly to WhatsApp
    const waUrl = buildWaUrl(bookingId)
    window.location.href = waUrl
  }

  const step = "font-serif text-4xl font-light italic text-accent/70"
  const btn = "flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-bold transition active:scale-95"
  const field = "w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 font-medium placeholder:text-foreground/40 focus:border-accent focus:outline-none read-only:opacity-70"

  const waUrlCurrent = id ? buildWaUrl(id) : ""

  return (
    <section id="book" className="glass glow-accent scroll-mt-6 rounded-3xl p-6 md:row-span-2 md:p-10">
      <h2 className="mb-8 font-serif text-3xl font-semibold italic text-primary md:text-4xl">Book your tickets</h2>
      <ol className="space-y-8">
        {/* Step 1: Choose tickets */}
        <li className="flex gap-5">
          <span className={step}>1</span>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold">Choose tickets</h3>
            {e.tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-2xl border border-border/60 py-2 pl-4 pr-2">
                <div>
                  <p className="font-bold">{t.label}</p>
                  <p className="text-sm text-foreground/70">{inr(t.price)}{t.note && `, ${t.note}`}</p>
                </div>
                <div className={`flex items-center gap-3 ${id ? "opacity-50" : ""}`}>
                  <button aria-label={`Fewer ${t.label}`} onClick={() => set(t.id, -1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 active:scale-90"><Minus className="h-4 w-4" /></button>
                  <span className="w-5 text-center text-lg font-bold">{qty[t.id] || 0}</span>
                  <button aria-label={`More ${t.label}`} onClick={() => set(t.id, 1)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 active:scale-90"><Plus className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            <p className="flex justify-between px-1 text-lg"><span className="text-foreground/80">Total</span><span className="font-bold text-accent">{inr(total)}</span></p>
          </div>
        </li>

        {/* Step 2: Your details & WhatsApp redirect */}
        <li className="flex gap-5">
          <span className={step}>2</span>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold">Your details</h3>
            <input
              value={name}
              readOnly={!!id}
              onChange={(x) => setName(x.target.value)}
              placeholder="Full name"
              autoComplete="name"
              className={field}
            />
            <input
              value={phone}
              readOnly={!!id}
              onChange={(x) => setPhone(x.target.value)}
              placeholder="WhatsApp number (10 digits)"
              inputMode="tel"
              autoComplete="tel"
              className={field}
            />

            {id ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-accent/50 bg-accent/10 px-4 py-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                  <div>
                    <p className="text-xs text-foreground/70">Booking ID Generated</p>
                    <p className="text-lg font-bold text-accent">{id}</p>
                  </div>
                </div>
                <a
                  href={waUrlCurrent}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${btn} bg-[#25D366] text-[#0b2e17] shadow-lg`}
                >
                  <MessageCircle className="h-5 w-5" /> Continue on WhatsApp
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBooking}
                disabled={!valid || busy}
                className={`${btn} bg-[#25D366] text-[#0b2e17] shadow-lg disabled:opacity-40`}
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
                {busy ? "Connecting to WhatsApp…" : `Book on WhatsApp (${inr(total)})`}
              </button>
            )}

            {!valid && !id && (
              <p className="text-sm text-foreground/60">Add your name and a 10-digit phone number to continue.</p>
            )}
            {err && <p className="text-sm font-semibold text-red-400">{err}</p>}
          </div>
        </li>
      </ol>
    </section>
  )
}
