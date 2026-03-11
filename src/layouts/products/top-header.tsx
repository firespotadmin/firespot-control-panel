import TopHeaderActionButton from "@/components/common/dashboard/top-header-action-button";

const TopHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-[24px] font-[700]">Products</h1>
      <TopHeaderActionButton label="New Product" />
    </div>
  );
};

export default TopHeader;
