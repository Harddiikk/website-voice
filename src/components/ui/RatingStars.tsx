import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  reviews,
  className,
}: {
  rating: number;
  reviews?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={13}
            className={
              i < Math.round(rating)
                ? "fill-[var(--gold)] text-[var(--gold)]"
                : "text-[var(--text-subtle)]"
            }
          />
        ))}
      </div>
      <span className="font-tech text-xs text-[var(--text-muted)]">
        {rating.toFixed(1)}
        {reviews != null && <span className="text-[var(--text-subtle)]"> ({reviews})</span>}
      </span>
    </div>
  );
}
