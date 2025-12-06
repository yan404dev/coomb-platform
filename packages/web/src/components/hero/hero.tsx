import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  children: ReactNode;
  backgroundImage?: string;
  className?: string;
}

interface HeroTitleProps {
  children: ReactNode;
  className?: string;
}

interface HeroSubtitleProps {
  children: ReactNode;
  className?: string;
}

interface HeroDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface HeroContentProps {
  children: ReactNode;
  className?: string;
}

interface HeroActionsProps {
  children: ReactNode;
  className?: string;
}

interface HeroBadgeProps {
  children: ReactNode;
  className?: string;
}

const HeroRoot = ({
  children,
  backgroundImage = "/hero-home.webp",
  className,
}: HeroProps) => {
  return (
    <div
      className={cn(
        "relative w-full h-[580.78px] rounded-[24px] overflow-hidden mt-8",
        className,
      )}
    >
      <Image
        src={backgroundImage}
        alt="Hero background"
        fill
        className="object-cover"
        priority
        quality={95}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
      />
      <div className="relative z-10 h-full pl-16 pt-18 pb-16 flex items-start">
        {children}
      </div>
    </div>
  );
};

const HeroContent = ({ children, className }: HeroContentProps) => {
  return (
    <div className={cn("flex flex-col gap-3 max-w-[640px]", className)}>
      {children}
    </div>
  );
};

const HeroTitle = ({ children, className }: HeroTitleProps) => {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
};

const HeroTitleLine = ({ children }: { children: ReactNode }) => {
  return <span className="title">{children}</span>;
};

const HeroSubtitle = ({ children, className }: HeroSubtitleProps) => {
  return (
    <span
      className={cn(
        "text-[17px] leading-[21.6px] text-[#4B5563] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
};

const HeroDescription = ({ children, className }: HeroDescriptionProps) => {
  return (
    <p
      className={cn(
        "text-[16px] font-[380] leading-6 tracking-[-0.32px] text-[rgba(75,85,99,0.80)] max-w-[467px]",
        className,
      )}
    >
      {children}
    </p>
  );
};

const HeroActions = ({ children, className }: HeroActionsProps) => {
  return <div className={cn("flex gap-4", className)}>{children}</div>;
};

const HeroBadge = ({ children, className }: HeroBadgeProps) => {
  return (
    <div
      className={cn(
        "flex items-center w-[266px] h-[38px] pl-3 pr-1 py-1.5 gap-2 flex-shrink-0 rounded-[13px] bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const Hero = {
  Root: HeroRoot,
  Content: HeroContent,
  Badge: HeroBadge,
  Title: HeroTitle,
  TitleLine: HeroTitleLine,
  Subtitle: HeroSubtitle,
  Description: HeroDescription,
  Actions: HeroActions,
};
