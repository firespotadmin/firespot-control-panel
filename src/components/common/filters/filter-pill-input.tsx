import { topHeaderActionButtonClassName } from "@/components/common/dashboard/top-header-action-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FilterPillInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

const FilterPillInput = ({
  value,
  onChange,
  placeholder,
  className = "",
}: FilterPillInputProps) => {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn(
        `${topHeaderActionButtonClassName} min-w-[180px] border-0 text-[11px] font-[700] uppercase tracking-[0.08em] placeholder:text-[#6B7280] focus-visible:ring-0`,
        className
      )}
    />
  );
};

export default FilterPillInput;
