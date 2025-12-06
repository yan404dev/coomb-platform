import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface FormSectionProps {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function FormSection({
  id,
  title,
  defaultOpen,
  children,
}: FormSectionProps) {
  return (
    <Card className="w-full px-4 mt-6">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? id : undefined}
        className="w-full"
      >
        <AccordionItem value={id}>
          <AccordionTrigger className="text-xl font-bold text-foreground pt-4">
            {title}
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <div className="space-y-6">{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
