import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/shared/hooks/use-user";
import { useChats } from "@/app/dashboard/_hooks/use-chats";

interface UseDashboardSidebarModelProps {
  currentChatId?: string | null;
  onChatSelect?: (chatId: string | null) => void;
}

export function useDashboardSidebarModel({
  currentChatId,
  onChatSelect,
}: UseDashboardSidebarModelProps) {
  const { user, isLoading } = useUser();
  const {
    chats,
    isLoading: isLoadingChats,
    deleteConversation,
    updateConversationTitle,
  } = useChats({ enabled: Boolean(user) });
  const [isMobile, setIsMobile] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [chatToRename, setChatToRename] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDeleteChat = async () => {
    if (chatToDelete) {
      try {
        await deleteConversation(chatToDelete);
        setChatToDelete(null);
        toast.success("Conversa deletada com sucesso");

        if (currentChatId === chatToDelete) {
          onChatSelect?.(null);
        }
      } catch (error) {
        toast.error("Erro ao deletar conversa. Tente novamente.");
      }
    }
  };

  const handleRenameChat = async () => {
    if (chatToRename && newTitle.trim()) {
      try {
        await updateConversationTitle(chatToRename.id, {
          title: newTitle.trim(),
        });
        toast.success("Conversa renomeada com sucesso");
        setChatToRename(null);
        setNewTitle("");
      } catch (error) {
        toast.error("Erro ao renomear conversa. Tente novamente.");
      }
    }
  };

  return {
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
  };
}
