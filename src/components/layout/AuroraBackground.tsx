/** Clean, near-white page backdrop with a whisper of gray at the top. */
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      style={{
        background:
          "radial-gradient(120% 60% at 50% -10%, #f5f5f7 0%, #ffffff 60%)",
      }}
    />
  );
}
