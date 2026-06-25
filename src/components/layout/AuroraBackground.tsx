/** Fixed, full-page ambient aurora — layered drifting glows behind all content. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--bg)]">
      <div className="absolute inset-0 aurora" />
      <div
        className="animate-drift absolute -left-[10%] top-[-10%] h-[55vh] w-[55vh] rounded-full blur-[120px]"
        style={{ background: "rgba(124,92,255,0.30)" }}
      />
      <div
        className="animate-drift absolute right-[-5%] top-[10%] h-[45vh] w-[45vh] rounded-full blur-[120px]"
        style={{ background: "rgba(34,211,238,0.18)", animationDelay: "-6s" }}
      />
      <div
        className="animate-drift absolute bottom-[-15%] left-[30%] h-[50vh] w-[50vh] rounded-full blur-[140px]"
        style={{ background: "rgba(255,111,181,0.16)", animationDelay: "-11s" }}
      />
      {/* subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black, transparent 75%)",
        }}
      />
    </div>
  );
}
