import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Comparison } from "@/components/comparison"
import { Purpose } from "@/components/purpose"
import { Replay } from "@/components/replay"
import { BestCasts } from "@/components/best-casts"
import { FAQ } from "@/components/faq"
import { Contact } from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Comparison />
      <Purpose />
      <Replay />
      <BestCasts />
      <FAQ />
      <Contact />
    </main>
  )
}
