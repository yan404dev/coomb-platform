import { Footer, Header, LogoHero } from "@/components";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const steps = [
  {
    number: 1,
    title: "Faça upload do seu currículo em PDF ou conecte seu LinkedIn",
  },
  {
    number: 2,
    title: "Confirme suas informações básicas (nome, email e telefone)",
  },
  {
    number: 3,
    title: "Nossa IA extrai e otimiza suas experiências automaticamente",
  },
  {
    number: 4,
    title: "Revise e personalize o que a IA gerou em poucos cliques",
  },
  {
    number: 5,
    title: "Baixe seu currículo pronto e otimizado para ATS",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header nav={true} />

      <section
        className="mt-16 sm:mt-32 mb-24 sm:mb-40 items-center mx-auto grid grid-cols-12 gap-6 px-4 sm:px-8 xl:max-w-screen-2xl w-full max-w-[calc(var(--breakpoint-xl)*10/12)]"
        aria-labelledby="feature-page-hero"
      >
        <div className="col-span-12 text-center sm:col-span-8 sm:col-start-3">
          <h1 className="text-balance text-gray-700 text-[clamp(2rem,3.0047vw+1.29577rem,4rem)] tracking-[-.03em] leading-[clamp(2.2rem,calc(1.5662rem+2.70423vw),4rem)]">
            Começar a usar a Coomb
          </h1>
          <div className="mt-8 flex w-fit flex-wrap gap-2 mx-auto justify-center">
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                size: "lg",
              })}
            >
              Experimentar a Coomb
            </Link>
          </div>
        </div>

        <div className="col-span-12 -order-1 sm:col-span-8 sm:col-start-3">
          <div className="mx-auto w-20 h-20">
            <LogoHero />
          </div>
        </div>
      </section>

      <section className="mx-auto grid grid-cols-12 gap-6 px-4 sm:px-8 xl:max-w-screen-2xl w-full max-w-[calc(var(--breakpoint-xl)*10/12)] pb-24 sm:pb-40">
        <div className="scroll-mt-h-[calc(.25rem*18)] flex w-full flex-col items-start col-span-12 gap-10 xl:col-span-10 xl:col-start-2">
          <div className="w-full">
            <ol className="grid gap-x-6 gap-y-11 sm:grid-cols-2 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.number}>
                  <figure className="mx-auto max-w-100">
                    <div className="h-full w-full">
                      <div className="mx-auto h-[10.0625rem] w-full overflow-hidden rounded-2xl aspect-square bg-gray-200"></div>
                    </div>
                    <figcaption className="text-mkt-p2 mt-6 text-center text-balance">
                      <h2 className="mb-3 h-10 text-[clamp(1.5rem,.56338vw+1.36796rem,1.875rem)] font-medium tracking-[-.01em] leading-[clamp(1.98rem,calc(1.8057rem+.74366vw),2.475rem)]">
                        {step.number}
                      </h2>
                      <p className="font-semibold mb-2">{step.title}</p>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto grid grid-cols-12 gap-6 px-4 sm:px-8 xl:max-w-screen-2xl w-full max-w-[calc(var(--breakpoint-xl)*10/12)] mt-22 sm:mt-32">
        <div className="scroll-mt-h-[calc(.25rem*18)]  flex w-full flex-col items-center col-span-12 gap-10 xl:col-span-10 xl:col-start-2">
          <div className="flex flex-col gap-5 text-balance items-center max-w-[700px]">
            <h2 className="text-xl sm:text-[clamp(1.5rem,0.56338vw+1.36796rem,1.875rem)] font-medium tracking-tight leading-[clamp(1.98rem,calc(1.8057rem+0.74366vw),2.475rem)] text-center">
              <p>
                Precisa de mais ajuda? Visite nosso{" "}
                <Link
                  href="/ajuda"
                  className="hover:text-token-text-primary/60 underline underline-offset-2 transition-colors"
                >
                  grupo de suporte e marketing
                </Link>{" "}
                e receba ajuda da comunidade.
              </p>
            </h2>
          </div>
        </div>
      </section>

      <section className="mx-auto grid grid-cols-12 gap-6 px-4 sm:px-8 xl:max-w-screen-2xl bg-[#e8e8e8] rounded-2xl py-16 w-[calc(100%-2*1rem)] sm:w-[calc(100%-2*2rem)] mt-22 sm:mt-32">
        <div className="w-full col-span-full xl:col-span-10 xl:col-start-2 flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-start flex-wrap">
          <div className="max-w-[600px]">
            <h2 className="text-[clamp(1.5rem,0.56338vw+1.36796rem,1.875rem)] font-medium tracking-[-0.01em] leading-[clamp(1.98rem,calc(1.8057rem+0.74366vw),2.475rem)] text-center">
              Obtenha Coomb AI PRO
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/assinatura"
              className={buttonVariants({
                variant: "default",
                size: "lg",
              })}
            >
              Assinar agora
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
