import { Header } from "@/shared/components";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <>
      <Header nav />

      <div className="h-64 md:h-72 bg-muted animate-pulse" />

      <div className="w-full -mt-12 md:-mt-20">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8">
              <main className="space-y-6 min-w-0">
                <div className="bg-background rounded-xl p-6 shadow-sm border border-border">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-24 w-24 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-4">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  {[1, 2].map((i) => (
                    <div key={i} className="space-y-2 pt-4 border-t border-border first:border-0 first:pt-0">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>

                <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-8 w-20 rounded-full" />
                    ))}
                  </div>
                </div>
              </main>

              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-background rounded-xl p-6 shadow-sm border border-border space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-5 w-5" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
