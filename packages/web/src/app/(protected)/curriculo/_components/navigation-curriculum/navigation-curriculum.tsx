export enum CurriculumSection {
  IMPORT = "import",
  ABOUT = "about",
  EXPERIENCES = "experiences",
  SKILLS = "skills",
  OTHER = "other",
}

export interface NavigationItem {
  label: string;
  section: CurriculumSection;
}

interface NavigationCurriculumProps {
  items: NavigationItem[];
  currentSection: CurriculumSection;
  onSectionChange: (section: CurriculumSection) => void;
}

export function NavigationCurriculum({
  items,
  currentSection,
  onSectionChange,
}: NavigationCurriculumProps) {
  return (
    <div className="flex items-center justify-center md:justify-around gap-4 md:gap-6 flex-wrap p-4 md:p-6 bg-white shadow-sm rounded-lg">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => onSectionChange(item.section)}
          className={`text-base font-semibold transition-colors cursor-pointer ${
            currentSection === item.section
              ? "text-[#028A5A]"
              : "text-gray-500 hover:text-[#028A5A]"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
