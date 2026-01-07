import FilterCompo from "@/components/common/business/filter-compo";

const OverviewTab = () => {
  return (
    <div className="">
      <div className="flex pt-3 gap-2">
        <FilterCompo data={"ALL TIME"} />
        <FilterCompo data={"ALL TIME"} />
        <FilterCompo data={"ALL TIME"} />
        <FilterCompo data={"ALL TIME"} />
      </div>
    </div>
  );
};

export default OverviewTab;
