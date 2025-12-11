"use client";

import { useState, lazy, Suspense } from "react";
import { DASHBOARD_SUGGESTIONS } from "@/shared/constants/dashboard-suggestions";
import { useUser } from "@/shared/hooks/use-user";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardInput } from "./_components/dashboard-input";
import { useDashboardModel } from "./_hooks/use-dashboard";

const DashboardSidebar = lazy(() =>
  import("./_components/dashboard-sidebar").then((mod) => ({
    default: mod.DashboardSidebar,
  }))
);

const OptimizationChat = lazy(() =>
  import("./_components/optimization-chat").then((mod) => ({
    default: mod.OptimizationChat,
  }))
);

const SuggestionPopover = lazy(() =>
  import("./_components/suggestion-popover").then((mod) => ({
    default: mod.SuggestionPopover,
  }))
);

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState<string>("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const stored = sessionStorage.getItem("currentChatId");
      return stored || null;
    } catch {
      return null;
    }
  });

  const { user, isLoading } = useUser();
  const {
    messages,
    isLoading: isLoadingMessages,
    isPending,
    firstName,
    handleSend,
    handleNewConversation,
    handleSuggestionSelect,
  } = useDashboardModel({
    currentChatId,
    setCurrentChatId,
  });

  const handleSuggestionClick = (prompt: string) => {
    setSuggestionText(prompt);
  };

  return (
    <div className="flex w-full h-[100dvh] min-h-[100svh] lg:h-screen bg-background relative overflow-hidden">
      <Suspense fallback={null}>
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewConversation={handleNewConversation}
          currentChatId={currentChatId}
          onChatSelect={(chatId) => setCurrentChatId(chatId)}
        />
      </Suspense>

      <main
        className={`flex w-full flex-1 min-h-0 flex-col transition-all duration-300 ml-0 ${
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <DashboardHeader />

        <div className="flex-1 flex flex-col py-8 px-4 overflow-y-auto">
          {isLoading || isLoadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4 space-y-4 w-full max-w-3xl">
                <Skeleton className="h-12 w-64 mx-auto" />
                <Skeleton className="h-6 w-48 mx-auto" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <h1 className="text-dashboard-title">
                  {user ? (
                    <>
                      Olá, <span className="font-semibold">{firstName}!</span>
                    </>
                  ) : (
                    <>
                      Conheça a Coomb,
                      <br />
                      sua assistente de{" "}
                      <span className="font-semibold">
                        carreira inteligente!
                      </span>
                    </>
                  )}
                </h1>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="flex-1 flex items-center justify-center">
                  <Skeleton className="h-32 w-full max-w-3xl" />
                </div>
              }
            >
              <OptimizationChat messages={messages} isPending={isPending} />
            </Suspense>
          )}
        </div>

        <div className="sticky bottom-0 bg-background px-4 py-6 sm:px-6 sm:py-8">
          <div className="w-full max-w-3xl mx-auto space-y-4">
            <DashboardInput
              onSend={handleSend}
              suggestionText={suggestionText}
              onSuggestionApplied={() => setSuggestionText("")}
              isLoading={isPending}
            />

            <Suspense fallback={null}>
              <div className="flex flex-wrap justify-center gap-2">
                {DASHBOARD_SUGGESTIONS.map((category) => {
                  const Icon = category.icon;
                  return (
                    <SuggestionPopover
                      key={category.id}
                      icon={<Icon className="w-4 h-4" />}
                      label={category.label}
                      title={category.title}
                      suggestions={category.suggestions}
                      onSelect={handleSuggestionClick}
                    />
                  );
                })}
              </div>
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
