import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TopHeaderActionButtonProps {
  label: string;
  onClick?: () => void;
}

const TopHeaderActionButton = ({
  label,
  onClick,
}: TopHeaderActionButtonProps) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className="h-[38px] min-w-[150px] rounded-full bg-[#E5E7EB] px-4 text-[#0F172A] shadow-none hover:bg-[#D9DCE1]"
    >
      <div className="flex items-center gap-2.5">
        <Plus className="size-4 stroke-[2.75]" />
        <span className="text-[11px] font-[700] uppercase tracking-[0.08em]">
          {label}
        </span>
      </div>
    </Button>
  );
};

export default TopHeaderActionButton;
