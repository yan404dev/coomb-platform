import { HelpCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryDefinition {
  term: string;
  definition: string;
}

interface CategoryDialogProps {
  title: string;
  categories: CategoryDefinition[];
}

export function CategoryDialog({ title, categories }: CategoryDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="text-xs text-[#028A5A] cursor-pointer flex items-center gap-1 font-bold">
          Entenda as categorias
          <HelpCircle size={12} />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              {categories.map((category, index) => (
                <p key={index} className="text-foreground">
                  <strong>{category.term}:</strong> {category.definition}
                </p>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-[#028A5A] hover:bg-[#028A5A]/80 text-white">
            Ok, entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
