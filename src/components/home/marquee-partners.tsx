export function MarqueePartners() {
  const brands = [
    "ZPHC",
    "SUNDOWN NATURALS",
    "GOOD ENERGY",
    "LANDERLAN",
    "CATEDRAL",
    "INDUFAR",
    "ETICOS",
  ];
  const doubled = [...brands, ...brands];

  return (
    <section className="max-w-[1400px] mx-auto px-4 mt-6 md:mt-8 overflow-hidden border-y border-[var(--bg-border)] py-3 bg-[var(--bg)] relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--bg)] to-transparent z-10 pointer-events-none" />
      <div
        className="flex items-center gap-12 md:gap-20 opacity-30 grayscale font-bold text-base md:text-lg tracking-widest uppercase text-[var(--text-muted)] animate-marquee w-max"
        // Pause the marquee when scrolled off-screen so the GPU stops
        // recomposing frames for an invisible animation.
        data-pausable
      >
        {doubled.map((b, i) => (
          <span key={`${b}-${i}`}>{b}</span>
        ))}
      </div>
    </section>
  );
}
