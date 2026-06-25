import { cn } from "@/lib/utils";

/**
 * A stylized side-profile sneaker drawn entirely in SVG, tinted from a
 * product's colorway. No external asset — renders instantly, recolors freely.
 */
export function SneakerMark({
  primary = "#e23744",
  accent = "#1b1b1f",
  sole = "#f5f5f0",
  className,
}: {
  primary?: string;
  accent?: string;
  sole?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 256 150"
      className={cn("h-full w-full", className)}
      style={{ filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.55))" }}
      aria-hidden
    >
      {/* sole */}
      <path
        d="M22 112 C18 121 25 128 38 128 L224 128 C241 128 249 119 242 108 C238 114 230 114 221 114 L40 114 C31 114 26 114 22 112 Z"
        fill={sole}
      />
      {/* midsole highlight */}
      <path
        d="M26 106 C24 112 30 116 42 116 L222 116 C234 116 240 112 238 106 C234 110 226 110 218 110 L42 110 C34 110 30 110 26 106 Z"
        fill="#ffffff"
        opacity="0.85"
      />
      {/* upper body */}
      <path
        d="M30 110 L34 72 C35 60 46 53 60 55 C67 56 70 63 76 67 C82 70 88 70 96 68 C92 62 96 55 110 53 C138 48 160 56 188 66 C210 73 228 84 238 96 C243 102 242 108 234 110 Z"
        fill={primary}
      />
      {/* heel counter */}
      <path
        d="M34 72 C35 60 46 53 60 55 C58 64 56 80 56 96 L40 96 C36 88 33 80 34 72 Z"
        fill={accent}
        opacity="0.9"
      />
      {/* toe cap */}
      <path
        d="M188 66 C210 73 228 84 238 96 C243 102 242 108 234 110 L196 110 C196 92 192 78 188 66 Z"
        fill={accent}
        opacity="0.65"
      />
      {/* accent swoosh stripe */}
      <path
        d="M70 100 C108 80 150 78 206 92 C150 86 112 90 78 104 Z"
        fill={accent}
        opacity="0.85"
      />
      {/* laces */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={104 + i * 20}
          y={62 - i * 1.5}
          width="13"
          height="4"
          rx="2"
          transform={`rotate(-14 ${110 + i * 20} ${64 - i * 1.5})`}
          fill="#fafafa"
          opacity="0.9"
        />
      ))}
    </svg>
  );
}
