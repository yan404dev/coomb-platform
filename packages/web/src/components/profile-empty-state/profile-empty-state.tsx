import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { FileText, Sparkles } from "lucide-react";

export const ProfileEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Card className="w-full max-w-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="w-10 h-10 text-[#03A16C]" />
          </div>
        </div>

        <CardTitle className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Bem-vindo ao Coomb!
        </CardTitle>

        <CardDescription className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
          Você está a poucos passos de criar um currículo profissional impulsionado por IA.
          Vamos começar preenchendo suas informações básicas.
        </CardDescription>

        <CardContent className="px-0 space-y-4">
          <div className="grid gap-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#03A16C]">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Complete seu perfil</h3>
                <p className="text-sm text-gray-600">Adicione suas informações pessoais, experiências e habilidades</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#03A16C]">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Otimize com IA</h3>
                <p className="text-sm text-gray-600">Nossa IA irá analisar e sugerir melhorias para seu currículo</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-[#03A16C]">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Baixe e aplique</h3>
                <p className="text-sm text-gray-600">Gere seu currículo em PDF e comece a aplicar para vagas</p>
              </div>
            </div>
          </div>

          <Link href="/curriculo" className="block">
            <Button className="w-full h-12 bg-[#03A16C] hover:bg-[#028A5A] text-white text-base font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Começar a preencher meu currículo
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
