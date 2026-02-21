"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Star,
  ChevronDown,
  Clapperboard,
  CalendarDays,
  Search,
  User,
  Users,
  Zap,
  Filter,
} from "lucide-react";

// ============================================================
// Scroll animation hook
// ============================================================

function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document
      .querySelectorAll(".fade-up")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// ============================================================
// Mini star (used in mock UIs)
// ============================================================

function MiniStar({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <Star
      className={`${className ?? "w-2.5 h-2.5"} ${
        filled ? "fill-star text-star" : "fill-none text-muted/30"
      }`}
    />
  );
}

// ============================================================
// Phone mockup for hero section
// ============================================================

function MockFeedCardSmall({
  initials,
  name,
  title,
  stars,
  comment,
  gradient,
  time,
}: {
  initials: string;
  name: string;
  title: string;
  stars: number;
  comment?: string;
  gradient: string;
  time: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-2.5 mb-2 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center text-[8px] font-medium text-muted shrink-0">
          {initials}
        </div>
        <span className="text-[10px] font-medium text-foreground">{name}</span>
        <span className="text-[8px] text-muted ml-auto">{time}</span>
      </div>
      <div className="flex gap-2">
        <div
          className={`w-8 h-12 rounded shrink-0 bg-gradient-to-br ${gradient}`}
        />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold text-foreground truncate">
            {title}
          </div>
          <div className="flex gap-px mt-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <MiniStar key={i} filled={i <= stars} />
            ))}
          </div>
          {comment && (
            <div className="text-[9px] text-muted mt-1 line-clamp-1">
              {comment}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] lg:w-[300px]">
      {/* Glow */}
      <div className="absolute -inset-4 bg-accent/5 rounded-[52px] blur-2xl" />

      {/* Frame */}
      <div className="relative rounded-[40px] border-2 border-border/60 bg-background p-1.5 shadow-2xl">
        {/* Dynamic Island */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

        {/* Screen */}
        <div className="rounded-[34px] overflow-hidden bg-background pt-10 pb-14 px-3">
          <div className="text-xs font-bold text-foreground mb-3">Feed</div>

          <MockFeedCardSmall
            initials="S"
            name="Sarah"
            title="Severance"
            stars={5}
            comment="Everyone needs to watch this"
            gradient="from-cyan-800 to-blue-950"
            time="2h"
          />
          <MockFeedCardSmall
            initials="M"
            name="Marco"
            title="The Bear"
            stars={4}
            comment="Intense but brilliant"
            gradient="from-orange-700 to-red-950"
            time="5h"
          />
          <MockFeedCardSmall
            initials="A"
            name="Alex"
            title="Dune: Part Two"
            stars={5}
            gradient="from-amber-600 to-yellow-950"
            time="1d"
          />
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-around py-2.5 border-t border-border/40">
          <Clapperboard className="w-3.5 h-3.5 text-accent" />
          <CalendarDays className="w-3.5 h-3.5 text-muted/40" />
          <Search className="w-3.5 h-3.5 text-muted/40" />
          <Users className="w-3.5 h-3.5 text-muted/40" />
          <User className="w-3.5 h-3.5 text-muted/40" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Feature section mock UIs
// ============================================================

function MockFeedLarge() {
  const items = [
    {
      initials: "S",
      name: "Sarah Chen",
      title: "Severance",
      stars: 5,
      comment: "The finale broke me. Everyone needs to watch this.",
      gradient: "from-cyan-800 to-blue-950",
      time: "2h ago",
    },
    {
      initials: "M",
      name: "Marco Rossi",
      title: "The Bear",
      stars: 4,
      comment: "Season 3 is the best yet. Intense but brilliant.",
      gradient: "from-orange-700 to-red-950",
      time: "5h ago",
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 max-w-sm mx-auto lg:mx-0 space-y-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="p-3 bg-background rounded-lg border border-border"
        >
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-7 h-7 rounded-full bg-card-hover flex items-center justify-center text-[10px] font-semibold text-muted shrink-0">
              {item.initials}
            </div>
            <span className="text-sm font-medium text-foreground">
              {item.name}
            </span>
            <span className="text-xs text-muted ml-auto">{item.time}</span>
          </div>
          <div className="flex gap-3">
            <div
              className={`w-12 h-[72px] rounded-md shrink-0 bg-gradient-to-br ${item.gradient}`}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-foreground">
                {item.title}
              </div>
              <div className="flex gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <MiniStar
                    key={i}
                    filled={i <= item.stars}
                    className="w-3.5 h-3.5"
                  />
                ))}
              </div>
              <p className="text-xs text-muted mt-1.5 line-clamp-2">
                {item.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MockStreamingFilter() {
  const services = [
    { name: "Netflix", active: true },
    { name: "Disney+", active: false },
    { name: "Max", active: true },
    { name: "Apple TV+", active: false },
    { name: "Hulu", active: true },
  ];

  const posters = [
    { gradient: "from-red-800 to-red-950", title: "Stranger Things" },
    { gradient: "from-purple-800 to-purple-950", title: "Wednesday" },
    { gradient: "from-teal-700 to-teal-950", title: "The Last of Us" },
    { gradient: "from-blue-700 to-blue-950", title: "Ripley" },
    { gradient: "from-green-700 to-green-950", title: "Fallout" },
    { gradient: "from-pink-700 to-pink-950", title: "Shogun" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-5 max-w-sm mx-auto lg:mx-0">
      <div className="flex flex-wrap gap-2 mb-4">
        {services.map((s) => (
          <span
            key={s.name}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              s.active
                ? "border-accent/50 bg-accent/10 text-foreground"
                : "border-border text-muted"
            }`}
          >
            {s.name}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {posters.map((p) => (
          <div
            key={p.title}
            className={`aspect-[2/3] rounded-lg bg-gradient-to-br ${p.gradient} flex items-end p-1.5`}
          >
            <span className="text-[8px] text-white/70 font-medium leading-tight">
              {p.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockCalendar() {
  const days = [
    { label: "Mon", day: 17 },
    { label: "Tue", day: 18, shows: ["Severance"] },
    { label: "Wed", day: 19 },
    { label: "Thu", day: 20, shows: ["The Bear", "Slow Horses"] },
    { label: "Fri", day: 21, shows: ["Stranger Things"] },
    { label: "Sat", day: 22 },
    { label: "Sun", day: 23 },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-5 max-w-sm mx-auto lg:mx-0">
      <div className="text-xs font-semibold text-foreground mb-4">
        This Week
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => (
          <div key={d.label} className="text-center">
            <div className="text-[9px] text-muted mb-1">{d.label}</div>
            <div
              className={`text-xs font-medium rounded-lg py-2 ${
                d.shows
                  ? "bg-accent/15 text-accent border border-accent/20"
                  : "text-muted"
              }`}
            >
              {d.day}
            </div>
            {d.shows && (
              <div className="mt-1 space-y-0.5">
                {d.shows.map((s) => (
                  <div
                    key={s}
                    className="text-[7px] text-accent/80 truncate leading-tight"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockCompatibility() {
  const friends = [
    { initials: "AK", name: "Alex Kim", pct: 92, color: "text-success" },
    { initials: "SJ", name: "Sarah Jones", pct: 78, color: "text-star" },
    { initials: "RM", name: "Ryan Murphy", pct: 45, color: "text-accent" },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-5 max-w-sm mx-auto lg:mx-0 space-y-3">
      {friends.map((f) => (
        <div
          key={f.initials}
          className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
        >
          <div className="w-9 h-9 rounded-full bg-card-hover flex items-center justify-center text-xs font-semibold text-muted shrink-0">
            {f.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground">{f.name}</div>
            <div className="text-xs text-muted">
              {f.pct >= 80 ? "Great" : f.pct >= 60 ? "Good" : "Different"} taste
              match
            </div>
          </div>
          <div className={`text-lg font-bold ${f.color}`}>{f.pct}%</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Sticky nav
// ============================================================

function StickyNav({ visible }: { visible: boolean }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg transition-all duration-300 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="text-sm font-bold text-foreground">
          Watch Circle
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-success text-black px-4 py-2 rounded-lg hover:bg-success/90 transition-colors"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// FAQ accordion
// ============================================================

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-medium text-foreground">
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-48 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-muted leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

// ============================================================
// Feature section layout helper
// ============================================================

function FeatureSection({
  label,
  title,
  description,
  mockUI,
  reverse,
}: {
  label: string;
  title: string;
  description: string;
  mockUI: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className={`fade-up ${reverse ? "lg:order-last" : ""}`}>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            {label}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            {description}
          </p>
        </div>
        <div
          className={`fade-up stagger-2 ${reverse ? "" : "lg:order-last"}`}
        >
          {mockUI}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main component
// ============================================================

export function LandingPage() {
  const [showNav, setShowNav] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Sticky nav trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowNav(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll reveal
  useScrollAnimations();

  const scrollToFeatures = () => {
    document
      .getElementById("problems")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const streamingServices = [
    "Netflix",
    "Disney+",
    "Max",
    "Apple TV+",
    "Prime Video",
    "Hulu",
    "Paramount+",
  ];

  const faqs = [
    {
      q: "How is this different from Letterboxd?",
      a: "Letterboxd is for film enthusiasts reviewing for strangers. Watch Circle is private — only your friends see your ratings, and you only see theirs. Plus, we filter everything by your streaming services so every recommendation is actually watchable.",
    },
    {
      q: "Do I need a lot of friends to use it?",
      a: "Not at all. Start with 2-3 friends and you'll already get great recommendations. You can invite anyone via WhatsApp or a share link — setup takes under a minute.",
    },
    {
      q: "What if my friends and I have different taste?",
      a: "That's where the compatibility score shines. You'll see a taste match percentage with each friend, so you know whose 5-star ratings to trust for horror, comedy, or whatever you're in the mood for.",
    },
    {
      q: "Which streaming services do you support?",
      a: "Netflix, Disney+, Hulu, Max, Apple TV+, Prime Video, Paramount+, and more. If you stream it, we probably support it.",
    },
    {
      q: "Is it free?",
      a: "Yes, completely free. No premium tiers, no ads, no catch.",
    },
  ];

  return (
    <>
      <StickyNav visible={showNav} />

      {/* ======================== HERO ======================== */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center py-20 px-6"
      >
        <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text column */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-[1.08]">
              Know what to watch{" "}
              <span className="text-accent">in seconds.</span>
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-muted max-w-lg leading-relaxed">
              See what your friends are rating, track shows together, and only
              discover content on services you already pay for.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-success text-black font-semibold px-7 py-3.5 rounded-xl text-base hover:bg-success/90 transition-colors shadow-lg shadow-success/20"
              >
                Get started — it&apos;s free
              </Link>
              <button
                onClick={scrollToFeatures}
                className="inline-flex items-center justify-center text-muted font-medium px-6 py-3.5 rounded-xl text-base hover:text-foreground hover:bg-card transition-colors border border-border"
              >
                See how it works
              </button>
            </div>

            {/* Streaming services */}
            <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2">
              <span className="text-xs text-muted/60 w-full mb-1">
                Works with your services
              </span>
              {streamingServices.map((s) => (
                <span key={s} className="text-sm text-muted/50 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Phone mockup */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ==================== PROBLEM SECTION ==================== */}
      <section id="problems" className="py-24 lg:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-up">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Finding something to watch shouldn&apos;t be this hard
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Algorithms don't know you",
                desc: "Streaming platforms optimize for engagement, not your taste. You deserve recommendations from people who actually know you.",
              },
              {
                icon: Users,
                title: "Strangers' reviews are noise",
                desc: "47,000 reviews from people you've never met won't tell you what your friends loved last weekend.",
              },
              {
                icon: Filter,
                title: "Half the recs you can't watch",
                desc: "Great recommendation, but it's only on a service you don't have. Watch Circle filters to what you can actually stream.",
              },
            ].map((card, i) => (
              <div
                key={card.title}
                className={`fade-up stagger-${i + 1} bg-card rounded-xl border border-border p-6 lg:p-8`}
              >
                <card.icon className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-muted leading-relaxed text-sm">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 lg:py-32 px-6 space-y-24 lg:space-y-40">
        <FeatureSection
          label="Social Feed"
          title="Your feed, your friends"
          description="See what the people you trust are watching and rating. No influencers. No sponsored posts. Just honest opinions from your actual circle."
          mockUI={<MockFeedLarge />}
        />

        <FeatureSection
          label="Smart Filtering"
          title="Filtered to what you can stream"
          description="Tell us your subscriptions. We'll only show content available on services you pay for. No more &ldquo;where do I watch this?&rdquo; frustration."
          mockUI={<MockStreamingFilter />}
          reverse
        />

        <FeatureSection
          label="Episode Calendar"
          title="Track shows together"
          description="Follow the series you're watching. See when new episodes drop. Know which friends are watching the same shows."
          mockUI={<MockCalendar />}
        />

        <FeatureSection
          label="Taste Match"
          title="Find your taste match"
          description="A compatibility score shows how aligned your taste is with each friend. 92% match? Trust their 5-star ratings blindly."
          mockUI={<MockCompatibility />}
          reverse
        />
      </section>

      {/* ======================== FAQ ======================== */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="fade-up text-3xl md:text-4xl font-semibold tracking-tight text-foreground text-center mb-12">
            Questions
          </h2>
          <div className="fade-up stagger-1">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-24 lg:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center fade-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Your next favorite show is one friend away.
          </h2>
          <p className="mt-6 text-lg text-muted">
            Set up in under a minute. Invite your first friend over WhatsApp.
          </p>
          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-success text-black font-semibold px-8 py-4 rounded-xl text-lg hover:bg-success/90 transition-colors shadow-lg shadow-success/20"
            >
              Get started — it&apos;s free
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted/60">
            No credit card. No spam. Just movies.
          </p>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted/60">
            &copy; {new Date().getFullYear()} Watch Circle
          </span>
          <div className="flex gap-6">
            <span className="text-sm text-muted/40">Terms</span>
            <span className="text-sm text-muted/40">Privacy</span>
          </div>
        </div>
      </footer>
    </>
  );
}
