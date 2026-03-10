import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Notification } from "iconsax-reactjs";

const NotificationButton = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="bg-[#F1F1F1] cursor-pointer h-[36px] relative w-[36px] rounded-full flex items-center justify-center hover:bg-[#e5e5e5] transition-all"
        >
          <Notification size={16} color="#000" variant="Outline" />
          <div className="absolute top-[2px] right-[1px] w-[8px] h-[8px] rounded-full bg-red-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="end" sideOffset={8}>
        <div className="p-3 border-b border-[#ECEEF1]">
          <h3 className="text-[14px] font-[600] text-[#111827]">Notifications</h3>
        </div>
        <div className="max-h-[280px] overflow-y-auto">
          <div className="p-4 text-center text-[13px] text-[#6B7280]">
            No new notifications
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationButton;
