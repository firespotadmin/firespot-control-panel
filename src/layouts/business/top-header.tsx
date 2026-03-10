import { Button } from "@/components/ui/button";
import { Add } from "iconsax-reactjs";

const TopHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">Businesses</h1>
      <Button className="flex bg-[#E5E7EB] text-[#000] text-[10px] hover:bg-[#D1D5DB] cursor-pointer p-[10px] gap-3 uppercase rounded-full">
        <Add size={40} color="#000" />
        New Business
      </Button>
    </div>
  );
};

export default TopHeader;
