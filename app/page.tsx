import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/layout/Footer'
import ScrollAnimationInit from '@/components/layout/ScrollAnimationInit'
import { Scroller } from '@/components/ui/scroller'
import { createSupabaseServerClient } from '@/lib/supabase'
import type { MenuItem } from '@/types/index'

async function getFeaturedItems(): Promise<MenuItem[]> {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase
    .from('menu_items')
    .select('*, category:categories(name, slug)')
    .eq('is_available', true)
    .eq('is_sold_out', false)
    .limit(8)
  return (data as MenuItem[]) ?? []
}

export default async function LandingPage() {
  const featured = await getFeaturedItems()

  return (
    <>
      <ScrollAnimationInit />
      <main>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          {/* Background image */}
          <Image
            src="/images/1.jpg"
            alt="Brews Lee café"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-7">
            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/images/Logo.png"
                alt="Brews Lee"
                width={220}
                height={88}
                className="drop-shadow-lg"
                priority
              />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#C9B59C]">
              Coffee &bull; Tea &bull; Milktea
            </p>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight drop-shadow-md">
              Every cup tells<br className="hidden sm:block" /> a story.
            </h1>

            <p className="text-base sm:text-lg text-white/75 max-w-lg mx-auto leading-relaxed">
              Your neighborhood coffee shop in Palawan. Handcrafted drinks, warm meals, and a space that feels like home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C9B59C] hover:bg-[#b8a08a] text-[#1C1209] font-semibold rounded-full transition-all duration-200 text-sm"
              >
                Order Now
              </Link>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-3.5 border border-white/40 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-200 text-sm backdrop-blur-sm"
              >
                Our Story
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
            <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-white/30 animate-pulse" />
          </div>
        </section>

        {/* ── ABOUT ─────────────────────────────────────────────────────── */}
        <section id="about" className="py-24 bg-[var(--color-subtle)] dark:bg-espresso-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Images column */}
            <div className="animate-on-scroll relative">
              {/* Main storefront image */}
              <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/About Us Image.png"
                  alt="Brews Lee storefront"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Owner card — overlapping bottom-right */}
              <div className="absolute -bottom-8 -right-4 sm:right-0 w-40 h-52 rounded-2xl overflow-hidden shadow-2xl border-4 border-[var(--color-subtle)] dark:border-espresso-800">
                <Image
                  src="/images/OwnerOfBrewsLee.png"
                  alt="Owner of Brews Lee"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* Text column */}
            <div className="space-y-6 pt-8 lg:pt-0">
              <p className="animate-on-scroll text-xs font-semibold uppercase tracking-[0.25em] text-[#C9B59C]">
                Our Story
              </p>
              <h2 className="animate-on-scroll delay-100 font-serif text-4xl sm:text-5xl font-semibold text-espresso-900 dark:text-cream-100 leading-tight">
                More than coffee.<br />A place to belong.
              </h2>
              <p className="animate-on-scroll delay-200 text-stone-500 dark:text-stone-400 leading-relaxed">
                Brews Lee started as a small corner shop with a big dream — to be the spot where mornings feel better, conversations flow freely, and every order feels personal. We source our beans carefully and craft every drink with intention.
              </p>
              <p className="animate-on-scroll delay-300 text-stone-500 dark:text-stone-400 leading-relaxed">
                From classic espresso to our signature lattes and hearty rice meals, we have something for everyone. Come as you are. Stay as long as you need.
              </p>
              <div className="animate-on-scroll delay-400 grid grid-cols-3 gap-6 pt-4 border-t border-[var(--color-muted)] dark:border-espresso-700">
                {[
                  { value: '50+', label: 'Menu Items' },
                  { value: '4.9', label: 'Avg Rating' },
                  { value: '3 yrs', label: 'Serving You' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center pt-4">
                    <p className="font-serif text-3xl font-bold text-espresso-900 dark:text-cream-100">{stat.value}</p>
                    <p className="text-xs text-stone-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CRAFT STRIP ───────────────────────────────────────────────── */}
        <section className="py-20 bg-[var(--color-base)] dark:bg-espresso-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
            <div className="text-center space-y-3">
              <p className="animate-on-scroll text-xs font-semibold uppercase tracking-[0.25em] text-[#C9B59C]">
                The Craft
              </p>
              <h2 className="animate-on-scroll delay-100 font-serif text-4xl sm:text-5xl font-semibold text-espresso-900 dark:text-cream-100">
                Made with intention.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { src: '/images/2.jpg', alt: 'Espresso extraction', label: 'Precision Extraction' },
                { src: '/images/9.jpg', alt: 'Barista tamping', label: 'Expert Tamping' },
                { src: '/images/10.jpg', alt: 'Latte art pour', label: 'Latte Artistry' },
              ].map(({ src, alt, label }, i) => (
                <div
                  key={src}
                  className={`animate-on-scroll delay-${(i + 1) * 100} group relative h-80 rounded-2xl overflow-hidden`}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <p className="absolute bottom-4 left-4 text-sm font-medium text-white">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE BANNER ──────────────────────────────────────────────── */}
        <section className="relative h-80 sm:h-96 flex items-center justify-center overflow-hidden">
          <Image
            src="/images/4.jpg"
            alt="Coffee café ambiance"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/50" />
          <blockquote className="relative z-10 text-center px-6 max-w-2xl">
            <p className="font-serif text-2xl sm:text-3xl font-semibold text-white leading-snug italic">
              &ldquo;Sometimes, having coffee with your friend is all the therapy you need.&rdquo;
            </p>
          </blockquote>
        </section>

        {/* ── FAN FAVORITES (horizontal scroller) ──────────────────────── */}
        <section id="menu-preview" className="py-20 bg-[var(--color-base)] dark:bg-espresso-900">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="px-4 sm:px-6 flex items-end justify-between mb-8">
              <div className="space-y-1.5">
                <p className="animate-on-scroll text-xs font-semibold uppercase tracking-[0.25em] text-[#C9B59C]">
                  What we serve
                </p>
                <h2 className="animate-on-scroll delay-100 font-serif text-3xl sm:text-4xl font-semibold text-espresso-900 dark:text-cream-100">
                  Fan Favorites
                </h2>
                <p className="animate-on-scroll delay-200 text-sm text-stone-500 dark:text-stone-400">
                  Our most-loved drinks and bites, made fresh every day.
                </p>
              </div>
              <Link
                href="/menu"
                className="shrink-0 text-sm font-medium text-[#C9B59C] hover:text-[#1C1209] dark:hover:text-cream-100 transition-colors flex items-center gap-1 pb-0.5"
              >
                View Full Menu
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Scroller */}
            {featured.length > 0 ? (
              <Scroller
                overflow="x"
                withButtons
                scrollAmount={340}
                className="px-4 sm:px-6"
                containerClassName="pb-4"
              >
                {featured.map((item) => (
                  <Link
                    key={item.id}
                    href="/menu"
                    className="group shrink-0 w-52 flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                    style={{ backgroundColor: '#EFE9E3', border: '1px solid #D9CFC7' }}
                  >
                    {/* Image */}
                    <div
                      className="h-36 relative overflow-hidden"
                      style={{ backgroundColor: '#D9CFC7' }}
                    >
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#C9B59C' }}>
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3.5 space-y-0.5 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#C9B59C' }}>
                        {(item.category as { name: string } | undefined)?.name ?? ''}
                      </p>
                      <p className="text-sm font-semibold leading-snug" style={{ color: '#1C1209' }}>
                        {item.name}
                      </p>
                      <p className="text-sm font-bold pt-1" style={{ color: '#C9B59C' }}>
                        ₱{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </Scroller>
            ) : (
              <div className="px-4 sm:px-6 py-16 text-center text-sm text-stone-400">
                Menu coming soon.
              </div>
            )}
          </div>
        </section>

        {/* ── PHOTO GALLERY STRIP ───────────────────────────────────────── */}
        <section className="py-20 bg-[var(--color-subtle)] dark:bg-espresso-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="animate-on-scroll text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9B59C]">The Experience</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-espresso-900 dark:text-cream-100">
                Life at Brews Lee
              </h2>
            </div>

            {/* Top row: 3 images */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { src: '/images/5.jpg',  alt: 'Iced coffee',        className: 'h-48 sm:h-64' },
                { src: '/images/7.jpg',  alt: 'Espresso machine',   className: 'h-48 sm:h-64' },
                { src: '/images/11.jpg', alt: 'Pour over coffee',   className: 'h-48 sm:h-64' },
              ].map(({ src, alt, className }) => (
                <div key={src} className={`animate-on-scroll relative ${className} rounded-2xl overflow-hidden`}>
                  <Image src={src} alt={alt} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>

            {/* Bottom row: 2 images */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { src: '/images/8.jpg', alt: 'Coffee with laptop', className: 'h-52 sm:h-72' },
                { src: '/images/3.jpg', alt: 'Pastries display',   className: 'h-52 sm:h-72' },
              ].map(({ src, alt, className }) => (
                <div key={src} className={`animate-on-scroll relative ${className} rounded-2xl overflow-hidden`}>
                  <Image src={src} alt={alt} fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="relative py-28 overflow-hidden">
          <Image
            src="/images/6.jpg"
            alt="Coffee neon sign"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 max-w-2xl mx-auto px-4 text-center space-y-6">
            <h2 className="animate-on-scroll font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Ready to order?
            </h2>
            <p className="animate-on-scroll delay-100 text-white/70 text-base sm:text-lg">
              Skip the line. Order online and pick up when it is ready.
            </p>
            <Link
              href="/menu"
              className="animate-on-scroll delay-200 inline-flex items-center gap-2 px-8 py-3.5 bg-[#C9B59C] hover:bg-[#b8a08a] text-[#1C1209] font-semibold rounded-full transition-all duration-200 text-sm"
            >
              Start Your Order
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
