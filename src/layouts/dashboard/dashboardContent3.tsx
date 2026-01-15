import ColorBox from "@/components/common/dashboard/color-box";
import type { BusinessStats } from "@/types/stats";

interface DashboardContent3Props {
  data: BusinessStats;
}

const DashboardContent3 = ({ data }: DashboardContent3Props) => {
  return (
    <div>
      <div>
        <h1 className="font-bold text-[24px] py-5">Businesses</h1>
        <div className="grid grid-cols-3 gap-5 pb-8">
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
        <hr />
      </div>
    </div>
  );
};

export default DashboardContent3;
