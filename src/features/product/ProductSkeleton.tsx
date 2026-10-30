import { Skeleton } from "@/components/ui/skeleton";

/** პროდუქტის გვერდის ჩონჩხი — გალერეა, სათაური და ფასი თავიდანვე იტევს ადგილს */
export function ProductSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
}
