"use client";

import { Pencil, FileText } from "lucide-react";
import Link from "next/link";
import { type ReactNode, Children } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CurriculumSection } from "../../../curriculo/_components/navigation-curriculum";
import { useProfileSectionCardModel } from "./profile-section-card.model";

interface ProfileSectionCardProps {
  title: string;
  showAllText: string;
  hideAllText?: string;
  children: ReactNode;
  editSection?: CurriculumSection;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyButtonText?: string;
  initialVisibleItems?: number;
}

interface ProfileSectionItemProps {
  title: string;
  subtitle: string;
  periodLabel?: string;
  periodValue?: string;
  description?: string;
}

const ProfileSectionCard = ({
  title,
  showAllText,
  hideAllText = "Ocultar",
  children,
  editSection,
  isEmpty = false,
  emptyMessage = "Nenhum item adicionado ainda",
  emptyButtonText = "Adicionar",
  initialVisibleItems = 2,
}: ProfileSectionCardProps) => {
  const childrenArray = Children.toArray(children);
  const { isExpanded, setIsExpanded, hasMore } = useProfileSectionCardModel({
    initialVisibleItems,
    childrenCount: childrenArray.length,
  });

  const visibleChildren = isExpanded
    ? childrenArray
    : childrenArray.slice(0, initialVisibleItems);

  const editButton = (
    <button className="flex items-center text-xs md:text-sm gap-1 text-[#03A16C] font-semibold shrink-0">
      <Pencil size={12} className="md:w-[15px] md:h-[15px]" />
      <span className="hidden sm:inline">Editar</span>
    </button>
  );

  if (isEmpty) {
    return (
      <Card className="p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-semibold text-lg md:text-xl lg:text-2xl text-foreground break-words">
            {title}
          </CardTitle>
        </div>

        <CardContent className="px-0 flex flex-col items-center justify-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <CardDescription className="text-center text-sm md:text-base text-gray-600">
            {emptyMessage}
          </CardDescription>
          {editSection && (
            <Link href={`/curriculo?tab=${editSection}`}>
              <Button className="bg-[#03A16C] hover:bg-[#028A5A] text-white">
                {emptyButtonText}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="font-semibold text-lg md:text-xl lg:text-2xl text-foreground break-words">
          {title}
        </CardTitle>
        {editSection ? (
          <Link href={`/curriculo?tab=${editSection}`}>{editButton}</Link>
        ) : (
          editButton
        )}
      </div>

      {visibleChildren}

      {hasMore && (
        <>
          <Separator />
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-black font-semibold text-xs md:text-sm hover:text-[#03A16C] transition-colors cursor-pointer"
            >
              <span className="text-base">{isExpanded ? '-' : '+'}</span>
              <span>{isExpanded ? hideAllText : showAllText}</span>
            </button>
          </div>
        </>
      )}
    </Card>
  );
};

const ProfileSectionItem = ({
  title,
  subtitle,
  periodLabel = "Período",
  periodValue,
  description,
}: ProfileSectionItemProps) => {
  return (
    <div className="p-4 md:p-6 border rounded-xl space-y-3">
      <div>
        <h3 className="font-semibold text-sm md:text-base lg:text-lg text-foreground uppercase tracking-wider break-words">
          {title}
        </h3>
        <p className="font-medium text-xs md:text-sm text-gray-600 break-words">
          {subtitle}
        </p>
      </div>

      {periodValue && (
        <div>
          <h4 className="font-semibold text-foreground uppercase tracking-wider text-xs md:text-sm">
            {periodLabel}
          </h4>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            {periodValue}
          </p>
        </div>
      )}

      {description && (
        <CardDescription className="text-sm md:text-base font-normal text-[rgba(75,85,99,0.80)] leading-relaxed break-words">
          {description}
        </CardDescription>
      )}
    </div>
  );
};

export { ProfileSectionCard, ProfileSectionItem };
