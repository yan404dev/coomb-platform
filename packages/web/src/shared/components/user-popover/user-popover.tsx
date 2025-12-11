"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import {
  User,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronDown,
  Users,
} from "lucide-react";
import { UserAvatar } from "@/shared/components/user-avatar";
import { PlanBadge } from "@/shared/components/plan-badge";
import Link from "next/link";
import { useUserPopoverModel } from "./user-popover.model";

interface UserPopoverProps {
  onLogout?: () => void;
}

export const UserPopover = ({ onLogout }: UserPopoverProps) => {
  const { open, setOpen, user, isLoading, handleLogout } =
    useUserPopoverModel({ onLogout });

  if (isLoading || !user) {
    return null;
  }

  const menuItems = [
    {
      icon: FileText,
      label: "Assistente IA",
      href: "/dashboard",
      description: "Otimize seu currículo com IA",
    },
    {
      icon: User,
      label: "Perfil",
      href: "/perfil",
      description: "Visualize o seu perfil",
    },
    {
      icon: FileText,
      label: "Currículo",
      href: "/curriculo",
      description: "Edite seu currículo",
    },
    {
      icon: CreditCard,
      label: "Assinatura",
      href: "/assinatura",
      description: "Planos e pagamentos",
    },
  ];

  const secondaryItems = [
    {
      icon: HelpCircle,
      label: "Ajuda e Suporte",
      href: "/ajuda",
    },
    {
      icon: Users,
      label: "Grupo de Network",
      href: "/network",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-1 h-10 rounded-full px-1 pr-2"
        >
          <UserAvatar user={user} size="sm" />
          <ChevronDown
            className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[calc(100vw-2rem)] sm:w-80 p-0 rounded-2xl border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
        align="end"
        sideOffset={8}
      >
        <div className="relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-4">
          <div className="flex items-start gap-3">
            <UserAvatar user={user} size="lg" showRing />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.fullName}
              </h3>
              <PlanBadge planType={user.planType} variant="inline" />
            </div>
          </div>
        </div>

        <div className="py-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-4 py-3"
            >
              <div className="mt-0.5">
                <item.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <Separator className="my-1" />

        <div className="py-2">
          {secondaryItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5"
            >
              <item.icon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{item.label}</span>
            </Link>
          ))}
        </div>

        <Separator className="my-1" />

        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sair da conta</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
