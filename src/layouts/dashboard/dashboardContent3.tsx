import ColorBox from "@/components/common/dashboard/color-box";
import type { BusinessStats } from "@/types/stats";

interface DashboardContent3Props {
  data?: BusinessStats | null;
}

const DashboardContent3 = ({ data }: DashboardContent3Props) => {
  return (
    <div>
      <p className="text-[16px] font-[600] text-[#111827]">Businesses</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Sign ups, active, and statements generated.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <ColorBox
            count={
              ("+" + data?.newSignUps && data?.newSignUps?.toString()) || "0"
            }
            label="Sign Ups"
            color="#24C166"
          />
          <ColorBox
            count={data?.activeBusinesses?.toString() || "0"}
            label="Total Active"
            color="#000"
          />
          <ColorBox
            count={data?.statementsGenerated?.toString() || "0"}
            label="Statements Generated"
            color="#000"
          />
        </div>
    </div>
  );
};

export default DashboardContent3;
