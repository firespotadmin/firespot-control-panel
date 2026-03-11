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
        "h-[40px] min-w-[180px] rounded-[20px] border-0 bg-[#E5E7EB] px-4 text-[10px] font-[700] uppercase text-[#111827] placeholder:text-[#6B7280] shadow-none focus-visible:ring-0",
        className
      )}
    />
  );
};

export default FilterPillInput;
