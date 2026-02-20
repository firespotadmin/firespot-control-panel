import { ArrowDown2 } from "iconsax-reactjs";

const CustomerFilterChip = ({ label }: { label: string }) => {
  return (
    <button className="bg-[#E5E7EB] cursor-pointer p-[10px] rounded-[20px]">
      <div className="flex gap-[8px] items-center px-1">
        <p className="text-[10px] uppercase font-[700]">{label}</p>
        <ArrowDown2 size={15} />
      </div>
    </button>
  );
};

export default CustomerFilterChip;
