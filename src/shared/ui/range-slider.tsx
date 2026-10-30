import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";
import { t } from "@/content/ka";

type RangeSliderProps = {
  value: [number, number];
  min: number;
  max: number;
  step?: number;
  ariaLabel: string;
  onValueChange: (value: [number, number]) => void;
  onValueCommit: (value: [number, number]) => void;
  className?: string;
};

const THUMB_CLASS =
  "block size-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * ორი thumb-იანი დიაპაზონის სლაიდერი (min + max).
 * shadcn-ის Slider მხოლოდ ერთ thumb-ს ხატავს, ამიტომ range ფილტრისთვის საკუთარი კომპონენტია საჭირო.
 */
export function RangeSlider({
  value,
  min,
  max,
  step = 1,
  ariaLabel,
  onValueChange,
  onValueCommit,
  className,
}: RangeSliderProps) {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center px-2.5 py-2", className)}
      value={value}
      min={min}
      max={max}
      step={step}
      minStepsBetweenThumbs={1}
      aria-label={ariaLabel}
      onValueChange={(next) => onValueChange([next[0], next[1]] as [number, number])}
      onValueCommit={(next) => onValueCommit([next[0], next[1]] as [number, number])}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={THUMB_CLASS} aria-label={`${ariaLabel} — ${t.common.minimum}`} />
      <SliderPrimitive.Thumb className={THUMB_CLASS} aria-label={`${ariaLabel} — ${t.common.maximum}`} />
    </SliderPrimitive.Root>
  );
}
