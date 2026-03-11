import TopHeaderActionButton from "@/components/common/dashboard/top-header-action-button";

const TopHeader = ({ onActionClick }: { onActionClick?: () => void }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">Customers</h1>
      <TopHeaderActionButton label="New Customer" onClick={onActionClick} />
    </div>
  );
};

export default TopHeader;
