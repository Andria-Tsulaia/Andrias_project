import { Skeleton } from "@/components/ui/skeleton";

/** ბარათის ჩონჩხი — loading-ისას ბადის ლეიაუტი არ იცვლება */
export function ProductCardSkeleton() {
  return (
    <div className="surface-card flex h-full flex-col overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex min-h-[132px] flex-1 flex-col gap-2 p-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-auto h-6 w-28" />
      </div>
    </div>
  );
}
