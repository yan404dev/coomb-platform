import Image from "next/image";
import { Card } from "@/components/ui/card";

interface SidebarCurriculumProps {
  progressData: {
    title: string;
    subtitle: string;
    percentage: number;
  };
  photoUploadData: {
    title: string;
    subtitle: string;
    formats: string[];
    maxSize: string;
    instructions: string;
  };
}

export function SidebarCurriculum({
  progressData,
  photoUploadData,
}: SidebarCurriculumProps) {
  return (
    <aside className="flex flex-col gap-6">
      <Card className="w-full px-4">
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="break-inside-avoid font-bold text-xl text-foreground mb-2">
              {progressData.title}
            </h3>
            <p className="break-inside-avoid text-sm font-medium text-[rgba(75,85,99,0.80)] leading-relaxed">
              {progressData.subtitle}
            </p>
          </div>

          <div>
            <h4 className="break-inside-avoid font-bold text-lg text-foreground">
              Preenchimento do currículo
            </h4>
            <div className="space-y-2">
              <div className="relative flex items-center justify-between">
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#028A5A] h-4 rounded-full"
                    style={{ width: `${progressData.percentage}%` }}
                  ></div>
                </div>
                <div className="ml-3">
                  <div className="bg-[#028A5A] rounded-full w-12 h-12 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {progressData.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="w-full px-4">
        <div className="flex flex-col gap-4">
          <h3 className="break-inside-avoid font-semibold text-lg text-foreground">
            {photoUploadData.title}{" "}
            <span className="text-sm text-[rgba(75,85,99,0.80)]">
              {photoUploadData.subtitle}
            </span>
          </h3>

          <div className="flex justify-center">
            <div className="group relative w-[130px] h-[130px] rounded-full border-4 border-white overflow-hidden bg-white cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1742201408304-d46448663e93?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Profile picture"
                fill
                className="object-cover"
                sizes="130px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  Adicionar imagem
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#D0F2FF] rounded-lg p-3">
            <h4 className="font-semibold mb-2 text-[#04297A]">
              Como aceitamos sua foto:
            </h4>
            <ul className="space-y-1 font-medium text-[.875rem] text-[#04297A]">
              {photoUploadData.formats.map((format, index) => (
                <li key={index}>• {format}</li>
              ))}
              <li>• Com o tamanho de até {photoUploadData.maxSize}</li>
            </ul>
          </div>

          <div className="bg-[#D0F2FF] rounded-lg p-3">
            <p className="font-medium text-[.875rem] text-[#04297A]">
              {photoUploadData.instructions}
            </p>
          </div>
        </div>
      </Card>
    </aside>
  );
}
