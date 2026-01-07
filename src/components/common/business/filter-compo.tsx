import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDown2 } from "iconsax-reactjs";
const FilterCompo = ({ data }: { data: any }) => {
  return (
    <div className="bg-[#E5E7EB] cursor-pointer p-[10px] rounded-[20px]">
      <div className="flex gap-[8px] items-center px-1">
        <p className="text-[10px] uppercase font-[700]">{data}</p>
        <ArrowDown2 size={15} />
      </div>
    </div>
  );
};

export default FilterCompo;
