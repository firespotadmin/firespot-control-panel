import { topHeaderActionButtonClassName } from "@/components/common/dashboard/top-header-action-button";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";

interface FilterPillDateProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

function parseDate(value: string): Date | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatDateLabel(value: string, placeholder: string): string {
  const date = parseDate(value);
  if (!date) return placeholder;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateValue(date: Date | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const FilterPillDate = ({
  value,
  onChange,
  placeholder,
  className = "",
}: FilterPillDateProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseDate(value), [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-label={placeholder}
          className={cn(
            `${topHeaderActionButtonClassName} min-w-[150px] justify-between border-0 text-[11px] font-[700] uppercase tracking-[0.08em] focus-visible:ring-0`,
            className
          )}
        >
          <span>{formatDateLabel(value, placeholder)}</span>
          <CalendarIcon className="size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onChange(formatDateValue(date));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default FilterPillDate;
