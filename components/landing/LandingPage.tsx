"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  Star,
  Clapperboard,
  CalendarDays,
  Search,
  Users,
  User,
  Tv,
  BarChart3,
} from "lucide-react";

// ============================================================
// Scroll animations
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
      { threshold: 0.15 }
    );
    document
      .querySelectorAll(".fade-up")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ============================================================
// Phone mockup
// ============================================================

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] lg:w-[320px]">
      <div className="absolute -inset-6 bg-accent/5 rounded-[60px] blur-3xl" />

      <div className="relative rounded-[44px] border-2 border-border/60 bg-background p-1.5 shadow-2xl">
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />

        <div className="rounded-[38px] overflow-hidden bg-background pt-10 pb-14 px-3">
          <div className="text-xs font-bold text-foreground mb-3">Feed</div>

          {[
            {
              initials: "S",
              name: "Sarah",
              title: "Severance",
              stars: 5,
              comment: "Everyone needs to watch this",
              gradient: "from-cyan-800 to-blue-950",
              time: "2h",
            },
            {
              initials: "M",
              name: "Marco",
              title: "The Bear",
              stars: 4,
              comment: "Intense but brilliant",
              gradient: "from-orange-700 to-red-950",
              time: "5h",
            },
            {
              initials: "A",
              name: "Alex",
              title: "Dune: Part Two",
              stars: 5,
              comment: "A masterpiece",
              gradient: "from-amber-600 to-yellow-950",
              time: "1d",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-card rounded-lg border border-border p-2.5 mb-2 last:mb-0"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-border flex items-center justify-center text-[8px] font-medium text-muted shrink-0">
                  {item.initials}
                </div>
                <span className="text-[10px] font-medium text-foreground">
                  {item.name}
                </span>
                <span className="text-[8px] text-muted ml-auto">
                  {item.time}
                </span>
              </div>
              <div className="flex gap-2">
                <div
                  className={`w-8 h-12 rounded shrink-0 bg-gradient-to-br ${item.gradient}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-foreground truncate">
                    {item.title}
                  </div>
                  <div className="flex gap-px mt-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-2.5 h-2.5 ${
                          i <= item.stars
                            ? "fill-star text-star"
                            : "fill-none text-muted/30"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[9px] text-muted mt-1 line-clamp-1">
                    {item.comment}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
// Main component
// ============================================================

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  useScrollAnimations();

  return (
    <>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-bold text-foreground tracking-tight">
            Watch Circle
          </span>
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
      </nav>

      {/* ======================== HERO ======================== */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center pt-14 px-6"
      >
        <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
              Your friends rate movies.
              <br />
              <span className="text-muted">You watch the good ones.</span>
            </h1>
            <p className="mt-5 text-lg text-muted max-w-md">
              A private feed of ratings from people you trust, filtered to your
              streaming services.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-success text-black font-semibold px-7 py-3.5 rounded-xl text-base hover:bg-success/90 transition-colors shadow-lg shadow-success/20"
              >
                Get started — it&apos;s free
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Star,
                title: "Rate together",
                desc: "You and your friends rate movies and shows. See what they loved.",
              },
              {
                icon: Tv,
                title: "Your services only",
                desc: "Every recommendation is on Netflix, Disney+, or whatever you have.",
              },
              {
                icon: BarChart3,
                title: "Taste match",
                desc: "See which friends share your taste. Trust their picks.",
              },
            ].map((item, i) => (
              <div key={item.title} className={`fade-up stagger-${i + 1}`}>
                <item.icon className="w-6 h-6 text-accent mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-md mx-auto text-center fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Your next favorite show is one friend away.
          </h2>
          <div className="mt-6">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-success text-black font-semibold px-7 py-3.5 rounded-xl text-base hover:bg-success/90 transition-colors shadow-lg shadow-success/20"
            >
              Get started — it&apos;s free
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted/50">
            Free forever. No credit card.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-muted/40">
            &copy; {new Date().getFullYear()} Watch Circle
          </span>
          <div className="flex gap-4">
            <span className="text-xs text-muted/30">Terms</span>
            <span className="text-xs text-muted/30">Privacy</span>
          </div>
        </div>
      </footer>
    </>
  );
}
