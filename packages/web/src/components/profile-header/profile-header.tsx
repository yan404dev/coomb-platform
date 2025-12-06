import Image from "next/image";
import Link from "next/link";
import type { Resume } from "@/entities";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileHeaderProps {
  resume?: Resume | null;
  loading?: boolean;
}

export const ProfileHeader = ({ resume, loading }: ProfileHeaderProps) => {
  // Todos os dados agora vem do User (AboutUser foi mergeado)
  const fullName = resume?.user?.full_name || "";
  const phone = resume?.user?.phone || "";
  const city = resume?.user?.city || "";
  const state = resume?.user?.state || "";
  const linkedin = resume?.user?.linkedin || "";

  if (loading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="w-[130px] h-[130px] md:w-[217px] md:h-[217px] rounded-full" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="group relative w-[130px] h-[130px] md:w-[217px] md:h-[217px] rounded-full border-4 border-white overflow-hidden bg-white cursor-pointer">
        <Image
          src="https://images.unsplash.com/photo-1742201408304-d46448663e93?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile picture"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 130px, 217px"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <span className="text-white text-sm md:text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
            Adicionar imagem
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground break-words">
          {fullName}
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm md:text-base font-medium text-gray-600">
          {city && state && (
            <span>
              {city} - {state}
            </span>
          )}
          <div className="flex gap-2">
            {linkedin && (
              <Link href={linkedin} target="_blank" className="text-[#03A16C]">
                <svg width="14" height="14" fill="currentColor">
                  <path d="M13 0H.997C.447 0 0 .453 0 1.01v11.98C0 13.548.447 14 .997 14H13c.55 0 1-.453 1-1.01V1.01C14 .452 13.55 0 13 0ZM4.231 12H2.156V5.319h2.078V12h-.003ZM3.194 4.406a1.204 1.204 0 1 1 0-2.407 1.204 1.204 0 0 1 0 2.407ZM12.009 12H9.934V8.75c0-.775-.015-1.772-1.078-1.772-1.081 0-1.247.844-1.247 1.716V12H5.534V5.319h1.991v.912h.028c.278-.525.956-1.078 1.966-1.078 2.1 0 2.49 1.385 2.49 3.185V12Z" />
                </svg>
              </Link>
            )}
            {phone && (
              <Link
                href={`https://wa.me/55${phone.replace(/\D/g, "")}`}
                target="_blank"
                className="text-[#03A16C]"
              >
                <svg width="14" height="14" fill="currentColor">
                  <path d="M11.903 2.034A6.885 6.885 0 0 0 6.997 0 6.946 6.946 0 0 0 .984 10.406L0 14l3.678-.966a6.917 6.917 0 0 0 3.316.844h.003c3.822 0 7.003-3.112 7.003-6.937 0-1.853-.787-3.594-2.097-4.907ZM6.997 12.71a5.756 5.756 0 0 1-2.938-.803l-.209-.125-2.181.572.581-2.128-.138-.219a5.747 5.747 0 0 1-.88-3.069A5.774 5.774 0 0 1 7 1.173c1.54 0 2.988.6 4.075 1.69 1.088 1.091 1.756 2.538 1.753 4.079 0 3.18-2.653 5.768-5.831 5.768Zm3.162-4.318c-.171-.088-1.025-.507-1.184-.563-.16-.06-.275-.087-.39.088a9.967 9.967 0 0 1-.55.68c-.1.117-.204.132-.376.045-1.018-.51-1.687-.91-2.359-2.063-.178-.306.178-.284.51-.947.056-.115.028-.215-.016-.303-.044-.087-.39-.94-.535-1.287-.14-.338-.284-.291-.39-.297-.1-.007-.216-.007-.332-.007a.642.642 0 0 0-.462.216c-.16.175-.606.594-.606 1.447 0 .853.622 1.678.706 1.794.088.115 1.222 1.865 2.963 2.619 1.1.474 1.53.515 2.08.434.335-.05 1.026-.419 1.17-.825.143-.406.143-.753.1-.825-.041-.078-.157-.122-.329-.206Z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
