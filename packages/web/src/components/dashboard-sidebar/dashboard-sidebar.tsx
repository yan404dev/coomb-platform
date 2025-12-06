"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Plus, MessageSquare, Menu, X, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { LoginBanner } from "@/components/login-banner";
import { useDashboardSidebarModel } from "./dashboard-sidebar.model";

export interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewConversation: () => void;
  currentChatId?: string | null;
  onChatSelect?: (chatId: string | null) => void;
}

export const DashboardSidebar = ({
  isOpen,
  onToggle,
  onNewConversation,
  currentChatId,
  onChatSelect,
}: DashboardSidebarProps) => {
  const {
    user,
    isLoading,
    chats,
    isLoadingChats,
    isMobile,
    chatToDelete,
    setChatToDelete,
    chatToRename,
    setChatToRename,
    newTitle,
    setNewTitle,
    handleDeleteChat,
    handleRenameChat,
  } = useDashboardSidebarModel({ currentChatId, onChatSelect });

  const sidebarContent = (
    <>
      <div className="flex items-center justify-start p-3 h-14 md:block hidden">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-200 text-gray-700"
          onClick={onToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-2 p-2">
        <Button
          variant="ghost"
          className={`${
            isOpen || isMobile
              ? "justify-start gap-3 px-3"
              : "justify-center px-0"
          } h-11 hover:bg-gray-200 text-gray-900 rounded-full`}
          onClick={() => {
            onNewConversation();
            if (isMobile) onToggle();
          }}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {(isOpen || isMobile) && <span className="text-sm">Nova conversa</span>}
        </Button>

        {(isOpen || isMobile) && (
          <div className="flex-1 overflow-y-auto mt-4">
            {!user && !isLoading ? (
              <div className="px-3">
                <LoginBanner onLoginClick={() => isMobile && onToggle()} />
              </div>
            ) : (
              <div className="space-y-1">
                {isLoadingChats ? (
                  <p className="text-xs text-gray-500 px-3 py-2">Carregando...</p>
                ) : chats.length === 0 ? (
                  <p className="text-xs text-gray-500 px-3 py-2">Nenhuma conversa ainda</p>
                ) : (
                  <>
                    <p className="text-xs text-gray-500 px-3 py-2">Conversas recentes</p>
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`group flex items-center gap-1 px-3 h-10 hover:bg-gray-200 rounded-full ${
                          currentChatId === chat.id ? "bg-gray-200" : ""
                        }`}
                      >
                        <Button
                          variant="ghost"
                          className="flex-1 justify-start gap-3 px-0 h-10 hover:bg-transparent text-gray-700 hover:text-gray-900 text-sm font-normal min-w-0 overflow-hidden"
                          onClick={() => {
                            onChatSelect?.(chat.id);
                            if (isMobile) onToggle();
                          }}
                        >
                          <MessageSquare className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate text-left min-w-0 flex-1">{chat.title}</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-300 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToRename({ id: chat.id, title: chat.title });
                                setNewTitle(chat.title);
                              }}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Renomear
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setChatToDelete(chat.id);
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-50 md:hidden hover:bg-gray-200 text-gray-700 bg-background/80 backdrop-blur-sm"
          onClick={onToggle}
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Sheet open={isOpen} onOpenChange={onToggle}>
          <SheetContent side="left" className="w-64 p-0 bg-[#f9fafb] border-r-0 [&>button]:hidden">
            <VisuallyHidden.Root>
              <SheetTitle>Menu de navegação</SheetTitle>
              <SheetDescription>
                Acesse suas conversas e crie novos currículos
              </SheetDescription>
            </VisuallyHidden.Root>
            <div className="flex items-center justify-end p-3 h-14">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-200 text-gray-700"
                onClick={onToggle}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex flex-col h-[calc(100%-56px)]">
              {sidebarContent}
            </div>
          </SheetContent>
        </Sheet>

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deletar conversa</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja deletar esta conversa? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteChat} className="bg-red-600 hover:bg-red-700">
                Deletar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Dialog de renomeação */}
        <AlertDialog open={!!chatToRename} onOpenChange={() => setChatToRename(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Renomear conversa</AlertDialogTitle>
              <AlertDialogDescription>
                Digite o novo título para a conversa.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Novo título"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameChat();
                  }
                }}
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setNewTitle("")}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleRenameChat}>Salvar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <aside
        className={`fixed z-50 flex flex-col transition-all duration-300 ease-in-out h-full bg-[#f9fafb] border-r border-gray-200 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={!!chatToDelete} onOpenChange={() => setChatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta conversa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteChat} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de renomeação */}
      <AlertDialog open={!!chatToRename} onOpenChange={() => setChatToRename(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Renomear conversa</AlertDialogTitle>
            <AlertDialogDescription>
              Digite o novo título para a conversa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Novo título"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRenameChat();
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNewTitle("")}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRenameChat}>Salvar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
