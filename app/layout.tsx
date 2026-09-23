import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist_Mono, Newsreader, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
})
const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
})
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const desc = "Raas Garba Season 3 by Infinite Events. Friday, 16 October 2026, 6 PM at JDR Hotel, Sundargarh. Star guest Ulka Gupta. DJ Dev on the console. Tickets ₹599, kids ₹350."

export const metadata: Metadata = {
  title: "Raas Garba Season 3 | Infinite Events",
  description: desc,
  openGraph: {
    title: "Raas Garba Season 3",
    description: desc,
    type: "website",
    images: [{ url: "/star/ulka-gupta-1.jpg", width: 1200, height: 1600, alt: "Ulka Gupta at Raas Garba Season 3" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raas Garba Season 3",
    description: desc,
    images: ["/star/ulka-gupta-1.jpg"],
  },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
}

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#3A0A12" }
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_newsreader.variable} ${_spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
