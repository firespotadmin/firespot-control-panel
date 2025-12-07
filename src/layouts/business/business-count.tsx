import ColorBox from "@/components/common/dashboard/color-box";

const BusinessCount = () => {
  return (
    <div>
      <div className="grid grid-cols-6 gap-[12px] pt-5">
        <ColorBox color="#000" count={"0"} label="Total Sign Ups" />
        <ColorBox color="#000" count={"0"} label="KYB Complete" />
        <ColorBox color="#000" count={"0"} label="Verified" />
        <ColorBox color="#000" count={"0"} label="Unverified" />
        <ColorBox color="#000" count={"0"} label="Active" />
        <ColorBox color="#000" count={"0"} label="Statements Generated" />
      </div>
    </div>
  );
};

export default BusinessCount;
