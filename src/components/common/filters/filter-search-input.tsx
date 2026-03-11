import { Input } from "@/components/ui/input";
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
    <div className={`relative w-[320px] ${className}`}>
      <SearchNormal1
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
      />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="pl-9 h-9 rounded-full bg-[#F9FAFB] border-[#E5E7EB]"
      />
    </div>
  );
};

export default FilterSearchInput;
