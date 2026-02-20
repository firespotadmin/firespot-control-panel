import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const NoCustomersState = () => {
  return (
    <div className="py-12 px-4">
      <div className="flex flex-col items-center text-center">
        <img src="/no-customer.png" alt="No customers" className="w-16 h-16" />
        <h3 className="mt-4 text-[30px] font-[700] text-[#111827]">No customers yet</h3>
        <p className="mt-2 text-[14px] text-[#6B7280]">
          You would see all customers that pay with Firespot here.
        </p>
        <Button className="mt-6 h-9 rounded-full bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#111827] text-[10px] font-[700] uppercase px-4">
          <Plus size={14} className="mr-2" />
          Add Business
        </Button>
      </div>
    </div>
  );
};

export default NoCustomersState;
