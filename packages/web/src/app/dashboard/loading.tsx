import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex w-full h-[100dvh] min-h-[100svh] lg:h-screen bg-background relative overflow-hidden">
      <aside className="hidden md:flex w-16 flex-col border-r border-border bg-background">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </aside>

      <main className="flex w-full flex-1 min-h-0 flex-col ml-0 md:ml-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>

        <div className="flex-1 flex flex-col py-8 px-4 overflow-y-auto">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-4 space-y-4 w-full max-w-3xl">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-background px-4 py-6 sm:px-6 sm:py-8">
          <div className="w-full max-w-3xl mx-auto space-y-4">
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="flex justify-center gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
