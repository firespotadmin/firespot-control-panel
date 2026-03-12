import { topHeaderActionButtonClassName } from "@/components/common/dashboard/top-header-action-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type FilterOption = {
  label: string;
  value: string;
};

interface FilterPillSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

const EMPTY_VALUE = "__empty__";

const FilterPillSelect = ({
  value,
  onChange,
  options,
  className = "",
}: FilterPillSelectProps) => {
  return (
    <Select
      value={value || EMPTY_VALUE}
      onValueChange={(nextValue) =>
        onChange(nextValue === EMPTY_VALUE ? "" : nextValue)
      }
    >
      <SelectTrigger
        className={cn(
          `${topHeaderActionButtonClassName} min-w-[140px] border-0 text-[11px] font-[700] uppercase tracking-[0.08em] focus-visible:ring-0`,
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem
            key={option.value || EMPTY_VALUE}
            value={option.value || EMPTY_VALUE}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterPillSelect;
