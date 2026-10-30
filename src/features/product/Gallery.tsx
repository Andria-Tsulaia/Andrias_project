import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { t } from "@/content/ka";
import { cn } from "@/lib/utils";

type GalleryProps = {
  title: string;
  image?: string;
  images?: string[];
};

/** გალერეა — სურათების რაოდენობა სერვერიდან მოდის (ყოველთვის არ არის 5) */
export function Gallery({ title, image, images }: GalleryProps) {
  const gallery = (images?.length ? images : image ? [image] : []).filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!gallery.length) {
    return <div className="aspect-square w-full rounded-lg border border-border bg-muted" />;
  }

  const total = gallery.length;
  const index = Math.min(activeIndex, total - 1);

  const go = (next: number) => setActiveIndex((next + total) % total);

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX ?? null;
          if (start === null || end === null) return;
          if (Math.abs(end - start) > 40) go(end < start ? index + 1 : index - 1);
          touchStartX.current = null;
        }}
      >
        <img
          src={gallery[index]}
          alt={t.product.galleryImage(title, index + 1, total)}
          width={700}
          height={700}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="size-full object-cover"
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={t.product.prevImage}
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground transition-colors hover:bg-card"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={t.product.nextImage}
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground transition-colors hover:bg-card"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <ul className="flex flex-wrap gap-2" aria-label={t.product.galleryImage(title, index + 1, total)}>
          {gallery.map((source, thumbIndex) => (
            <li key={`${source}-${thumbIndex}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(thumbIndex)}
                aria-label={t.product.galleryImage(title, thumbIndex + 1, total)}
                aria-current={thumbIndex === index}
                className={cn(
                  "size-16 overflow-hidden rounded-md border-2 bg-muted transition-colors",
                  thumbIndex === index ? "border-primary" : "border-transparent hover:border-border",
                )}
              >
                <img src={source} alt="" width={64} height={64} className="size-full object-cover" loading="lazy" decoding="async" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
