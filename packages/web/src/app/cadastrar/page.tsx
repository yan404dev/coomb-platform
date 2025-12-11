import { Suspense } from "react";
import { Header } from "@/shared/components";
import { RegisterForm } from "./_components/register-form";

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header nav />

      <div className="flex flex-1 items-center justify-between px-4 md:px-24">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md px-4 md:px-0">
            <Suspense fallback={null}>
              <RegisterForm />
            </Suspense>
          </div>
        </div>

        <div className="hidden lg:flex w-[40%] items-center justify-center">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-2xl"
          >
            <source src="/login-coomb.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
}
