import { Star } from "lucide-react";

import { t } from "@/content/ka";
import { cn } from "@/lib/utils";

type RatingStarsProps = {
  rating: number;
  reviewsCount?: number;
  className?: string;
};

/** რეიტინგი ვარსკვლავებით — ნახევარი ვარსკვლავიც აისახება */
export function RatingStars({ rating, reviewsCount, className }: RatingStarsProps) {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className="flex items-center" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => {
          const fill = Math.max(0, Math.min(1, clamped - index));
          return (
            <span key={index} className="relative inline-block size-4">
              <Star className="absolute inset-0 size-4 text-muted-foreground/40" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className="size-4 fill-star text-star" />
              </span>
            </span>
          );
        })}
      </span>
      <span className="text-xs text-muted-foreground">
        {clamped.toFixed(1)}
        {typeof reviewsCount === "number" ? ` ${t.product.reviews(reviewsCount)}` : ""}
      </span>
    </div>
  );
}
