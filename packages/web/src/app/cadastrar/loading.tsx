import { Header } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegisterLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header nav />

      <div className="flex flex-1 items-center justify-between px-4 md:px-24">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md px-4 md:px-0">
            <div className="md:border md:border-border md:rounded-xl md:p-6 space-y-4 md:shadow-[var(--shadow-header)]">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-background text-foreground/60 text-xs">
                    ou
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full rounded-lg" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              <div className="text-center pt-2">
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex w-[40%] items-center justify-center">
          <Skeleton className="w-full aspect-video rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
