"use client"
import { useState } from "react"
import { Minus, Plus, MessageCircle, Smartphone, Loader2 } from "lucide-react"
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

  const reserve = async () => {
    setBusy(true); setErr("")
    try {
      const r = await fetch(e.sheetUrl, { method: "POST", body: JSON.stringify({ name: name.trim(), phone: mobile, adults: qty.adult || 0, kids: qty.kids || 0, total }) })
      setId((await r.json()).id)
    } catch { setErr("Couldn't create your booking. Check your internet and try again.") }
    setBusy(false)
  }

  const upi = `upi://pay?pa=${e.upi.id}&pn=${encodeURIComponent(e.upi.name)}&am=${total}&cu=INR&tn=${encodeURIComponent(`Raas Garba ${id}`)}`
  const wa = `https://wa.me/${e.whatsapp}?text=${encodeURIComponent(`Hi! I've paid ${inr(total)} for Raas Garba Season 3.\nBooking ID: ${id}\nName: ${name.trim()}\nPhone: ${mobile}\nTickets: ${summary}\n(Payment screenshot attached)`)}`

  const step = "font-serif text-4xl font-light italic text-accent/70"
  const btn = "flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 font-bold transition active:scale-95"
  const off = id ? "" : "pointer-events-none opacity-40"
  const field = "w-full rounded-2xl border border-border/60 bg-transparent px-4 py-3 font-medium placeholder:text-foreground/40 focus:border-accent focus:outline-none read-only:opacity-70"

  return (
    <section id="book" className="glass glow-accent scroll-mt-6 rounded-3xl p-6 md:row-span-2 md:p-10">
      <h2 className="mb-8 font-serif text-3xl font-semibold italic text-primary md:text-4xl">Book your tickets</h2>
      <ol className="space-y-8">
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
        <li className="flex gap-5">
          <span className={step}>2</span>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-semibold">Your details</h3>
            <input value={name} readOnly={!!id} onChange={(x) => setName(x.target.value)} placeholder="Full name" autoComplete="name" className={field} />
            <input value={phone} readOnly={!!id} onChange={(x) => setPhone(x.target.value)} placeholder="WhatsApp number" inputMode="tel" autoComplete="tel" className={field} />
            {id ? (
              <p className="rounded-2xl border border-accent/50 bg-accent/10 px-4 py-3 font-medium">Your booking ID is <span className="font-bold text-accent">{id}</span></p>
            ) : (
              <button onClick={reserve} disabled={!valid || busy} className={`${btn} bg-primary text-primary-foreground disabled:opacity-40`}>
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : null} {busy ? "Creating booking…" : "Get booking ID"}
              </button>
            )}
            {!valid && !id && <p className="text-sm text-foreground/60">Add your name and a 10-digit number to continue.</p>}
            {err && <p className="text-sm font-semibold text-red-400">{err}</p>}
          </div>
        </li>
        <li className="flex gap-5">
          <span className={step}>3</span>
          <div className={`flex-1 ${off}`}>
            <h3 className="mb-1 text-xl font-semibold">Pay by UPI</h3>
            <p className="mb-3 font-medium text-foreground/80">GPay, PhonePe, Paytm or any UPI app. Pay exactly {inr(total)}.</p>
            <a href={upi} className={`${btn} bg-accent text-accent-foreground md:hidden`}><Smartphone className="h-5 w-5" /> Pay {inr(total)} in UPI app</a>
            <p className="hidden rounded-2xl border border-border/60 px-4 py-3 font-medium text-foreground/80 md:block">Open this page on your phone to pay with a UPI app.</p>
          </div>
        </li>
        <li className="flex gap-5">
          <span className={step}>4</span>
          <div className={`flex-1 ${off}`}>
            <h3 className="mb-1 text-xl font-semibold">Send us the screenshot</h3>
            <p className="mb-3 font-medium text-foreground/80">Your booking ID and details are filled in. Attach the payment screenshot and send. The team replies to confirm.</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25D366] text-[#0b2e17]`}><MessageCircle className="h-5 w-5" /> Send on WhatsApp</a>
          </div>
        </li>
      </ol>
    </section>
  )
}
