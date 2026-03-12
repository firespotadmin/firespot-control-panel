import { topHeaderActionButtonClassName } from "@/components/common/dashboard/top-header-action-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchNormal1 } from "iconsax-reactjs";
import type { KeyboardEventHandler } from "react";

interface FilterSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  placeholder: string;
  className?: string;
}

const FilterSearchInput = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className = "",
}: FilterSearchInputProps) => {
  return (
    <div className={cn("relative w-[320px]", className)}>
      <SearchNormal1
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn(
          `${topHeaderActionButtonClassName} w-full border-0 pl-9 pr-4 text-[11px] font-[600] tracking-[0.01em] placeholder:text-[#6B7280] focus-visible:ring-0`,
        )}
      />
    </div>
  );
};

export default FilterSearchInput;
