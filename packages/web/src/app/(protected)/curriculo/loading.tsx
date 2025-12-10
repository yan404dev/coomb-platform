import { Header } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

export default function CurriculumLoading() {
  return (
    <>
      <Header nav />
      <div className="px-4 md:px-8 lg:px-24 mx-auto container pt-28 pb-14">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          </aside>

          <main className="flex-1 space-y-6">
            <div className="bg-background rounded-xl p-6 border border-border">
              <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-8 w-28 mt-2" />
                </div>
              </div>
            </div>

            {[1, 2, 3].map((section) => (
              <div key={section} className="bg-background rounded-xl p-6 border border-border space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((field) => (
                    <div key={field} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
