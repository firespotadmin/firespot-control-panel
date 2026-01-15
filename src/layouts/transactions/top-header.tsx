import { Button } from "@/components/ui/button";
import { Add } from "iconsax-reactjs";

const TopHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[24px] font-[700]">Transactions</h1>
      <Button className="flex bg-[#E5E7EB] text-[#000] text-[10px] hover:bg-[#D1D5DB] cursor-pointer p-[10px] gap-3 uppercase rounded-full">
        <Add size={40} color="#000" />
        Generate Statement
      </Button>
    </div>
  );
};

export default TopHeader;
