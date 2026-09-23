"use client"

import { useState } from "react"
import { CalendarDays, Clock, Ticket, MapPin, Instagram, Sparkles, ChevronLeft, ChevronRight, Camera, Phone, MessageCircle } from "lucide-react"
import e from "@/data/event.json"
import { Booking } from "@/components/booking"

const icons = [CalendarDays, Clock, Ticket, MapPin]
const colors = ["#F4A51C", "#E23B3B", "#FBF1DC"]

// Concentric dotted rings: the garba circle, drawn as bandhani
function Rings() {
  return (
    <svg viewBox="-250 -250 500 500" className="w-full h-full" aria-hidden>
      <defs>
        <radialGradient id="diya">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="1" stopColor="#F4A51C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="70" fill="url(#diya)" className="diya" />
      <circle r="9" fill="#FFE9A8" />
      {[80, 118, 156, 194, 232].map((r, i) => {
        const n = Math.round(r / 6.5)
        return (
          <g key={r} className={i % 2 ? "garba-ring rev" : "garba-ring"} style={{ animationDuration: `${50 + i * 18}s` }}>
            {Array.from({ length: n }, (_, j) => {
              const a = (j / n) * 2 * Math.PI
              return <circle key={j} cx={+(Math.cos(a) * r).toFixed(2)} cy={+(Math.sin(a) * r).toFixed(2)} r={i % 2 ? 3 : 4.5} fill={colors[i % 3]} />
            })}
          </g>
        )
      })}
    </svg>
  )
}

// Hanging marigold toran
function Toran() {
  return (
    <svg className="h-14 w-full" aria-hidden>
      <defs>
        <pattern id="toran" width="96" height="56" patternUnits="userSpaceOnUse">
          <path d="M0 6 Q48 40 96 6" fill="none" stroke="#F4A51C" strokeWidth="1.5" opacity=".6" />
          {[[16, 15], [32, 21], [48, 23], [64, 21], [80, 15]].map(([x, y], i) => <circle key={x} cx={x} cy={y} r={i % 2 ? 4 : 5.5} fill={i % 2 ? "#E23B3B" : "#F4A51C"} />)}
          <path d="M0 6 q-7 18 0 30 q7 -12 0 -30z" fill="#3F8F4A" />
          <circle cx="0" cy="6" r="4" fill="#F4A51C" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#toran)" />
    </svg>
  )
}

function Star() {
  const s = e.star
  const photos = s.photos && s.photos.length > 0 ? s.photos : (s.photo ? [{ src: s.photo, alt: s.name, label: "Featured" }] : [])
  const [activeIdx, setActiveIdx] = useState(0)
  const currentPhoto = photos[activeIdx] || photos[0]

  const nextPhoto = () => setActiveIdx((prev) => (prev + 1) % photos.length)
  const prevPhoto = () => setActiveIdx((prev) => (prev - 1 + photos.length) % photos.length)

  return (
    <section className="relative overflow-hidden">
      <Toran />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-14 pt-8 md:grid-cols-[minmax(0,420px)_1fr] md:gap-16 md:px-12 md:pb-20">
        <div className="mx-auto w-full max-w-[340px] md:max-w-none">
          {/* Main Arched Frame */}
          <div
            style={{ borderRadius: "50% 50% 1.5rem 1.5rem / 37.5% 37.5% 1.5rem 1.5rem" }}
            className="group relative border-2 border-accent p-2 shadow-[0_0_60px_rgba(244,165,28,.25)] transition-all duration-300 hover:shadow-[0_0_80px_rgba(244,165,28,.4)]"
          >
            {/* Star badge */}
            <div className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-accent/60 bg-background/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-accent backdrop-blur-md shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" /> Star Guest
            </div>

            <div
              style={{ borderRadius: "50% 50% 1rem 1rem / 37.5% 37.5% 1rem 1rem" }}
              className="relative aspect-[3/4] overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#7a1a24,#2a0610_70%)]"
            >
              {currentPhoto ? (
                <img
                  key={currentPhoto.src}
                  src={currentPhoto.src}
                  alt={currentPhoto.alt || s.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <>
                  <div className="absolute inset-[-20%] opacity-50"><Rings /></div>
                  <span className="absolute inset-0 grid place-items-center font-serif text-8xl italic text-primary/90">UG</span>
                </>
              )}

              {/* Prev / Next controls if multiple photos */}
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/75 hover:scale-110 active:scale-95"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/75 hover:scale-110 active:scale-95"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md">
                    {activeIdx + 1} / {photos.length} • {currentPhoto.label}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-sm font-semibold text-accent">
            <Sparkles className="h-4 w-4" /> {s.intro}
          </div>
          <h2 className="mt-3 font-serif text-6xl font-semibold italic leading-[0.9] text-primary md:text-8xl">{s.name}</h2>
          <p className="mx-auto mt-6 max-w-md text-lg font-medium text-foreground/90 md:mx-0">{s.bio}</p>

          <div className="mt-6">
            <span className="text-xs uppercase tracking-wider text-accent/90 font-semibold block mb-2">Famous For</span>
            <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
              {s.credits.map((c) => (
                <li key={c} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-foreground/85 backdrop-blur-sm">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick photo switcher buttons inside info column for easy interaction */}
          {photos.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="flex items-center gap-1.5 text-xs text-foreground/70 font-medium mr-1">
                <Camera className="h-3.5 w-3.5 text-accent" /> Photos:
              </span>
              {photos.map((p, idx) => (
                <button
                  key={p.src}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition active:scale-95 ${idx === activeIdx
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "border border-border/70 text-foreground/80 hover:border-accent hover:text-accent"
                    }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 hidden md:block"><BookButton /></div>
        </div>
      </div>
    </section>
  )
}

function BookButton({ className = "" }: { className?: string }) {
  return (
    <a href="#book"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-base font-bold text-accent-foreground transition active:scale-95 md:hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-primary ${className}`}>
      <Ticket className="h-5 w-5" /> Book tickets from {e.price}
    </a>
  )
}

export function EventPage() {
  return (
    <main className="min-h-screen gradient-bg pb-28 md:pb-0">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -right-40 -top-24 h-[130vw] w-[130vw] opacity-40 md:hidden"><Rings /></div>


        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-10 pt-20 md:grid-cols-[1.1fr_1fr] md:px-12 md:py-24">
          <div>
            <img src="/infinite-events-logo.jpg" alt="Infinite Events" className="h-20 w-auto mb-4 rounded-lg mix-blend-lighten" />
            <h1 className="mt-3 font-serif font-semibold italic leading-[0.85] text-primary">
              <span className="block text-7xl md:text-[8.5rem]">{e.title}</span>
              <span className="mt-3 block font-sans text-3xl font-light not-italic tracking-tight text-accent md:text-5xl">{e.season}</span>
            </h1>
            <p className="mt-6 max-w-md text-lg font-medium text-foreground/90">{e.tagline}</p>
            <div className="mt-8 hidden md:block"><BookButton /></div>
            <p className="mt-3 hidden text-sm text-foreground/70 md:block">Adults ₹599, kids ₹350. Pay by UPI, confirm on WhatsApp.</p>
          </div>
          <div className="hidden md:block relative">
            {/* Ulka Gupta cutout as hero visual */}
            <div className="relative aspect-[3/4] max-h-[580px] mx-auto">
              <div className="absolute inset-[-15%] opacity-30"><Rings /></div>
              <div className="relative z-10 h-full w-full drop-shadow-[0_0_60px_rgba(244,165,28,0.3)]">
              <img
                src="/star/ulka-gupta-cutout.png"
                alt="Ulka Gupta"
                className="h-full w-full object-contain object-bottom"
                style={{
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 98%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 98%)",
                }}
              />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick info */}
      <section className="border-y border-border/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 md:hidden">
          {e.info.map((x, i) => {
            const I = icons[i]; return (
              <div key={x.label} className="glass flex items-center justify-between rounded-2xl px-5 py-4">
                <span className="flex items-center gap-3 text-sm font-semibold text-foreground/80"><I className="h-5 w-5 text-accent" />{x.label}</span>
                <span className="font-bold">{x.value}</span>
              </div>)
          })}
        </div>
        <dl className="mx-auto hidden max-w-6xl grid-cols-4 px-12 py-8 md:grid">
          {e.info.map((x, i) => {
            const I = icons[i]; return (
              <div key={x.label} className="flex items-start gap-3">
                <I className="mt-1 h-5 w-5 text-accent" />
                <div><dt className="text-sm text-foreground/70">{x.label}</dt><dd className="text-lg font-bold">{x.value}</dd></div>
              </div>)
          })}
        </dl>
      </section>

      <Star />

      {/* DJ Dev */}
      {e.dj && (
        <section className="mx-auto max-w-6xl px-6 pt-2 pb-4 md:px-12 md:pt-4 md:pb-8">
          <div className="glass-strong glow-accent rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-[minmax(0,360px)_1fr]">
              {/* DJ Dev Photo */}
              <div className="relative aspect-[3/4] md:aspect-auto overflow-hidden">
                <img
                  src={e.dj.photo}
                  alt={e.dj.name}
                  className="h-full w-full object-cover object-top"
                />
                {/* Gradient overlay for text readability on mobile */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/40" />
              </div>

              {/* DJ Dev Info */}
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-sm font-semibold text-accent mb-3 w-fit">
                  🎧 {e.dj.intro}
                </div>
                <h2 className="font-serif text-5xl font-semibold italic leading-[0.9] text-primary md:text-7xl">{e.dj.name}</h2>
                <p className="mt-4 max-w-lg text-base font-medium text-foreground/85">{e.dj.bio}</p>

                {/* Past event credits */}
                <div className="mt-6">
                  <span className="text-xs uppercase tracking-wider text-accent/90 font-semibold block mb-2">Headlined At</span>
                  <ul className="flex flex-wrap gap-2">
                    {e.dj.credits.map((c: string) => (
                      <li key={c} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-foreground/85 backdrop-blur-sm">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instagram link */}
                <a
                  href={e.dj.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline w-fit"
                >
                  <Instagram className="h-4 w-4" /> @dj_dev
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Photos */}
      <section className="mx-auto max-w-6xl px-6 pt-10 md:px-12 md:pt-16">
        <h2 className="mb-6 font-serif text-3xl font-semibold italic text-primary md:text-4xl">What the night feels like</h2>
        <div className="scrollbar-hide -mx-6 flex snap-x gap-3 overflow-x-auto px-6 md:hidden">
          {e.photos.map((p) => <img key={p.src} src={p.src} alt={p.alt} loading="lazy" className="h-72 w-60 flex-none snap-start rounded-2xl object-cover" />)}
        </div>
        <div className="hidden h-[520px] grid-cols-4 grid-rows-2 gap-4 md:grid">
          {e.photos.map((p, i) => <img key={p.src} src={p.src} alt={p.alt} loading="lazy" className={`h-full w-full rounded-2xl object-cover ${["col-span-2 row-span-2 rounded-3xl", "col-span-2", "", ""][i]}`} />)}
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-2 md:px-12 md:py-16">
        <Booking />

        <section className="glass-strong rounded-3xl p-6 md:p-8">
          <h2 className="mb-4 font-serif text-3xl font-semibold italic text-primary">Getting there</h2>
          <p className="font-bold">{e.venue.name}</p>
          <p className="mt-1 text-foreground/80">{e.venue.address}</p>
          <a href={e.venue.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-3 font-semibold text-primary active:bg-white/10 md:hover:bg-white/10">
            <MapPin className="h-4 w-4" /> Open in Google Maps
          </a>
        </section>

        <section className="glass-strong rounded-3xl p-6 md:p-8">
          <h2 className="mb-5 font-serif text-3xl font-semibold italic text-primary">Before you come</h2>
          <ul className="space-y-4">
            {e.tips.map((t) => (<li key={t.title}><h3 className="font-bold">{t.title}</h3><p className="text-sm font-medium leading-relaxed text-foreground/80">{t.description}</p></li>))}
          </ul>
        </section>
      </div>

      {/* Past events */}
      <section className="mx-auto max-w-6xl px-6 pb-6 md:px-12 md:pb-10">
        <h2 className="mb-6 font-serif text-3xl font-semibold italic text-primary md:text-4xl">Past events</h2>
        <ul className="scrollbar-hide -mx-6 flex snap-x gap-4 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {e.pastEvents.map((p) => (
            <li key={p.title + p.edition} className="relative w-64 flex-none snap-start overflow-hidden rounded-3xl md:w-auto">
              <img src={p.src} alt={p.alt} loading="lazy" className="aspect-[4/5] w-full object-cover opacity-80" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5 pt-16">
                <h3 className="font-serif text-2xl font-semibold italic text-primary">{p.title}</h3>
                <p className="font-medium text-foreground/85">{p.edition}{p.when && `, ${p.when}`}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section className="mx-auto max-w-6xl px-6 pb-6 md:px-12 md:pb-10">
        <h2 className="mb-2 font-serif text-3xl font-semibold italic text-primary md:text-4xl">Contact us</h2>
        <p className="mb-6 font-medium text-foreground/80">Questions about tickets or the event? Call or WhatsApp any of us.</p>
        <ul className="grid gap-4 md:grid-cols-3">
          {e.contacts.map((c) => (
            <li key={c.phone} className="glass-strong rounded-3xl p-5">
              <p className="text-lg font-bold">{c.name}</p>
              <p className="mb-4 font-medium text-foreground/75">+91 {c.phone.slice(2, 7)} {c.phone.slice(7)}</p>
              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:+${c.phone}`} className="flex items-center justify-center gap-2 rounded-full border border-primary/40 py-3 font-semibold text-primary active:scale-95 md:hover:bg-white/10"><Phone className="h-4 w-4" /> Call</a>
                <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-semibold text-[#0b2e17] active:scale-95"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="py-10 text-center md:py-14">
        <img src="/infinite-events-logo.jpg" alt="Infinite Events" className="mx-auto h-20 w-auto rounded-lg mix-blend-lighten mb-4" />
        <p className="font-serif text-lg italic text-foreground/80">An Infinite Events experience</p>
        <a href={e.instagram} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
          <Instagram className="h-4 w-4" /> @infiniteevents2026
        </a>
      </footer>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border/50 bg-background/90 px-4 pt-3 backdrop-blur-xl md:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <BookButton className="w-full" />
      </div>
    </main>
  )
}
